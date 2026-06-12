# Reference: `app/api/webhooks/mercadopago/route.ts`

Path destino: `app/api/webhooks/mercadopago/route.ts`

Recibe notificaciones asíncronas de MP y actualiza el estado final. Detecta la transición de "no-paid" a "paid" (estados internos, ya mapeados) para incrementar cupón y enviar email **solo una vez**.

**Seguridad:**
- **Valida la firma `x-signature`** de MercadoPago (HMAC-SHA256 con el secret del webhook). Si `tenants.mp_webhook_secret` está cargado y la firma no valida → 401. Si el secret no está cargado, procesa pero loggea un warning (configurarlo es parte del go-live).
- El tenant sale de `process.env.NEXT_PUBLIC_TENANT_ID` — la URL del webhook ya NO lleva `?tenantId=`.
- El estado del pago se re-consulta a la API de MP con el access token del tenant (nunca se confía en el body).

**Requiere** (una sola vez por instancia — ver `mercadopago-connection.md`):
```sql
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS mp_webhook_secret text;
-- + la función increment_coupon_use (ver skill principal)
```

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { MercadoPagoConfig, Payment as MpPayment } from "mercadopago";
import { mapMpStatus, isPaid } from "@/lib/payments/status";
import { sendTransactionalEmail } from "@/lib/email/send";
import { buildPaymentConfirmationEmail } from "@/lib/email/templates/payment";

/**
 * Valida el header x-signature de MercadoPago.
 * Manifest: "id:{data.id};request-id:{x-request-id};ts:{ts};"
 * https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
function isValidSignature(
  request: NextRequest,
  dataId: string,
  secret: string
): boolean {
  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signature || !requestId) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((p) => p.trim().split("=") as [string, string])
  );
  if (!parts.ts || !parts.v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  return expected === parts.v1;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "payment" && body.data?.id) {
      const paymentId = String(body.data.id);
      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

      if (!tenantId) {
        console.error("Webhook: NEXT_PUBLIC_TENANT_ID no configurado");
        return NextResponse.json({ received: true });
      }

      const supabaseAdmin = createAdminClient();

      const { data: tenant } = await supabaseAdmin
        .from("tenants")
        .select("mp_access_token, mp_webhook_secret, smpt_user, smpt_pass, name")
        .eq("id", tenantId)
        .single();

      if (!tenant?.mp_access_token) {
        return NextResponse.json({ received: true });
      }

      // ── Validación de firma ──────────────────────────────────────────
      if (tenant.mp_webhook_secret) {
        if (!isValidSignature(request, paymentId, tenant.mp_webhook_secret)) {
          console.error("Webhook: firma inválida");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      } else {
        console.warn(
          "Webhook: mp_webhook_secret no configurado — firma NO validada. Cargarlo antes del go-live."
        );
      }

      const mpClient = new MercadoPagoConfig({
        accessToken: tenant.mp_access_token,
      });
      const paymentApi = new MpPayment(mpClient);
      const payment = await paymentApi.get({ id: paymentId });

      const orderId = payment.external_reference;
      const payerEmailStr = (payment.payer as any)?.email;

      if (!orderId) {
        return NextResponse.json({ received: true });
      }

      // Estado anterior para detectar transición (estados internos mapeados)
      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select(
          "status, total, coupon_code, discount_amount, shipping_carrier, shipping_service, shipping_cost"
        )
        .eq("id", orderId)
        .eq("tenant_id", tenantId)
        .single();

      if (!existingOrder) {
        return NextResponse.json({ received: true });
      }

      const wasPaid = existingOrder.status === "paid";
      const isNowPaid = isPaid(payment.status);

      // Registrar el evento crudo para auditoría/conciliación
      await supabaseAdmin.from("payment_events").insert({
        tenant_id: tenantId,
        order_id: orderId,
        provider: "mercadopago",
        provider_event_id: paymentId,
        status: payment.status ?? null,
        payload: { status_detail: payment.status_detail, type: body.type },
      });

      // Actualizar orden — estado SIEMPRE mapeado, error SIEMPRE chequeado
      const updateData: Record<string, unknown> = {
        status: mapMpStatus(payment.status),
        payment_status: payment.status_detail ?? payment.status,
        mp_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      };
      if (payerEmailStr) updateData.payer_email = payerEmailStr;

      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

      if (updateError) {
        console.error("[webhook] Error actualizando orden:", updateError);
      }

      // Si pasa a paid por primera vez: aplicar cupón + email (una sola vez)
      if (!wasPaid && isNowPaid) {
        // Incremento ATÓMICO del cupón (único lugar donde se incrementa)
        if (existingOrder.coupon_code) {
          const { error: couponError } = await supabaseAdmin.rpc(
            "increment_coupon_use",
            { p_tenant_id: tenantId, p_code: existingOrder.coupon_code }
          );
          if (couponError) {
            console.error("[webhook] Error incrementando cupón:", couponError);
          }
        }

        // Email de confirmación (vía SMTP — ver skill smtp-email)
        if (tenant.smpt_user && tenant.smpt_pass && payerEmailStr) {
          try {
            const { data: orderItems } = await supabaseAdmin
              .from("order_items")
              .select("name, variant_name, quantity, unit_price")
              .eq("order_id", orderId);

            const html = buildPaymentConfirmationEmail({
              statusText: "✅ Pago aprobado",
              items: (orderItems ?? []).map((i) => ({
                name: i.variant_name ? `${i.name} - ${i.variant_name}` : i.name,
                price: Number(i.unit_price),
                quantity: i.quantity,
              })),
              totalAmount: Number(existingOrder.total),
              paymentId: payment.id!,
              shippingInfo: existingOrder.shipping_carrier
                ? {
                    carrier: existingOrder.shipping_carrier,
                    service: existingOrder.shipping_service ?? undefined,
                    cost: Number(existingOrder.shipping_cost ?? 0),
                  }
                : undefined,
              discount:
                existingOrder.coupon_code && existingOrder.discount_amount
                  ? {
                      code: existingOrder.coupon_code,
                      amount: Number(existingOrder.discount_amount),
                    }
                  : undefined,
            });

            await sendTransactionalEmail({
              smtpUser: tenant.smpt_user,
              smtpPass: tenant.smpt_pass,
              to: payerEmailStr,
              subject: `✅ Pago aprobado - Orden #${payment.id}`,
              html,
              fromName: tenant.name,
            });
          } catch (e) {
            console.error("Webhook email error:", e);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
```

## Notas

- Siempre responde `{ received: true }` (salvo firma inválida → 401) para que MP no reintente indefinidamente.
- La detección `!wasPaid && isNowPaid` usa los **estados internos** (`paid`), no los de MP. Como `process-payment` también escribe estados mapeados, la transición se detecta correctamente y no se duplica ni el cupón ni el email.
- El **secret del webhook** se obtiene en el panel de MercadoPago del cliente: Tus integraciones → la aplicación → Webhooks → "Clave secreta". Guardarlo en `tenants.mp_webhook_secret`.
- El insert en `payment_events` deja trazabilidad de cada notificación (la tabla ya existe en el schema y está protegida por RLS deny-all).
- Para testear localmente, usar ngrok y setear temporalmente `tenants.url` con la URL de ngrok (la `notification_url` se arma desde `tenants.url`).
- **Plan Empresa con Correo Argentino:** el branch de `importShipping` (skill `correo-argentino`) va DENTRO del bloque `!wasPaid && isNowPaid`, después del email.
