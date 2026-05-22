import { HeroSection } from "@/components/ui/HeroSection";
import { FAQSection } from "@/components/ui/FAQSection";
import { FadeUpOnScroll, ScalePopOnScroll, SlideFromSide } from "@/components/ui/Animations";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import Link from "next/link";

// Datos mock de servicios destacados (3 servicios)
const SERVICES = [
  {
    id: "s1",
    icon: "🏙️",
    color: "#00F5FF",
    title: "Pantallas Exteriores",
    subtitle: "Fachadas y cartelería",
    description:
      "Pantallas LED de alta luminosidad para exteriores, resistentes a la lluvia y el sol. Visibles de día y de noche. Ideales para locales comerciales, estaciones de servicio y franquicias.",
    features: ["Alta luminosidad (5000 nits+)", "IP65 resistente al agua", "Tamaños desde 1m²"],
    image: "https://loremflickr.com/800/500/led,billboard,outdoor?lock=10",
  },
  {
    id: "s2",
    icon: "🏪",
    color: "#BF00FF",
    title: "Pantallas Interiores",
    subtitle: "Showrooms y comercios",
    description:
      "Displays LED de alta definición para el interior de tu local. Mostrá precios, promociones y contenido dinámico que captura la atención de cada cliente que entra.",
    features: ["Full HD y 4K disponible", "Bajo consumo energético", "Instalación en horas"],
    image: "https://loremflickr.com/800/500/led,indoor,display?lock=15",
  },
  {
    id: "s3",
    icon: "🎪",
    color: "#39FF14",
    title: "Pantallas para Eventos",
    subtitle: "Fiestas y espectáculos",
    description:
      "Pantallas modulares de gran formato para eventos, recitales, presentaciones y fiestas. Alquiler o venta con instalación y operación técnica incluida.",
    features: ["Formato modular configurable", "Operador técnico incluido", "Alquiler y venta"],
    image: "https://loremflickr.com/800/500/led,event,concert?lock=20",
  },
];

// Mock de casos de uso / proyectos realizados
const CASES = [
  { label: "Farmacia céntrica, Baradero", img: "https://loremflickr.com/600/400/pharmacy,led?lock=31" },
  { label: "Concesionaria de autos, Zárate", img: "https://loremflickr.com/600/400/car,dealer,led?lock=32" },
  { label: "Evento corporativo, Buenos Aires", img: "https://loremflickr.com/600/400/corporate,event,led?lock=33" },
  { label: "Bar nocturno, San Pedro", img: "https://loremflickr.com/600/400/bar,neon,led?lock=34" },
];

export default function HomePage() {
  const waLink = buildWhatsAppLink({ message: "Hola, quiero cotizar una pantalla LED" });

  return (
    <>
      {/* HERO */}
      <HeroSection waLink={waLink} />

      {/* MARQUEE de servicios */}
      <div className="bg-neutral-800/50 border-y border-neutral-800 overflow-hidden py-4">
        <div className="flex animate-marquee whitespace-nowrap gap-12">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 flex-shrink-0">
              {["Pantallas Exteriores", "Pantallas Interiores", "Eventos & Espectáculos", "Instalación Profesional", "Soporte 24/7", "Garantía 12 meses"].map((item) => (
                <span key={item} className="flex items-center gap-3 font-display text-sm uppercase tracking-widest text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN: 3 SERVICIOS */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Heading */}
          <FadeUpOnScroll className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
              Lo que hacemos
            </p>
            <h2 className="font-display text-5xl lg:text-7xl font-black uppercase text-neutral-50 leading-none">
              Nuestros{" "}
              <span className="led-text-magenta">Servicios</span>
            </h2>
          </FadeUpOnScroll>

          {/* Cards de servicios — layout asimétrico */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <ScalePopOnScroll key={service.id} delay={i * 0.1}>
                <div
                  className="group relative rounded-lg overflow-hidden border border-neutral-800 hover:border-opacity-60 transition-all duration-500 flex flex-col h-full"
                  style={{ "--service-color": service.color } as React.CSSProperties}
                >
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent"
                    />
                    {/* Icono */}
                    <div
                      className="absolute top-4 right-4 w-10 h-10 rounded flex items-center justify-center text-xl border"
                      style={{ borderColor: `${service.color}40`, backgroundColor: `${service.color}15` }}
                    >
                      {service.icon}
                    </div>
                    {/* Línea de color */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500"
                      style={{ backgroundColor: service.color, boxShadow: `0 0 8px ${service.color}` }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 p-6 flex flex-col bg-neutral-900/80">
                    <p
                      className="font-body text-xs uppercase tracking-[0.2em] mb-2"
                      style={{ color: service.color }}
                    >
                      {service.subtitle}
                    </p>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-neutral-50 mb-3">
                      {service.title}
                    </h3>
                    <p className="font-body text-sm text-neutral-400 leading-relaxed mb-5 flex-1">
                      {service.description}
                    </p>
                    {/* Features */}
                    <ul className="space-y-1.5 mb-6">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 font-body text-xs text-neutral-400">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: service.color }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`https://wa.me/3329746323?text=${encodeURIComponent(`Hola, quiero consultar sobre ${service.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wider transition-all duration-200 active:scale-95 group/btn"
                      style={{ color: service.color }}
                    >
                      Consultar precio
                      <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </ScalePopOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: CÓMO FUNCIONA */}
      <section className="py-24 bg-neutral-800/30 relative">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,245,255,1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <FadeUpOnScroll className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
              Proceso
            </p>
            <h2 className="font-display text-5xl lg:text-6xl font-black uppercase text-neutral-50">
              Así de{" "}
              <span className="led-text-cyan">simple</span>
            </h2>
          </FadeUpOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: "💬", title: "Consultás", desc: "Nos escribís por WhatsApp con las medidas y el lugar donde va la pantalla." },
              { step: "02", icon: "📐", title: "Cotizamos", desc: "Te enviamos una propuesta con precio, especificaciones técnicas y tiempo de entrega." },
              { step: "03", icon: "🔧", title: "Instalamos", desc: "Nuestro equipo técnico instala la pantalla y configura el sistema de gestión de contenidos." },
              { step: "04", icon: "✨", title: "Brillás", desc: "Tu negocio empieza a destacar. Soporte técnico disponible ante cualquier consulta." },
            ].map((item, i) => (
              <SlideFromSide key={item.step} index={i} delay={i * 0.08}>
                <div className="relative text-center p-6 rounded-lg border border-neutral-800 bg-neutral-900/50 group hover:border-brand-primary/30 transition-colors duration-300">
                  <div className="font-display text-6xl font-black text-neutral-800 absolute top-4 right-4 select-none group-hover:text-neutral-700 transition-colors">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4 relative">{item.icon}</div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide text-neutral-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-neutral-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </SlideFromSide>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: PROYECTOS REALIZADOS */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUpOnScroll className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
                  Galería
                </p>
                <h2 className="font-display text-5xl lg:text-6xl font-black uppercase text-neutral-50 leading-none">
                  Trabajos
                  <span className="block led-text-green">realizados</span>
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="font-body text-sm text-neutral-400 hover:text-brand-primary transition-colors flex items-center gap-2 group self-end"
              >
                Ver catálogo completo
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </FadeUpOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CASES.map((c, i) => (
              <ScalePopOnScroll key={c.label} delay={i * 0.07}>
                <div className="relative group overflow-hidden rounded-lg aspect-square">
                  <img
                    src={c.img}
                    alt={c.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-body text-xs text-neutral-300">{c.label}</p>
                  </div>
                  {/* Borde LED al hover */}
                  <div className="absolute inset-0 rounded-lg border border-brand-primary opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                </div>
              </ScalePopOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: POR QUÉ ELEGIRNOS */}
      <section className="py-24 bg-neutral-800/20 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-2/3 bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-2/3 bg-gradient-to-b from-transparent via-brand-secondary/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeUpOnScroll className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
              Diferencial
            </p>
            <h2 className="font-display text-5xl lg:text-6xl font-black uppercase text-neutral-50">
              ¿Por qué{" "}
              <span className="led-text-cyan">Leds Binario?</span>
            </h2>
          </FadeUpOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                color: "#00F5FF",
                title: "Instalación express",
                desc: "Instalamos tu pantalla en 1 a 2 días hábiles. Cero demoras, tu negocio funcionando cuanto antes.",
              },
              {
                icon: "🛡️",
                color: "#BF00FF",
                title: "12 meses de garantía",
                desc: "Todas nuestras pantallas incluyen garantía total de 12 meses con servicio técnico a domicilio.",
              },
              {
                icon: "📱",
                color: "#39FF14",
                title: "Control desde el celular",
                desc: "Actualizá el contenido de tu pantalla desde cualquier lugar, en tiempo real, sin técnicos.",
              },
              {
                icon: "🌧️",
                color: "#FF6B00",
                title: "Alta resistencia",
                desc: "Pantallas exteriores certificadas IP65. Lluvia, polvo y sol extremo no las afectan.",
              },
              {
                icon: "💡",
                color: "#00F5FF",
                title: "Bajo consumo",
                desc: "Tecnología LED de última generación con eficiencia energética hasta 70% superior a otras tecnologías.",
              },
              {
                icon: "📞",
                color: "#BF00FF",
                title: "Soporte 24/7",
                desc: "Nuestro equipo técnico responde ante cualquier inconveniente los 7 días de la semana.",
              },
            ].map((item, i) => (
              <FadeUpOnScroll key={item.title} delay={i * 0.08}>
                <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50 group hover:border-opacity-40 transition-all duration-300"
                  style={{ "--c": item.color } as React.CSSProperties}
                >
                  <div
                    className="text-3xl mb-4 w-12 h-12 rounded flex items-center justify-center border"
                    style={{ borderColor: `${item.color}30`, backgroundColor: `${item.color}10` }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="font-display text-lg font-bold uppercase tracking-wide mb-2"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeUpOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />
    </>
  );
}
