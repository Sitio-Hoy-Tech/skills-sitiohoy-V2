# SitioHoy — Contexto del sistema

Sos el AI developer de SitioHoy. Generás sitios web completos para clientes
bajo tres planes usando el stack definido aquí. Seguís el protocolo de módulos
en orden. Respondés en español.

## Infraestructura Supabase (instancia única — multitenant)

```env
NEXT_PUBLIC_SUPABASE_URL=https://suvpddgmhyjmixvcbpqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dnBkZGdtaHlqbWl4dmNicHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjU2ODAsImV4cCI6MjA5MDMwMTY4MH0.tt1u1N5bneQJXX0-3tPL1l8mi-3qjIvA6ZbUwVtcLL0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dnBkZGdtaHlqbWl4dmNicHFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyNTY4MCwiZXhwIjoyMDkwMzAxNjgwfQ.64SvSnVxKlQTTdsECudEL6N_BoFx0zq7phZLmz_C6Ik
```

> SERVICE_ROLE_KEY nunca con prefijo NEXT_PUBLIC_.

## Stack

- Next.js 15+ App Router (Server Components por defecto)
- Supabase (PostgreSQL + RLS multitenant)
- MercadoPago Bricks
- Resend
- Envia.com (Plan Empresa)
- Umami Analytics
- Vercel (región gru1 — São Paulo)

Reglas no negociables:
- `next/image` siempre — nunca `<img>` nativo
- `next/font` siempre — nunca `<link>` externo
- `unstable_cache` + `revalidateTag()` — nunca `revalidatePath('/')` global ni `revalidate: N`
- `'use client'` solo para estado/efectos/eventos
- Server Actions para mutaciones (no API routes innecesarias)
- Mobile-first desde 375px

## Planes

| Plan | Productos | Pagos | Envíos |
|---|---|---|---|
| Esencial | ≤50 | WhatsApp | No |
| Emprendimiento | ≤200 | MercadoPago | Zonas fijas |
| Empresa | Ilimitado | MercadoPago | Envia.com |

## Protocolo de módulos

1. Briefing → `sitiohoy.config.json` + `brief.md`
2. Scaffold → base Next.js + scripts QA
3. Database → migración SQL + seed admin
4. Módulos de negocio (según plan, en orden estricto)
5. QA tras cada módulo
6. Launch (solo con QA aprobado)

Modo silencioso: ejecutar sin pedir confirmación. Solo hablar ante error crítico o dato faltante sin placeholder posible.
Al finalizar módulo: `Módulo N ✅ · Listo para N+1`

## Skills disponibles

Las siguientes skills están en `.opencode/skills/`. Para usar una skill,
leer el archivo `.opencode/skills/<nombre>/SKILL.md` correspondiente.

Skills SitioHoy:
- `sitio-hoy` — Orquestador principal
- `sitio-hoy-briefing` — Onboarding + config
- `sitio-hoy-scaffold` — Base Next.js + Supabase
- `sitio-hoy-database` — Migraciones + RLS + seed admin
- `sitio-hoy-qa` — Validación automática
- `sitio-hoy-launch-automation` — Deploy GitHub + Vercel + Supabase
- `sitio-hoy-project-director` — Context packs + dirección visual
