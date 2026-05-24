export const MOCK_CATEGORIES = [
  { id: "mock-cat-1", name: "Pantallas Fijas",     slug: "pantallas-fijas",   position: 1, subcategories: [] },
  { id: "mock-cat-2", name: "Pantallas Rental",    slug: "pantallas-rental",  position: 2, subcategories: [] },
  { id: "mock-cat-3", name: "Mallas y Especiales", slug: "mallas-especiales", position: 3, subcategories: [] },
  { id: "mock-cat-4", name: "Accesorios",          slug: "accesorios",        position: 4, subcategories: [] },
];

export const MOCK_PRODUCTS = [
  {
    id: "mock-1", name: "Pantalla P10 Fixed Exterior", slug: "pantalla-p10-fixed-exterior",
    price: null, compare_at_price: null, featured: true, category_id: "mock-cat-1",
    description: "Pixel pitch P10 para instalaciones fijas en exteriores. Alta luminosidad de 6,000 nits con bajo consumo energético. Módulos de 96x96cm.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,screen?lock=10", alt: "Pantalla P10 Fixed Exterior", position: 0 }],
  },
  {
    id: "mock-2", name: "Pantalla LED Indoor Modular", slug: "pantalla-led-indoor-modular",
    price: null, compare_at_price: null, featured: true, category_id: "mock-cat-1",
    description: "Esquema modular que permite alcanzar diversas dimensiones adaptadas a cada espacio interior. Resolución configurable según necesidad.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,display?lock=11", alt: "Pantalla LED Indoor", position: 0 }],
  },
  {
    id: "mock-3", name: "Pantalla Indoor Pitch 2.5mm", slug: "pantalla-indoor-pitch-2-5mm",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-1",
    description: "Diseñada para visualización a corta distancia en interiores. Imagen cristalina ideal para showrooms, halls corporativos y presentaciones de alta gama.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,panel?lock=3", alt: "Pantalla Indoor 2.5mm", position: 0 }],
  },
  {
    id: "mock-4", name: "Pantalla P3 Indoor Fine Pitch", slug: "pantalla-p3-indoor-fine-pitch",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-1",
    description: "Fine pitch P3 para espacios comerciales de alta gama. Imagen detallada a media distancia, perfecta para lobbies y tiendas premium.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,wall?lock=4", alt: "Pantalla P3 Fine Pitch", position: 0 }],
  },
  {
    id: "mock-5", name: "Pantalla P4 Outdoor Fixed", slug: "pantalla-p4-outdoor-fixed",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-1",
    description: "Pixel pitch 4mm para instalaciones fijas en exteriores protegidos o semi-cubiertos. Combinación ideal de resolución y durabilidad outdoor.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,billboard?lock=5", alt: "Pantalla P4 Outdoor", position: 0 }],
  },
  {
    id: "mock-6", name: "Tótem LED 2x1m", slug: "totem-led-2x1m",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-1",
    description: "Solución integral para publicidad en vía pública. Estructura de 2x1 metro con pantalla LED incluida, gabinete de aluminio y electrónica protegida.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,sign?lock=6", alt: "Tótem LED", position: 0 }],
  },
  {
    id: "mock-7", name: "Curve P6.25 Outdoor", slug: "curve-p6-25-outdoor",
    price: null, compare_at_price: null, featured: true, category_id: "mock-cat-2",
    description: "Pantalla curva de alta calidad con tecnología Nova HighRefresh 3600hz. Diseño PCB rental para montaje rápido en eventos y publicidad exterior premium.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,stage?lock=7", alt: "Curve P6.25 Outdoor", position: 0 }],
  },
  {
    id: "mock-8", name: "P10 Rental Exterior Ultra Liviana", slug: "p10-rental-exterior-ultra-liviana",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-2",
    description: "Pantalla de alquiler ultra liviana para eventos en exteriores. Módulos de aluminio 96x96cm de rápido ensamblaje. Ideal para shows y festivales.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,concert?lock=8", alt: "P10 Rental Exterior", position: 0 }],
  },
  {
    id: "mock-9", name: "Pantallas LED Flexibles", slug: "pantallas-led-flexibles",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-3",
    description: "PCB rubber flex HD con diseño de ensamblaje magnético. Adaptable a superficies curvas, cilíndricas o formas arquitectónicas irregulares.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,flexible?lock=9", alt: "Pantallas LED Flexibles", position: 0 }],
  },
  {
    id: "mock-10", name: "Malla LED Brillo 2000 Lumen", slug: "malla-led-brillo-2000-lumen",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-3",
    description: "Malla LED de alta luminosidad P8, liviana y estanca al agua (IP65). Ideal para fachadas de edificios y grandes superficies exteriores.",
    product_images: [{ url: "https://loremflickr.com/800/600/led,mesh?lock=1", alt: "Malla LED 2000 Lumen", position: 0 }],
  },
  {
    id: "mock-11", name: "LED Transparente Mesh", slug: "led-transparente-mesh",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-3",
    description: "Pantalla LED transparente para vidrieras y escaparates comerciales. Permite visibilidad a través del panel mientras muestra contenido de alto impacto.",
    product_images: [{ url: "https://loremflickr.com/800/600/transparent,screen?lock=2", alt: "LED Transparente", position: 0 }],
  },
  {
    id: "mock-12", name: "Procesador Multi Imagen", slug: "procesador-multi-imagen",
    price: null, compare_at_price: null, featured: false, category_id: "mock-cat-4",
    description: "Controlador de video avanzado para gestionar múltiples pantallas LED simultáneamente. Sincronización perfecta entre pantallas. Plug & Play.",
    product_images: [{ url: "https://loremflickr.com/800/600/technology,server?lock=3", alt: "Procesador Multi Imagen", position: 0 }],
  },
];
