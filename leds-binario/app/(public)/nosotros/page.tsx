import { FadeUpOnScroll, ScalePopOnScroll } from "@/components/ui/Animations";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function NosotrosPage() {
  const waLink = buildWhatsAppLink({ message: "Hola, quiero saber más sobre Leds Binario" });

  return (
    <div className="pt-20">
      {/* Hero Nosotros */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://loremflickr.com/1920/600/led,technology,team?lock=40"
            alt="Equipo Leds Binario"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/60 to-neutral-900" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeUpOnScroll>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-4">
              Quiénes somos
            </p>
            <h1 className="font-display text-6xl lg:text-8xl font-black uppercase text-neutral-50 leading-none mb-6">
              Leds <span className="led-text-cyan">Binario</span>
            </h1>
            <p className="font-body text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Somos especialistas en pantallas LED con base en Baradero, Buenos Aires. Desde el 2018 ayudamos a negocios y emprendedores a destacarse con tecnología de iluminación moderna y duradera.
            </p>
          </FadeUpOnScroll>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUpOnScroll>
              <div>
                <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-4">
                  Nuestra historia
                </p>
                <h2 className="font-display text-4xl lg:text-5xl font-black uppercase text-neutral-50 mb-6 leading-tight">
                  Tecnología LED
                  <span className="block led-text-cyan">al alcance de todos</span>
                </h2>
                <div className="space-y-4 font-body text-neutral-400 leading-relaxed">
                  <p>
                    Nacimos con la convicción de que cualquier negocio, sin importar su tamaño, merece tener la mejor visibilidad posible. Las pantallas LED dejaron de ser exclusivas de las grandes marcas.
                  </p>
                  <p>
                    {/* Cliente: revisar/reemplazar con información real */}
                    Con más de 200 instalaciones realizadas en la región, somos el referente en tecnología LED para comercios, eventos y señalización en Baradero, San Pedro, Zárate y alrededores.
                  </p>
                  <p>
                    Trabajamos con marcas de primera línea y ofrecemos servicio técnico propio, garantizando la máxima calidad y disponibilidad para nuestros clientes.
                  </p>
                </div>
              </div>
            </FadeUpOnScroll>
            <FadeUpOnScroll delay={0.2}>
              <div className="relative">
                <img
                  src="https://loremflickr.com/800/600/led,installation,technician?lock=41"
                  alt="Instalación pantalla LED"
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
                <div className="absolute -bottom-4 -left-4 bg-neutral-900 border border-brand-primary/30 rounded-lg p-4 animate-glow-border">
                  <p className="font-display text-3xl font-black led-text-cyan">+200</p>
                  <p className="font-body text-xs text-neutral-400 uppercase tracking-wider">Instalaciones</p>
                </div>
              </div>
            </FadeUpOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-800/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeUpOnScroll>
            <h2 className="font-display text-4xl lg:text-5xl font-black uppercase text-neutral-50 mb-4">
              ¿Querés trabajar con nosotros?
            </h2>
            <p className="font-body text-neutral-400 mb-8">
              Contactanos y te contamos cómo podemos hacer brillar tu negocio.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-brand-primary text-neutral-900 px-10 py-4 rounded font-display font-bold text-lg uppercase tracking-widest hover:bg-brand-primary/80 active:scale-95 transition-all duration-200"
            >
              Hablemos
            </a>
          </FadeUpOnScroll>
        </div>
      </section>
    </div>
  );
}
