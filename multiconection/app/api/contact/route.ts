import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { name, email, phone, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const supabaseAdmin = createAdminClient();

  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("name, resend_api_key, contact_email")
    .eq("id", tenantId)
    .single();

  if (!tenant?.resend_api_key) {
    console.warn(`Resend no configurado para tenant ${tenantId}`);
    return NextResponse.json({ ok: true });
  }

  if (!tenant?.contact_email) {
    console.warn(`contact_email no configurado para tenant ${tenantId}`);
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(tenant.resend_api_key);

    await resend.emails.send({
      from: `${tenant.name} <${tenant.contact_email}>`,
      to: [email],
      subject: `Recibimos tu consulta, ${name}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

                <tr>
                  <td style="background:#060D1A;padding:32px 40px;text-align:center;">
                    <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">${tenant.name}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px 40px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">
                    <div style="display:inline-block;background:#e8f9fb;border-radius:50%;padding:16px;margin-bottom:16px;">
                      <span style="font-size:32px;">✅</span>
                    </div>
                    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#060D1A;">¡Recibimos tu mensaje, ${name}!</h1>
                    <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.6;">
                      Gracias por contactarnos. Revisamos tu consulta y<br>
                      <strong style="color:#060D1A;">nos pondremos en contacto a la brevedad.</strong>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 40px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Tu mensaje</p>
                    <div style="background:#f9fafb;border-radius:8px;border-left:4px solid #00B8D4;padding:16px 20px;">
                      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${message.replace(/\n/g, "<br>")}</p>
                    </div>
                    <table style="width:100%;margin-top:20px;border-collapse:collapse;">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#9ca3af;width:110px;">Nombre</td>
                        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#374151;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;${phone ? "border-bottom:1px solid #f0f0f0;" : ""}font-size:13px;color:#9ca3af;">Email</td>
                        <td style="padding:8px 0;${phone ? "border-bottom:1px solid #f0f0f0;" : ""}font-size:13px;color:#374151;">${email}</td>
                      </tr>
                      ${phone ? `<tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Teléfono</td><td style="padding:8px 0;font-size:13px;color:#374151;">${phone}</td></tr>` : ""}
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 40px;background:#f9fafb;border-top:1px solid #f0f0f0;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                      Este correo fue enviado porque completaste el formulario de contacto en el sitio de <strong>${tenant.name}</strong>.
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });
  } catch (e) {
    console.error("Error enviando email de contacto:", e);
  }

  return NextResponse.json({ ok: true });
}
