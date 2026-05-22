import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Leds Binario — Pantallas LED en Baradero",
  description: "Pantallas LED de alta definición para publicidad, eventos y negocios. Calidad premium, instalación profesional en toda la región.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head />
      <body className="bg-neutral-900 text-neutral-50 antialiased">
        {umamiId && (
          <Script src={umamiSrc} data-website-id={umamiId} strategy="afterInteractive" />
        )}
        {children}
      </body>
    </html>
  );
}
