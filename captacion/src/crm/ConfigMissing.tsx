export default function ConfigMissing() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="font-display text-2xl font-semibold">Falta configurar Supabase</h2>
        <p className="mt-3 text-ink-600">
          El panel funciona, pero aún no está conectado a la base de datos. Para activarlo:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-600">
          <li>
            Crea un proyecto en <strong>supabase.com</strong> y ejecuta{" "}
            <code className="rounded bg-sand px-1">supabase/schema.sql</code> en el SQL Editor.
          </li>
          <li>
            Copia <code className="rounded bg-sand px-1">.env.example</code> a{" "}
            <code className="rounded bg-sand px-1">.env</code> y rellena{" "}
            <code className="rounded bg-sand px-1">VITE_SUPABASE_URL</code> y{" "}
            <code className="rounded bg-sand px-1">VITE_SUPABASE_ANON_KEY</code>.
          </li>
          <li>Reinicia el servidor de desarrollo.</li>
        </ol>
        <a href="/" className="mt-5 inline-block text-sm text-terracotta-600 hover:underline">
          ← Volver a la web
        </a>
      </div>
    </div>
  );
}
