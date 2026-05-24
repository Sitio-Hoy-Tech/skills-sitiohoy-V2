"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "¿Cómo puedo solicitar un presupuesto?",
    answer:
      "Podés contactarnos directamente por WhatsApp o completar el formulario de contacto en nuestro sitio. En menos de 24 horas hábiles te enviamos una propuesta personalizada según tus necesidades y el tamaño del proyecto.",
  },
  {
    question: "¿Realizan instalaciones en todo el país?",
    answer:
      "Sí, contamos con equipos técnicos en Buenos Aires y tenemos red de instaladores en todo el país. Hemos realizado proyectos en CABA, GBA, Córdoba, Rosario, Mendoza y otras provincias. Consultanos por tu ciudad.",
  },
  {
    question: "¿Cuál es la diferencia entre pantallas fijas y de rental?",
    answer:
      "Las pantallas fijas están diseñadas para instalaciones permanentes en locales, edificios o vía pública. Las pantallas de rental son más livianas y modulares, pensadas para eventos temporales, shows y exposiciones donde se necesita armar y desarmar con rapidez.",
  },
  {
    question: "¿Ofrecen soporte técnico post-instalación?",
    answer:
      "Absolutamente. Contamos con soporte técnico 24/7 para nuestros clientes. Ofrecemos asistencia remota para configuración de contenidos y visitas técnicas presenciales cuando es necesario. Nuestro objetivo es que tu pantalla funcione siempre al máximo.",
  },
  {
    question: "¿Los precios incluyen instalación y configuración?",
    answer:
      "Cada presupuesto es personalizado e incluye el detalle de todos los componentes: hardware, software de gestión, instalación y capacitación. Nada queda fuera de lo acordado. Te explicamos todo antes de comenzar.",
  },
  {
    question: "¿Qué garantía tienen las pantallas?",
    answer:
      "Todos nuestros productos cuentan con garantía de fábrica de 2 años para uso exterior y 3 años para uso interior. Además, ofrecemos planes de mantenimiento preventivo para maximizar la vida útil de tu inversión.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className="py-24 lg:py-32"
      style={{ backgroundColor: "#060D1A" }}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "#00B8D4" }}
          >
            Respuestas rápidas
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black text-4xl lg:text-6xl text-white"
          >
            LO QUE NOS{" "}
            <span className="text-gradient-brand">PREGUNTAN</span>
          </motion.h2>
        </div>

        {/* FAQ items */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "#0C1828",
                  border: `1px solid ${open === i ? "rgba(0,184,212,0.4)" : "rgba(30, 52, 88, 0.6)"}`,
                  transition: "border-color 0.3s ease",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-item-${i}`}
                >
                  <span
                    className="font-body font-semibold text-base pr-4"
                    style={{ color: open === i ? "#00B8D4" : "white" }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: open === i
                        ? "rgba(0,184,212,0.15)"
                        : "rgba(255,255,255,0.06)",
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={open === i ? "#00B8D4" : "rgba(255,255,255,0.5)"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p
                        className="font-body text-sm leading-relaxed px-6 pb-6"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p
            className="font-body text-sm mb-4"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            ¿No encontrás lo que buscás?
          </p>
          <a
            href={`https://wa.me/5491136178343?text=${encodeURIComponent("Hola, tengo una consulta sobre pantallas LED.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm transition-colors hover:opacity-80"
            style={{ color: "#00B8D4" }}
          >
            Consultanos por WhatsApp
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
