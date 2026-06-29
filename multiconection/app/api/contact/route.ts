import { NextRequest, NextResponse } from "next/server";
import { getSmtpTransporter } from "@/lib/smtp/client";
import {
  contactNotificationEmail,
  contactConfirmationEmail,
} from "@/lib/email/templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantConfig } from "@/lib/supabase/tenant";

const attempts = new Map<string, { count: number; resetAt: number }>();

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, honeypot } = body;

    if (honeypot) return NextResponse.json({ ok: true });

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Esperá un momento." },
        { status: 429 }
      );
    }

    const tenant = await getTenantConfig();
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
    const siteName = tenant.name ?? "Multiconection";
    const siteUrl =
      tenant.url ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://multiconection.com.ar";
    const city = tenant.origin_city ?? "Capital Federal - Buenos Aires";

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : null;
    const safeMessage = escapeHtml(message);

    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from("contact_messages").insert({
      tenant_id: tenantId,
      name,
      email,
      phone: phone ?? null,
      message,
      source: "contact_form",
    });

    if (!tenant.contact_email) {
      console.warn(`contact_email no configurado para tenant ${tenantId}`);
      return NextResponse.json({ ok: true });
    }

    const client = await getSmtpTransporter();
    if (!client) {
      console.warn(`SMTP no configurado para tenant ${tenantId}`);
      return NextResponse.json({ ok: true });
    }

    const notifHtml = contactNotificationEmail({
      siteName,
      siteUrl,
      city,
      name: safeName,
      email: safeEmail,
      phone: safePhone,
      message: safeMessage,
    });
    try {
      await client.transporter.sendMail({
        from: client.from,
        to: tenant.contact_email,
        replyTo: email,
        subject: `📬 ${name} te escribió desde ${siteName}`,
        html: notifHtml,
      });
    } catch (e) {
      console.error("Error enviando notificación al negocio:", e);
    }

    const confirmHtml = contactConfirmationEmail({
      siteName,
      siteUrl,
      city,
      name: safeName,
      message: safeMessage,
    });
    try {
      await client.transporter.sendMail({
        from: client.from,
        to: email,
        replyTo: tenant.contact_email,
        subject: `✅ Recibimos tu consulta — ${siteName}`,
        html: confirmHtml,
      });
    } catch (e) {
      console.error("Error enviando confirmación al visitante:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Error en /api/contact:", e);
    return NextResponse.json(
      { error: "Error inesperado" },
      { status: 500 }
    );
  }
}