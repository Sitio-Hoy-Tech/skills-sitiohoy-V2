/**
 * Sistema de imágenes placeholder con LoremFlickr
 * Imágenes del rubro por keyword — determinístico por lock.
 */

const RUBRO_KEYWORDS: Record<string, string> = {
  led: "led,screen",
  "pantalla-led": "led,display",
  "pantallas-led": "led,billboard",
  "cartel-led": "led,sign",
  "display-led": "led,screen",
  "pantalla-exterior": "outdoor,led",
  "pantalla-interior": "indoor,led",
  publicidad: "advertising,led",
  letrero: "neon,sign",
  "letra-led": "led,letter",
  "rotulo-led": "led,signage",
  tecnologia: "technology,gadget",
  electronica: "electronics,led",
};

function deriveKeyword(nameOrRubro: string): string {
  const clean = nameOrRubro
    .toLowerCase()
    .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u").replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/g, "").trim();

  if (RUBRO_KEYWORDS[clean]) return RUBRO_KEYWORDS[clean];

  const firstWord = clean.split(/\s+/)[0];
  if (RUBRO_KEYWORDS[firstWord]) return RUBRO_KEYWORDS[firstWord];

  for (const [key, val] of Object.entries(RUBRO_KEYWORDS)) {
    if (clean.includes(key)) return val;
  }

  return clean.split(/\s+/).filter((w) => w.length >= 3).slice(0, 2).join(",") || "led,screen";
}

function deterministicLock(seed: string): number {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return (hash % 50) + 1;
}

export function getFlickrImage(keyword: string, width = 800, height = 600, lock?: number): string {
  const kw = deriveKeyword(keyword);
  const lockNum = lock ?? deterministicLock(keyword);
  return `https://loremflickr.com/${width}/${height}/${kw}?lock=${lockNum}`;
}

export function getProductImage(
  product: { name: string; product_images?: { url: string; alt?: string | null }[] },
  width = 800,
  height = 600
): string {
  if (product.product_images?.[0]?.url) {
    return product.product_images[0].url;
  }
  return getFlickrImage(product.name, width, height);
}

export function getSectionImage(keyword: string, width = 1200, height = 800, lock?: number): string {
  return getFlickrImage(keyword, width, height, lock);
}

export function getProductImageByRubro(rubro: string, index: number, width = 800, height = 600): string {
  const kw = deriveKeyword(rubro);
  return `https://loremflickr.com/${width}/${height}/${kw}?lock=${(index % 20) + 1}`;
}

/** @deprecated Usar getFlickrImage() */
export function getPlaceholderImage(seed: string, width = 800, height = 600): string {
  return getFlickrImage(seed, width, height);
}
