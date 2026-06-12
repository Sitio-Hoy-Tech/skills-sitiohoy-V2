---
name: footer-branding-sitiohoy
description: Barra inferior del footer que muestra la marca SitioHoy en TODAS las plantillas, independientemente del plan. Es la última franja del footer, debajo de todo el contenido del cliente. Incluye el logo PNG de SitioHoy en tamaño pequeño + texto "Sitio creado con SitioHoy" con link a sitiohoy.com.ar. Este componente es IDÉNTICO en todas las plantillas — no varía con el diseño del footer del cliente.
---

# Skill: Footer Branding — SitioHoy

Barra de marca de la plataforma que va al **final de TODOS los footers**, debajo del contenido del cliente (links, contacto, copyright). Es la firma de SitioHoy en cada sitio que generamos.

## Regla principal

**Este componente es FIJO y CONSISTENTE en todas las plantillas.** No cambia de diseño ni de posición. Siempre va como última franja del footer, separada visualmente del resto.

---

## El logo — archivo PNG real (NUNCA inventar un SVG)

El logo oficial es un **PNG** que vive en la carpeta de assets de las skills:

```
D:\escritorio\skills-sitiohoy-V2\skills\assets\sitiohoy-logo.png          ← logo principal
D:\escritorio\skills-sitiohoy-V2\skills\assets\sitiohoy-logo-light.png   ← versión clara (opcional, para footers verdes)
```

**Al implementar el componente:**

1. **Copiar** `sitiohoy-logo.png` (y `sitiohoy-logo-light.png` si existe) al `public/` del proyecto:
   ```bash
   cp "D:\escritorio\skills-sitiohoy-V2\skills\assets\sitiohoy-logo.png" public/sitiohoy-logo.png
   ```
2. Si la carpeta de assets **no está disponible** (o el archivo no existe): preguntar al usuario la ruta del PNG. Si tampoco la tiene a mano, usar el **fallback solo-texto** (ver abajo) — **NUNCA inventar, dibujar ni aproximar un logo SVG.** Un logo falso en el footer de un cliente es peor que no tener logo.

---

## Especificación visual

### Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│        [Footer principal del cliente]               │
│        (links, contacto, copyright, etc.)           │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   [Logo PNG 20px]  Sitio creado con SitioHoy        │  ← esta franja
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Reglas de estilo

| Propiedad | Valor |
|---|---|
| Altura | Auto, con padding vertical de `py-4` |
| Separador superior | Línea `border-t` sutil (opacidad baja, adaptar al fondo) |
| Alineación | Centrado horizontal (`justify-center`) |
| Logo | `public/sitiohoy-logo.png`, altura `20px`, ancho `auto` |
| Logo en footer verde | Usar `public/sitiohoy-logo-light.png` si existe; si no, envolver el logo en un chip con fondo `bg-white/90 rounded px-1` para garantizar contraste |
| Texto | `"Sitio creado con"` en `text-xs` + `"SitioHoy"` como link a `https://sitiohoy.com.ar` |
| Color del link | `#10b981` (emerald-500) — o `#f1f5f9` si el fondo del footer es verde |
| Color del texto | Heredar la opacidad del footer padre (generalmente `text-neutral-50/40` en footers oscuros, `text-neutral-400` en footers claros) |
| Hover en link | `hover:underline` + subir opacidad |
| Fuente | `font-body` (la del sitio), `text-xs` |

---

## Componente — `SitioHoyBranding`

```tsx
// components/ui/SitioHoyBranding.tsx

interface SitioHoyBrandingProps {
  /** Si el fondo del footer es verde, pasar true para usar la versión clara */
  greenBackground?: boolean;
}

export function SitioHoyBranding({ greenBackground = false }: SitioHoyBrandingProps) {
  const linkColor = greenBackground ? "#f1f5f9" : "#10b981";
  const logoSrc = greenBackground
    ? "/sitiohoy-logo-light.png" // si no existe esta versión, usar el chip de contraste (ver skill)
    : "/sitiohoy-logo.png";

  return (
    <div className="border-t border-current/5 mt-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-center gap-2">
        {/* Logo PNG real — copiado desde assets/ a public/. <img> nativo: a 20px
            no hay beneficio de <Image> y evita el tema de sizes/remotePatterns. */}
        <img
          src={logoSrc}
          alt=""
          aria-hidden="true"
          className="h-5 w-auto"
        />

        <p className="font-body text-xs opacity-40 hover:opacity-60 transition-opacity">
          Sitio creado con{" "}
          <a
            href="https://sitiohoy.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: linkColor }}
          >
            SitioHoy
          </a>
        </p>
      </div>
    </div>
  );
}
```

### Fallback solo-texto (si el PNG no está disponible)

```tsx
// Mismo componente SIN <img> — solo la línea de texto con el link.
// Dejar un comentario para reponer el logo cuando esté el archivo:
{/* TODO: copiar assets/sitiohoy-logo.png a public/ y agregar el <img> */}
```

---

## Integración en el Footer

El `<SitioHoyBranding />` se renderiza como **último hijo** dentro del `<footer>`:

```tsx
// Ejemplo con Footer Mega Dark
export function Footer({ brandName, brandTagline }: FooterProps) {
  return (
    <footer className="bg-neutral-900 text-neutral-50 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* ... contenido del footer del cliente ... */}

        <div className="border-t border-neutral-50/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-neutral-50/60">
            © {year} {brandName}. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* ← Branding SitioHoy — SIEMPRE al final */}
      <SitioHoyBranding />
    </footer>
  );
}
```

---

## Reglas

1. **SIEMPRE presente.** No se omite nunca, en ningún plan, en ningún footer.
2. **SIEMPRE al final.** Debajo del copyright del cliente, como última franja visible.
3. **NUNCA en medio del footer.** No mezclarlo con los links de navegación del cliente.
4. **Logo pequeño (20px).** No debe competir visualmente con la marca del cliente.
5. **El logo es el PNG real de `assets/`** copiado a `public/sitiohoy-logo.png`. NUNCA inventar un SVG ni usar otro archivo.
6. **Discreto pero visible.** Opacidad baja, pero legible. No esconder.
7. **El link apunta a `https://sitiohoy.com.ar`** con `target="_blank"`.
8. **Si el PNG no está disponible → fallback solo-texto** con TODO para reponerlo.

---

## Validación

- [ ] `public/sitiohoy-logo.png` existe en el proyecto (copiado desde assets de las skills).
- [ ] `<SitioHoyBranding />` renderizado al final de cada footer.
- [ ] Logo visible a 20px de alto.
- [ ] En footers verdes: versión light o chip de contraste.
- [ ] Link funcional a `sitiohoy.com.ar`.
- [ ] No interfiere visualmente con el footer del cliente.
- [ ] Presente en mobile y desktop.
