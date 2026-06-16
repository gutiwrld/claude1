import { Banner } from "./ui";

export function ConfigMissing() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="mb-4 text-2xl font-black">
        Porra <span className="text-grass-400">Mundial 2026</span>
      </h1>
      <Banner kind="error">
        Falta configurar Supabase. Copia <code className="rounded bg-pitch-700 px-1">.env.example</code> a{" "}
        <code className="rounded bg-pitch-700 px-1">.env</code> y rellena{" "}
        <code className="rounded bg-pitch-700 px-1">VITE_SUPABASE_URL</code> y{" "}
        <code className="rounded bg-pitch-700 px-1">VITE_SUPABASE_ANON_KEY</code>. Luego reinicia{" "}
        <code className="rounded bg-pitch-700 px-1">npm run dev</code>. Tienes los pasos en el README.
      </Banner>
    </div>
  );
}
