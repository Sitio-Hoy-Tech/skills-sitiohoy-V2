import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";
import { TAGS } from "@/lib/cache-tags";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getTenantConfig } from "@/lib/supabase/tenant";
import { HeroSection } from "@/components/ui/HeroSection";
import { FAQSection } from "@/components/ui/FAQSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import siteImages from "@/content/site-images.json";

const getFeaturedProducts = unstable_cache(
  async () => {
    try {
      const tenantId = getTenantId();
      const supabaseAdmin = createAdminClient();
      const { data, error } = await supabaseAdmin
        .from("products")
        .select(
          "id, name, slug, description, product_images (id, url, alt, position)"
        )
        .eq("tenant_id", tenantId)
        .eq("active", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) console.error("[home] featured error:", error.message);
      return data ?? [];
    } catch (e) {
      console.error("[home] featured exception:", e);
      return [];
    }
  },
  ["home-featured"],
  { tags: [TAGS.PRODUCTS] }
);

const MOCK_FEATURED = [
  {
    id: "mock-f1",
    name: "Pantalla P10 Fixed Exterior",
    slug: "pantalla-p10-fixed-exterior",
    description:
      "Alta luminosidad con bajo consumo energético. Ideal para publicidad en vía pública.",
    product_images: [
      { url: siteImages.home.featured[0].src, alt: siteImages.home.featured[0].alt, position: 0 },
    ],
  },
  {
    id: "mock-f2",
    name: "Curve P6.25 Outdoor",
    slug: "curve-p6-25-outdoor",
    description:
      "Nova HighRefresh 3600hz. Diseñada para eventos y publicidad premium.",
    product_images: [
      { url: siteImages.home.featured[1].src, alt: siteImages.home.featured[1].alt, position: 0 },
    ],
  },
  {
    id: "mock-f3",
    name: "Pantalla Indoor Pitch 2.5mm",
    slug: "pantalla-indoor-pitch-2-5mm",
    description:
      "Fine pitch para visualización a corta distancia. Imagen cristalina en interiores.",
    product_images: [
      { url: siteImages.home.featured[2].src, alt: siteImages.home.featured[2].alt, position: 0 },
    ],
  },
];

const BENEFITS = [
  {
    icon: "⚡",
    title: "Impacto visual excepcional",
    desc: "Pantallas de alta luminosidad visibles incluso en plena luz del día, con colores vibrantes y resolución perfecta.",
  },
  {
    icon: "🛡️",
    title: "Durabilidad garantizada",
    desc: "Materiales de primer nivel con certificaciones IP65 para exterior. Resistencia total a lluvia, viento y temperatura.",
  },
  {
    icon: "📱",
    title: "Gestión de contenido simple",
    desc: "Software intuitivo para actualizar tu contenido desde cualquier dispositivo, en tiempo real y sin conocimientos técnicos.",
  },
  {
    icon: "🔧",
    title: "Soporte técnico 24/7",
    desc: "Equipo especializado disponible las 24 horas para resolver cualquier inconveniente y mantener tu pantalla siempre activa.",
  },
];


export default async function HomePage() {
  let featured: typeof MOCK_FEATURED = [];

  const [tenantConfig] = await Promise.allSettled([getTenantConfig()]);
  const whatsappNumber =
    tenantConfig.status === "fulfilled"
      ? (tenantConfig.value as Record<string, string>).whatsapp
      : undefined;

  try {
    const dbFeatured = await getFeaturedProducts();
    if (dbFeatured.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      featured = dbFeatured as any;
    }
  } catch {
    // use mock
  }

  const displayFeatured = featured.length > 0 ? featured : MOCK_FEATURED;
  const waLink = buildWhatsAppLink({
    number: whatsappNumber,
    message: "Hola, quiero hacer una consulta sobre pantallas LED.",
  });

  return (
    <>
      {/* HERO */}
      <HeroSection waLink={waLink} />


      {/* POR QUÉ INVERTIR EN PANTALLAS LED */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: "#0C1828" }}>
        {/* Fondo: líneas diagonales sutiles */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              rgba(0,184,212,0.04) 0px,
              rgba(0,184,212,0.04) 1px,
              transparent 1px,
              transparent 40px
            )`,
          }}
        />
        {/* Orbe de luz cyan izquierda */}
        <div
          className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,184,212,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Orbe de luz magenta derecha */}
        <div
          className="absolute -right-40 bottom-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(217,27,138,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-display font-black text-3xl lg:text-5xl text-white text-center mb-16 leading-tight">
              ¿Por qué invertir en{" "}
              <span className="text-gradient-brand">pantallas LED</span>?
            </h2>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen izquierda */}
            <ScrollReveal className="w-full">
              <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(0,184,212,0.2)" }}>
                <Image
                  src={siteImages.invertir.conNosotros.src}
                  alt={siteImages.invertir.conNosotros.alt}
                  width={0}
                  height={0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ width: "100%", height: "auto", display: "block" }}
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,184,212,0.15) 0%, transparent 60%)",
                  }}
                />
              </div>
            </ScrollReveal>

            {/* Items numerados derecha */}
            <div className="flex flex-col gap-8">
              {[
                {
                  title: "Impacto Visual en tu Publicidad",
                  desc: "Las pantallas LED ofrecen una calidad de imagen excepcional, generando un 70% de impacto mayor a los carteles tradicionales.",
                },
                {
                  title: "Flexibilidad y Versatilidad",
                  desc: "Pueden adaptarse a diferentes espacios y necesidades, logrando cualquier tamaño o forma, sin importar si es en interior o exterior.",
                },
                {
                  title: "Ahorro Energético",
                  desc: "Las pantallas LED son eficientes energéticamente, lo que resulta en un ahorro significativo en costos de electricidad a largo plazo.",
                },
                {
                  title: "Durabilidad y Fiabilidad",
                  desc: "Son dispositivos duraderos y confiables, diseñados para resistir condiciones climáticas diversas y mantener un rendimiento constante.",
                },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <div className="flex gap-5 items-start">
                    <div
                      className="shrink-0 w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center font-display font-black text-white text-base lg:text-xl"
                      style={{ backgroundColor: "#00B8D4", boxShadow: "0 0 20px rgba(0,184,212,0.4)" }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-lg lg:text-2xl mb-1 lg:mb-2">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm lg:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* CTA centrado */}
          <ScrollReveal className="mt-16 flex justify-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-body font-bold text-base text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: "#00B8D4",
                boxShadow: "0 0 30px rgba(0,184,212,0.35)",
              }}
            >
              Pedí tu presupuesto ahora
            </a>
          </ScrollReveal>
        </div>
      </section>


      {/* BENEFICIOS */}
      <section className="py-24 lg:py-32" style={{ backgroundColor: "#060D1A" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <ScrollReveal>
                <p
                  className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
                  style={{ color: "#00B8D4" }}
                >
                  Por qué elegirnos
                </p>
                <h2
                  className="font-display font-black text-4xl lg:text-6xl text-white leading-[0.95] mb-6"
                >
                  TECNOLOGÍA QUE
                  <br />
                  <span className="text-gradient-brand">TRABAJA</span>
                  <br />
                  POR VOS
                </h2>
                <p
                  className="font-body text-base leading-relaxed mb-8"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Cada pantalla LED que instalamos es el resultado de más de
                  10 años de experiencia en el mercado argentino. Trabajamos
                  con las marcas más reconocidas del mundo para garantizar que
                  tu inversión dure en el tiempo.
                </p>
                <Link
                  href="/nosotros"
                  className="inline-flex items-center gap-2 font-body font-semibold text-sm transition-colors hover:opacity-80"
                  style={{ color: "#00B8D4" }}
                >
                  Conocer más sobre nosotros
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {BENEFITS.map((b, i) => (
                <ScrollReveal key={b.title} delay={i * 0.1} className="h-full">
                  <div
                    className="p-6 rounded-xl card-led-hover h-full flex flex-col"
                    style={{ backgroundColor: "#0C1828" }}
                  >
                    <span className="text-3xl mb-4 block">{b.icon}</span>
                    <h3
                      className="font-display font-bold text-lg text-white mb-2"
                    >
                      {b.title}
                    </h3>
                    <p
                      className="font-body text-xs leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {b.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-24 lg:py-32" style={{ backgroundColor: "#0C1828" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <ScrollReveal>
              <p
                className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
                style={{ color: "#00B8D4" }}
              >
                Lo más consultado
              </p>
              <h2 className="font-display font-black text-4xl lg:text-6xl text-white leading-[0.95]">
                PRODUCTOS
                <br />
                <span className="text-gradient-brand">DESTACADOS</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 font-body font-semibold text-sm transition-colors hover:opacity-80 shrink-0"
                style={{ color: "#00B8D4" }}
              >
                Ver catálogo completo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {displayFeatured.map((product, i) => {
              const imgUrl = product.product_images?.[0]?.url ?? siteImages.home.featured[i]?.src ?? "";
              const waProductLink = buildWhatsAppLink({ number: whatsappNumber, productName: product.name });
              return (
                <ScrollReveal key={product.id} delay={i * 0.1} className="h-full">
                  <div
                    className="rounded-2xl overflow-hidden card-led-hover group h-full flex flex-col"
                    style={{ backgroundColor: "#142240" }}
                  >
                    <div className="overflow-hidden" style={{ backgroundColor: "#0c1828" }}>
                      <Image
                        src={imgUrl}
                        alt={product.product_images?.[0]?.alt ?? product.name}
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ width: "100%", height: "auto", display: "block" }}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-display font-bold text-xl text-white mb-2">
                        {product.name}
                      </h3>
                      <p
                        className="font-body text-sm leading-relaxed mb-5 flex-1"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {product.description}
                      </p>
                      <a
                        href={waProductLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: "#00B8D4" }}
                      >
                        Más información
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRABAJOS PREVIEW */}
      <section className="py-24 lg:py-32" style={{ backgroundColor: "#060D1A" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <ScrollReveal>
              <p
                className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
                style={{ color: "#D91B8A" }}
              >
                Nuestra obra
              </p>
              <h2 className="font-display font-black text-4xl lg:text-6xl text-white leading-[0.95]">
                INSTALACIONES
                <br />
                <span style={{ color: "#D91B8A" }}>REALES</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <Link
                href="/trabajos"
                className="inline-flex items-center gap-2 font-body font-semibold text-sm transition-colors hover:opacity-80 shrink-0"
                style={{ color: "#D91B8A" }}
              >
                Ver todos los trabajos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {siteImages.trabajos.slice(0, 8).map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.05}>
                <div
                  className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
                  style={{ border: "1px solid rgba(30,52,88,0.5)" }}
                >
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    style={{ filter: "brightness(0.8) saturate(1.1)" }}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA FINAL */}
      <section
        className="py-24 lg:py-32 relative overflow-hidden"
        style={{ backgroundColor: "#0C1828" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,184,212,0.8) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p
              className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
              style={{ color: "#00B8D4" }}
            >
              ¿Tenés un proyecto?
            </p>
            <h2 className="font-display font-black text-4xl lg:text-7xl text-white leading-[0.92] mb-6">
              HABLEMOS DE
              <br />
              <span className="text-gradient-brand">TU PROYECTO</span>
            </h2>
            <p
              className="font-body text-base leading-relaxed mb-10"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Contanos qué necesitás y te preparamos una propuesta a medida.
              Sin compromiso, sin letras chicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-body font-bold text-base text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  backgroundColor: "#00B8D4",
                  boxShadow: "0 0 40px rgba(0,184,212,0.3)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escribirnos por WhatsApp
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-body font-semibold text-base text-white transition-all duration-300 hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Formulario de contacto
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
