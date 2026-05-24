import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: "#060D1A" }}
    >
      <p
        className="font-display text-8xl font-black mb-4"
        style={{ color: "#00B8D4" }}
      >
        404
      </p>
      <h1 className="font-display text-3xl font-bold text-white mb-3">
        Página no encontrada
      </h1>
      <p className="font-body text-white/60 mb-8">
        El contenido que buscás no existe o fue movido.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 font-body font-semibold rounded-full text-white transition-all duration-300 hover:scale-105"
        style={{ backgroundColor: "#00B8D4" }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
