import { buildWhatsAppLink } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Image from "next/image";
import type { Metadata } from "next";
import siteImages from "@/content/site-images.json";

export const metadata: Metadata = {
  title: "Trabajos — Multi Conection",
  description:
    "Galería de instalaciones LED realizadas por Multi Conection en Argentina. Más de 1,000 proyectos en vía pública, eventos, locales comerciales y corporativos.",
};


export default function TrabajosPage() {
  const waLink = buildWhatsAppLink({
    message:
      "Hola, vi sus trabajos y quisiera consultar sobre un proyecto de pantallas LED.",
  });

  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{ backgroundColor: "#060D1A" }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(217,27,138,0.8) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <p
              className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
              style={{ color: "#D91B8A" }}
            >
              Nuestras instalaciones
            </p>
            <h1 className="font-display font-black text-5xl lg:text-8xl text-white leading-[0.92] tracking-tight mb-4">
              NUESTROS
              <br />
              <span style={{ color: "#D91B8A" }}>TRABAJOS</span>
            </h1>
            <p
              className="font-body text-base leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Más de 1,000 instalaciones realizadas en todo el país. Desde
              locales comerciales hasta eventos masivos, corporativos y vía
              pública.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS */}
      <section
        className="py-12"
        style={{
          backgroundColor: "#0C1828",
          borderTop: "1px solid rgba(30,52,88,0.5)",
          borderBottom: "1px solid rgba(30,52,88,0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1.000+", label: "Instalaciones totales" },
              { value: "8+", label: "Rubros atendidos" },
              { value: "24", label: "Provincias con presencia" },
              { value: "100%", label: "Proyectos entregados" },
            ].map((s) => (
              <ScrollReveal key={s.label}>
                <div className="text-center">
                  <p
                    className="font-display font-black text-4xl mb-1"
                    style={{ color: "#D91B8A" }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="font-body text-xs uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {s.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-16 pb-24" style={{ backgroundColor: "#060D1A" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Masonry-like grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {siteImages.trabajos.map((project, i) => (
              <ScrollReveal key={project.id} delay={(i % 3) * 0.08}>
                <div
                  className="group relative rounded-2xl overflow-hidden card-led-hover"
                  style={{
                    border: "1px solid rgba(30,52,88,0.5)",
                    aspectRatio: i % 5 === 0 ? "3/2" : "4/3",
                  }}
                >
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    style={{ filter: "brightness(0.75) saturate(1.1)" }}
                  />
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(6,13,26,0.9) 0%, rgba(6,13,26,0.2) 50%, transparent 100%)",
                    }}
                  />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display font-bold text-lg text-white leading-tight">
                      {project.title}
                    </h3>
                    <p
                      className="font-body text-xs mt-1 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-center"
        style={{
          backgroundColor: "#0C1828",
          borderTop: "1px solid rgba(30,52,88,0.4)",
        }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4">
              ¿TU PROYECTO ES
              <br />
              <span style={{ color: "#D91B8A" }}>EL SIGUIENTE?</span>
            </h2>
            <p
              className="font-body text-base leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Contanos en qué estás trabajando y preparamos una propuesta
              para que tu pantalla LED sea el próximo caso de éxito.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-body font-bold text-base text-white transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#D91B8A",
                boxShadow: "0 0 30px rgba(217,27,138,0.3)",
              }}
            >
              Empezar mi proyecto
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
