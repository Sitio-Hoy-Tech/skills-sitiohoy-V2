# Reference: `app/auth/signout/route.ts`

Path destino: `app/auth/signout/route.ts`

Endpoint POST que cierra la sesión y redirige a `/login`.

El redirect usa el `origin` del request — no hace falta `NEXT_PUBLIC_SITE_URL` (que ya no existe; la URL del sitio vive en `tenants.url`).

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
}
```
