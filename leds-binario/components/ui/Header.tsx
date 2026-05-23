"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";

export function Header({ brandName }: { brandName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showSolid = !isHome || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showSolid
            ? "bg-neutral-900/95 backdrop-blur-md border-b border-brand-primary/20 shadow-lg shadow-brand-primary/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded border border-brand-primary/60 flex items-center justify-center group-hover:border-brand-primary transition-colors duration-300">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-led-pulse" />
                </div>
              </div>
              <span className="font-display text-xl font-bold uppercase tracking-widest text-neutral-50 group-hover:led-text-cyan transition-all duration-300">
                {brandName}
              </span>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center gap-10">
              <NavLink href="/servicios">Servicios</NavLink>
              <NavLink href="/catalogo">Catálogo</NavLink>
              <NavLink href="/nosotros">Nosotros</NavLink>
              <NavLink href="/contacto">Contacto</NavLink>
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "3329746323"}?text=${encodeURIComponent("Hola, quiero consultar sobre pantallas LED")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-2 bg-brand-primary text-neutral-900 px-5 py-2 rounded text-sm font-display font-bold uppercase tracking-wider hover:bg-brand-primary/80 active:scale-95 transition-all duration-200"
              >
                Consultar
              </a>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-neutral-300 hover:text-brand-primary transition-colors"
                aria-label="Abrir menú"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-body text-sm text-neutral-300 hover:text-brand-primary transition-colors duration-200 relative group uppercase tracking-wider"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
