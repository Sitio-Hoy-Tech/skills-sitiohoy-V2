# Reference: `app/layout.tsx` — Root layout con Umami

Path destino: `app/layout.tsx`

Root layout que inyecta el script de Umami solo si el tenant tiene `umami_website_id` configurado. **El skill `sitio-diseno` después agrega las fuentes y demás configuración visual a este mismo archivo.**

Los datos de Umami ya **no salen de `.env`** — viven en `tenants` (`umami_url`, `umami_website_id`) y el dominio se deriva de `tenants.url`. Por eso el layout es `async` y usa `getTenantConfig()`.

```typescript
import Script from "next/script";
import { getTenantConfig, getSiteDomain } from "@/lib/config/tenant";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenantConfig();
  const umamiSrc = tenant.umami_url || "https://cloud.umami.is/script.js";
  const umamiId = tenant.umami_website_id;
  const siteDomain = getSiteDomain(tenant.url);

  return (
    <html lang="es">
      <head />
      <body>
        {umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            data-domains={siteDomain ?? undefined}
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
```

## Por qué `data-domains`

Cuando `data-domains` está presente, el script de Umami **solo envía eventos cuando el hostname actual coincide con ese valor**. Esto tiene dos efectos importantes:

1. **En `localhost` / `npm run dev`:** el script se carga pero no envía nada — cero errores 400 en consola.
2. **En producción (dominio del cliente):** el script trackea normalmente.

Sin `data-domains`, el script intenta enviar eventos desde localhost y la API de Umami responde `400` porque el website ID no está registrado para ese origen.

El dominio se deriva automáticamente de `tenants.url` con `getSiteDomain()` (quita el protocolo y el path). Ya no hace falta una variable aparte.

## Configuración en Supabase

En la fila del tenant (`tenants`):

```sql
UPDATE public.tenants SET
  umami_url = 'https://cloud.umami.is/script.js',
  umami_website_id = '550e8400-e29b-41d4-a716-446655440000', -- UUID que da Umami Cloud
  url = 'https://cafedelnorte.com.ar'
WHERE id = '{TENANT_ID}';
```

> **IMPORTANTE:** `umami_website_id` debe ser el UUID que da Umami Cloud. NO poner emails ni texto libre — la API de Umami devuelve 400 con valores inválidos.

## Nota

El `<head />` vacío y el `<body>` sin clases es intencional — el skill `sitio-diseno` agrega:
- Fuentes con `next/font/google`
- Variables CSS de tipografía en el `<html>`
- Clases en el `<body>` para fondo y color de texto
- Metadata (título, descripción)
- Favicon
