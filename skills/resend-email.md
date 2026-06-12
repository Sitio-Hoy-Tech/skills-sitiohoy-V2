---
name: resend-email
description: "[ARCHIVADO — NO ACTIVAR. Usar el skill smtp-email] Integración de emails transaccionales con Resend, fuera de uso. Se conserva únicamente por si en el futuro se vuelve a Resend. Ninguna mención a 'emails', 'mails transaccionales' o 'confirmaciones' debe activar este skill — eso es smtp-email. Solo leer este archivo si el usuario pide EXPLÍCITAMENTE 'usar Resend' o 'volver a Resend'."
---

# Skill: Resend Email — ⛔ ARCHIVADO (no activar)

> **⛔ STOP. Si llegaste acá buscando cómo enviar emails, este NO es el skill: usar `smtp-email` (SMTP/Hostinger con nodemailer).**
>
> Este skill solo se sigue si el usuario pidió **explícitamente y por nombre** volver a usar Resend. En cualquier otro caso, cerrar este archivo y leer `smtp-email`.
>
> Contexto: el envío de emails se hace por **SMTP (Hostinger) con nodemailer**. Hostinger es más barato que Resend y permite múltiples buzones. Las credenciales viven en `tenants.smpt_user` / `tenants.smpt_pass` (no más `tenants.resend_api_key`) y el servidor en `platform_config`. Este archivo se conserva como referencia por si la plataforma vuelve a Resend en el futuro.

---

# Skill: Resend Email

Envío de emails transaccionales (confirmaciones, notificaciones) en sitios SitioHoy.

## Stack

- Next.js App Router + TypeScript
- Supabase configurado (`tenants.resend_api_key`)
- `lib/supabase/admin.ts` (lo provee `scaffold-base`)

## Dependencias

```bash
npm install resend
```

## Variables de entorno

La API key de Resend se almacena por tenant en `tenants.resend_api_key` en Supabase. **No va en `.env`.**

Variables de configuración por proyecto en `.env.local`:

```env
RESEND_FROM_DOMAIN=tu-dominio.com.ar
RESEND_FROM_EMAIL=noreply@tu-dominio.com.ar
CONTACT_EMAIL=info@tu-dominio.com.ar
```

## Configuración del dominio en Resend

1. Ir a [resend.com/domains](https://resend.com/domains).
2. Agregar el dominio del cliente (ej: `tu-dominio.com.ar`).
3. Configurar los registros DNS (MX, SPF, DKIM) que indica Resend.
4. Verificar el dominio.
5. Crear API key y guardarla en `tenants.resend_api_key` (Supabase).

---

## Generar archivos del proyecto

| Ref a leer | Path destino |
|---|---|
| `resend-email--ref--lib-email-send.md` | `lib/email/send.ts` |
| `resend-email--ref--lib-email-template-payment.md` | `lib/email/templates/payment.ts` |

---

## Uso

### Enviar un email arbitrario

```typescript
import { sendTransactionalEmail } from "@/lib/email/send";

await sendTransactionalEmail({
  resendApiKey: tenant.resend_api_key,
  to: "cliente@example.com",
  subject: "Asunto del email",
  html: "<div>HTML del email</div>",
  fromName: tenant.name, // opcional, usa env como fallback
});
```

### Enviar confirmación de pago

```typescript
import { sendTransactionalEmail } from "@/lib/email/send";
import {
  buildPaymentConfirmationEmail,
  getPaymentStatusText,
} from "@/lib/email/templates/payment";

const html = buildPaymentConfirmationEmail({
  statusText: getPaymentStatusText("approved"),
  items: [
    { name: "Producto X", price: 1000, quantity: 2 },
  ],
  totalAmount: 2500,
  paymentId: "12345678",
  shippingInfo: { carrier: "OCA", service: "Estándar", cost: 500 },
  discount: { code: "DESC10", amount: 200 },
});

await sendTransactionalEmail({
  resendApiKey: tenant.resend_api_key,
  to: "cliente@example.com",
  subject: "✅ Pago aprobado - Orden #12345678",
  html,
  fromName: tenant.name,
});
```

---

## Helpers de status

```typescript
getPaymentStatusText("approved")    // "✅ Pago aprobado"
getPaymentStatusText("pending")     // "⏳ Pago pendiente"
getPaymentStatusText("in_process")  // "⏳ Pago en proceso"
getPaymentStatusText("rejected")    // "❌ Pago rechazado"
```

---

## Personalización del template de pago

Pasar parámetros opcionales para adaptar al branding del cliente:

```typescript
buildPaymentConfirmationEmail({
  // ... datos obligatorios
  headerTitle: "Tu Compra en Mi Tienda",
  gradientFrom: "#FF6B35",
  gradientTo: "#F7931E",
  accentColor: "#FF6B35",
});
```

| Parámetro | Default | Descripción |
|---|---|---|
| `headerTitle` | "Confirmación de Compra" | Título del header del email |
| `gradientFrom` / `gradientTo` | `#6366f1` / `#8b5cf6` | Gradiente del header |
| `accentColor` | `#6366f1` | Color del total y acentos |

---

## Crear nuevos templates

Para agregar otros emails (bienvenida, cambio de estado de envío, recuperación de contraseña, etc.), seguir el patrón:

```typescript
// lib/email/templates/welcome.ts
export function buildWelcomeEmail(params: { userName: string }): string {
  return `<div>...HTML...</div>`;
}
```

Y llamar con `sendTransactionalEmail()` pasando el HTML generado.

---

## Reglas

1. **El email NUNCA debe romper el flujo principal** — siempre envolver en try/catch.
2. **La API key viene de `tenants.resend_api_key`** — no de `.env`.
3. **El remitente (`from`) debe coincidir con un dominio verificado en Resend** — sino el envío falla.
4. **Para desarrollo**, Resend permite enviar a tu propio email sin verificar dominio.
5. **El email del comprador** se obtiene de `formData.payer.email` o `result.payer.email` (fallback para wallet payments).
6. **Templates HTML inline-styled** — sin CSS externo, sin clases. Los clientes de email no los soportan bien.
