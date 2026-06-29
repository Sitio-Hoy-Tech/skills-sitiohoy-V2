"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, useMotionValue } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics/umami";
import siteImages from "@/content/site-images.json";

const LOGOS = [
  { src: "/images/logos/cocacola.png", alt: "Coca-Cola" },
  { src: "/images/logos/fiat.svg", alt: "Fiat" },
  { src: "/images/logos/cronica.png",  alt: "Crónica TV" },
  { src: "/images/logos/citroen.svg",  alt: "Citroen" },
  { src: "/images/logos/larural.png",  alt: "La Rural" },
  { src: "/images/logos/shell.png",  alt: "Shell" },
  { src: "/images/logos/eltrece.png",  alt: "El Trece" },
  { src: "/images/logos/ypf_logoazul.svg",  alt: "YPF" },
  { src: "/images/logos/peugeot.avif",  alt: "Peugeot" },
  { src: "/images/logos/C9.webp",  alt: "Canal 9" },
];
const MARQUEE_LOGOS = Array.from({ length: 8 }, () => LOGOS).flat();

interface HeroSectionProps {
  waLink: string;
}

const STATS = [
  { target: 3500, suffix: "+", label: "Instalaciones" },
  { target: 500,  suffix: "+", label: "Clientes activos" },
  { target: 15,   suffix: "+", label: "Años de experiencia" },
  { target: 24,   suffix: "/7", label: "Soporte técnico", raw: "24/7" },
];

function formatAR(n: number) {
  return new Intl.NumberFormat("es-AR").format(Math.round(n));
}

function StatCounter({ stat, isMobile }: { stat: typeof STATS[number]; isMobile: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(() => (isMobile ? stat.raw ?? formatAR(stat.target) : "0"));

  useEffect(() => {
    if (isMobile) return;
    if (stat.raw) return;
    if (!inView) return;
    const controls = animate(count, stat.target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(formatAR(v)),
    });
    return () => controls.stop();
  }, [inView, isMobile, stat.raw, stat.target, count]);

  return (
    <div className="text-center sm:text-left">
      <p
        ref={ref}
        className="font-display font-black text-3xl sm:text-4xl mb-1"
        style={{ color: "#00B8D4" }}
      >
        {stat.raw ? stat.raw : `${display}${stat.suffix}`}
      </p>
      <p
        className="font-body text-xs uppercase tracking-wider"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {stat.label}
      </p>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
  }, []);
  return isMobile;
}

export function HeroSection({ waLink }: HeroSectionProps) {
  const isMobile = useIsMobile();

  // En mobile: sin animación, sin delay
  const tr = (dur: number, del: number) => ({
    duration: isMobile ? 0 : dur,
    delay:    isMobile ? 0 : del,
    ease: [0.16, 1, 0.3, 1] as const,
  });

  // En mobile y=0: initial ya en posición final
  const iy = (y: number) => isMobile ? 0 : y;

  // En mobile opacity=1: el elemento arranca visible, sin esperar JS
  const io = (y = 0) => ({ opacity: isMobile ? 1 : 0, y: iy(y) });

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/fondo-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "brightness(0.35) saturate(0.85)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,13,26,0.88) 0%, rgba(12,24,40,0.78) 40%, rgba(6,13,26,0.88) 100%)",
          }}
        />
      </div>

      {/* LED Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,184,212,0.8) 1px, transparent 0)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ backgroundColor: "#00B8D4" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: "#D91B8A" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={io(16)}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.6, 0)}
            className="no-anim-mobile flex items-center gap-3 mb-8"
          >
            <div
              className="w-8 h-px"
              style={{ backgroundColor: "#00B8D4" }}
            />
            <span
              className="font-body text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: "#00B8D4" }}
            >
              Tecnología LED de alta gama
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={io(30)}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.8, 0.1)}
            className="no-anim-mobile font-display font-black leading-[0.92] tracking-tight mb-6"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "#FFFFFF" }}
          >
            PANTALLAS LED
            <br />
            <span className="text-gradient-brand">QUE GENERAN</span>
            <br />
            IMPACTO REAL
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={io(20)}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.3)}
            className="no-anim-mobile font-body text-lg leading-relaxed mb-10 max-w-2xl"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Soluciones personalizadas en pantallas LED para publicidad, eventos
            y marketing digital. Calidad premium, soporte técnico 24/7 y más de
            1,000 instalaciones en Argentina.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={io(20)}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.45)}
            className="no-anim-mobile flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-base text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: "#00B8D4",
                boxShadow: "0 0 30px rgba(0,184,212,0.3)",
              }}
            >
              Ver catálogo
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { source: "hero" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-base transition-all duration-300 hover:bg-white/10"
              style={{
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar ahora
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={io(20)}
            animate={{ opacity: 1, y: 0 }}
            transition={tr(0.7, 0.6)}
            className="no-anim-mobile grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {STATS.map((stat) => (
              <StatCounter key={stat.label} stat={stat} isMobile={isMobile} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Marquee logos */}
      <motion.div
        initial={io()}
        animate={{ opacity: 1 }}
        transition={tr(0.8, 0.7)}
        className="no-anim-mobile relative z-10 w-full overflow-hidden py-4"
        style={{
          borderTop: "1px solid rgba(30,52,88,0.5)",
          borderBottom: "1px solid rgba(30,52,88,0.5)",
          backgroundColor: "rgba(12,24,40,0.6)",
        }}
      >
        <div
          className="flex animate-marquee items-center gap-16"
          style={{ width: "max-content" }}
        >
          {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((logo, i) => (
            <div key={i} className="shrink-0 flex items-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={0}
                height={0}
                sizes="120px"
                style={{ width: "auto", height: "36px", opacity: 0.45 }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hero image strip */}
      <motion.div
        initial={io()}
        animate={{ opacity: 1 }}
        transition={tr(1.2, 0.8)}
        className="no-anim-mobile relative z-10 w-full overflow-hidden"
        style={{ height: "280px" }}
      >
        <div className="flex gap-3 w-full h-full">
          {siteImages.hero.strip.map((img, i) => (
            <div
              key={i}
              className="flex-1 relative overflow-hidden rounded-xl"
              style={{ minWidth: "200px" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover"
                style={{ filter: "brightness(0.7) saturate(1.2)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,13,26,0.8) 0%, transparent 50%)",
                }}
              />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-y-0 left-0 w-16"
          style={{ background: "linear-gradient(to right, #060D1A, transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-16"
          style={{ background: "linear-gradient(to left, #060D1A, transparent)" }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={io()}
        animate={{ opacity: 1 }}
        transition={tr(0.8, 1.5)}
        className="no-anim-mobile absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, rgba(0,184,212,0.6), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
