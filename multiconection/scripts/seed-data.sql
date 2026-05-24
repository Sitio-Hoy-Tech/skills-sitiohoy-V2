-- ============================================================
-- Seed Data — Multi Conection (Plan Esencial)
-- Replace TODO_TENANT_ID with the actual tenant UUID before running.
-- ============================================================

-- ── Categories ───────────────────────────────────────────────
INSERT INTO categories (id, tenant_id, name, slug, position, active)
VALUES
  ('11111111-0001-0001-0001-000000000001', 'TODO_TENANT_ID', 'Pantallas Fijas',      'pantallas-fijas',    1, true),
  ('11111111-0001-0001-0001-000000000002', 'TODO_TENANT_ID', 'Pantallas Rental',     'pantallas-rental',   2, true),
  ('11111111-0001-0001-0001-000000000003', 'TODO_TENANT_ID', 'Mallas y Especiales',  'mallas-especiales',  3, true),
  ('11111111-0001-0001-0001-000000000004', 'TODO_TENANT_ID', 'Accesorios',           'accesorios',         4, true)
ON CONFLICT (id) DO NOTHING;

-- ── Products ─────────────────────────────────────────────────
INSERT INTO products (id, tenant_id, name, slug, price, compare_at_price, description, featured, category_id, active)
VALUES
  -- Pantallas Fijas
  ('22222222-0001-0001-0001-000000000001', 'TODO_TENANT_ID',
   'Pantalla P10 Fixed Exterior', 'pantalla-p10-fixed-exterior',
   NULL, NULL,
   'Pixel pitch P10 para instalaciones fijas en exteriores. Alta luminosidad de 6,000 nits con bajo consumo energético. Módulos de 96x96cm.',
   true, '11111111-0001-0001-0001-000000000001', true),

  ('22222222-0001-0001-0001-000000000002', 'TODO_TENANT_ID',
   'Pantalla LED Indoor Modular', 'pantalla-led-indoor-modular',
   NULL, NULL,
   'Esquema modular que permite alcanzar diversas dimensiones adaptadas a cada espacio interior. Resolución configurable según necesidad.',
   true, '11111111-0001-0001-0001-000000000001', true),

  ('22222222-0001-0001-0001-000000000003', 'TODO_TENANT_ID',
   'Pantalla Indoor Pitch 2.5mm', 'pantalla-indoor-pitch-2-5mm',
   NULL, NULL,
   'Diseñada para visualización a corta distancia en interiores. Imagen cristalina ideal para showrooms, halls corporativos y presentaciones de alta gama.',
   false, '11111111-0001-0001-0001-000000000001', true),

  ('22222222-0001-0001-0001-000000000004', 'TODO_TENANT_ID',
   'Pantalla P3 Indoor Fine Pitch', 'pantalla-p3-indoor-fine-pitch',
   NULL, NULL,
   'Fine pitch P3 para espacios comerciales de alta gama. Imagen detallada a media distancia, perfecta para lobbies y tiendas premium.',
   false, '11111111-0001-0001-0001-000000000001', true),

  ('22222222-0001-0001-0001-000000000005', 'TODO_TENANT_ID',
   'Pantalla P4 Outdoor Fixed', 'pantalla-p4-outdoor-fixed',
   NULL, NULL,
   'Pixel pitch 4mm para instalaciones fijas en exteriores protegidos o semi-cubiertos. Combinación ideal de resolución y durabilidad outdoor.',
   false, '11111111-0001-0001-0001-000000000001', true),

  ('22222222-0001-0001-0001-000000000006', 'TODO_TENANT_ID',
   'Tótem LED 2x1m', 'totem-led-2x1m',
   NULL, NULL,
   'Solución integral para publicidad en vía pública. Estructura de 2x1 metro con pantalla LED incluida, gabinete de aluminio y electrónica protegida.',
   false, '11111111-0001-0001-0001-000000000001', true),

  -- Pantallas Rental
  ('22222222-0001-0001-0001-000000000007', 'TODO_TENANT_ID',
   'Curve P6.25 Outdoor', 'curve-p6-25-outdoor',
   NULL, NULL,
   'Pantalla curva de alta calidad con tecnología Nova HighRefresh 3600hz. Diseño PCB rental para montaje rápido en eventos y publicidad exterior premium.',
   true, '11111111-0001-0001-0001-000000000002', true),

  ('22222222-0001-0001-0001-000000000008', 'TODO_TENANT_ID',
   'P10 Rental Exterior Ultra Liviana', 'p10-rental-exterior-ultra-liviana',
   NULL, NULL,
   'Pantalla de alquiler ultra liviana para eventos en exteriores. Módulos de aluminio 96x96cm de rápido ensamblaje. Ideal para shows y festivales.',
   false, '11111111-0001-0001-0001-000000000002', true),

  -- Mallas y Especiales
  ('22222222-0001-0001-0001-000000000009', 'TODO_TENANT_ID',
   'Pantallas LED Flexibles', 'pantallas-led-flexibles',
   NULL, NULL,
   'PCB rubber flex HD con diseño de ensamblaje magnético. Adaptable a superficies curvas, cilíndricas o formas arquitectónicas irregulares.',
   false, '11111111-0001-0001-0001-000000000003', true),

  ('22222222-0001-0001-0001-000000000010', 'TODO_TENANT_ID',
   'Malla LED Brillo 2000 Lumen', 'malla-led-brillo-2000-lumen',
   NULL, NULL,
   'Malla LED de alta luminosidad P8, liviana y estanca al agua (IP65). Ideal para fachadas de edificios y grandes superficies exteriores.',
   false, '11111111-0001-0001-0001-000000000003', true),

  ('22222222-0001-0001-0001-000000000011', 'TODO_TENANT_ID',
   'LED Transparente Mesh', 'led-transparente-mesh',
   NULL, NULL,
   'Pantalla LED transparente para vidrieras y escaparates comerciales. Permite visibilidad a través del panel mientras muestra contenido de alto impacto.',
   false, '11111111-0001-0001-0001-000000000003', true),

  -- Accesorios
  ('22222222-0001-0001-0001-000000000012', 'TODO_TENANT_ID',
   'Procesador Multi Imagen', 'procesador-multi-imagen',
   NULL, NULL,
   'Controlador de video avanzado para gestionar múltiples pantallas LED simultáneamente. Sincronización perfecta entre pantallas. Plug & Play.',
   false, '11111111-0001-0001-0001-000000000004', true)

ON CONFLICT (id) DO NOTHING;
