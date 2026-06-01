import { buildWhatsAppLink } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import siteImages from "@/content/site-images.json";

export const metadata: Metadata = {
  title: "Nosotros — Multi Conection",
  description:
    "Conocé la historia de Multi Conection. Más de 10 años de experiencia en pantallas LED para publicidad y eventos en Argentina.",
};

const VALUES = [
  {
    title: "Excelencia técnica",
    desc: "Trabajamos con los fabricantes más reconocidos del mundo. Cada producto que instalamos pasa por un riguroso control de calidad antes de llegar a tus manos.",
  },
  {
    title: "Compromiso real",
    desc: "No desaparecemos después de la venta. Somos tu socio tecnológico a largo plazo, disponibles 24/7 para mantener tu pantalla funcionando al máximo.",
  },
  {
    title: "Soluciones a medida",
    desc: "Cada proyecto es único. Diseñamos soluciones específicas para cada cliente, desde el tamaño y resolución hasta el sistema de gestión de contenidos.",
  },
  {
    title: "Proyección nacional",
    desc: "Con base en Buenos Aires y presencia en todo el país, podemos ejecutar proyectos en cualquier provincia con los mismos estándares de calidad.",
  },
];

const MILESTONES = [
  { year: "2013", text: "Fundación de Multi Conection en Buenos Aires." },
  { year: "2015", text: "Primera instalación de gran escala para evento masivo." },
  { year: "2018", text: "Expansión al interior del país. Presencia en 10 provincias." },
  { year: "2021", text: "Superamos las 500 instalaciones permanentes en Argentina." },
  { year: "2024", text: "Más de 1,000 instalaciones y referentes del mercado LED." },
];

export default function NosotrosPage() {
  const waLink = buildWhatsAppLink({
    message: "Hola, quisiera más información sobre Multi Conection.",
  });

  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ backgroundColor: "#060D1A" }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,184,212,0.8) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <p
              className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
              style={{ color: "#00B8D4" }}
            >
              Nuestra empresa
            </p>
            <h1 className="font-display font-black text-5xl lg:text-8xl text-white leading-[0.92] tracking-tight mb-6">
              QUIÉNES
              <br />
              <span className="text-gradient-brand">SOMOS</span>
            </h1>
            <p
              className="font-body text-lg leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Multi Conection nació con una misión clara: llevar tecnología LED
              de alta calidad a cada rincón de Argentina, con el respaldo
              técnico que los grandes proyectos exigen.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* STORY SECTION */}
      <section
        className="py-24 lg:py-32"
        style={{ backgroundColor: "#0C1828" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="relative">
                <div
                  className="relative w-full rounded-2xl overflow-hidden"
                  style={{ aspectRatio: "4/3", border: "1px solid rgba(30,52,88,0.5)" }}
                >
                  <Image
                    src={siteImages.nosotros.historia.src}
                    alt={siteImages.nosotros.historia.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    style={{ filter: "brightness(0.85) saturate(1.1)" }}
                  />
                </div>
                {/* Stats overlay */}
                <div
                  className="absolute -bottom-6 -right-6 p-6 rounded-2xl"
                  style={{
                    backgroundColor: "#142240",
                    border: "1px solid rgba(0,184,212,0.3)",
                  }}
                >
                  <p
                    className="font-display font-black text-4xl"
                    style={{ color: "#00B8D4" }}
                  >
                    +15
                  </p>
                  <p
                    className="font-body text-xs uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Años en el mercado
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p
                className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-6"
                style={{ color: "#00B8D4" }}
              >
                Nuestra historia
              </p>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white leading-[0.95] mb-6">
                MÁS DE UNA DÉCADA
                <br />
                <span className="text-gradient-brand">ILUMINANDO</span>
                <br />
                PROYECTOS
              </h2>
              <p
                className="font-body text-base leading-relaxed mb-6"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Comenzamos en 2013 con el objetivo de democratizar el acceso a
                tecnología LED profesional en Argentina. Hoy somos referentes en
                el mercado, con más de 1,000 instalaciones realizadas para
                clientes que van desde pymes locales hasta grandes cadenas y
                empresas multinacionales.
              </p>
              <p
                className="font-body text-base leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Trabajamos con fabricantes de primer nivel mundial para
                garantizar que cada pantalla que instalamos sea sinónimo de
                calidad, durabilidad y rendimiento excepcional.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#00B8D4" }}
              >
                Consultarnos
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section
        className="py-24 lg:py-32"
        style={{ backgroundColor: "#060D1A" }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-display font-black text-4xl lg:text-6xl text-white mb-16 text-center">
              NUESTRO
              <br />
              <span className="text-gradient-brand">CAMINO</span>
            </h2>
          </ScrollReveal>
          <div className="relative">
            <div
              className="absolute left-[39px] top-0 bottom-0 w-px"
              style={{ backgroundColor: "rgba(30,52,88,0.8)" }}
            />
            <div className="flex flex-col gap-10">
              {MILESTONES.map((m, i) => (
                <ScrollReveal key={m.year} delay={i * 0.1}>
                  <div className="flex items-start gap-6">
                    <div
                      className="w-20 h-20 shrink-0 rounded-full flex items-center justify-center font-display font-black text-sm z-10"
                      style={{
                        backgroundColor: "#0C1828",
                        border: "2px solid #00B8D4",
                        color: "#00B8D4",
                      }}
                    >
                      {m.year}
                    </div>
                    <div className="pt-4">
                      <p
                        className="font-body text-base leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {m.text}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section
        className="py-24 lg:py-32"
        style={{ backgroundColor: "#0C1828" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p
                className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
                style={{ color: "#00B8D4" }}
              >
                Lo que nos define
              </p>
              <h2 className="font-display font-black text-4xl lg:text-6xl text-white">
                NUESTROS{" "}
                <span className="text-gradient-brand">VALORES</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div
                  className="p-8 rounded-2xl h-full card-led-hover"
                  style={{ backgroundColor: "#142240" }}
                >
                  <div
                    className="w-10 h-1 rounded mb-6"
                    style={{ backgroundColor: "#00B8D4" }}
                  />
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    {v.title}
                  </h3>
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {v.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 text-center"
        style={{ backgroundColor: "#060D1A" }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-6">
              ¿LISTO PARA
              <br />
              <span className="text-gradient-brand">TU PROYECTO?</span>
            </h2>
            <p
              className="font-body text-base leading-relaxed mb-10"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Contanos tu idea y te asesoramos sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-body font-bold text-base text-white transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#00B8D4" }}
              >
                Hablar por WhatsApp
              </a>
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-base text-white transition-all duration-300 hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Ver catálogo
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
