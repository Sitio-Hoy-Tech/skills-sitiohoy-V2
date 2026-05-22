import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SitioHoyBranding } from "./SitioHoyBranding";

export function Footer({ brandName }: { brandName: string }) {
  const year = new Date().getFullYear();
  const waLink = buildWhatsAppLink();

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 mt-24">
      {/* CTA Footer */}
      <div className="relative overflow-hidden bg-neutral-900 py-20 border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary/70 mb-4">
            ¿Listo para brillar?
          </p>
          <h2 className="font-display text-5xl lg:text-7xl font-black uppercase text-neutral-50 mb-6 leading-none">
            Hacé que tu negocio
            <span className="block led-text-cyan animate-led-pulse">
              brille de noche
            </span>
          </h2>
          <p className="font-body text-neutral-400 mb-10 max-w-xl mx-auto">
            Contactanos por WhatsApp y recibí una cotización sin cargo en menos de 24hs.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-4 font-display font-bold text-xl uppercase tracking-widest rounded hover:bg-[#20B055] transition-colors active:scale-95 duration-200"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar ahora
          </a>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-display text-2xl font-bold uppercase tracking-widest text-neutral-50 mb-3">
              {brandName}
            </p>
            <p className="font-body text-sm text-neutral-400 max-w-xs leading-relaxed">
              Especialistas en pantallas LED para publicidad y señalización. Instalación profesional en Baradero y toda la región.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Páginas
            </p>
            <ul className="space-y-2">
              {[
                { href: "/servicios", label: "Servicios" },
                { href: "/catalogo", label: "Catálogo" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/contacto", label: "Contacto" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-neutral-400 hover:text-brand-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Contacto
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-neutral-400 hover:text-brand-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                  WhatsApp
                </a>
              </li>
              <li>
                {/* Cliente: revisar/reemplazar con email real */}
                <a
                  href="mailto:info@ledsbaradero.com"
                  className="font-body text-sm text-neutral-400 hover:text-brand-primary transition-colors"
                >
                  info@ledsbaradero.com
                </a>
              </li>
              <li>
                {/* Cliente: revisar/reemplazar con dirección real */}
                <p className="font-body text-sm text-neutral-400">
                  Baradero, Buenos Aires
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-neutral-600">
            © {year} {brandName}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-led-pulse" />
            <p className="font-body text-xs text-neutral-600">Online 24/7</p>
          </div>
        </div>
      </div>

      <SitioHoyBranding />
    </footer>
  );
}
