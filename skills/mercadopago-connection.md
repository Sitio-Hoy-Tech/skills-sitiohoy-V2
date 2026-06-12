---
name: mercadopago-connection
description: Configura la integración completa con Mercado Pago en proyectos Next.js de SitioHoy (planes Emprendimiento y Empresa). Incluye creación de preferencia con orden + order_items, procesamiento de pago con Payment Brick, webhook con detección de transición a approved, aplicación de cupones (con incremento de uses_count), populación completa de las columnas de envío y descuento de orders, y disparo de emails de confirmación vía smtp-email. Multi-tenant — credenciales por tenant en Supabase. Usar cuando el usuario quiera integrar Mercado Pago, configurar pagos, crear checkout, manejar webhooks, o cuando un scaffold lo invoque.
---

# Skill: Mercado Pago Connection

Integración completa con Mercado Pago para los planes Emprendimiento y Empresa.

## Stack requerido

- Next.js App Router + TypeScript
- Supabase configurado (skill `supabase-connection`)
- `tenants` con `mp_access_token` y `mp_public_key` cargados
- Tablas `orders`, `order_items`, `coupons`
- `lib/email/send.ts` y `lib/email/templates/payment.ts` (skill `smtp-email`)
- `app/api/tenant-config/route.ts` (lo provee `scaffold-base`)

## Dependencias

```bash
npm install mercadopago @mercadopago/sdk-react
```

## Variables de entorno

Las credenciales de MP **NO** van en `.env.local`. Se almacenan por tenant:
- `tenants.mp_access_token` — Token privado (server-only)
- `tenants.mp_public_key` — Clave pública (se expone al cliente vía `/api/tenant-config`)
- `tenants.mp_webhook_secret` — Clave secreta del webhook (panel MP → Webhooks → "Clave secreta"). Server-only, valida la firma `x-signature`.

**No se agrega ninguna env var nueva** (regla de las 5 variables de scaffold-base). Las `back_urls` y `notification_url` se arman desde `tenants.url`. En localhost no se configuran webhooks.

## Setup SQL (una sola vez por instancia Supabase)

```sql
-- Columna para el secret del webhook (si no existe)
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS mp_webhook_secret text;

-- Incremento atómico de usos de cupón (lo llama SOLO el webhook)
CREATE OR REPLACE FUNCTION public.increment_coupon_use(p_tenant_id uuid, p_code text)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.coupons
     SET uses_count = COALESCE(uses_count, 0) + 1
   WHERE tenant_id = p_tenant_id AND code = p_code;
$$;
```

---

## Generar archivos del proyecto

| Ref a leer | Path destino |
|---|---|
| `mercadopago-connection--ref--lib-payment-status.md` | `lib/payments/status.ts` ⚠️ **PRIMERO** (lo importan los 3 endpoints) |
| `mercadopago-connection--ref--api-create-preference.md` | `app/api/create-preference/route.ts` |
| `mercadopago-connection--ref--api-process-payment.md` | `app/api/process-payment/route.ts` |
| `mercadopago-connection--ref--api-webhook.md` | `app/api/webhooks/mercadopago/route.ts` |
| `mercadopago-connection--ref--checkout-page.md` | `app/checkout/page.tsx` (placeholder con Payment Brick — el skill de diseño lo estiliza) |

---

## Flujo completo

1. **Cliente** captura datos del comprador (`customer`), selección de envío (`shipping`: `zone_id` en Rama B, `carrier`+`service` en Rama A) y opcionalmente el código de cupón.
2. **Cliente** llama a `GET /api/tenant-config` → recibe `mp_public_key`.
3. **Cliente** inicializa el SDK con `initMercadoPago(publicKey, { locale: "es-AR" })`.
4. **Cliente** llama a `POST /api/create-preference` con `{ items: [{product_id, variant_id?, quantity}], customer, shipping, coupon?: {code} }`. **Sin precios, sin tenantId, sin discount** — todo eso lo calcula el servidor.
5. **Servidor** resuelve precios desde `products`/`product_variants`, re-valida el cupón, verifica el costo de envío (lookup de zona o re-cotización Envia) y crea `orders` con todas las columnas (shipping_*, coupon_code, discount_amount, customer_*, payer_email).
6. **Servidor** crea N filas en `order_items`.
7. **Servidor** crea preferencia en MP (descuento prorrateado entre ítems — MP no acepta ítems negativos) y devuelve `{ preferenceId, orderId, total }`.
8. **Cliente** renderiza el Payment Brick con `preferenceId` y el `total` del servidor.
9. **Usuario** completa el formulario de pago.
10. **Cliente** llama a `POST /api/process-payment` con `{ formData, orderId }`.
11. **Servidor** crea el pago en MP, actualiza `orders` con `mp_payment_id` y el **status mapeado** (`mapMpStatus` — ver `lib/payments/status.ts`), y envía email de confirmación. NO toca el cupón.
12. **Cliente** redirige a `/checkout/status`.
13. **Webhook** valida la firma `x-signature`, re-consulta el pago a MP, actualiza estado final, y **solo en la transición a `paid`**: incrementa `coupons.uses_count` (RPC atómico) + envía email. Único lugar donde se incrementa el cupón.

---

## Tipos de datos esperados

El endpoint `create-preference` espera este payload del cliente (**solo IDs y cantidades** — precios, descuento y costo de envío se calculan server-side):

```typescript
{
  items: Array<{
    product_id: string;
    variant_id?: string;
    quantity: number;
  }>;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  shipping: {
    zone_id?: string;       // Rama B (zonas fijas) — el server busca el precio
    carrier?: string;       // Rama A (Envia) — el server re-cotiza y matchea
    service?: string;       // Rama A
    street?: string;
    city?: string;
    state?: string;
    postal_code: string;
    notes?: string;
  };
  coupon?: {
    code: string;           // SOLO el código — el server recalcula el descuento
  };
}
```

> ⚠️ Si un payload incluye `price`, `cost`, `discount` o `tenantId`, el endpoint los **ignora**. Confiar en valores del navegador permite comprar a cualquier precio.

---

## Notas importantes

- Las credenciales de MP se obtienen de `tenants.mp_access_token` y `tenants.mp_public_key` (multi-tenant).
- El `external_reference` vincula la preferencia con la orden en Supabase. **Nunca pisarlo** con el payment id.
- Si es localhost, no se configuran `back_urls` ni `notification_url`.
- La moneda fija es `ARS`.
- El webhook siempre responde `{ received: true }` para no generar reintentos de MP (excepto firma inválida → 401).
- **`orders.status` SIEMPRE se escribe vía `mapMpStatus()`** (`lib/payments/status.ts`). La tabla tiene CHECK constraint y rechaza los estados crudos de MP (`approved`, `in_process`, `rejected`). El estado crudo va en `orders.payment_status`.
- El incremento de `uses_count` se hace **SOLO en el webhook**, en la transición a `paid`, con el RPC atómico `increment_coupon_use`. `process-payment` NO incrementa — así no hay doble conteo ni carreras.
- El email se envía en `process-payment` (feedback inmediato) y en el webhook **solo si la orden no estaba ya en `paid`** — la transición evita duplicados.
- Los datos del comprador se guardan en columnas dedicadas (`customer_first_name`, `customer_last_name`, `customer_phone`, `payer_email`), NO solo en JSONB.
- `shipping_address` JSONB tiene la dirección completa; las columnas `shipping_carrier`, `shipping_service`, `shipping_cost`, `shipping_postal_code` se populan para queries rápidas y reporting.

## Reglas

1. **Email NUNCA rompe el pago** — siempre en try/catch independiente.
2. **Todas las credenciales** vienen de la tabla `tenants`, no de `.env`.
3. **`tenantId` NUNCA viene del cliente** — siempre `process.env.NEXT_PUBLIC_TENANT_ID` (cada deploy es de un solo tenant).
4. **Precios, descuento y envío se calculan SIEMPRE server-side** contra la DB. El cliente solo manda IDs y cantidades.
5. **El webhook es idempotente** — verificar transición de status (sobre estados internos mapeados) para no duplicar acciones, y validar la firma `x-signature` si `mp_webhook_secret` está cargado.
6. **`order_items` se crea SIEMPRE** junto con la orden, no solo el JSONB en `orders.shipping_address`.
7. **Cupones: `uses_count` se incrementa UNA sola vez, solo en el webhook**, en la transición a `paid`, vía RPC atómico.
8. **Chequear el error de todo UPDATE a `orders`** — un CHECK violado falla en silencio si no se chequea.
