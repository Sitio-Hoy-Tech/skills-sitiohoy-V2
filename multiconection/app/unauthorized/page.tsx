import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: "#060D1A" }}
    >
      <h1 className="font-display text-3xl font-bold text-white mb-3">
        Acceso no autorizado
      </h1>
      <p className="font-body text-white/60 mb-8">
        Tu cuenta no tiene permisos para administrar este sitio.
      </p>
      <Link
        href="/"
        className="font-body text-sm hover:underline"
        style={{ color: "#00B8D4" }}
      >
        Volver al sitio
      </Link>
    </div>
  );
}
