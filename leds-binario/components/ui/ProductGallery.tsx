"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProductImage {
  id?: string;
  url: string;
  alt?: string | null;
  position?: number;
}

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx];

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral-800 bg-neutral-800/30">
        <AnimatePresence mode="wait">
          <motion.img
            key={active.url}
            src={active.url}
            alt={active.alt || productName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Borde LED */}
        <div className="absolute inset-0 rounded-lg border border-brand-primary/20 pointer-events-none" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActiveIdx(i)}
              className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all duration-200 ${
                i === activeIdx
                  ? "border-brand-primary shadow-md shadow-brand-primary/20"
                  : "border-neutral-700 hover:border-neutral-500"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `${productName} - imagen ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
