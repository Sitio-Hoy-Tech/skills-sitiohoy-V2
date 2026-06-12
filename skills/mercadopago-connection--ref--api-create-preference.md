# Reference: `app/api/create-preference/route.ts`

Path destino: `app/api/create-preference/route.ts`

Crea una orden + order_items en Supabase y devuelve la preferencia de MP.

## ⚠️ Regla de seguridad — el servidor calcula TODO

El cliente envía **solo IDs y cantidades**. Los precios, el descuento del cupón y el costo de envío se calculan **siempre server-side** contra la base:

- **Precio de cada ítem** → `products.price` / `sale_price` y `product_variants.price` / `price_modifier` desde Supabase. NUNCA el `price` que mande el navegador.
- **Descuento** → se re-valida el código de cupón con las mismas reglas que `/api/coupons/validate`. NUNCA el `discount` que mande el navegador.
- **Envío** → Rama B: lookup de `shipping_zones` por `zone_id`. Rama A: re-cotizar Envia (`quoteEnvia` de `lib/shipping/envia.ts`) y matchear carrier+service. NUNCA el `cost` que mande el navegador.
- **`tenantId`** → de `process.env.NEXT_PUBLIC_TENANT_ID` (cada deploy es de un solo tenant). NUNCA del body.

Sin esto, cualquier persona con DevTools puede comprar a $1.

```typescript
import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
// Solo Rama A (Envia.com) — en Rama B eliminar este import y el branch correspondiente:
// import { quoteEnvia } from "@/lib/shipping/envia";

interface CartItemInput {
  product_id: string;
  variant_id?: string;
  quantity: number;
}

interface ShippingInput {
  zone_id?: string;        // Rama B (zonas fijas)
  carrier?: string;        // Rama A (Envia) — opción que eligió el comprador
  service?: string;        // Rama A
  street?: string;
  city?: string;
  state?: string;
  postal_code: string;
  notes?: string;
}

interface CustomerInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      items,
      customer,
      shipping,
      coupon,
    }: {
      items: CartItemInput[];
      customer: CustomerInfo;
      shipping: ShippingInput;
      coupon?: { code: string };
    } = await request.json();

    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

    if (!items?.length || !tenantId || !customer?.email || !shipping?.postal_code) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .select("mp_access_token, url")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant?.mp_access_token) {
      return NextResponse.json(
        { error: "Mercado Pago no configurado para este tenant" },
        { status: 400 }
      );
    }

    // ── 1. Precios reales desde la DB ─────────────────────────────────
    const productIds = [...new Set(items.map((i) => i.product_id))];
    const variantIds = items.map((i) => i.variant_id).filter(Boolean) as string[];

    const { data: products } = await supabaseAdmin
      .from("products")
      .select("id, name, price, is_sale, sale_price, stock, stock_unlimited")
      .eq("tenant_id", tenantId)
      .eq("active", true)
      .in("id", productIds);

    const { data: variants } = variantIds.length
      ? await supabaseAdmin
          .from("product_variants")
          .select("id, product_id, name, price, price_modifier")
          .eq("tenant_id", tenantId)
          .in("id", variantIds)
      : { data: [] as any[] };

    const resolvedItems: Array<{
      product_id: string;
      variant_id: string | null;
      name: string;
      variant_name: string | null;
      unit_price: number;
      quantity: number;
    }> = [];

    for (const item of items) {
      const product = (products ?? []).find((p) => p.id === item.product_id);
      if (!product || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: "Producto inválido o no disponible" },
          { status: 400 }
        );
      }

      const basePrice =
        product.is_sale && product.sale_price != null
          ? Number(product.sale_price)
          : Number(product.price);

      let unitPrice = basePrice;
      let variantName: string | null = null;

      if (item.variant_id) {
        const variant = (variants ?? []).find(
          (v) => v.id === item.variant_id && v.product_id === item.product_id
        );
        if (!variant) {
          return NextResponse.json({ error: "Variante inválida" }, { status: 400 });
        }
        unitPrice =
          variant.price != null
            ? Number(variant.price)
            : basePrice + Number(variant.price_modifier ?? 0);
        variantName = variant.name;
      }

      resolvedItems.push({
        product_id: product.id,
        variant_id: item.variant_id ?? null,
        name: product.name,
        variant_name: variantName,
        unit_price: unitPrice,
        quantity: item.quantity,
      });
    }

    const subtotal = resolvedItems.reduce(
      (sum, i) => sum + i.unit_price * i.quantity,
      0
    );

    // ── 2. Cupón re-validado server-side ──────────────────────────────
    let discount = 0;
    let couponCode: string | null = null;

    if (coupon?.code) {
      const now = new Date().toISOString();
      const { data: couponRow } = await supabaseAdmin
        .from("coupons")
        .select("code, type, value, min_amount, max_uses, uses_count, starts_at, expires_at, active")
        .eq("tenant_id", tenantId)
        .eq("code", coupon.code.toUpperCase().trim())
        .eq("active", true)
        .single();

      const couponValid =
        couponRow &&
        (!couponRow.starts_at || couponRow.starts_at <= now) &&
        (!couponRow.expires_at || couponRow.expires_at >= now) &&
        (couponRow.max_uses === null || (couponRow.uses_count ?? 0) < couponRow.max_uses) &&
        subtotal >= Number(couponRow.min_amount ?? 0);

      if (!couponValid) {
        return NextResponse.json({ error: "Cupón inválido o vencido" }, { status: 400 });
      }

      discount =
        couponRow.type === "percent"
          ? Math.round((subtotal * Number(couponRow.value)) / 100)
          : Math.min(Number(couponRow.value), subtotal);
      couponCode = couponRow.code;
    }

    // ── 3. Costo de envío verificado server-side ──────────────────────
    let shippingCost = 0;
    let shippingCarrier: string;
    let shippingService: string | null = null;

    if (shipping.zone_id) {
      // Rama B — zonas fijas
      const { data: zone } = await supabaseAdmin
        .from("shipping_zones")
        .select("name, price")
        .eq("tenant_id", tenantId)
        .eq("id", shipping.zone_id)
        .eq("active", true)
        .single();

      if (!zone) {
        return NextResponse.json({ error: "Zona de envío inválida" }, { status: 400 });
      }
      shippingCost = Number(zone.price);
      shippingCarrier = zone.name;
    } else if (shipping.carrier) {
      // Rama A — Envia.com: re-cotizar y matchear la opción elegida.
      // Descomentar el import de quoteEnvia arriba. En Rama B, eliminar este branch.
      return NextResponse.json({ error: "Configurar rama de envío" }, { status: 500 });
      /*
      const options = await quoteEnvia(
        {
          street: shipping.street ?? "",
          city: shipping.city ?? "",
          state: shipping.state ?? "",
          postal_code: shipping.postal_code,
        },
        items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
      );
      const match = options.find(
        (o) => o.carrier === shipping.carrier && o.service === shipping.service
      );
      if (!match) {
        return NextResponse.json(
          { error: "La opción de envío ya no está disponible. Volvé a cotizar." },
          { status: 400 }
        );
      }
      shippingCost = Number(match.price);
      shippingCarrier = match.carrier;
      shippingService = match.service;
      */
    } else {
      return NextResponse.json({ error: "Falta la selección de envío" }, { status: 400 });
    }

    const total = Math.max(0, subtotal - discount) + shippingCost;

    // ── 4. Crear orden con TODAS las columnas relevantes ──────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        tenant_id: tenantId,
        status: "pending",
        total,
        currency: "ARS",
        payment_provider: "mercadopago",
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone ?? null,
        payer_email: customer.email,
        // Shipping — columnas individuales + JSONB con detalle completo
        shipping_carrier: shippingCarrier,
        shipping_service: shippingService,
        shipping_cost: shippingCost,
        shipping_postal_code: shipping.postal_code,
        shipping_address: {
          street: shipping.street ?? null,
          city: shipping.city ?? null,
          state: shipping.state ?? null,
          postal_code: shipping.postal_code,
          notes: shipping.notes ?? null,
        },
        // Cupón
        coupon_code: couponCode,
        discount_amount: discount > 0 ? discount : null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Error creando orden:", orderError);
      return NextResponse.json(
        { error: "Error creando orden base" },
        { status: 500 }
      );
    }

    // ── 5. Crear order_items ──────────────────────────────────────────
    const orderItemsRows = resolvedItems.map((item) => ({
      order_id: order.id,
      tenant_id: tenantId,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.name,
      variant_name: item.variant_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsRows);

    if (itemsError) {
      console.error("Error creando order_items:", itemsError);
      // Rollback de la orden
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Error creando ítems de la orden" },
        { status: 500 }
      );
    }

    // ── 6. Crear preferencia MP ───────────────────────────────────────
    const mpClient = new MercadoPagoConfig({
      accessToken: tenant.mp_access_token,
    });
    const preference = new Preference(mpClient);

    // La URL del sitio viene de tenants.url (no de .env). Sin trailing slash.
    const siteUrl = tenant.url?.replace(/\/$/, "");
    const isLocalhost = !siteUrl || siteUrl.includes("localhost");

    // ⚠️ MP rechaza ítems con unit_price <= 0 — el descuento NO va como ítem
    // negativo. Se prorratea proporcionalmente entre los ítems.
    const discountFactor = subtotal > 0 ? Math.max(0, subtotal - discount) / subtotal : 1;

    const preferenceItems = resolvedItems.map((item) => ({
      id: item.product_id,
      title: item.variant_name ? `${item.name} - ${item.variant_name}` : item.name,
      unit_price: Math.round(item.unit_price * discountFactor * 100) / 100,
      quantity: item.quantity,
      currency_id: "ARS",
    }));

    if (shippingCost > 0) {
      preferenceItems.push({
        id: "shipping",
        title: `Envío - ${shippingCarrier}${shippingService ? ` (${shippingService})` : ""}`,
        unit_price: shippingCost,
        quantity: 1,
        currency_id: "ARS",
      });
    }

    const preferenceBody: Record<string, unknown> = {
      external_reference: order.id,
      items: preferenceItems,
      payer: {
        email: customer.email,
        name: customer.first_name,
        surname: customer.last_name,
        phone: customer.phone ? { number: customer.phone } : undefined,
      },
    };

    if (siteUrl && !isLocalhost) {
      preferenceBody.back_urls = {
        success: `${siteUrl}/checkout/status`,
        failure: `${siteUrl}/checkout/status`,
        pending: `${siteUrl}/checkout/status`,
      };
      preferenceBody.auto_return = "approved";
      preferenceBody.notification_url = `${siteUrl}/api/webhooks/mercadopago`;
    }

    const result = await preference.create({ body: preferenceBody as any });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      orderId: order.id,
      total, // total autoritativo calculado server-side — el cliente lo usa para el Brick
    });
  } catch (error) {
    console.error("Error creating preference:", error);
    return NextResponse.json(
      { error: "Error al crear la preferencia de pago" },
      { status: 500 }
    );
  }
}
```

## Notas

- **El response incluye `total`** — el checkout usa ese valor para inicializar el Payment Brick, no un total calculado en el cliente.
- El prorrateo del descuento entre ítems existe porque MP rechaza `unit_price` negativo o cero. El redondeo a 2 decimales puede generar diferencias de centavos con `orders.total` — `process-payment` cobra `orders.total`, que es el valor autoritativo.
- `notification_url` ya NO lleva `?tenantId=` — el webhook resuelve el tenant desde `NEXT_PUBLIC_TENANT_ID` (cada deploy es de un solo tenant).
- En **Rama A (Envia)**: descomentar el import y el branch de `quoteEnvia`, y borrar el `return` placeholder. En **Rama B**: eliminar el branch comentado por completo.
- El chequeo de stock (si `stock_unlimited = false`) se puede agregar en el loop de resolución de ítems: si `product.stock < quantity` → 400. Recomendado para clientes con stock finito.
