"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics/umami";

interface ProductImage {
  url: string;
  alt?: string | null;
  position: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  product_images?: ProductImage[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CatalogGridProps {
  products: Product[];
  categories: Category[];
  waLink: string;
}

function ProductCarousel({
  images,
  productName,
  productId,
}: {
  images: ProductImage[];
  productName: string;
  productId: string;
}) {
  const [index, setIndex] = useState(0);

  const sorted = [...images].sort((a, b) => a.position - b.position);
  const hasMultiple = sorted.length > 1;

  const fallbackUrl = `https://loremflickr.com/800/600/led,screen?lock=${
    productId.charCodeAt(productId.length - 1) % 20 + 1
  }`;
  const current = sorted[index] ?? { url: fallbackUrl, alt: productName };

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + sorted.length) % sorted.length);
  }

  function next(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % sorted.length);
  }

  return (
    <div className="relative aspect-[4/5] overflow-hidden shrink-0 group/carousel">
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={index}
          src={current.url}
          alt={current.alt ?? productName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.85) saturate(1.1)" }}
        />
      </AnimatePresence>

      {hasMultiple && (
        <>
          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            aria-label="Imagen anterior"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            aria-label="Imagen siguiente"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Counter */}
          <div
            className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full font-body text-xs text-white"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            {index + 1}/{sorted.length}
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: i === index ? "white" : "rgba(255,255,255,0.4)",
                  transform: i === index ? "scale(1.4)" : "scale(1)",
                }}
                aria-label={`Imagen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CatalogGrid({ products, categories, waLink }: CatalogGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_id === activeCategory);

  function buildProductWaLink(productName: string): string {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491136178343";
    const text = `Hola, quiero consultar sobre: *${productName}*`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }

  return (
    <section className="pb-24" style={{ backgroundColor: "#060D1A" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className="px-5 py-2 rounded-full font-body font-semibold text-sm transition-all duration-200"
            style={{
              backgroundColor: activeCategory === "all" ? "#00B8D4" : "rgba(20,34,64,0.8)",
              color: activeCategory === "all" ? "white" : "rgba(255,255,255,0.6)",
              border: `1px solid ${activeCategory === "all" ? "#00B8D4" : "rgba(30,52,88,0.6)"}`,
            }}
          >
            Todos ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  trackEvent("category_click", { category: cat.slug });
                }}
                className="px-5 py-2 rounded-full font-body font-semibold text-sm transition-all duration-200"
                style={{
                  backgroundColor: active ? "#00B8D4" : "rgba(20,34,64,0.8)",
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  border: `1px solid ${active ? "#00B8D4" : "rgba(30,52,88,0.6)"}`,
                }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => {
              const images = product.product_images ?? [];
              const productWaLink = buildProductWaLink(product.name);

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl overflow-hidden card-led-hover group flex flex-col"
                  style={{ backgroundColor: "#0C1828" }}
                >
                  {/* Carousel */}
                  <ProductCarousel
                    images={images}
                    productName={product.name}
                    productId={product.id}
                  />

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {product.category_id && (
                      <span
                        className="inline-block font-body text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1 rounded-full self-start"
                        style={{
                          backgroundColor: "rgba(0,184,212,0.1)",
                          color: "#00B8D4",
                          border: "1px solid rgba(0,184,212,0.2)",
                        }}
                      >
                        {categories.find((c) => c.id === product.category_id)?.name ?? "LED"}
                      </span>
                    )}

                    <h3 className="font-display font-bold text-xl text-white mb-3">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p
                        className="font-body text-sm leading-relaxed mb-5 flex-1"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {product.description}
                      </p>
                    )}

                    <a
                      href={productWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("whatsapp_click", {
                          source: "catalog",
                          product: product.slug,
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full font-body font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg mt-auto"
                      style={{
                        backgroundColor: "#00B8D4",
                        boxShadow: "0 0 20px rgba(0,184,212,0.2)",
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Más información
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-base" style={{ color: "rgba(255,255,255,0.4)" }}>
              No hay productos en esta categoría.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div
          className="mt-16 p-8 rounded-2xl text-center"
          style={{
            backgroundColor: "#0C1828",
            border: "1px solid rgba(0,184,212,0.2)",
          }}
        >
          <p className="font-display font-bold text-2xl text-white mb-2">
            ¿No encontrás lo que buscás?
          </p>
          <p className="font-body text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            Desarrollamos soluciones a medida. Consultanos y armamos
            tu pantalla con las especificaciones exactas que necesitás.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-base text-white transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#D91B8A" }}
          >
            Consultar solución personalizada
          </a>
        </div>
      </div>
    </section>
  );
}
