"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// Partículas LED flotantes
function LedParticle({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: 4,
        height: 4,
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.6, 1, 0],
        scale: [0, 1, 0.8, 1, 0],
        y: [0, -30, -15, -40, -60],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1,
      }}
    />
  );
}

const particles = [
  { x: 10, y: 80, color: "#00F5FF", delay: 0 },
  { x: 25, y: 70, color: "#BF00FF", delay: 0.5 },
  { x: 40, y: 85, color: "#39FF14", delay: 1 },
  { x: 55, y: 75, color: "#00F5FF", delay: 1.5 },
  { x: 70, y: 80, color: "#FF6B00", delay: 2 },
  { x: 85, y: 70, color: "#BF00FF", delay: 0.3 },
  { x: 15, y: 60, color: "#39FF14", delay: 2.5 },
  { x: 90, y: 60, color: "#00F5FF", delay: 1.2 },
  { x: 50, y: 90, color: "#BF00FF", delay: 0.8 },
  { x: 75, y: 55, color: "#39FF14", delay: 1.8 },
];

export function HeroSection({ waLink }: { waLink: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-900">
      {/* Fondo con imagen LED + overlay */}
      <div className="absolute inset-0">
        <img
          src="https://loremflickr.com/1920/1080/led,billboard?lock=5"
          alt="Pantallas LED"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/95 via-neutral-900/80 to-neutral-900/70" />
        {/* Líneas de escaneo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.05) 2px, rgba(0,245,255,0.05) 4px)",
          }}
        />
      </div>

      {/* Grid de fondo */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Partículas */}
      {mounted && particles.map((p, i) => (
        <LedParticle key={i} {...p} />
      ))}

      {/* Bordes luminosos */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/40 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-brand-green animate-led-pulse" />
          <span className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary">
            Pantallas LED · Baradero · Buenos Aires
          </span>
          <div className="w-2 h-2 rounded-full bg-brand-green animate-led-pulse" />
        </motion.div>

        {/* Heading con palabra animada */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black uppercase leading-none tracking-tight mb-6"
        >
          <span className="block text-5xl sm:text-7xl lg:text-9xl text-neutral-50">
            Tu marca
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-9xl led-text-cyan animate-led-pulse">
            brillando
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-9xl text-neutral-50">
            las 24hs
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-body text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Pantallas LED de alta definición para publicidad, negocios y eventos.
          Instalación profesional, soporte técnico incluido.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand-primary text-neutral-900 px-10 py-4 rounded font-display font-bold text-lg uppercase tracking-widest hover:bg-brand-primary/80 active:scale-95 transition-all duration-200 shadow-lg shadow-brand-primary/40 animate-glow-border"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pedir cotización
          </a>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 border border-neutral-700 text-neutral-300 px-10 py-4 rounded font-display font-bold text-lg uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all duration-200"
          >
            Ver catálogo
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: "+200", label: "Instalaciones" },
            { value: "24/7", label: "Soporte" },
            { value: "12m", label: "Garantía" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-black led-text-cyan">{stat.value}</p>
              <p className="font-body text-xs uppercase tracking-widest text-neutral-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-body text-xs uppercase tracking-[0.3em] text-neutral-600">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-brand-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
