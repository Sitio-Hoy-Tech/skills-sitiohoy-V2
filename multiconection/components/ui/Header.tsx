"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Trabajos", href: "/trabajos" },
  { label: "Contacto", href: "/contacto" },
];

export function Header({ waLink }: { waLink: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Cierra el menú si se navega a otra página
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const solidBg = !isHome || scrolled;

  // El overlay se renderiza via portal en document.body para evitar que el
  // backdrop-filter del header cree un nuevo containing block que confine
  // el position:fixed del overlay al header en lugar de al viewport.
  const overlay = (
    <div
      className="fixed inset-0 z-30 lg:hidden flex flex-col"
      style={{ backgroundColor: "#060D1A" }}
    >
      {/* Nav links — empiezan debajo del header (h-16 = 64px) */}
      <nav className="flex flex-col flex-1 overflow-y-auto px-6 pt-20">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between font-body font-semibold text-lg py-5 border-b transition-colors duration-200"
              style={{
                color: active ? "#00B8D4" : "rgba(255,255,255,0.85)",
                borderColor: "rgba(30,52,88,0.4)",
              }}
            >
              {link.label}
              {active && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#00B8D4" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* WhatsApp CTA */}
      <div
        className="px-6 py-8 shrink-0"
        style={{ borderTop: "1px solid rgba(30,52,88,0.4)" }}
      >
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-body font-semibold text-base text-white active:scale-95 transition-transform duration-150"
          style={{ backgroundColor: "#00B8D4" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          backgroundColor: solidBg ? "rgba(6, 13, 26, 0.95)" : "transparent",
          backdropFilter: solidBg ? "blur(12px)" : "none",
          borderBottom: solidBg ? "1px solid rgba(30, 52, 88, 0.6)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo1.png"
              alt="Multi Conection"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm font-medium transition-colors duration-200"
                  style={{ color: active ? "#00B8D4" : "rgba(255,255,255,0.75)" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "#00B8D4" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar
            </a>
          </div>

          {/* Hamburger — z-40 propio para estar sobre el overlay (z-30) */}
          <button
            className="lg:hidden relative z-40 flex flex-col justify-center gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span
              className="block w-6 h-0.5 bg-white transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "rotate(45deg) translate(0, 8px)" : "" }}
            />
            <span
              className="block w-6 h-0.5 bg-white transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 bg-white transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "rotate(-45deg) translate(0, -8px)" : "" }}
            />
          </button>
        </div>
      </header>

      {/* Portal: se renderiza en document.body, fuera del header y su backdrop-filter */}
      {mounted && menuOpen && createPortal(overlay, document.body)}
    </>
  );
}
