"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "¿Qué tipo de pantallas LED ofrecen?",
    answer:
      "Ofrecemos pantallas LED para uso interior y exterior, en distintos tamaños y resoluciones. Nuestro catálogo incluye pantallas fijas para locales comerciales, pantallas móviles para eventos y displays modulares para fachadas.",
  },
  {
    question: "¿Hacen envíos o solo trabajan en Baradero?",
    answer:
      "Trabajamos en toda la provincia de Buenos Aires y el interior del país. Realizamos la instalación en el lugar que el cliente necesite. Consultanos por tu ciudad y te cotizamos el traslado sin cargo.",
  },
  {
    question: "¿Qué pasa si la pantalla tiene un problema después de la instalación?",
    answer:
      "Todas nuestras pantallas tienen garantía de 12 meses. Si surge algún inconveniente técnico, respondemos en el mismo día por WhatsApp y coordinamos el servicio técnico a domicilio.",
  },
  {
    question: "¿Cuánto tarda la instalación?",
    answer:
      "Dependiendo del tamaño de la pantalla y las condiciones del lugar, la instalación se realiza en 1 a 2 días hábiles. Para pantallas modulares grandes, el plazo puede extenderse a 3-4 días.",
  },
  {
    question: "¿Puedo poner mi propio contenido publicitario en la pantalla?",
    answer:
      "Por supuesto. Cada pantalla viene con software de gestión de contenidos incluido. Podés actualizar tu publicidad desde el celular o la computadora, sin necesidad de conocimientos técnicos.",
  },
  {
    question: "¿Las pantallas LED consumen mucha energía?",
    answer:
      "Las pantallas LED son significativamente más eficientes que la iluminación tradicional. Una pantalla de 2m² consume aproximadamente el equivalente a 3 lámparas comunes. Además, el brillo se regula automáticamente según la luz ambiental.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-neutral-900 relative overflow-hidden">
      {/* Grid decorativo de fondo */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
            Información
          </p>
          <h2 className="font-display text-5xl lg:text-6xl font-black uppercase text-neutral-50">
            Preguntas{" "}
            <span className="led-text-cyan">Frecuentes</span>
          </h2>
        </motion.div>

        {/* Acordeón */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.5 }}
              className={`border rounded overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-brand-primary/60 bg-neutral-800/80"
                  : "border-neutral-800 bg-neutral-800/30 hover:border-neutral-700"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-item-${index}`}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-body font-semibold text-neutral-100 pr-4">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary rotate-45"
                      : "border-neutral-600 text-neutral-400"
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="6" y1="1" x2="6" y2="11" />
                    <line x1="1" y1="6" x2="11" y2="6" />
                  </svg>
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 font-body text-sm text-neutral-400 leading-relaxed border-t border-neutral-700/50 pt-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center font-body text-sm text-neutral-500 mt-10"
        >
          ¿No encontrás tu respuesta?{" "}
          <a
            href={`https://wa.me/3329746323?text=${encodeURIComponent("Hola, tengo una consulta sobre pantallas LED")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            Escribinos por WhatsApp
          </a>
        </motion.p>
      </div>
    </section>
  );
}
