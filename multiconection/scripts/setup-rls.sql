-- ============================================================
-- RLS Policies — Multi Conection (Plan Esencial)
-- Run AFTER the main schema is applied.
-- No tenant creation block — run tenant INSERT separately.
-- ============================================================

-- ── Enable RLS ───────────────────────────────────────────────
ALTER TABLE tenants         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ── Helper: current tenant from JWT claim ────────────────────
-- Public pages use service_role (admin client) so RLS is bypassed
-- for server-side reads. These policies protect direct anon access.

-- ── tenants ──────────────────────────────────────────────────
CREATE POLICY "tenants_public_read"
  ON tenants FOR SELECT
  USING (true);

-- ── categories ───────────────────────────────────────────────
CREATE POLICY "categories_public_read"
  ON categories FOR SELECT
  USING (active = true);

CREATE POLICY "categories_service_all"
  ON categories FOR ALL
  USING (auth.role() = 'service_role');

-- ── products ─────────────────────────────────────────────────
CREATE POLICY "products_public_read"
  ON products FOR SELECT
  USING (active = true);

CREATE POLICY "products_service_all"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- ── product_images ───────────────────────────────────────────
CREATE POLICY "product_images_public_read"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "product_images_service_all"
  ON product_images FOR ALL
  USING (auth.role() = 'service_role');

-- ── product_variants ─────────────────────────────────────────
CREATE POLICY "product_variants_public_read"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "product_variants_service_all"
  ON product_variants FOR ALL
  USING (auth.role() = 'service_role');

-- ── contact_messages ─────────────────────────────────────────
-- Anyone can INSERT (form submissions). Only service_role can read.
CREATE POLICY "contact_messages_public_insert"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contact_messages_service_read"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "contact_messages_service_all"
  ON contact_messages FOR ALL
  USING (auth.role() = 'service_role');
