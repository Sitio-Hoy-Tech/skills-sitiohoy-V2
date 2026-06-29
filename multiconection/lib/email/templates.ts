export interface EmailTemplateOptions {
  siteName: string;
  siteUrl: string;
  primaryColor?: string;
  city?: string;
}

const PRIMARY = "#00B8D4";
const BG_DARK = "#060D1A";
const CARD_BG = "#0C1828";

const baseLayout = (
  opts: EmailTemplateOptions,
  content: string,
  preheader?: string,
) => `
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ""}
  <!DOCTYPE html>
  <html lang="es">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
      <tr><td align="center">
        <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">

          <tr>
            <td style="background:${BG_DARK};padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                ${opts.siteName}
              </p>
              <p style="margin:6px 0 0;font-size:11px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.25em;">
                Pantallas LED
              </p>
            </td>
          </tr>

          <tr><td style="padding:32px 40px 16px;">${content}</td></tr>

          <tr>
            <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #f0f0f0;text-align:center;font-size:12px;color:#9ca3af;line-height:1.6;">
              <a href="${opts.siteUrl}" style="color:${PRIMARY};text-decoration:none;font-weight:700;">${opts.siteUrl}</a>${opts.city ? ` · ${opts.city}` : ""}
              <br>
              Este correo fue generado automáticamente desde el formulario de contacto.
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>
`;

const btn = (href: string, label: string, bg: string = PRIMARY) =>
  `<a href="${href}" style="display:inline-block;background:${bg};color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">${label}</a>`;

export const contactNotificationEmail = (
  opts: EmailTemplateOptions & {
    name: string;
    email: string;
    phone?: string | null;
    message: string;
  },
) =>
  baseLayout(
    opts,
    `<table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:16px;">
       <tr>
         <td style="width:48px;vertical-align:top;">
           <div style="width:40px;height:40px;border-radius:50%;background:#e8f9fb;display:flex;align-items:center;justify-content:center;font-size:20px;text-align:center;line-height:40px;">📬</div>
         </td>
         <td style="vertical-align:middle;">
           <h1 style="margin:0;font-size:22px;font-weight:800;color:#060D1A;">Nuevo mensaje de contacto</h1>
           <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">${opts.name} escribió desde el formulario</p>
         </td>
       </tr>
     </table>

     <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:16px 0;">
       <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#9ca3af;width:110px;">Nombre</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#060D1A;font-weight:600;">${opts.name}</td></tr>
       <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#9ca3af;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;"><a href="mailto:${opts.email}" style="color:${PRIMARY};text-decoration:none;font-weight:600;">${opts.email}</a></td></tr>
       ${opts.phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#9ca3af;">Teléfono</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#060D1A;font-weight:600;">${opts.phone}</td></tr>` : ""}
     </table>

     <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Mensaje</p>
     <div style="background:#f9fafb;border-radius:8px;border-left:4px solid ${PRIMARY};padding:16px 20px;">
       <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${opts.message.replace(/\n/g, "<br>")}</p>
     </div>

     <div style="margin-top:24px;">${btn(`mailto:${opts.email}`, "Responder →")}</div>`,
    `${opts.name} escribió: "${opts.message.slice(0, 60)}..."`,
  );

export const contactConfirmationEmail = (
  opts: EmailTemplateOptions & { name: string; message: string },
) =>
  baseLayout(
    opts,
    `<table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:16px;">
       <tr>
         <td style="width:48px;vertical-align:top;">
           <div style="width:40px;height:40px;border-radius:50%;background:#e8f9fb;display:flex;align-items:center;justify-content:center;font-size:20px;text-align:center;line-height:40px;">✅</div>
         </td>
         <td style="vertical-align:middle;">
           <h1 style="margin:0;font-size:22px;font-weight:800;color:#060D1A;">¡Recibimos tu consulta, ${opts.name}!</h1>
           <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">Te vamos a responder a la brevedad.</p>
         </td>
       </tr>
     </table>

     <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
       Gracias por escribirnos. Revisamos tu mensaje y nos ponemos en contacto con vos lo antes posible.
     </p>

     <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Tu mensaje</p>
     <div style="background:#f9fafb;border-radius:8px;border-left:4px solid ${PRIMARY};padding:16px 20px;">
       <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${opts.message.replace(/\n/g, "<br>")}</p>
     </div>

     <div style="margin-top:24px;">${btn(opts.siteUrl, "Volver al sitio")}</div>

     <p style="margin-top:20px;font-size:13px;color:#9ca3af;line-height:1.6;">
       ¿Necesitás respuesta inmediata? Escribinos por WhatsApp al
       <a href="https://wa.me/541136178343" style="color:#25D366;text-decoration:none;font-weight:700;">+54 11 3617-8343</a>.
     </p>`,
    `Gracias por escribirnos, ${opts.name}. Te respondemos pronto.`,
  );

export const orderConfirmationEmail = (
  opts: EmailTemplateOptions & {
    customerName: string;
    itemsHtml: string;
    shippingCost?: number;
    discountAmount?: number;
    total: number;
    trackingUrl: string;
  },
) =>
  baseLayout(
    opts,
    `<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#060D1A;">¡Gracias ${opts.customerName}!</h1>
     <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">Tu pedido fue confirmado.</p>

     <table border="0" cellpadding="8" width="100%" style="border-collapse:collapse;font-size:14px;">
       <thead><tr style="background:${CARD_BG};color:#ffffff;">
         <th style="text-align:left;font-weight:700;">Producto</th>
         <th style="text-align:center;font-weight:700;">Cantidad</th>
         <th style="text-align:right;font-weight:700;">Precio</th>
       </tr></thead>
       <tbody>${opts.itemsHtml}</tbody>
       <tfoot>
         ${(opts.shippingCost ?? 0) > 0 ? `<tr><td colspan="2" style="padding:8px;">Envío</td><td style="text-align:right;padding:8px;">$${opts.shippingCost!.toLocaleString("es-AR")}</td></tr>` : ""}
         ${(opts.discountAmount ?? 0) > 0 ? `<tr><td colspan="2" style="padding:8px;">Descuento</td><td style="text-align:right;padding:8px;">-$${opts.discountAmount!.toLocaleString("es-AR")}</td></tr>` : ""}
         <tr style="border-top:2px solid ${PRIMARY};"><td colspan="2" style="padding:12px 8px;font-weight:800;color:#060D1A;">Total</td><td style="text-align:right;padding:12px 8px;font-weight:800;color:#060D1A;font-size:16px;">$${opts.total.toLocaleString("es-AR")}</td></tr>
       </tfoot>
     </table>

     <div style="margin-top:24px;">${btn(opts.trackingUrl, "Seguir mi pedido →")}</div>`,
    `Pedido confirmado por $${opts.total.toLocaleString("es-AR")}`,
  );