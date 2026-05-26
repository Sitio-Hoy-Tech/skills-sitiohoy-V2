import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";
import { TAGS } from "@/lib/cache-tags";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { CatalogGrid } from "@/components/ui/CatalogGrid";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo — Multi Conection",
  description:
    "Explorá nuestro catálogo completo de pantallas LED: fijas, rental, mallas, flexibles y accesorios. Consultá por el producto que necesitás.",
};

const getProducts = unstable_cache(
  async () => {
    try {
      const tenantId = getTenantId();
      const supabaseAdmin = createAdminClient();
      const { data, error } = await supabaseAdmin
        .from("products")
        .select(
          "id, name, slug, price, compare_at_price, description, featured, category_id, product_images (id, url, alt, position)"
        )
        .eq("tenant_id", tenantId)
        .eq("active", true)
        .order("position", { ascending: true, nullsFirst: false })
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
        .select("id, name, slug, position, subcategories (id, name, slug, position)")
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


export default async function CatalogPage() {
  let products: typeof MOCK_PRODUCTS = [];
  let categories: typeof MOCK_CATEGORIES = [];

  try {
    const [dbProducts, dbCategories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    if (dbProducts.length > 0 && dbCategories.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products = dbProducts as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories = dbCategories as any;
    }
  } catch {
    // use mock
  }

  const useRealData = products.length > 0 && categories.length > 0;
  const displayProducts = useRealData ? products : MOCK_PRODUCTS;
  const displayCategories = useRealData ? categories : MOCK_CATEGORIES;

  const waLink = buildWhatsAppLink({
    message: "Hola, quiero consultar sobre el catálogo de pantallas LED.",
  });

  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{ backgroundColor: "#060D1A" }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,184,212,0.8) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <p
            className="font-body text-xs font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "#00B8D4" }}
          >
            Nuestros productos
          </p>
          <h1 className="font-display font-black text-5xl lg:text-8xl text-white leading-[0.92] tracking-tight mb-4">
            CATÁLOGO
            <br />
            <span className="text-gradient-brand">LED</span>
          </h1>
          <p
            className="font-body text-base leading-relaxed max-w-xl"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {displayProducts.length} productos disponibles. Consultá por cualquiera
            y te asesoramos sin compromiso.
          </p>
        </div>
      </section>

      {/* CATALOG GRID (client component for filtering) */}
      <CatalogGrid
        products={displayProducts}
        categories={displayCategories}
        waLink={waLink}
      />
    </>
  );
}
