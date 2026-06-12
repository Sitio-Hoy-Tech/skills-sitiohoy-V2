# Reference: `app/api/tenant-config/route.ts`

Path destino: `app/api/tenant-config/route.ts`

Endpoint que devuelve la config **pública** del tenant para que los Client Components la consuman (WhatsApp, `mp_public_key`, Umami, URL). Si el plan es Esencial y NO usa MP, igual funciona — `mp_public_key` será null.

> **Importante:** este endpoint solo debe devolver campos NO sensibles. Nunca incluir `mp_access_token`, `smpt_pass`, `revalidation_secret` ni tokens de envío — esos se leen solo server-side con `getTenantConfig()`.

```typescript
import { NextResponse } from "next/server";
import { getTenantConfig } from "@/lib/config/tenant";

export async function GET() {
  try {
    // getTenantConfig está cacheado (unstable_cache + tag tenant-config-{id})
    // — este endpoint NO golpea Supabase en cada visita.
    const t = await getTenantConfig();

    // ⚠️ Allowlist explícita de campos públicos. NUNCA hacer spread del objeto
    // completo: tiene mp_access_token, smpt_pass, revalidation_secret, etc.
    return NextResponse.json({
      name: t.name,
      slug: t.slug,
      plan: t.plan,
      status: t.status,
      max_products: t.max_products,
      url: t.url,
      whatsapp: t.whatsapp,
      contact_email: t.contact_email,
      umami_url: t.umami_url,
      umami_website_id: t.umami_website_id,
      mp_public_key: t.mp_public_key,
    });
  } catch {
    return NextResponse.json({ error: "Tenant no encontrado" }, { status: 404 });
  }
}
```

## Campos devueltos

| Campo | Uso en el front |
|---|---|
| `name`, `slug` | Branding / títulos |
| `plan`, `status`, `max_products` | Lógica de plan |
| `url` | Links absolutos, canonical |
| `whatsapp` | CTA de WhatsApp (pasar a `buildWhatsAppLink`) |
| `contact_email` | Mostrar email de contacto |
| `umami_url`, `umami_website_id` | Script de analytics |
| `mp_public_key` | SDK de MercadoPago en el browser |
