---
name: supabase-connection
description: Configura la conexión a Supabase en proyectos Next.js de SitioHoy. Provee referencia compacta de columnas para escribir queries, y carga el SQL completo de CREATE TABLE solo cuando se necesita montar una nueva instancia desde cero. Multi-tenant. Usar cuando el usuario quiera conectar Supabase, configurar autenticación, inicializar tablas, o consultar la estructura de una tabla.
---

# Skill: Supabase Connection

Configuración de Supabase para proyectos SitioHoy.

> **Importante:** los archivos de cliente (client/server/admin/proxy) y auth (login/signup/signout) los genera **scaffold-base**. Este skill se enfoca en el **schema** y la referencia de columnas para que el modelo escriba queries correctas.

## Stack

- Next.js App Router + TypeScript
- `@supabase/ssr` (browser y servidor con cookies)
- `@supabase/supabase-js` (cliente admin con service_role)

## Variables de entorno (las define scaffold-base)

Solo estas 5 (ver `scaffold-base--ref--env-local-example`). El resto de la config del tenant se lee de Supabase con `getTenantConfig()`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_TENANT_ID=
REVALIDATE_SECRET=
```

---

## Schema — referencia compacta de columnas

> El schema **ya está creado en producción**. Esta es la referencia que el modelo necesita para escribir queries correctas (SELECT/INSERT/UPDATE).

**`tenants`** — config del negocio
- Identidad: `id`, `name`, `slug` (unique), `plan` (`esencial`|`emprendimiento`|`empresa`), `status`, `max_products` (50/200/null), `created_at`, `updated_at`.
- Sitio / contacto (reemplazan env vars): `url` (unique), `whatsapp`, `contact_email`, `umami_url`, `umami_website_id`.
- Pagos: `mp_access_token`, `mp_public_key`.
- Email SMTP del tenant: `smpt_user`, `smpt_pass` *(columnas con typo en la DB — son así)*. El `from` se arma desde `smpt_user`. Host/port/ssl viven en `platform_config`. `resend_api_key` está DEPRECADO.
- ISR: `revalidation_secret`.
- Suscripción / deploy: `subscription_id`, `subscription_status`, `current_period_end`, `suspended_at`, `vercel_project_id`.
- **Planes Emprendimiento/Empresa con Envia (Rama A):** `envia_access_token`, `origin_name`, `origin_phone`, `origin_address`, `origin_city`, `origin_postal_code`, `origin_state`. También `mp_webhook_secret` (firma del webhook de MP, planes con pagos).
- **Solo plan Empresa con Correo Argentino:** `correo_argentino_customer_id`, `correo_argentino_token`, `correo_argentino_token_expires_at`.

**`user_tenants`** — membresías
`id`, `user_id` → `auth.users`, `tenant_id` → `tenants`, `role` (`owner`|`admin`|`editor`), `created_at`.

**`categories`** — `id`, `tenant_id`, `name`, `slug`, `position`, `active`.

**`subcategories`** — `id`, `tenant_id`, `category_id` → `categories`, `name`, `slug`, `position`, `active`.

**`products`** — catálogo
`id`, `tenant_id`, `name`, `slug`, `description`, `price`, `compare_at_price`, `is_sale`, `sale_price`, `category_id` → `categories`, `subcategory_id` → `subcategories`, `active`, `featured`, `is_service`, `position`, `created_at`, `updated_at`, `created_by`, `updated_by`. **Stock:** `stock`, `stock_unlimited`. **Envío:** `weight_grams`, `shipping_required`, `length_cm`, `width_cm`, `height_cm`.

**`product_images`** — imágenes (NO usar array en `products`)
`id`, `tenant_id`, `product_id` → `products` (cascade), `url`, `alt`, `position`.

**`product_variants`** — variantes
`id`, `tenant_id`, `product_id` → `products` (cascade), `name`, `sku`, `price`, `price_modifier`, `stock`.

**`shipping_zones`** — Emprendimiento siempre / Empresa solo si NO usa Envia
`id`, `tenant_id`, `name` (ej: "CABA"), `description`, `price`, `position`, `active`.

**`orders`** — Emprendimiento y Empresa
- Identificación: `id`, `tenant_id`, `external_reference`, `tracking_token` (unique), `created_at`, `updated_at`.
- Estado: `status` con CHECK constraint — valores válidos: `pending`|`pending_payment`|`paid`|`payment_failed`|`processing`|`confirmed`|`shipped`|`delivered`|`cancelled`|`refunded`. ⚠️ NUNCA escribir estados crudos de MP (`approved`, `in_process`, `rejected`) — usar `mapMpStatus()` de `lib/payments/status.ts`. El estado crudo de MP va en `payment_status` (sin constraint). También: `payment_provider` (default `mercadopago`), `mp_payment_id`, `total`, `currency` (default `ARS`).
- Comprador: `customer_first_name`, `customer_last_name`, `customer_phone`, `payer_email`, `notes`.
- Envío: `shipping_carrier`, `shipping_service`, `shipping_cost`, `shipping_postal_code`, `shipping_address` (JSONB), `shipping_label_url` (solo Envia), `shipping_tracking_number`.
- Cupón: `coupon_code`, `discount_amount`.

**`order_items`** — `id`, `tenant_id`, `order_id` → `orders` (cascade), `product_id` → `products`, `variant_id` → `product_variants`, `name`, `variant_name`, `quantity`, `unit_price`.

**`coupons`** — `id`, `tenant_id`, `code`, `type` (`percent`|`fixed`), `value`, `min_amount`, `max_uses`, `uses_count`, `starts_at`, `expires_at`, `active`.

**`contact_messages`** — formulario de contacto
`id`, `tenant_id`, `name`, `email`, `phone`, `message`, `source` (default `contact_form`), `status` (`new`|`read`|`archived`), `created_at`.

**`order_events`** — historial de cambios de estado de pedidos
`id`, `tenant_id`, `order_id` → `orders`, `type`, `payload` (JSONB), `created_at`.

**`payment_events`** — eventos de pago de proveedores
`id`, `tenant_id`, `order_id` → `orders`, `provider` (default `mercadopago`), `provider_event_id`, `status`, `payload` (JSONB), `created_at`.

**`product_attributes`** / **`product_attribute_values`** — atributos custom de producto (ej: "Color" → "Rojo", "Azul")
`product_attributes`: `id`, `tenant_id`, `product_id` → `products`, `name`, `position`. `product_attribute_values`: `id`, `tenant_id`, `product_attribute_id` → `product_attributes`, `value`, `position`.

**`blog_categories`** / **`blog_posts`** — blog (opcional)
`blog_posts`: `id`, `tenant_id`, `category_id` → `blog_categories`, `title`, `slug`, `excerpt`, `content`, `cover_image`, `status` (`draft`|`published`|`archived`), `published_at`.

**`platform_config`** — nivel plataforma (fila única, NO por tenant)
SMTP del servidor: `host`, `port`, `ssl`. Correo Argentino de la plataforma: `correo_argentino_user`, `correo_argentino_password`, `correo_argentino_customer_id`, `correo_argentino_token`, `correo_argentino_token_expires_at`.

**`crm_webhook_config`** — config clave/valor de webhooks de CRM: `key` (PK), `value`.

---

## Tablas por plan — referencia rápida

| Tabla | Esencial | Emprendimiento | Empresa |
|---|---|---|---|
| `tenants`, `user_tenants` | ✅ | ✅ | ✅ |
| `categories`, `subcategories` | ✅ | ✅ | ✅ |
| `products`, `product_images`, `product_variants` | ✅ | ✅ | ✅ |
| `shipping_zones` | ❌ | ✅ (si NO usa Envia) | ✅ (si NO usa Envia) |
| `orders`, `order_items` | ❌ | ✅ | ✅ |
| `coupons` | ❌ | ✅ | ✅ |
| `tenants.envia_access_token` + `origin_*` | — | ✅ (si usa Envia) | ✅ (si usa Envia) |

**Decisión clave (Emprendimiento y Empresa):** al iniciar el scaffold SIEMPRE se pregunta si usa Envia.com o zonas fijas (`shipping_zones`). Mutuamente excluyentes. En Emprendimiento, Envia aplica si lo usa como zona de envíos (ej. solo Correo Argentino) o con otros métodos además de Correo Argentino.

---

## Patrón de uso del admin client en API routes

```typescript
import { createAdminClient } from "@/lib/supabase/admin";

const supabaseAdmin = createAdminClient();

const { data: tenant } = await supabaseAdmin
  .from("tenants")
  .select("mp_access_token, smpt_user, smpt_pass, umami_url, plan")
  .eq("id", process.env.NEXT_PUBLIC_TENANT_ID)
  .single();
```

> Para leer la config completa del tenant, preferí el helper `getTenantConfig()` (`lib/config/tenant.ts`) en vez de repetir el `select` en cada route.

---

## Casos de uso

### Caso 1 — Proyecto sobre la instancia existente (default)
**No ejecutar SQL.** Las tablas ya están. Usar la referencia de columnas de arriba para escribir queries.

### Caso 2 — Montar Supabase desde cero (nueva instancia)
Cargar el reference `supabase-connection--ref--schema-sql.md` que tiene el SQL completo de `CREATE TABLE`. Pegarlo en el SQL Editor de Supabase.

Después del schema, seguir con `supabase-storage` (bucket) y `rls-on-demand` (políticas).

---

## Insertar tenant inicial

> **El script `setup-rls.sql` (generado por `rls-on-demand`) ahora crea el tenant automáticamente.** Ya no es necesario hacer el INSERT manual. El script imprime el UUID del tenant creado.

Después de correr `setup-rls.sql`, cargar la config del tenant (todo lo que antes iba en `.env` ahora va acá):
```sql
UPDATE public.tenants SET
  url = 'https://{dominio}',
  whatsapp = '549XXXXXXXXXX',
  contact_email = 'info@{dominio}',
  -- MercadoPago (planes con pagos)
  mp_access_token = '{token}',
  mp_public_key = '{key}',
  -- Email SMTP del tenant (typo en columnas es intencional)
  smpt_user = 'contacto@{dominio}',
  smpt_pass = '{password_smtp}',
  -- Analytics
  umami_url = 'https://cloud.umami.is/script.js',
  umami_website_id = '{website_id}',
  -- ISR
  revalidation_secret = '{openssl rand -hex 32}'
WHERE slug = '{slug}';
```

> El host/puerto/SSL del servidor SMTP se cargan una sola vez en `platform_config` (no por tenant). Ver skill `smtp-email`.

> **Nota:** el UPDATE usa `WHERE slug` en vez de `WHERE id` para no depender de copiar el UUID. Si se prefiere usar el UUID, usar `WHERE id = '{el-uuid-que-imprimió-setup-rls}'`.

---

## Notas importantes

- `client.ts` — usar en componentes `"use client"`
- `server.ts` — usar en Server Components y Server Actions
- `admin.ts` — SOLO server-side (API routes, Server Actions). Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente
- El proxy (`lib/supabase/proxy.ts`) protege `/admin` verificando membresía en `user_tenants` (preparación — el panel admin actual es externo)
- Roles válidos en `user_tenants`: `owner`, `admin`, `editor`
- `envia_access_token` y `origin_*` aplican a Emprendimiento y Empresa cuando eligieron Envia.com (Rama A)
- Las columnas `shipping_*` y `coupon_code`/`discount_amount` en `orders` se populan desde los endpoints de pago — no usar solo el JSONB
