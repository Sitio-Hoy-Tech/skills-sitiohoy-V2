import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";

export async function getTenantConfig() {
  try {
    const supabaseAdmin = createAdminClient();
    const tenantId = getTenantId();
    const { data } = await supabaseAdmin
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single();
    return data ?? {};
  } catch {
    return {};
  }
}
