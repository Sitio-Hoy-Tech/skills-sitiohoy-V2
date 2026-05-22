import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { TAGS } from "@/lib/cache-tags";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { FadeUpOnScroll } from "@/components/ui/Animations";
import Link from "next/link";
import { ProductGallery } from "@/components/ui/ProductGallery";

function getProduct(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const tenantId = getTenantId();
        const supabaseAdmin = createAdminClient();

        const { data } = await supabaseAdmin
          .from("products")
          .select(`
            id, name, slug, price, compare_at_price, description, featured,
            category_id,
            product_images (id, url, alt, position),
            product_variants (id, name, sku, price, price_modifier, stock)
          `)
          .eq("tenant_id", tenantId)
          .eq("slug", slug)
          .eq("active", true)
          .single();

        return data ?? null;
      } catch {
        return null;
      }
    },
    [`product-${slug}`],
    { tags: [TAGS.PRODUCTS, TAGS.PRODUCT(slug)] }
  )();
}

// Mock product para preview
const MOCK_PRODUCT = {
  id: "mock-preview",
  name: "Pantalla LED Exterior P6",
  slug: "pantalla-led-exterior-p6",
  price: 450000,
  compare_at_price: 520000,
  description: "Pantalla LED exterior de alta luminosidad con pitch P6. Certificación IP65 para uso exterior permanente. Resolución full color, brillo 5000 nits que garantiza perfecta visibilidad bajo el sol directo. Incluye controlador, cable de datos y software de gestión con app móvil.\n\nIdeal para fachadas de locales comerciales, estaciones de servicio, farmacias, concesionarias y cualquier negocio que necesite visibilidad nocturna y diurna.",
  featured: true,
  category_id: "mock-cat-1",
  product_images: [
    { id: "img-1", url: "https://loremflickr.com/900/700/led,outdoor,billboard?lock=1", alt: "Vista frontal", position: 0 },
    { id: "img-2", url: "https://loremflickr.com/900/700/led,sign,night?lock=2", alt: "Funcionando de noche", position: 1 },
    { id: "img-3", url: "https://loremflickr.com/900/700/led,detail,screen?lock=3", alt: "Detalle de módulos", position: 2 },
  ],
  product_variants: [
    { id: "var-1", name: '0.5m² (50x100cm)', sku: 'LED-P6-050', price: 220000, price_modifier: 0, stock: 5 },
    { id: "var-2", name: '1m² (100x100cm)', sku: 'LED-P6-100', price: 380000, price_modifier: 0, stock: 3 },
    { id: "var-3", name: '2m² (100x200cm)', sku: 'LED-P6-200', price: 680000, price_modifier: 0, stock: 2 },
    { id: "var-4", name: 'Medida personalizada', sku: 'LED-P6-CUSTOM', price: null as any, price_modifier: 0, stock: 99 },
  ],
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: any = await getProduct(slug);

  // Si no hay producto en DB, usar mock para preview
  if (!product) {
    if (slug === MOCK_PRODUCT.slug) {
      product = MOCK_PRODUCT;
    } else {
      notFound();
    }
  }

  const waLink = buildWhatsAppLink({
    productName: product.name,
    productUrl: `https://ledsbaradero.com/producto/${product.slug}`,
  });

  const images = product.product_images?.length > 0
    ? product.product_images
    : [{ url: `https://loremflickr.com/900/700/led,screen?lock=${product.slug.length}`, alt: product.name, position: 0 }];

  const sortedImages = [...images].sort((a: any, b: any) => a.position - b.position);

  return (
    <div className="pt-20 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-4">
        <nav className="flex items-center gap-2 font-body text-xs text-neutral-500">
          <Link href="/" className="hover:text-brand-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-brand-primary transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-neutral-300">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería */}
          <FadeUpOnScroll>
            <ProductGallery images={sortedImages} productName={product.name} />
          </FadeUpOnScroll>

          {/* Info del producto */}
          <FadeUpOnScroll delay={0.15}>
            <div>
              {product.featured && (
                <span className="inline-block bg-brand-primary text-neutral-900 text-xs font-display font-bold uppercase px-3 py-1 rounded tracking-wider mb-4">
                  Destacado
                </span>
              )}

              <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-neutral-50 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Precio */}
              <div className="flex items-center gap-4 mb-6">
                <p className="font-display text-3xl font-black led-text-cyan">
                  {formatPrice(product.price)}
                </p>
                {product.compare_at_price && (
                  <p className="font-body text-lg text-neutral-600 line-through">
                    {formatPrice(product.compare_at_price)}
                  </p>
                )}
              </div>

              {/* Descripción */}
              {product.description && (
                <div className="font-body text-sm text-neutral-400 leading-relaxed mb-8 whitespace-pre-line">
                  {product.description}
                </div>
              )}

              {/* Variantes (display only) */}
              {product.product_variants && product.product_variants.length > 0 && (
                <div className="mb-8">
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
                    Tamaños / Opciones
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.product_variants.map((variant: any) => (
                      <div
                        key={variant.id}
                        className="px-3 py-2 rounded border border-neutral-700 bg-neutral-800/50 text-center"
                      >
                        <p className="font-body text-sm text-neutral-200">{variant.name}</p>
                        {variant.price && (
                          <p className="font-display text-xs font-bold led-text-cyan mt-0.5">
                            {formatPrice(variant.price)}
                          </p>
                        )}
                        {!variant.price && (
                          <p className="font-body text-xs text-brand-primary mt-0.5">A consultar</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA WhatsApp */}
              <div className="space-y-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-5 rounded font-display font-bold text-lg uppercase tracking-widest hover:bg-[#20B055] active:scale-95 transition-all duration-200 shadow-lg shadow-[#25D366]/30"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Pedir cotización
                </a>
                <p className="font-body text-xs text-center text-neutral-600">
                  Respondemos en menos de 24hs · Instalación incluida
                </p>
              </div>

              {/* Garantía */}
              <div className="mt-8 p-4 rounded-lg border border-neutral-800 bg-neutral-800/30 flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="font-display font-bold text-sm uppercase tracking-wide text-neutral-200">
                    12 meses de garantía
                  </p>
                  <p className="font-body text-xs text-neutral-500">
                    Servicio técnico a domicilio incluido en toda la región.
                  </p>
                </div>
              </div>
            </div>
          </FadeUpOnScroll>
        </div>
      </div>
    </div>
  );
}
