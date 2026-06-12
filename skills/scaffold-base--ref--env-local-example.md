# Reference: `.env.local.example` base

Path destino: `.env.local.example`

**Estas 5 variables son las ÚNICAS que van en `.env`.** Aplican a TODOS los planes (Esencial, Emprendimiento, Empresa) sin excepción. Todo lo demás (WhatsApp, URL del sitio, email de contacto, Umami, credenciales SMTP, MercadoPago, Envia, Correo Argentino) se lee en runtime desde la base de datos.

```env
# === Supabase ===
# URL de la instancia (Dashboard → Settings → API). Sin trailing slash.
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# === Multi-tenant ===
NEXT_PUBLIC_TENANT_ID=

# === ISR on-demand ===
# Fallback local del secret de revalidación. En producción el valor real
# se lee de tenants.revalidation_secret. Generar con: openssl rand -hex 32
REVALIDATE_SECRET=
```

## Regla de oro

**NO agregar ninguna otra variable a `.env`.** Si una integración necesita una credencial o dato de configuración, ese dato vive en Supabase, no en `.env`:

| Dato | Dónde vive |
|---|---|
| Número de WhatsApp | `tenants.whatsapp` |
| URL del sitio / dominio | `tenants.url` |
| Email de contacto (destino del formulario) | `tenants.contact_email` |
| Umami (script + website id) | `tenants.umami_url`, `tenants.umami_website_id` |
| Credenciales SMTP del tenant | `tenants.smpt_user`, `tenants.smpt_pass` |
| Host/puerto/SSL del servidor SMTP | `platform_config.host`, `platform_config.port`, `platform_config.ssl` |
| MercadoPago | `tenants.mp_access_token`, `tenants.mp_public_key` |
| Envia.com (plan Empresa) | `tenants.envia_access_token` + `tenants.origin_*` |
| Correo Argentino (plan Empresa) | `platform_config.*` + `tenants.correo_argentino_customer_id` |
| Secret de revalidación (producción) | `tenants.revalidation_secret` |

Estos datos se leen con el admin client (`lib/supabase/admin.ts`) vía el helper `getTenantConfig()` (`lib/config/tenant.ts`). Por eso `SUPABASE_SERVICE_ROLE_KEY` es la única credencial sensible que queda en `.env`: es la llave que permite leer la fila del tenant.

## Por qué `SUPABASE_SERVICE_ROLE_KEY` se queda en `.env`

El cliente admin (`service_role`) saltea RLS y es lo que usan los endpoints server-side (`tenant-config`, `contact`, webhook de pagos) y los triggers ISR para leer/escribir la fila de `tenants`. Es server-only — nunca se expone al cliente. Sin esta llave el sitio no puede leer su propia configuración.
