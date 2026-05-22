import { FadeUpOnScroll, ScalePopOnScroll } from "@/components/ui/Animations";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const SERVICES_DETAIL = [
  {
    id: "exteriores",
    color: "#00F5FF",
    icon: "🏙️",
    title: "Pantallas Exteriores",
    description:
      "Diseñadas para soportar las condiciones más exigentes del exterior argentino. Certificación IP65, resistentes a la lluvia, polvo y temperaturas extremas. Alta luminosidad de 5000 nits que garantiza perfecta visibilidad incluso bajo el sol directo.",
    features: [
      "Luminosidad 5000-8000 nits",
      "Certificación IP65 (resistente agua y polvo)",
      "Rango temperatura: -20°C a +60°C",
      "Pitch disponible: P4, P6, P8, P10",
      "Pantallas fijas y scrolling",
      "Software de gestión incluido",
    ],
    useCases: ["Locales comerciales", "Estaciones de servicio", "Farmacias", "Concesionarias", "Restaurantes con fachada"],
    image: "https://loremflickr.com/900/600/led,outdoor,billboard?lock=50",
  },
  {
    id: "interiores",
    color: "#BF00FF",
    icon: "🏪",
    title: "Pantallas Interiores",
    description:
      "Displays LED de alta resolución para el interior de tu local o showroom. Perfectas para mostrar precios, promociones, menú digital o contenido multimedia. Bajo consumo energético y instalación rápida sin obras.",
    features: [
      "Resolución Full HD y 4K",
      "Brillo 800-1500 nits",
      "Pitch disponible: P1.5, P2, P2.5, P3",
      "Forma y tamaño personalizable",
      "Bajo consumo energético",
      "Control remoto y por app",
    ],
    useCases: ["Restaurantes y bares", "Showrooms", "Locales de ropa", "Peluquerías", "Farmacias y kioscos"],
    image: "https://loremflickr.com/900/600/led,indoor,retail?lock=51",
  },
  {
    id: "eventos",
    color: "#39FF14",
    icon: "🎪",
    title: "Pantallas para Eventos",
    description:
      "Pantallas modulares de gran formato para eventos, recitales, presentaciones corporativas y fiestas privadas. Disponibles en alquiler o venta, con operador técnico incluido en el servicio de instalación.",
    features: [
      "Módulos intercambiables y escalables",
      "Tamaños desde 3m² hasta 100m²+",
      "Resolución adaptable al formato",
      "Operador técnico incluido",
      "Alquiler y venta disponible",
      "Soporte antes, durante y después",
    ],
    useCases: ["Recitales y espectáculos", "Eventos corporativos", "Presentaciones de producto", "Casamientos y fiestas", "Ferias y exposiciones"],
    image: "https://loremflickr.com/900/600/led,concert,stage?lock=52",
  },
];

export default function ServiciosPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 text-center">
        <FadeUpOnScroll>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
            Todo lo que ofrecemos
          </p>
          <h1 className="font-display text-5xl lg:text-7xl font-black uppercase text-neutral-50 leading-none mb-4">
            Nuestros <span className="led-text-cyan">Servicios</span>
          </h1>
          <p className="font-body text-neutral-400 max-w-xl mx-auto">
            Soluciones LED para cada necesidad: desde locales pequeños hasta eventos de gran escala.
          </p>
        </FadeUpOnScroll>
      </section>

      {/* Detalle de servicios */}
      {SERVICES_DETAIL.map((service, i) => (
        <section
          key={service.id}
          className={`py-20 ${i % 2 === 0 ? "bg-neutral-900" : "bg-neutral-800/20"}`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              {/* Imagen */}
              <ScalePopOnScroll>
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: service.color, boxShadow: `0 0 20px ${service.color}` }}
                  />
                </div>
              </ScalePopOnScroll>

              {/* Contenido */}
              <FadeUpOnScroll delay={0.15}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{service.icon}</span>
                    <p className="font-body text-xs uppercase tracking-[0.2em]" style={{ color: service.color }}>
                      {service.title}
                    </p>
                  </div>
                  <h2 className="font-display text-4xl lg:text-5xl font-black uppercase text-neutral-50 leading-tight mb-4">
                    {service.title}
                  </h2>
                  <p className="font-body text-neutral-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="font-body text-xs uppercase tracking-wider text-neutral-500 mb-3">
                        Especificaciones
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 font-body text-sm text-neutral-400">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: service.color }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-body text-xs uppercase tracking-wider text-neutral-500 mb-3">
                        Ideal para
                      </p>
                      <ul className="space-y-2">
                        {service.useCases.map((uc) => (
                          <li key={uc} className="flex items-center gap-2 font-body text-sm text-neutral-400">
                            <span className="text-neutral-600">→</span>
                            {uc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/3329746323?text=${encodeURIComponent(`Hola, quiero consultar sobre ${service.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded font-display font-bold text-base uppercase tracking-widest transition-all duration-200 active:scale-95"
                    style={{
                      backgroundColor: service.color,
                      color: "#03050F",
                    }}
                  >
                    Consultar precio
                  </a>
                </div>
              </FadeUpOnScroll>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
