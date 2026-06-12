# Reference: `app/api/process-payment/route.ts`

Path destino: `app/api/process-payment/route.ts`

Recibe los datos del Payment Brick, crea el pago en MP, actualiza la orden (con el estado **mapeado** — ver `lib/payments/status.ts`) y dispara email de confirmación.

**Qué NO hace este endpoint:**
- NO incrementa `coupons.uses_count` — eso lo hace **solo el webhook** en la transición a `paid` (un único lugar = sin doble conteo).
- NO acepta `tenantId` del cliente — sale de `process.env.NEXT_PUBLIC_TENANT_ID`.
- NO escribe estados crudos de MP en `orders.status` — siempre vía `mapMpStatus()`.
- NO pisa `external_reference` — ese campo vincula la orden con la preferencia y no se toca.
- NO devuelve detalles internos de errores al cliente.

```typescript
import { MercadoPagoConfig, Payment as MpPayment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapMpStatus, isPaymentValid } from "@/lib/payments/status";
import { sendTransactionalEmail } from "@/lib/email/send";
import {
  buildPaymentConfirmationEmail,
  getPaymentStatusText,
} from "@/lib/email/templates/payment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, orderId } = body;
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

    if (!formData || !tenantId || !orderId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    const { data: tenant } = await supabaseAdmin
      .from("tenants")
      .select("mp_access_token, smpt_user, smpt_pass, name")
      .eq("id", tenantId)
      .single();

    if (!tenant?.mp_access_token) {
      return NextResponse.json(
        { error: "Mercado Pago no configurado" },
        { status: 400 }
      );
    }

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "id, status, mp_payment_id, total, coupon_code, discount_amount, shipping_carrier, shipping_service, shipping_cost, payer_email"
      )
      .eq("id", orderId)
      .eq("tenant_id", tenantId)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // Idempotencia: si la orden ya tiene un pago cobrado, no crear otro.
    if (order.status === "paid" && order.mp_payment_id) {
      return NextResponse.json(
        { error: "Esta orden ya fue pagada" },
        { status: 409 }
      );
    }

    const { data: orderItems } = await supabaseAdmin
      .from("order_items")
      .select("name, variant_name, quantity, unit_price")
      .eq("order_id", orderId);

    const mpClient = new MercadoPagoConfig({
      accessToken: tenant.mp_access_token,
    });
    const payment = new MpPayment(mpClient);

    const paymentBody: Record<string, unknown> = {
      transaction_amount: Number(order.total),
      description: `Compra - Orden ${orderId}`,
      payment_method_id: formData.payment_method_id,
      external_reference: orderId,
    };

    // Pago con tarjeta
    if (formData.token) {
      paymentBody.token = formData.token;
      paymentBody.installments = formData.installments || 1;
      paymentBody.payer = {
        email: formData.payer?.email || order.payer_email,
        identification: formData.payer?.identification,
      };
      if (formData.issuer_id) paymentBody.issuer_id = formData.issuer_id;
    }

    // Otros métodos (transferencia, efectivo)
    if (formData.payer && !formData.token) {
      paymentBody.payer = {
        email: formData.payer.email || order.payer_email,
        first_name: formData.payer.first_name,
        last_name: formData.payer.last_name,
        identification: formData.payer.identification,
      };
    }

    const result = await payment.create({ body: paymentBody as any });

    const payerEmailStr =
      formData.payer?.email ||
      (result.payer as any)?.email ||
      order.payer_email ||
      null;

    // Actualizar orden — estado SIEMPRE mapeado, error SIEMPRE chequeado
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        mp_payment_id: String(result.id),
        status: mapMpStatus(result.status),
        payment_status: result.status_detail ?? result.status,
        payer_email: payerEmailStr,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      // No abortar: el pago en MP ya existe. Loggear para conciliación manual.
      console.error("[process-payment] Error actualizando orden:", updateError);
    }

    // Email de confirmación vía SMTP (no rompe el pago si falla) — ver skill smtp-email
    if (isPaymentValid(result.status) && payerEmailStr && tenant.smpt_user && tenant.smpt_pass && orderItems) {
      try {
        const statusText = getPaymentStatusText(result.status!);
        const html = buildPaymentConfirmationEmail({
          statusText,
          items: orderItems.map((i) => ({
            name: i.variant_name ? `${i.name} - ${i.variant_name}` : i.name,
            price: Number(i.unit_price),
            quantity: i.quantity,
          })),
          totalAmount: Number(order.total),
          paymentId: result.id!,
          shippingInfo: order.shipping_carrier
            ? {
                carrier: order.shipping_carrier,
                service: order.shipping_service ?? undefined,
                cost: Number(order.shipping_cost ?? 0),
              }
            : undefined,
          discount:
            order.coupon_code && order.discount_amount
              ? { code: order.coupon_code, amount: Number(order.discount_amount) }
              : undefined,
        });

        await sendTransactionalEmail({
          smtpUser: tenant.smpt_user,
          smtpPass: tenant.smpt_pass,
          to: payerEmailStr,
          subject: `${statusText} - Orden #${result.id}`,
          html,
          fromName: tenant.name,
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      payment_method_id: result.payment_method_id,
    });
  } catch (error: any) {
    // Loggear el detalle server-side; al cliente solo mensaje genérico
    // (los mensajes internos de MP/Supabase no se exponen).
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
```

## Notas

- El email se manda acá para feedback inmediato. Como este endpoint setea `orders.status = "paid"` cuando MP aprueba en sincrónico, el webhook ve `wasPaid = true` y **no** manda un segundo email ni incrementa el cupón dos veces.
- Si MP devuelve `pending`/`in_process`, el email sale con el texto de estado correspondiente y el webhook se encarga del email de "aprobado" cuando llegue la transición.
