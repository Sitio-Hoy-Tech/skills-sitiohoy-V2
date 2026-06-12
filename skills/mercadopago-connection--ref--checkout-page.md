# Reference: `app/checkout/page.tsx` con Payment Brick

Path destino: `app/checkout/page.tsx`

Componente cliente que integra el Payment Brick de Mercado Pago. Asume que los datos de checkout (cart, customer, shipping, coupon) ya fueron capturados en pasos anteriores y guardados en `localStorage`. **El skill de diseño implementa el form completo de captura — este archivo es la integración técnica del pago.**

```typescript
"use client";

import { useEffect, useState, useCallback } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;          // productId-variantId (key del CartContext)
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number;       // solo para mostrar en la UI — el server NO lo usa
  quantity: number;
};

type CustomerInfo = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
};

type ShippingInfo = {
  zone_id?: string;    // Rama B (zonas fijas) — el server busca el precio por id
  carrier?: string;    // Rama A (Envia) — el server re-cotiza y matchea
  service?: string;    // Rama A
  street?: string;
  city?: string;
  state?: string;
  postal_code: string;
  notes?: string;
};

type CouponInfo = {
  code: string;        // SOLO el código — el descuento lo recalcula el server
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mpInitialized, setMpInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedCustomer = localStorage.getItem("checkout_customer");
    const savedShipping = localStorage.getItem("checkout_shipping");
    const savedCoupon = localStorage.getItem("checkout_coupon");

    if (!savedCart || !savedCustomer || !savedShipping) {
      router.push("/checkout/datos");
      return;
    }

    const parsedCart: CartItem[] = JSON.parse(savedCart);
    const customer: CustomerInfo = JSON.parse(savedCustomer);
    const shipping: ShippingInfo = JSON.parse(savedShipping);
    const coupon: CouponInfo | undefined = savedCoupon
      ? JSON.parse(savedCoupon)
      : undefined;

    if (parsedCart.length === 0) {
      router.push("/");
      return;
    }
    setCart(parsedCart);

    async function init() {
      try {
        const keyRes = await fetch(`/api/tenant-config`);
        const keyData = await keyRes.json();
        if (!keyData.mp_public_key) {
          setError("Mercado Pago no está configurado.");
          setLoading(false);
          return;
        }

        initMercadoPago(keyData.mp_public_key, { locale: "es-AR" });
        setMpInitialized(true);

        // ⚠️ Al server van SOLO ids y cantidades — los precios, el descuento
        // y el envío los calcula /api/create-preference contra la DB.
        const prefRes = await fetch("/api/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: parsedCart.map((i) => ({
              product_id: i.productId,
              variant_id: i.variantId,
              quantity: i.quantity,
            })),
            customer,
            shipping,
            coupon: coupon ? { code: coupon.code } : undefined,
          }),
        });
        const prefData = await prefRes.json();

        if (prefData.preferenceId && prefData.orderId) {
          setPreferenceId(prefData.preferenceId);
          setOrderId(prefData.orderId);
          // Total autoritativo calculado por el server — nunca calcularlo acá
          setTotal(prefData.total);
        } else {
          setError(prefData.error || "Error al crear la preferencia.");
        }
      } catch (err) {
        setError("Error al inicializar el checkout.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  const handleSubmit = useCallback(
    async (formData: unknown) => {
      setProcessing(true);
      setError(null);

      try {
        const res = await fetch("/api/process-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData, orderId }),
        });

        const data = await res.json();

        if (data.id) {
          localStorage.removeItem("cart");
          localStorage.removeItem("checkout_customer");
          localStorage.removeItem("checkout_shipping");
          localStorage.removeItem("checkout_coupon");
          router.push(
            `/checkout/status?payment_id=${data.id}&status=${data.status}`
          );
        } else {
          setError(data.error || "Error al procesar el pago");
        }
      } catch (err) {
        setError("Error de conexión. Intentá de nuevo.");
        console.error(err);
      } finally {
        setProcessing(false);
      }
    },
    [orderId, router]
  );

  // TODO: skill sitio-diseno — wrapper visual del checkout
  return (
    <>
      {error && <div role="alert">{error}</div>}
      {mpInitialized && preferenceId && total > 0 && (
        <Payment
          initialization={{
            amount: total,
            preferenceId: preferenceId,
          }}
          onSubmit={async (param) => {
            await handleSubmit(param.formData);
          }}
          onError={(error) => console.error("Payment Brick error:", error)}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
              mercadoPago: "all",
            } as any,
          }}
        />
      )}
    </>
  );
}
```

## Notas

- El form de captura de datos del comprador, selección de envío y validación de cupón vive en `app/checkout/datos/page.tsx` (lo arma el skill `sitio-diseno`). **Contrato de localStorage que esa página debe respetar:**
  - `checkout_customer` → `{ first_name, last_name, email, phone? }`
  - `checkout_shipping` → Rama B: `{ zone_id, street, city, state, postal_code, notes? }` · Rama A: `{ carrier, service, street, city, state, postal_code, notes? }`
  - `checkout_coupon` → `{ code }` (solo el código — sin discount; el server lo recalcula)
- Este archivo solo monta el Payment Brick una vez que los datos están en localStorage.
- El `total` que se muestra y se pasa al Brick viene del response de `/api/create-preference` (autoritativo, calculado contra la DB).
- El status del pago se ve en `app/checkout/status/page.tsx` (también del skill de diseño).
