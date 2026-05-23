import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";
import { TAGS } from "@/lib/cache-tags";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { FadeUpOnScroll, ScalePopOnScroll } from "@/components/ui/Animations";
import Link from "next/link";

const getProducts = unstable_cache(
  async () => {
    try {
      const tenantId = getTenantId();
      const supabaseAdmin = createAdminClient();

      const { data, error } = await supabaseAdmin
        .from("products")
        .select(`
          id, name, slug, price, compare_at_price, description, featured,
          category_id,
          product_images (id, url, alt, position)
        `)
        .eq("tenant_id", tenantId)
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) console.error("[catalog] products error:", error.message);
      return data ?? [];
    } catch (e) {
      console.error("[catalog] products exception:", e);
      return [];
    }
  },
  ["catalog-products"],
  { tags: [TAGS.PRODUCTS] }
);

const getCategories = unstable_cache(
  async () => {
    try {
      const tenantId = getTenantId();
      const supabaseAdmin = createAdminClient();

      const { data, error } = await supabaseAdmin
        .from("categories")
        .select(`id, name, slug, position, subcategories (id, name, slug, position)`)
        .eq("tenant_id", tenantId)
        .eq("active", true)
        .order("position");

      if (error) console.error("[catalog] categories error:", error.message);
      return data ?? [];
    } catch (e) {
      console.error("[catalog] categories exception:", e);
      return [];
    }
  },
  ["catalog-categories"],
  { tags: [TAGS.CATEGORIES] }
);


function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 text-center border-b border-neutral-800">
        <FadeUpOnScroll>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
            Todos nuestros productos
          </p>
          <h1 className="font-display text-5xl lg:text-7xl font-black uppercase text-neutral-50 leading-none">
            Catálogo LED
          </h1>
        </FadeUpOnScroll>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Filtros por categoría */}
        <FadeUpOnScroll className="mb-10">
          <div className="flex flex-wrap gap-2">
            <button className="font-body text-sm px-4 py-2 rounded border border-brand-primary bg-brand-primary/10 text-brand-primary">
              Todos
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                className="font-body text-sm px-4 py-2 rounded border border-neutral-700 text-neutral-400 hover:border-brand-primary/40 hover:text-neutral-200 transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </FadeUpOnScroll>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product: any, i: number) => {
            const img = product.product_images?.[0]?.url || `https://loremflickr.com/800/600/led,screen?lock=${i + 1}`;
            const waLink = buildWhatsAppLink({ productName: product.name });

            return (
              <ScalePopOnScroll key={product.id} delay={i * 0.04}>
                <div className="group border border-neutral-800 rounded-lg overflow-hidden hover:border-brand-primary/30 transition-all duration-300 flex flex-col h-full bg-neutral-900/50">
                  {/* Imagen */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={img}
                      alt={product.product_images?.[0]?.alt || product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.featured && (
                      <span className="absolute top-3 left-3 bg-brand-primary text-neutral-900 text-xs font-display font-bold uppercase px-2 py-1 rounded tracking-wider">
                        Destacado
                      </span>
                    )}
                    {product.compare_at_price && (
                      <span className="absolute top-3 right-3 bg-brand-secondary text-white text-xs font-body font-bold px-2 py-1 rounded">
                        Oferta
                      </span>
                    )}
                    {/* Overlay LED */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-brand-primary text-neutral-900 px-4 py-2 rounded font-display font-bold text-xs uppercase tracking-wider hover:bg-brand-primary/80 transition-colors"
                      >
                        Consultar
                      </a>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/producto/${product.slug}`}>
                      <h3 className="font-display font-bold text-base uppercase tracking-wide text-neutral-100 hover:text-brand-primary transition-colors mb-2 leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    {product.description && (
                      <p className="font-body text-xs text-neutral-500 leading-relaxed mb-3 line-clamp-2 flex-1">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="font-display font-bold text-lg led-text-cyan">
                          {formatPrice(product.price)}
                        </p>
                        {product.compare_at_price && (
                          <p className="font-body text-xs text-neutral-600 line-through">
                            {formatPrice(product.compare_at_price)}
                          </p>
                        )}
                      </div>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-brand-primary font-body text-xs hover:underline"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Pedir precio
                      </a>
                    </div>
                  </div>
                </div>
              </ScalePopOnScroll>
            );
          })}
        </div>
      </div>
    </div>
  );
}
