interface WhatsAppLinkParams {
  number?: string;
  message?: string;
  productName?: string;
  productUrl?: string;
}

export function buildWhatsAppLink({
  number,
  message,
  productName,
  productUrl,
}: WhatsAppLinkParams = {}): string {
  const phone = number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  let text = message;

  if (!text && productName) {
    text = `Hola, quiero consultar sobre: *${productName}*`;
    if (productUrl) text += `\n${productUrl}`;
  }

  if (!text) text = "Hola, quiero hacer una consulta.";

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
