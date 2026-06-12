# Reference: `lib/whatsapp.ts`

Path destino: `lib/whatsapp.ts`

Construye links a WhatsApp con mensajes pre-rellenados. Usado en CTAs globales y de productos.

El número **ya no sale de `.env`** — viene de `tenants.whatsapp`. Se pasa como parámetro `number`. En Server Components se obtiene con `getTenantConfig()`; en Client Components se obtiene del endpoint `tenant-config` y se pasa hacia abajo por props.

```typescript
interface WhatsAppLinkParams {
  number: string;
  message?: string;
  productName?: string;
  productUrl?: string;
}

export function buildWhatsAppLink({
  number,
  message,
  productName,
  productUrl,
}: WhatsAppLinkParams): string {
  let text = message;

  if (!text && productName) {
    text = `Hola, quiero consultar sobre: *${productName}*`;
    if (productUrl) text += `\n${productUrl}`;
  }

  if (!text) text = "Hola, quiero hacer una consulta.";

  // Normaliza el número: deja solo dígitos (wa.me no acepta espacios ni +)
  const cleanNumber = (number ?? "").replace(/\D/g, "");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
```

## Uso

### En Server Component

```typescript
import { getTenantConfig } from "@/lib/config/tenant";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const tenant = await getTenantConfig();
const link = buildWhatsAppLink({ number: tenant.whatsapp ?? "", productName: "Producto X" });
```

### En Client Component

El número llega por props (desde un Server Component padre o desde el fetch a `/api/tenant-config`):

```typescript
buildWhatsAppLink({ number: whatsappNumber, message: "Hola!" });
```

## Notas

- Si `number` viene vacío/null, el link igual se construye pero apunta a `wa.me/` sin número — el componente que lo use debería ocultar el CTA si `tenant.whatsapp` es null.
