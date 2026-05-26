import Link from "next/link";
import Image from "next/image";

export function SitioHoyBranding() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-center gap-2">
        <Image
          src="/images/logo-sitio-hoy.png"
          alt="SitioHoy"
          width={0}
          height={0}
          sizes="80px"
          style={{ width: "auto", height: "18px" }}
        />
        <p
          className="font-body text-xs"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Sitio desarrollado con{" "}
          <Link
            href="https://sitiohoy.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            SitioHoy
          </Link>
        </p>
      </div>
    </div>
  );
}
