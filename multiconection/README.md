# Multi Conection

Sitio web de Multi Conection construido con SitioHoy.

- **Plan:** Esencial
- **Slug:** multiconection
- **Stack:** Next.js + TypeScript + Tailwind v4 + Supabase + Vercel
- **Tenant ID:** 7f17066d-2179-4621-8ed8-c65ab4561356

## Setup local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Copiar `.env.local.example` a `.env.local` y completar las variables.

3. Correr en desarrollo:
   ```bash
   npm run dev
   ```

4. Build de producción:
   ```bash
   npm run build
   ```

## Estructura

- `app/` — rutas y páginas (App Router)
- `lib/` — utilidades compartidas (Supabase, helpers)
- `proxy.ts` — middleware de sesión Supabase (NO `middleware.ts`)
- `scripts/setup-rls.sql` — políticas RLS para Supabase (ejecutar una sola vez en el SQL Editor de Supabase)
- `scripts/seed-data.sql` — datos de prueba (Ctrl+H `TODO_TENANT_ID` → UUID real)

## Scripts SQL (orden)

1. `scripts/setup-rls.sql` → habilita RLS + crea políticas
2. `scripts/seed-data.sql` → carga categorías y productos de prueba

## Deploy

Deploy en Vercel:
- Conectar el repo
- Configurar las variables de entorno del `.env.local.example`
- Configurar el dominio en Cloudflare apuntando a Vercel

## Soporte

Cualquier consulta: [SitioHoy](https://sitiohoy.com.ar)
