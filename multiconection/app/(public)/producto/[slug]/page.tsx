import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { TAGS } from "@/lib/cache-tags";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-catalog";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import type { Metadata } from "next";

function getProduct(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const tenantId = getTenantId();
        const supabaseAdmin = createAdminClient();
        const { data } = await supabaseAdmin
          .from("products")
          .select(
            "id, name, slug, price, compare_at_price, description, featured, category_id, product_images (id, url, alt, position), product_variants (id, name, sku, price, price_modifier, stock)"
          )
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return {
    title: `${mockProduct?.name ?? "Producto"} — Multi Conection`,
    description:
      mockProduct?.description ??
      "Consultá especificaciones y precio por WhatsApp.",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product = await getProduct(slug);

  // Fallback to mock
  if (!product) {
    const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!mockProduct) notFound();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product = { ...mockProduct, product_variants: [] } as any;
  }

  if (!product) notFound();

  const imgUrl =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (product as any).product_images?.[0]?.url ??
    `https://loremflickr.com/800/600/led,screen?lock=10`;

  const categoryName =
    MOCK_CATEGORIES.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c) => c.id === (product as any).category_id
    )?.name ?? "LED";

  const waLink = buildWhatsAppLink({
    productName: product.name,
    productUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/producto/${slug}`,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images = (product as any).product_images ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants = (product as any).product_variants ?? [];

  return (
    <>
      <section
        className="pt-28 pb-24"
        style={{ backgroundColor: "#060D1A" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-10">
            <Link
              href="/catalogo"
              className="font-body text-sm transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Catálogo
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
            <span className="font-body text-sm text-white/70 truncate">
              {product.name}
            </span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <ScrollReveal>
              <div className="flex flex-col gap-4">
                <div
                  className="aspect-[4/3] rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(30,52,88,0.5)" }}
                >
                  <img
                    src={imgUrl}
                    alt={images[0]?.alt ?? product.name}
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.9) saturate(1.1)" }}
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.slice(1, 5).map(
                      (img: { url: string; alt?: string | null; id: string }) => (
                        <div
                          key={img.id}
                          className="aspect-square rounded-xl overflow-hidden"
                          style={{ border: "1px solid rgba(30,52,88,0.4)" }}
                        >
                          <img
                            src={img.url}
                            alt={img.alt ?? product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Info */}
            <ScrollReveal delay={0.15}>
              <span
                className="inline-block font-body text-xs font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(0,184,212,0.1)",
                  color: "#00B8D4",
                  border: "1px solid rgba(0,184,212,0.2)",
                }}
              >
                {categoryName}
              </span>

              <h1 className="font-display font-black text-4xl lg:text-5xl text-white leading-[0.95] mb-6">
                {product.name}
              </h1>

              <p
                className="font-body text-base leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {product.description ??
                  "Pantalla LED de alta calidad. Consultanos por especificaciones técnicas, dimensiones disponibles y precios."}
              </p>

              {/* Variants display */}
              {variants.length > 0 && (
                <div className="mb-8">
                  <p
                    className="font-body text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Variantes disponibles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map(
                      (v: { id: string; name: string }) => (
                        <span
                          key={v.id}
                          className="px-4 py-2 rounded-full font-body text-sm"
                          style={{
                            backgroundColor: "rgba(20,34,64,0.8)",
                            color: "rgba(255,255,255,0.7)",
                            border: "1px solid rgba(30,52,88,0.6)",
                          }}
                        >
                          {v.name}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col gap-4">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 py-4 rounded-full font-body font-bold text-base text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  style={{
                    backgroundColor: "#00B8D4",
                    boxShadow: "0 0 30px rgba(0,184,212,0.3)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Más información por WhatsApp
                </a>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center gap-2 py-3 rounded-full font-body font-semibold text-sm text-white transition-all duration-300 hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  ← Ver todo el catálogo
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
