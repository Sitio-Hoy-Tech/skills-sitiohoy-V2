# Reference: `lib/email/send.ts`

Path destino: `lib/email/send.ts`

Función genérica de envío vía SMTP (Hostinger) con nodemailer.

- Las credenciales del buzón (`smtpUser` / `smtpPass`) las pasa el caller desde `tenants.smpt_user` / `tenants.smpt_pass`.
- El host/puerto/SSL se leen de `platform_config` en runtime (permite cambiar de proveedor sin redeploy).
- El `from` se arma desde `smtpUser`.

```typescript
import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";

interface SendEmailParams {
  smtpUser: string; // tenants.smpt_user — también es el remitente (from)
  smtpPass: string; // tenants.smpt_pass
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}

// Host/puerto/SSL del servidor SMTP. Fila única en platform_config.
// Fallback a Hostinger por defecto si no está configurado.
async function getSmtpServerConfig(): Promise<{ host: string; port: number; secure: boolean }> {
  try {
    const supabaseAdmin = createAdminClient();
    const { data } = await supabaseAdmin
      .from("platform_config")
      .select("host, port, ssl")
      .limit(1)
      .single();

    if (data?.host) {
      return {
        host: data.host,
        port: data.port ?? 465,
        secure: data.ssl ?? true,
      };
    }
  } catch {
    // ignora y usa el default
  }
  return { host: "smtp.hostinger.com", port: 465, secure: true };
}

export async function sendTransactionalEmail({
  smtpUser,
  smtpPass,
  to,
  subject,
  html,
  fromName,
}: SendEmailParams) {
  if (!smtpUser || !smtpPass) {
    throw new Error("Credenciales SMTP del tenant no configuradas (smpt_user / smpt_pass).");
  }

  const { host, port, secure } = await getSmtpServerConfig();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true para 465; false para 587 (STARTTLS)
    auth: { user: smtpUser, pass: smtpPass },
  });

  const from = fromName ? `${fromName} <${smtpUser}>` : smtpUser;

  const info = await transporter.sendMail({ from, to, subject, html });
  return info;
}
```

## Notas

- `secure: true` ⇒ puerto 465 (SSL directo, default Hostinger). Para 587 usar `secure: false` (STARTTLS).
- El typo `smpt_user` / `smpt_pass` es el nombre **real** de las columnas en la DB — el caller las lee tal cual y las pasa como `smtpUser` / `smtpPass`.
- Para no romper el flujo principal, el caller debe envolver la llamada en try/catch.
