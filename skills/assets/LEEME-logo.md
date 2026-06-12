# Assets de SitioHoy

Carpeta de archivos binarios que las skills copian a los proyectos generados.

## Archivos esperados

| Archivo | Uso | Estado |
|---|---|---|
| `sitiohoy-logo.png` | Logo del footer branding (skill `footer-branding-sitiohoy`). Se copia a `public/sitiohoy-logo.png` de cada proyecto. Idealmente con fondo transparente y proporción que se vea bien a 20px de alto. | ⚠️ PENDIENTE — pegar el PNG acá |
| `sitiohoy-logo-light.png` | Versión clara del logo para footers con fondo verde/emerald. Opcional. | Opcional |

> Mientras `sitiohoy-logo.png` no esté en esta carpeta, el componente `<SitioHoyBranding />` se genera en modo fallback solo-texto (sin logo), con un TODO para reponerlo.
