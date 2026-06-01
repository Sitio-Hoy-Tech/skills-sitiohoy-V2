"use client";

import { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { trackEvent } from "@/lib/analytics/umami";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const waLink = buildWhatsAppLink({
    message: "Hola, quiero consultar sobre pantallas LED.",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", phone: "", message: "" });
        trackEvent("contact_form_submit");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

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
              Estamos para ayudarte
            </p>
            <h1 className="font-display font-black text-5xl lg:text-8xl text-white leading-[0.92] tracking-tight mb-4">
              CONTACTO
            </h1>
            <p
              className="font-body text-base leading-relaxed max-w-xl"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Consultanos por WhatsApp o dejanos tu mensaje y te respondemos
              a la brevedad.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 pb-28" style={{ backgroundColor: "#060D1A" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Contact info */}
            <ScrollReveal>
              <div className="flex flex-col gap-8">

                {/* WhatsApp CTA — primary */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { source: "contact" })}
                  className="flex items-center gap-5 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                  style={{
                    backgroundColor: "#0C1828",
                    border: "1px solid rgba(37,211,102,0.3)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "rgba(37,211,102,0.15)" }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-bold text-xl text-white mb-1">
                      WhatsApp (respuesta inmediata)
                    </p>
                    <p
                      className="font-body text-sm"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      Escribinos ahora y te respondemos al instante.
                    </p>
                  </div>
                  <svg
                    className="ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>

                {/* Info cards */}
                {[
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B8D4" strokeWidth="1.8">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    label: "Ubicación",
                    value: "Capital Federal - Buenos Aires",
                    sub: "",
                  },
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B8D4" strokeWidth="1.8">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 13.5 19.79 19.79 0 01.02 4.82 2 2 0 012 2.67h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.02z" />
                      </svg>
                    ),
                    label: "Teléfono",
                    value: "+54 11 3617-8343",
                    sub: "Lunes a sábados, 9–19hs",
                  },
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B8D4" strokeWidth="1.8">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    label: "Email",
                    value: "info@multiconection.com.ar",
                    sub: "Respondemos en menos de 24hs",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-5 p-6 rounded-2xl"
                    style={{
                      backgroundColor: "#0C1828",
                      border: "1px solid rgba(30,52,88,0.5)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(0,184,212,0.1)" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="font-body text-xs font-semibold uppercase tracking-wider mb-1"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {item.label}
                      </p>
                      <p className="font-body font-semibold text-white">{item.value}</p>
                      <p
                        className="font-body text-sm mt-0.5"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {item.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Contact form */}
            <ScrollReveal delay={0.15}>
              <div
                className="p-8 rounded-2xl"
                style={{
                  backgroundColor: "#0C1828",
                  border: "1px solid rgba(30,52,88,0.5)",
                }}
              >
                <h2 className="font-display font-bold text-2xl text-white mb-6">
                  Envianos un mensaje
                </h2>

                {status === "ok" ? (
                  <div
                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(0,184,212,0.1)" }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8D4" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="font-display font-bold text-xl text-white">
                      ¡Mensaje enviado!
                    </p>
                    <p
                      className="font-body text-sm"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      Te respondemos a la brevedad. También podés escribirnos por WhatsApp.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-2 font-body text-sm underline underline-offset-4"
                      style={{ color: "#00B8D4" }}
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label
                          className="font-body text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          Nombre *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Tu nombre"
                          className="px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-[#00B8D4]"
                          style={{
                            backgroundColor: "rgba(20,34,64,0.6)",
                            border: "1px solid rgba(30,52,88,0.8)",
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          className="font-body text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="tu@email.com"
                          className="px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-[#00B8D4]"
                          style={{
                            backgroundColor: "rgba(20,34,64,0.6)",
                            border: "1px solid rgba(30,52,88,0.8)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        className="font-body text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+54 11 xxxx-xxxx"
                        className="px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-[#00B8D4]"
                        style={{
                          backgroundColor: "rgba(20,34,64,0.6)",
                          border: "1px solid rgba(30,52,88,0.8)",
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        className="font-body text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Mensaje *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Contanos sobre tu proyecto de pantallas LED..."
                        className="px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-[#00B8D4] resize-none"
                        style={{
                          backgroundColor: "rgba(20,34,64,0.6)",
                          border: "1px solid rgba(30,52,88,0.8)",
                        }}
                      />
                    </div>

                    {status === "error" && (
                      <p
                        className="font-body text-sm"
                        style={{ color: "#D91B8A" }}
                      >
                        Hubo un error al enviar. Intentá por WhatsApp.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-4 rounded-full font-body font-bold text-base text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "#00B8D4",
                        boxShadow: "0 0 30px rgba(0,184,212,0.25)",
                      }}
                    >
                      {status === "sending" ? "Enviando..." : "Enviar mensaje"}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
