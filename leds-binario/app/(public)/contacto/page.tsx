"use client";

import { useState } from "react";
import { FadeUpOnScroll } from "@/components/ui/Animations";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const waLink = `https://wa.me/3329746323?text=${encodeURIComponent("Hola, quiero consultar sobre pantallas LED")}`;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 text-center">
        <FadeUpOnScroll>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
            Hablemos
          </p>
          <h1 className="font-display text-5xl lg:text-7xl font-black uppercase text-neutral-50 mb-4 leading-none">
            Contacto
          </h1>
          <p className="font-body text-neutral-400 max-w-xl mx-auto">
            Completá el formulario o escribinos directamente por WhatsApp. Respondemos en menos de 24hs.
          </p>
        </FadeUpOnScroll>
      </section>

      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <FadeUpOnScroll className="lg:col-span-2">
              <div className="space-y-8">
                {/* WhatsApp */}
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
                    Canal rápido
                  </p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-neutral-100 group-hover:text-[#25D366] transition-colors">WhatsApp</p>
                      <p className="font-body text-sm text-neutral-500">+54 3329 746323</p>
                    </div>
                  </a>
                </div>

                {/* Email */}
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
                    Email
                  </p>
                  {/* Cliente: revisar/reemplazar con email real */}
                  <a
                    href="mailto:info@ledsbaradero.com"
                    className="font-body text-neutral-300 hover:text-brand-primary transition-colors"
                  >
                    info@ledsbaradero.com
                  </a>
                </div>

                {/* Ubicación */}
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
                    Ubicación
                  </p>
                  {/* Cliente: revisar/reemplazar con dirección real */}
                  <p className="font-body text-neutral-300">
                    Baradero, Buenos Aires<br />
                    Argentina
                  </p>
                </div>

                {/* Horario */}
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
                    Horario de atención
                  </p>
                  {/* Cliente: revisar/reemplazar con horario real */}
                  <p className="font-body text-neutral-300 text-sm">
                    Lunes a Viernes: 9:00 — 18:00<br />
                    Sábados: 9:00 — 13:00
                  </p>
                </div>
              </div>
            </FadeUpOnScroll>

            {/* Form */}
            <FadeUpOnScroll delay={0.15} className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 p-8 rounded-lg border border-neutral-800 bg-neutral-900/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block font-body text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Nombre *
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-4 py-3 font-body text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-body text-xs uppercase tracking-wider text-neutral-500 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-4 py-3 font-body text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block font-body text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded px-4 py-3 font-body text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                    placeholder="+54 9 3329 000000"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded px-4 py-3 font-body text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 resize-none"
                    placeholder="Contanos sobre tu proyecto: tipo de pantalla, dimensiones, lugar de instalación..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-brand-primary text-neutral-900 px-8 py-4 rounded font-display font-bold text-base uppercase tracking-widest hover:bg-brand-primary/80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {status === "loading" ? "Enviando..." : "Enviar consulta"}
                </button>

                {status === "ok" && (
                  <p className="text-center font-body text-sm text-brand-green">
                    ✓ Mensaje enviado. Te respondemos en breve.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-center font-body text-sm text-red-400">
                    Hubo un error. Por favor escribinos por{" "}
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a>.
                  </p>
                )}
              </form>
            </FadeUpOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
}
