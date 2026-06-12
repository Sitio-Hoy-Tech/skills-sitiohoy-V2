# Reference: RLS para tablas internas (deny-all)

**Aplica a: TODOS los planes, SIEMPRE.** Este bloque se incluye en todo `setup-rls.sql` sin excepción.

Estas tablas contienen credenciales de la plataforma o datos personales, y **solo se acceden con `service_role` desde el servidor**. Por eso se habilita RLS **sin crear ninguna política**: el resultado es deny-all para `anon` y `authenticated` (la anon key viaja en el bundle JS de todos los sitios — sin esto, cualquier visitante puede leerlas). `service_role` bypasea RLS, así que la app sigue funcionando igual.

| Tabla | Qué protege |
|---|---|
| `platform_config` | Credenciales SMTP del servidor + usuario/password de Correo Argentino de la plataforma |
| `contact_messages` | Nombres, emails, teléfonos y mensajes de los formularios de contacto de TODOS los tenants |
| `payment_events` | Payloads crudos de proveedores de pago |
| `order_events` | Historial de pedidos |
| `crm_webhook_config` | Config de webhooks del CRM |
| `blog_posts`, `blog_categories` | Contenido editorial (el sitio lo lee con service_role) |
| `product_attributes`, `product_attribute_values` | Atributos de producto (el sitio los lee con service_role) |

```sql
-- =============================================
-- Tablas internas — RLS habilitado SIN políticas (deny-all para anon/authenticated)
-- service_role bypasea RLS: la app server-side no se ve afectada.
-- =============================================
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_webhook_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_values ENABLE ROW LEVEL SECURITY;
```

## Notas

- **NO crear políticas para estas tablas.** RLS habilitado sin políticas = nadie con anon/authenticated key puede leer ni escribir. Es el comportamiento deseado.
- Si en el futuro el panel admin externo necesita leer `contact_messages` con `authenticated` (en vez de service_role), agregar en ese momento una política de membresía igual a la de `orders`. Hasta entonces, deny-all.
- Este bloque es idempotente: `ENABLE ROW LEVEL SECURITY` se puede correr múltiples veces sin error.
