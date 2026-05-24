import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#060D1A" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor: "#0C1828", border: "1px solid #1E3458" }}
      >
        <h1 className="font-display text-2xl font-bold text-white mb-6">
          Acceso admin
        </h1>

        <form action={login} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block font-body text-sm text-white/60 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg font-body text-white text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: "#142240",
                border: "1px solid #1E3458",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-body text-sm text-white/60 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-lg font-body text-white text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: "#142240",
                border: "1px solid #1E3458",
              }}
            />
          </div>

          {error === "invalid_credentials" && (
            <p className="font-body text-sm text-red-400">
              Email o contraseña incorrectos.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-body font-semibold text-white transition-all duration-300 hover:opacity-90 mt-2"
            style={{ backgroundColor: "#00B8D4" }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
