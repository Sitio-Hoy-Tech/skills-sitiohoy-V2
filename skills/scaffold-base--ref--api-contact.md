# Reference: `app/api/contact/route.ts`

Path destino: `app/api/contact/route.ts`

Formulario de contacto. Manda un email vía SMTP (ver skill `smtp-email`) al `contact_email` del tenant. Usa las credenciales SMTP del tenant (`smpt_user` / `smpt_pass`) en Supabase.

**Importante:** si el SMTP o el `contact_email` no están configurados, el endpoint igual responde `ok: true` para que el usuario no vea errores internos. Se loggea por consola.

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email/send";

// El input del visitante se interpola en el HTML del email → escapar SIEMPRE
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

export async function POST(request: NextRequest) {
  const { name, email, phone, message, website } = await request.json();

  // Honeypot anti-spam: "website" es un campo oculto del form que los humanos
  // no completan. Si viene con valor, es un bot — responder ok sin hacer nada.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  // Límites de tamaño — evita abuso del SMTP del tenant
  if (String(name).length > 200 || String(email).length > 200 || String(message).length > 5000) {
    return NextResponse.json({ error: "Campos demasiado largos" }, { status: 400 });
  }

  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const supabaseAdmin = createAdminClient();

  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("name, contact_email, smpt_user, smpt_pass")
    .eq("id", tenantId)
    .single();

  // Opcional: guardar el mensaje en contact_messages
  if (tenant) {
    await supabaseAdmin.from("contact_messages").insert({
      tenant_id: tenantId,
      name,
      email,
      phone: phone ?? null,
      message,
      source: "contact_form",
    });
  }

  if (!tenant?.smpt_user || !tenant?.smpt_pass) {
    console.warn(`SMTP no configurado para tenant ${tenantId}`);
    return NextResponse.json({ ok: true });
  }

  const destinationEmail = tenant.contact_email;
  if (!destinationEmail) {
    console.warn("contact_email no configurado para el tenant");
    return NextResponse.json({ ok: true });
  }

  try {
    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safePhone = phone ? escapeHtml(String(phone)) : null;
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, "<br>");

    await sendTransactionalEmail({
      smtpUser: tenant.smpt_user,
      smtpPass: tenant.smpt_pass,
      fromName: tenant.name,
      to: destinationEmail,
      subject: `Nueva consulta de ${String(name).replace(/[\r\n]/g, " ").slice(0, 100)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2>Nueva consulta desde el sitio web</h2>
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          ${safePhone ? `<p><strong>Teléfono:</strong> ${safePhone}</p>` : ""}
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">
            ${safeMessage}
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error("Error enviando email de contacto:", e);
  }

  return NextResponse.json({ ok: true });
}
```

> **El form del sitio debe incluir el honeypot:** un input `name="website"` oculto con CSS (`position: absolute; left: -9999px`, `tabIndex={-1}`, `autoComplete="off"`) — NO `display: none` directo en el input visible para lectores de pantalla; agregar `aria-hidden="true"` al wrapper. El skill `sitio-diseno` lo agrega al armar el form de contacto.

## Notas

- El `from` lo arma `sendTransactionalEmail` desde `tenant.smpt_user` (ver skill `smtp-email`).
- El destino es `tenant.contact_email` (antes era la env var `CONTACT_EMAIL`).
- Guardar el mensaje en `contact_messages` es opcional pero recomendado: queda registro aunque falle el email.
