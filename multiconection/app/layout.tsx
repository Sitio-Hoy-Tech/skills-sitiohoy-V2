import { Barlow_Condensed, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import type { Metadata } from "next";

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Multi Conection — Pantallas LED Profesionales",
  description:
    "Soluciones en pantallas LED para publicidad, eventos y marketing digital. Más de 1,000 instalaciones en Argentina. Tecnología de alta calidad para grandes proyectos.",
  keywords: "pantallas LED, publicidad LED, pantallas exterior, LED Argentina, Multi Conection",
  openGraph: {
    title: "Multi Conection — Pantallas LED Profesionales",
    description:
      "Soluciones en pantallas LED para publicidad, eventos y marketing digital.",
    siteName: "Multi Conection",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "Multi Conection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi Conection — Pantallas LED Profesionales",
    description:
      "Soluciones en pantallas LED para publicidad, eventos y marketing digital.",
    images: ["/logo1.png"],
  },
  icons: [
    { rel: "icon", url: "/favicon.png" },
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const umamiSrc =
    process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <head />
      <body
        className="antialiased"
        style={{ backgroundColor: "#060D1A", color: "#ffffff" }}
      >
        {umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            data-domains={process.env.NEXT_PUBLIC_SITE_DOMAIN}
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
