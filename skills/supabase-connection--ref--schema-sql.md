# Reference: Schema SQL completo (CREATE TABLE)

**Cuándo usar este archivo:** SOLO cuando se monta una nueva instancia de Supabase desde cero.

**No ejecutar** este SQL si la instancia de SitioHoy ya existe — las tablas ya están creadas.

Pegar todo el bloque en el **SQL Editor de Supabase** del proyecto nuevo.

```sql
-- =============================================
-- TENANTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  mp_access_token TEXT,
  mp_public_key TEXT,
  url TEXT UNIQUE,                        -- URL del sitio (reemplaza NEXT_PUBLIC_SITE_URL)
  resend_api_key TEXT,                    -- DEPRECADO: email ahora vía SMTP (ver smpt_user/smpt_pass)
  plan TEXT,                              -- 'esencial' | 'emprendimiento' | 'empresa'
  status TEXT DEFAULT 'active',
  max_products INTEGER DEFAULT 50,        -- 50 / 200 / NULL (ilimitado)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  umami_url TEXT,                         -- Script src de Umami (reemplaza NEXT_PUBLIC_UMAMI_SRC)
  umami_website_id TEXT,                  -- Website ID de Umami (reemplaza NEXT_PUBLIC_UMAMI_WEBSITE_ID)
  -- Contacto / WhatsApp (reemplazan variables de entorno)
  whatsapp TEXT,                          -- Número de WhatsApp (reemplaza NEXT_PUBLIC_WHATSAPP_NUMBER)
  contact_email TEXT,                     -- Destino del formulario de contacto (reemplaza CONTACT_EMAIL)
  -- Email SMTP del tenant (host/port/ssl van en platform_config). OJO: columnas con typo en la DB.
  smpt_user TEXT,                         -- Usuario SMTP (ej: contacto@sitiohoy.com.ar) — también define el "from"
  smpt_pass TEXT,                         -- Password SMTP
  -- ISR on-demand
  revalidation_secret TEXT,              -- Secret de /api/revalidate (reemplaza REVALIDATE_SECRET en prod)
  -- Suscripción
  subscription_id TEXT,
  subscription_status TEXT,
  current_period_end TIMESTAMPTZ,
  suspended_at TIMESTAMPTZ,
  -- Deploy
  vercel_project_id TEXT,
  -- Envia.com (Solo plan Empresa con envíos automáticos)
  envia_access_token TEXT,
  origin_name TEXT,
  origin_phone TEXT,
  origin_address TEXT,
  origin_city TEXT,
  origin_postal_code TEXT,
  origin_state TEXT,
  -- Correo Argentino (Solo plan Empresa con CA directo; credenciales de plataforma en platform_config)
  correo_argentino_customer_id TEXT,
  correo_argentino_token TEXT,
  correo_argentino_token_expires_at TIMESTAMPTZ
);

-- =============================================
-- USER TENANTS (membresía)
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT,                              -- 'owner' | 'admin' | 'editor'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  position INTEGER,
  active BOOLEAN
);

-- =============================================
-- SUBCATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  category_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  active BOOLEAN,
  position INTEGER
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  slug TEXT,
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  compare_at_price NUMERIC,
  is_sale BOOLEAN DEFAULT false,
  sale_price NUMERIC,
  is_service BOOLEAN NOT NULL DEFAULT false,
  -- Stock
  stock INTEGER CHECK (stock IS NULL OR stock >= 0),
  stock_unlimited BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  -- Envío / dimensiones (para cotización de envíos)
  weight_grams INTEGER DEFAULT 500,
  shipping_required BOOLEAN DEFAULT true,
  length_cm NUMERIC,
  width_cm NUMERIC,
  height_cm NUMERIC
);

-- =============================================
-- PRODUCT IMAGES (tabla separada, no array en products)
-- =============================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER,
  tenant_id UUID NOT NULL
);

-- =============================================
-- PRODUCT VARIANTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  stock INTEGER,
  price_modifier NUMERIC,
  tenant_id UUID NOT NULL,
  price NUMERIC
);

-- =============================================
-- SHIPPING ZONES (Emprendimiento siempre, Empresa cuando NO usa Envia.com)
-- =============================================
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,                     -- "CABA", "GBA", "Interior"
  description TEXT,
  price NUMERIC NOT NULL,                 -- Costo fijo del envío para esta zona
  position INTEGER,
  active BOOLEAN
);

-- =============================================
-- ORDERS (Emprendimiento y Empresa)
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  mp_payment_id TEXT,
  status TEXT CHECK (status IN ('pending', 'pending_payment', 'paid', 'payment_failed', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total NUMERIC,
  payer_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  currency TEXT DEFAULT 'ARS',
  payment_status TEXT,
  payment_provider TEXT DEFAULT 'mercadopago',
  external_reference TEXT,
  customer_first_name TEXT,
  customer_last_name TEXT,
  customer_phone TEXT,
  shipping_address JSONB,                 -- { street, city, state, postal_code, notes? }
  tracking_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  notes TEXT,
  -- Columnas de envío (rellenar según provider de envío)
  shipping_carrier TEXT,                  -- "OCA", "Andreani", "Correo Argentino", o nombre de zona
  shipping_service TEXT,                  -- "Estándar", "Express", null si es zona fija
  shipping_cost NUMERIC,
  shipping_label_url TEXT,                -- URL de la etiqueta (solo Envia.com)
  shipping_tracking_number TEXT,
  shipping_postal_code TEXT,
  -- Columnas de cupón
  coupon_code TEXT,
  discount_amount NUMERIC
);

-- =============================================
-- ORDER ITEMS (Emprendimiento y Empresa)
-- =============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  name TEXT NOT NULL,
  variant_name TEXT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  tenant_id UUID NOT NULL
);

-- =============================================
-- COUPONS (Emprendimiento y Empresa)
-- =============================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL,                     -- 'percent' | 'fixed'
  value NUMERIC NOT NULL,
  min_amount NUMERIC,
  max_uses INTEGER,
  uses_count INTEGER,
  expires_at TIMESTAMPTZ,
  active BOOLEAN,
  starts_at TIMESTAMPTZ
);

-- =============================================
-- ÍNDICES recomendados (mejoran performance de queries comunes)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_tenant_active ON public.products(tenant_id, active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(tenant_id, slug);
CREATE INDEX IF NOT EXISTS idx_categories_tenant ON public.categories(tenant_id, active, position);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON public.subcategories(category_id, active);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id, position);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_tenant ON public.shipping_zones(tenant_id, active, position);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status ON public.orders(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_external_ref ON public.orders(external_reference);
CREATE INDEX IF NOT EXISTS idx_orders_mp_payment ON public.orders(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_coupons_tenant_code ON public.coupons(tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_user_tenants_user ON public.user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant ON public.user_tenants(tenant_id);

-- =============================================
-- CONTACT MESSAGES (todos los planes)
-- =============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'pending_reply', 'archived', 'reopened', 'closed')),
  assigned_user_id UUID REFERENCES auth.users(id),
  labels TEXT[] DEFAULT '{}',
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ORDER EVENTS (Emprendimiento y Empresa)
-- =============================================
CREATE TABLE IF NOT EXISTS public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  order_id UUID REFERENCES public.orders(id),
  type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- PAYMENT EVENTS (Emprendimiento y Empresa)
-- =============================================
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  order_id UUID REFERENCES public.orders(id),
  provider TEXT NOT NULL DEFAULT 'mercadopago',
  provider_event_id TEXT,
  status TEXT,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- PLATFORM CONFIG (nivel plataforma, fila única — NO por tenant)
-- SMTP del servidor de correo + credenciales de Correo Argentino de la plataforma
-- =============================================
CREATE TABLE IF NOT EXISTS public.platform_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- SMTP del servidor (Hostinger por defecto). El usuario/pass van por tenant en tenants.smpt_user/smpt_pass
  host TEXT,                              -- ej: smtp.hostinger.com
  port INTEGER,                          -- ej: 465
  ssl BOOLEAN,                           -- true para puerto 465
  -- Correo Argentino (MiCorreo) — credenciales de la cuenta operativa de la plataforma
  correo_argentino_user TEXT,
  correo_argentino_password TEXT,
  correo_argentino_customer_id TEXT,
  correo_argentino_token TEXT,
  correo_argentino_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- BLOG (opcional, todos los planes)
-- =============================================
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  category_id UUID REFERENCES public.blog_categories(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ATRIBUTOS DE PRODUCTO (ej: "Color", "Talle" con sus valores)
-- =============================================
CREATE TABLE IF NOT EXISTS public.product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_attribute_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  product_attribute_id UUID NOT NULL REFERENCES public.product_attributes(id),
  value TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

-- =============================================
-- CRM WEBHOOK CONFIG (clave/valor, nivel plataforma)
-- =============================================
CREATE TABLE IF NOT EXISTS public.crm_webhook_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_contact_messages_tenant ON public.contact_messages(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_order_events_order ON public.order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_order ON public.payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tenant ON public.blog_posts(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_blog_categories_tenant ON public.blog_categories(tenant_id, active, position);
CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON public.product_attributes(product_id, position);
CREATE INDEX IF NOT EXISTS idx_product_attribute_values_attr ON public.product_attribute_values(product_attribute_id, position);
```

## Después de ejecutar el SQL

1. Crear el bucket de storage — ver skill `supabase-storage`.
2. Habilitar RLS y crear políticas — ver skill `rls-on-demand`.
3. Insertar el tenant inicial — ver skill `supabase-connection` (sección "Insertar tenant inicial").
