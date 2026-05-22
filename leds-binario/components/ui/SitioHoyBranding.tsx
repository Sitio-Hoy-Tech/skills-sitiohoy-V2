import Link from "next/link";

interface SitioHoyBrandingProps {
  greenBackground?: boolean;
}

export function SitioHoyBranding({ greenBackground = false }: SitioHoyBrandingProps) {
  const logoColor = greenBackground ? "#f1f5f9" : "#10b981";
  const textColor = greenBackground
    ? "text-white/40 hover:text-white/60"
    : "text-current opacity-40 hover:opacity-60";

  return (
    <div className="border-t border-current/5 mt-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 1024 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect rx="180" width="1024" height="1024" fill={logoColor} />
          <path
            d="M512 160c-60 0-120 40-160 100-80 120-100 260-40 380 30 60 80 120 140 160 40 30 80 50 120 60 60 20 120 10 160-20 60-40 80-120 40-200-20-40-60-80-100-100-60-40-120-60-160-40-30 10-40 40-20 70 20 40 60 60 100 60 30 0 60-10 80-30 30-30 20-80-20-120-30-30-80-40-120-20-60 20-100 80-100 160 0 60 40 100 80 80"
            fill="white"
            stroke="white"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className={`font-body text-xs transition-opacity ${textColor}`}>
          Sitio creado con{" "}
          <a
            href="https://sitiohoy.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: logoColor }}
          >
            SitioHoy
          </a>
        </p>
      </div>
    </div>
  );
}
