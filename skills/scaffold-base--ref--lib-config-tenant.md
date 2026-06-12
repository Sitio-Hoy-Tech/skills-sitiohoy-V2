# Reference: `lib/config/tenant.ts`

Path destino: `lib/config/tenant.ts`

Helper server-side que lee la fila completa de configuración del tenant desde Supabase. **Reemplaza a las variables de entorno** que antes guardaban WhatsApp, URL, email de contacto, Umami, etc. Todo eso ahora vive en la tabla `tenants` y se lee con este helper.

**SOLO server-side** (usa el admin client / `service_role`). Nunca importar desde componentes `"use client"`.

```typescript
import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";

export interface TenantConfig {
  id: string;
  name: string;
  slug: string;
  plan: string | null;
  status: string | null;
  max_products: number | null;
  // Sitio / contacto
  url: string | null;
  whatsapp: string | null;
  contact_email: string | null;
  // Analytics
  umami_url: string | null;
  umami_website_id: string | null;
  // Pagos
  mp_access_token: string | null;
  mp_public_key: string | null;
  // Email SMTP del tenant (host/port/ssl viven en platform_config)
  smpt_user: string | null;
  smpt_pass: string | null;
  // ISR
  revalidation_secret: string | null;
  // Envíos (solo plan Empresa con Envia)
  envia_access_token: string | null;
  origin_name: string | null;
  origin_phone: string | null;
  origin_address: string | null;
  origin_city: string | null;
  origin_postal_code: string | null;
  origin_state: string | null;
  // Correo Argentino (solo plan Empresa con CA directo)
  correo_argentino_customer_id: string | null;
}

// Campos que se traen siempre. Mantener en sync con TenantConfig.
const TENANT_FIELDS = `
  id, name, slug, plan, status, max_products,
  url, whatsapp, contact_email,
  umami_url, umami_website_id,
  mp_access_token, mp_public_key,
  smpt_user, smpt_pass,
  revalidation_secret,
  envia_access_token, origin_name, origin_phone, origin_address,
  origin_city, origin_postal_code, origin_state,
  correo_argentino_customer_id
`;

/**
 * Fetch real, envuelto en unstable_cache con el tag tenant-config-{id}.
 * El trigger SQL sobre la tabla tenants (skill isr-on-demand) invalida ese tag
 * al editar la fila — la config se sirve cacheada y se refresca sola.
 */
const fetchTenantConfig = unstable_cache(
  async (): Promise<TenantConfig> => {
    const tenantId = getTenantId();
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("tenants")
      .select(TENANT_FIELDS)
      .eq("id", tenantId)
      .single();

    if (error || !data) {
      throw new Error(`No se pudo leer la config del tenant ${tenantId}: ${error?.message ?? "no encontrado"}`);
    }

    return data as unknown as TenantConfig;
  },
  [`tenant-config-${process.env.NEXT_PUBLIC_TENANT_ID}`],
  { tags: [`tenant-config-${process.env.NEXT_PUBLIC_TENANT_ID}`] }
);

/**
 * Lee la configuración completa del tenant actual.
 * - cache() de React: dedupe dentro del mismo request (varios llamados = 1 fetch).
 * - unstable_cache: persiste entre requests, invalidado por el tag tenant-config-{id}.
 */
export const getTenantConfig = cache(fetchTenantConfig);

/**
 * Deriva el dominio (sin protocolo) a partir de tenants.url.
 * Reemplaza a la antigua NEXT_PUBLIC_SITE_DOMAIN. Devuelve null si no hay url.
 */
export function getSiteDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim() || null;
  }
}
```

## Notas

- **Caché en dos niveles:** `cache()` de React deduplica llamadas dentro del mismo request; `unstable_cache` evita el roundtrip a Supabase entre requests. El tag `tenant-config-{TENANT_ID}` lo invalida el trigger SQL sobre `tenants` (skill `isr-on-demand`) — al editar la fila del tenant, la config se refresca sola.
- ⚠️ **El endpoint `/api/revalidate` NO debe usar este helper para leer `revalidation_secret`** — debe leerlo con query directa sin caché (ver skill `isr-on-demand`). Si leyera el secret cacheado y el secret cambia en la DB, el endpoint rechazaría el nuevo secret y el tag nunca se invalidaría (deadlock).
- `getTenantId()` viene de `lib/tenant.ts` y lee `NEXT_PUBLIC_TENANT_ID` (una de las 5 variables permitidas en `.env`).
- El `select` usa los nombres de columna **reales** de la DB, incluido el typo `smpt_user` / `smpt_pass` (la columna en Supabase está así escrita).
- `host`, `port` y `ssl` del servidor SMTP NO están acá — viven en `platform_config` y los lee el skill `smtp-email`.
- Para datos públicos que el browser necesita (ej. `mp_public_key`, `whatsapp`), exponerlos vía `app/api/tenant-config/route.ts`, nunca importando este helper en el cliente.
