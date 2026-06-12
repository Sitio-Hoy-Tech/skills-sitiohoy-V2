---
name: smtp-email
description: Configura el envío de emails transaccionales vía SMTP (Hostinger) con nodemailer en proyectos Next.js de SitioHoy. Provee función genérica de envío y un template configurable de confirmación de pago (con items, descuento por cupón, desglose de envío). Multi-tenant — las credenciales SMTP del negocio viven por tenant en Supabase (tenants.smpt_user / tenants.smpt_pass) y el host/puerto/SSL del servidor en platform_config. Reemplaza al skill resend-email (deprecado). Invocado por scaffolds y por mercadopago-connection (que dispara los emails). Usar cuando se quiera configurar el envío de mails, enviar emails transaccionales, o crear nuevos templates.
---

# Skill: SMTP Email (Hostinger)

Envío de emails transaccionales (confirmaciones, notificaciones) en sitios SitioHoy vía **SMTP con nodemailer**, conectado a **Hostinger**.

> **Reemplaza al skill `resend-email`** (deprecado). Hostinger es más barato que Resend y permite múltiples usuarios de correo. SPF/DKIM quedan resueltos por Hostinger sin configuración extra.

## Stack

- Next.js App Router + TypeScript
- `nodemailer` conectado a Hostinger como servidor SMTP
- Supabase configurado + `lib/supabase/admin.ts` (lo provee `scaffold-base`)

## Dependencias

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

## Dónde viven las credenciales (NADA en `.env`)

| Dato | Ubicación |
|---|---|
| Usuario SMTP del tenant (también es el `from`) | `tenants.smpt_user` *(typo intencional, columna real)* |
| Password SMTP del tenant | `tenants.smpt_pass` *(typo intencional)* |
| Host del servidor SMTP | `platform_config.host` (default `smtp.hostinger.com`) |
| Puerto | `platform_config.port` (default `465`) |
| SSL | `platform_config.ssl` (default `true` para puerto 465) |

- El `from` del email se construye automáticamente desde `tenants.smpt_user` (ej: `contacto@sitiohoy.com.ar`).
- Host/puerto/SSL en `platform_config` permiten cambiar de proveedor SMTP **sin redeploy**.
- Por defecto: Hostinger, `smtp.hostinger.com`, puerto `465`, SSL.

## Configuración inicial en Supabase

**Una sola vez** (nivel plataforma) — fila en `platform_config`:

```sql
INSERT INTO public.platform_config (host, port, ssl)
VALUES ('smtp.hostinger.com', 465, true);
-- O si ya existe la fila:
UPDATE public.platform_config SET host = 'smtp.hostinger.com', port = 465, ssl = true;
```

**Por cada tenant** — credenciales de su buzón:

```sql
UPDATE public.tenants SET
  smpt_user = 'contacto@sitiohoy.com.ar',
  smpt_pass = '{password_del_buzon}'
WHERE id = '{TENANT_ID}';
```

---

## Generar archivos del proyecto

| Ref a leer | Path destino |
|---|---|
| `smtp-email--ref--lib-email-send.md` | `lib/email/send.ts` |
| `smtp-email--ref--lib-email-template-payment.md` | `lib/email/templates/payment.ts` |

---

## Uso

### Enviar un email arbitrario

```typescript
import { sendTransactionalEmail } from "@/lib/email/send";

await sendTransactionalEmail({
  smtpUser: tenant.smpt_user,
  smtpPass: tenant.smpt_pass,
  to: "cliente@example.com",
  subject: "Asunto del email",
  html: "<div>HTML del email</div>",
  fromName: tenant.name, // opcional; el from es siempre smpt_user
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
  items: [{ name: "Producto X", price: 1000, quantity: 2 }],
  totalAmount: 2500,
  paymentId: "12345678",
  shippingInfo: { carrier: "OCA", service: "Estándar", cost: 500 },
  discount: { code: "DESC10", amount: 200 },
});

await sendTransactionalEmail({
  smtpUser: tenant.smpt_user,
  smtpPass: tenant.smpt_pass,
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

Mismo patrón: una función que devuelve HTML inline-styled y se pasa a `sendTransactionalEmail()`:

```typescript
// lib/email/templates/welcome.ts
export function buildWelcomeEmail(params: { userName: string }): string {
  return `<div>...HTML...</div>`;
}
```

---

## Reglas

1. **El email NUNCA debe romper el flujo principal** — siempre envolver en try/catch.
2. **Las credenciales SMTP del tenant vienen de `tenants.smpt_user` / `tenants.smpt_pass`** — no de `.env`.
3. **El host/puerto/SSL vienen de `platform_config`** — no de `.env`. Default: Hostinger 465/SSL.
4. **El `from` se arma desde `smpt_user`** — Hostinger resuelve SPF/DKIM para ese dominio.
5. **Para SSL usar `secure: true` con puerto 465.** Si se usa 587, `secure: false` + STARTTLS.
6. **Templates HTML inline-styled** — sin CSS externo, sin clases. Los clientes de email no los soportan bien.
