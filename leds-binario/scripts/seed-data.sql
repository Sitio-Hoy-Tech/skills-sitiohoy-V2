-- =============================================
-- Seed Data - Leds Binario
-- Ejecutar UNA SOLA VEZ despues de setup-rls.sql
-- Hacer Ctrl+H y reemplazar cc02534c-8767-4d50-a00f-2fd9298c1b88
 con el UUID real
-- UUID del tenant: cc02534c-8767-4d50-a00f-2fd9298c1b88
-- =============================================

-- =============================================
-- CATEGORÍAS
-- =============================================
INSERT INTO public.categories (id, tenant_id, name, slug, position, active) VALUES
  ('a1b20001-0000-4000-8000-000000000001', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'Pantallas Exteriores', 'exteriores', 0, true),
  ('a1b20001-0000-4000-8000-000000000002', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'Pantallas Interiores', 'interiores', 1, true),
  ('a1b20001-0000-4000-8000-000000000003', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'Eventos y Espectáculos', 'eventos', 2, true),
  ('a1b20001-0000-4000-8000-000000000004', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'Accesorios y Software', 'accesorios', 3, true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SUBCATEGORÍAS
-- =============================================
INSERT INTO public.subcategories (id, tenant_id, category_id, name, slug, position, active) VALUES
  ('b2c30001-0000-4000-8000-000000000001', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'a1b20001-0000-4000-8000-000000000001', 'Fachadas Comerciales', 'fachadas', 0, true),
  ('b2c30001-0000-4000-8000-000000000002', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'a1b20001-0000-4000-8000-000000000001', 'Cartelería Vial', 'vial', 1, true),
  ('b2c30001-0000-4000-8000-000000000003', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'a1b20001-0000-4000-8000-000000000002', 'Displays Comerciales', 'displays', 0, true),
  ('b2c30001-0000-4000-8000-000000000004', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'a1b20001-0000-4000-8000-000000000002', 'Menús Digitales', 'menus', 1, true),
  ('b2c30001-0000-4000-8000-000000000005', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'a1b20001-0000-4000-8000-000000000003', 'Alquiler', 'alquiler', 0, true),
  ('b2c30001-0000-4000-8000-000000000006', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'a1b20001-0000-4000-8000-000000000003', 'Venta Formato Grande', 'venta-grande', 1, true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PRODUCTOS
-- =============================================
INSERT INTO public.products (id, tenant_id, name, slug, description, price, compare_at_price, category_id, active, featured) VALUES
  (
    'c3d40001-0000-4000-8000-000000000001', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Pantalla LED Exterior P6',
    'pantalla-led-exterior-p6',
    'Pantalla LED exterior pitch P6 de alta luminosidad. Certificación IP65 para uso permanente en exterior. Brillo de 5000 nits, perfectamente visible bajo el sol directo. Incluye controlador, cable de datos y software de gestión con app móvil.',
    450000, 520000, 'a1b20001-0000-4000-8000-000000000001', true, true
  ),
  (
    'c3d40001-0000-4000-8000-000000000002', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Pantalla LED Exterior P10',
    'pantalla-led-exterior-p10',
    'Pantalla LED exterior pitch P10 para señalización de largo alcance. Ideal para cartelería de acceso, rutas y publicidad en grandes distancias. Módulos resistentes al clima argentino.',
    290000, null, 'a1b20001-0000-4000-8000-000000000001', true, true
  ),
  (
    'c3d40001-0000-4000-8000-000000000003', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Pantalla LED Exterior P8 Full Color',
    'pantalla-led-exterior-p8',
    'Balance perfecto entre resolución y costo para publicidad exterior dinámica. Pitch P8, colores vibrantes full color. Alta resistencia a la lluvia, polvo y variaciones de temperatura.',
    380000, null, 'a1b20001-0000-4000-8000-000000000001', true, false
  ),
  (
    'c3d40001-0000-4000-8000-000000000004', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Display LED Interior P2.5 Full HD',
    'display-led-interior-p25',
    'Display LED de alta resolución para interiores. Pitch P2.5 con colores vibrantes y ángulo de visión de 160°. Silencioso, bajo consumo energético. Ideal para showrooms, concesionarias y comercios premium.',
    620000, 700000, 'a1b20001-0000-4000-8000-000000000002', true, true
  ),
  (
    'c3d40001-0000-4000-8000-000000000005', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Pantalla LED Interior P3',
    'pantalla-led-interior-p3',
    'Pantalla LED interior pitch P3 para comercios y locales de atención al público. Instalación sencilla en pared o estructura. Actualización de contenido desde cualquier dispositivo.',
    480000, null, 'a1b20001-0000-4000-8000-000000000002', true, false
  ),
  (
    'c3d40001-0000-4000-8000-000000000006', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Menú Digital LED para Restaurantes',
    'menu-digital-led',
    'Display LED diseñado específicamente para menús digitales. Actualización en tiempo real de precios y platos desde el celular. Sin impresiones, sin laminados. Ahorrá y sorprendé a tus clientes.',
    185000, 210000, 'a1b20001-0000-4000-8000-000000000002', true, false
  ),
  (
    'c3d40001-0000-4000-8000-000000000007', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Módulo LED para Eventos 3x2m',
    'modulo-led-eventos-3x2',
    'Set de módulos LED configurables para armar pantallas de gran formato en eventos. 6m² totales. Incluye estructura de soporte tipo torre, cableado y operador técnico para instalación y operación.',
    890000, null, 'a1b20001-0000-4000-8000-000000000003', true, true
  ),
  (
    'c3d40001-0000-4000-8000-000000000008', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Pantalla LED Eventos 6x4m',
    'pantalla-led-eventos-6x4',
    'Pantalla LED modular de 6x4 metros para eventos masivos y espectáculos. Pitch P5, brillo de 5500 nits. Incluye transporte, instalación, operador técnico y desmontaje.',
    1450000, null, 'a1b20001-0000-4000-8000-000000000003', true, false
  ),
  (
    'c3d40001-0000-4000-8000-000000000009', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Cartel LED Scrolling',
    'cartel-led-scrolling',
    'Cartel LED scrolling horizontal para mostrar texto dinámico y llamativo. Ideal para farmacias, ferreterías, dietéticas y cualquier comercio con promociones frecuentes. Programación simple desde USB.',
    95000, 115000, 'a1b20001-0000-4000-8000-000000000001', true, false
  ),
  (
    'c3d40001-0000-4000-8000-000000000010', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Display LED Vidriera Transparente',
    'display-led-vidriera',
    'Pantalla LED transparente para vidrieras comerciales. Mostrá contenido dinámico sin bloquear la vista del interior del local. Efecto visual moderno y diferenciador para el paseo comercial.',
    320000, 360000, 'a1b20001-0000-4000-8000-000000000002', true, false
  ),
  (
    'c3d40001-0000-4000-8000-000000000011', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Arco LED para Eventos y Fiestas',
    'arco-led-eventos',
    'Estructura en arco con módulos LED para eventos, casamientos y fiestas. Medidas personalizables según el espacio. Disponible en alquiler. Impacto visual garantizado para fotos y transmisiones en vivo.',
    550000, null, 'a1b20001-0000-4000-8000-000000000003', true, false
  ),
  (
    'c3d40001-0000-4000-8000-000000000012', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
',
    'Pantalla LED Interior P1.5 Ultra HD',
    'pantalla-led-interior-p15',
    'Pantalla LED de ultra alta definición con pitch P1.5. Resolución equivalente a 4K. Para showrooms de lujo, presentaciones de producto y espacios donde la imagen lo es todo.',
    1200000, null, 'a1b20001-0000-4000-8000-000000000002', true, false
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- IMÁGENES DE PRODUCTOS
-- =============================================
INSERT INTO public.product_images (id, tenant_id, product_id, url, alt, position) VALUES
  ('d4e50001-0000-4000-8000-000000000001', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000001', 'https://loremflickr.com/800/600/led,billboard,outdoor?lock=1', 'Pantalla LED Exterior P6', 0),
  ('d4e50001-0000-4000-8000-000000000002', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000001', 'https://loremflickr.com/800/600/led,sign,night?lock=2', 'Pantalla LED exterior de noche', 1),
  ('d4e50001-0000-4000-8000-000000000003', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000002', 'https://loremflickr.com/800/600/led,outdoor,sign?lock=3', 'Pantalla LED Exterior P10', 0),
  ('d4e50001-0000-4000-8000-000000000004', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000003', 'https://loremflickr.com/800/600/led,advertising?lock=4', 'Pantalla LED Exterior P8', 0),
  ('d4e50001-0000-4000-8000-000000000005', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000004', 'https://loremflickr.com/800/600/led,indoor,display?lock=5', 'Display LED Interior P2.5', 0),
  ('d4e50001-0000-4000-8000-000000000006', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000005', 'https://loremflickr.com/800/600/led,retail,screen?lock=6', 'Pantalla LED Interior P3', 0),
  ('d4e50001-0000-4000-8000-000000000007', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000006', 'https://loremflickr.com/800/600/menu,digital,restaurant?lock=7', 'Menú Digital LED', 0),
  ('d4e50001-0000-4000-8000-000000000008', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000007', 'https://loremflickr.com/800/600/led,concert,event?lock=8', 'Módulo LED Eventos', 0),
  ('d4e50001-0000-4000-8000-000000000009', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000008', 'https://loremflickr.com/800/600/stage,led,concert?lock=9', 'Pantalla LED Eventos 6x4', 0),
  ('d4e50001-0000-4000-8000-000000000010', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000009', 'https://loremflickr.com/800/600/led,sign,scrolling?lock=10', 'Cartel LED Scrolling', 0),
  ('d4e50001-0000-4000-8000-000000000011', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000010', 'https://loremflickr.com/800/600/transparent,led,window?lock=11', 'Display LED Vidriera', 0),
  ('d4e50001-0000-4000-8000-000000000012', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000011', 'https://loremflickr.com/800/600/led,arch,event?lock=12', 'Arco LED Eventos', 0),
  ('d4e50001-0000-4000-8000-000000000013', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000012', 'https://loremflickr.com/800/600/led,4k,screen?lock=13', 'Pantalla LED Ultra HD', 0)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- VARIANTES DE PRODUCTOS
-- =============================================
INSERT INTO public.product_variants (id, tenant_id, product_id, name, sku, price, price_modifier, stock) VALUES
  -- Pantalla Exterior P6 — por tamaño
  ('e5f60001-0000-4000-8000-000000000001', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000001', '0.5m² (50x100cm)', 'LED-P6-EXT-050', 220000, 0, 5),
  ('e5f60001-0000-4000-8000-000000000002', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000001', '1m² (100x100cm)', 'LED-P6-EXT-100', 380000, 0, 3),
  ('e5f60001-0000-4000-8000-000000000003', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000001', '2m² (100x200cm)', 'LED-P6-EXT-200', 680000, 0, 2),
  ('e5f60001-0000-4000-8000-000000000004', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000001', 'Medida personalizada', 'LED-P6-EXT-CUSTOM', 0, 0, 99),
  -- Display Interior P2.5 — por tamaño
  ('e5f60001-0000-4000-8000-000000000005', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000004', '0.5m² (50x100cm)', 'LED-P25-INT-050', 310000, 0, 4),
  ('e5f60001-0000-4000-8000-000000000006', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000004', '1m² (100x100cm)', 'LED-P25-INT-100', 550000, 0, 3),
  ('e5f60001-0000-4000-8000-000000000007', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000004', '2m² (100x200cm)', 'LED-P25-INT-200', 980000, 0, 1),
  -- Cartel Scrolling — por longitud
  ('e5f60001-0000-4000-8000-000000000008', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000009', '1 metro', 'LED-SCROLL-100', 65000, 0, 10),
  ('e5f60001-0000-4000-8000-000000000009', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000009', '2 metros', 'LED-SCROLL-200', 95000, 0, 8),
  ('e5f60001-0000-4000-8000-000000000010', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000009', '3 metros', 'LED-SCROLL-300', 130000, 0, 5),
  -- Menú Digital — por tamaño
  ('e5f60001-0000-4000-8000-000000000011', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000006', '32 pulgadas', 'LED-MENU-32', 120000, 0, 6),
  ('e5f60001-0000-4000-8000-000000000012', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000006', '43 pulgadas', 'LED-MENU-43', 185000, 0, 4),
  ('e5f60001-0000-4000-8000-000000000013', 'cc02534c-8767-4d50-a00f-2fd9298c1b88
', 'c3d40001-0000-4000-8000-000000000006', '55 pulgadas', 'LED-MENU-55', 280000, 0, 2)
ON CONFLICT (id) DO NOTHING;
