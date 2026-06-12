# Reference: Envia.com — `lib/shipping/envia.ts` + `app/api/shipping/calculate/route.ts` (Rama A)

**Solo crear estos archivos si el plan (Emprendimiento o Empresa) eligió Envia.com como provider de envíos.** Si eligió zonas fijas, usar `scaffold-emprendimiento--ref--api-shipping-zones.md`.

La lógica de cotización vive en `lib/shipping/envia.ts` para que la usen **dos** consumidores:
1. `app/api/shipping/calculate/route.ts` — el checkout cotiza opciones para el comprador.
2. `app/api/create-preference/route.ts` — re-cotiza server-side para **verificar** el costo elegido (nunca se confía en el `cost` del navegador).

**El peso y las dimensiones salen de la DB** (`products.weight_grams`, `length_cm`, `width_cm`, `height_cm`) — el cliente solo manda `product_id` + `quantity`.

## Archivo 1 — `lib/shipping/envia.ts`

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";

export interface EnviaDestination {
  street: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface EnviaOption {
  carrier: string;
  service: string;
  price: number;
  estimated_delivery: string | null;
}

export class EnviaConfigError extends Error {}

/**
 * Cotiza envíos contra la API de Envia.com.
 * Peso y dimensiones se leen de products en la DB — nunca del cliente.
 */
export async function quoteEnvia(
  destination: EnviaDestination,
  items: Array<{ product_id: string; quantity: number }>
): Promise<EnviaOption[]> {
  const tenantId = getTenantId();
  const supabaseAdmin = createAdminClient();

  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select(
      "envia_access_token, origin_name, origin_phone, origin_address, origin_city, origin_postal_code, origin_state"
    )
    .eq("id", tenantId)
    .single();

  if (!tenant?.envia_access_token) {
    throw new EnviaConfigError("Envíos no configurados para este tenant");
  }
  if (
    !tenant.origin_name ||
    !tenant.origin_address ||
    !tenant.origin_city ||
    !tenant.origin_postal_code ||
    !tenant.origin_state
  ) {
    throw new EnviaConfigError("Datos de origen incompletos en el tenant");
  }

  // Peso y dimensiones reales desde la DB
  const productIds = [...new Set(items.map((i) => i.product_id))];
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, weight_grams, length_cm, width_cm, height_cm, shipping_required")
    .eq("tenant_id", tenantId)
    .in("id", productIds);

  let totalWeightKg = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  for (const item of items) {
    const p = (products ?? []).find((x) => x.id === item.product_id);
    if (!p || p.shipping_required === false) continue;
    totalWeightKg += ((p.weight_grams ?? 500) / 1000) * item.quantity;
    maxLength = Math.max(maxLength, Number(p.length_cm ?? 0));
    maxWidth = Math.max(maxWidth, Number(p.width_cm ?? 0));
    maxHeight = Math.max(maxHeight, Number(p.height_cm ?? 0));
  }

  const response = await fetch("https://api.envia.com/ship/rate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tenant.envia_access_token}`,
    },
    body: JSON.stringify({
      origin: {
        name: tenant.origin_name,
        phone: tenant.origin_phone,
        street: tenant.origin_address,
        city: tenant.origin_city,
        state: tenant.origin_state,
        postal_code: tenant.origin_postal_code,
        country: "AR",
      },
      destination: {
        street: destination.street,
        city: destination.city,
        state: destination.state,
        postal_code: destination.postal_code,
        country: "AR",
      },
      packages: [
        {
          weight: Math.max(totalWeightKg, 0.1),
          dimensions: {
            length: maxLength || 20,
            width: maxWidth || 20,
            height: maxHeight || 10,
          },
        },
      ],
      shipment: { carrier: "all" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Envia.com error: ${response.status}`);
  }

  const data = await response.json();

  return (data.data ?? []).map(
    (rate: {
      carrier: string;
      service: string;
      totalPrice: number;
      deliveryDate?: string;
    }) => ({
      carrier: rate.carrier,
      service: rate.service,
      price: rate.totalPrice,
      estimated_delivery: rate.deliveryDate ?? null,
    })
  );
}
```

## Archivo 2 — `app/api/shipping/calculate/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { quoteEnvia, EnviaConfigError } from "@/lib/shipping/envia";

export async function POST(request: NextRequest) {
  const { destination, items } = (await request.json()) as {
    destination: { street: string; city: string; state: string; postal_code: string };
    items: Array<{ product_id: string; quantity: number }>;
  };

  if (!destination?.postal_code || !items?.length) {
    return NextResponse.json({ error: "Destino inválido" }, { status: 400 });
  }

  try {
    const options = await quoteEnvia(destination, items);
    return NextResponse.json({ options });
  } catch (error) {
    if (error instanceof EnviaConfigError) {
      // No silenciar — el comprador debe ver "envíos no disponibles"
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Error calculando envío:", error);
    return NextResponse.json(
      { error: "No se pudo calcular el costo de envío" },
      { status: 500 }
    );
  }
}
```

## Cómo lo consume el checkout

El comprador ingresa su dirección + CP → el form llama a `POST /api/shipping/calculate` con `{ destination, items: [{product_id, quantity}] }` → recibe opciones reales de carriers → elige una.

El payload a `/api/create-preference` lleva **la opción elegida, sin costo** (el server re-cotiza y verifica):

```typescript
shipping: {
  carrier: "OCA",                    // del response de Envia
  service: "Estándar",               // del response de Envia
  street: "Av. Corrientes 1234",
  city: "Buenos Aires",
  state: "CABA",
  postal_code: "1043",
}
```

`create-preference` vuelve a llamar a `quoteEnvia()`, matchea `carrier + service` y usa **ese** precio. Esto pobla las columnas `shipping_carrier`, `shipping_service`, `shipping_cost`, `shipping_postal_code` y el JSONB `shipping_address` en `orders`.

## Notas importantes

- **Si falta `envia_access_token` o algún `origin_*`, el endpoint devuelve 503 con mensaje claro.** No silenciar el error.
- **Peso y dimensiones vienen de `products`** (`weight_grams` con default 500g, `length_cm`/`width_cm`/`height_cm` con default 20×20×10). Cargar esos campos al crear productos mejora la precisión de la cotización.
- Los productos con `shipping_required = false` (servicios) no suman peso.
- La API de Envia.com puede cambiar — verificar con su documentación oficial: [envia.com/api](https://envia.com).
