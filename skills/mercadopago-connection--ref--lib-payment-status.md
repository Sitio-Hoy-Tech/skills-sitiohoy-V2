# Reference: `lib/payments/status.ts`

Path destino: `lib/payments/status.ts`

Mapea los estados que devuelve MercadoPago a los estados internos de la tabla `orders`. **Obligatorio**: la columna `orders.status` tiene un CHECK constraint y NO acepta los estados crudos de MP (`approved`, `in_process`, `rejected`). Escribir el estado de MP directo en `orders.status` hace fallar el UPDATE en silencio y la orden queda en `pending` para siempre.

## Estados válidos en `orders.status` (CHECK de la DB)

`pending` · `pending_payment` · `paid` · `payment_failed` · `processing` · `confirmed` · `shipped` · `delivered` · `cancelled` · `refunded`

El estado crudo de MP se guarda aparte en `orders.payment_status` (sin constraint) para debugging y conciliación.

```typescript
/**
 * Mapea el status de MercadoPago al status interno de orders.
 * orders.status tiene CHECK constraint — NUNCA escribir el status de MP directo.
 */
export function mapMpStatus(mpStatus?: string | null): string {
  switch (mpStatus) {
    case "approved":
      return "paid";
    case "pending":
    case "in_process":
    case "in_mediation":
    case "authorized":
      return "pending_payment";
    case "rejected":
      return "payment_failed";
    case "cancelled":
      return "cancelled";
    case "refunded":
    case "charged_back":
      return "refunded";
    default:
      return "pending_payment";
  }
}

/** True si el pago quedó efectivamente cobrado. */
export function isPaid(mpStatus?: string | null): boolean {
  return mpStatus === "approved";
}

/** True si el intento de pago es válido (cobrado o en camino). */
export function isPaymentValid(mpStatus?: string | null): boolean {
  return (
    mpStatus === "approved" ||
    mpStatus === "in_process" ||
    mpStatus === "pending" ||
    mpStatus === "authorized"
  );
}
```

## Reglas de uso

1. `orders.status` ← `mapMpStatus(result.status)` — **siempre** a través del mapeo.
2. `orders.payment_status` ← `result.status_detail` o el status crudo de MP — para trazabilidad.
3. La detección de transición en el webhook se hace sobre el estado interno: `wasPaid = order.status === "paid"`, `isNowPaid = isPaid(payment.status)`.
4. **Chequear el error de cada UPDATE a `orders`** (`if (error) console.error(...)`) — un CHECK violado falla silenciosamente si no se chequea.
