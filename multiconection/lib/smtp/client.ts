import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantConfig } from "@/lib/supabase/tenant";

export async function getSmtpTransporter(): Promise<{
  transporter: Transporter;
  from: string;
} | null> {
  const tenant = await getTenantConfig();

  if (!tenant.smtp_user || !tenant.smtp_pass) return null;

  const supabaseAdmin = createAdminClient();
  const { data: platform } = await supabaseAdmin
    .from("platform_config")
    .select("smtp_host, smtp_port, smtp_secure")
    .limit(1)
    .maybeSingle();

  const transporter = nodemailer.createTransport({
    host: platform?.smtp_host ?? "smtp.hostinger.com",
    port: platform?.smtp_port ?? 465,
    secure: platform?.smtp_secure ?? true,
    auth: {
      user: tenant.smtp_user,
      pass: tenant.smtp_pass,
    },
  });

  return {
    transporter,
    from: `${tenant.name} <${tenant.smtp_user}>`,
  };
}