import { useState } from "react";
import { Banner, Button } from "./ui";

export function AdminGate({ pin, onUnlock }: { pin: string; onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim() === pin) {
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-6 max-w-sm space-y-3 rounded-2xl border border-pitch-700 bg-pitch-900/60 p-6">
      <h2 className="text-lg font-bold">Modo administrador</h2>
      <p className="text-sm text-chalk/60">Introduce el PIN para cargar resultados.</p>
      <input
        type="password"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(false);
        }}
        placeholder="PIN"
        autoComplete="off"
        className="w-full rounded-xl border border-pitch-600 bg-pitch-800 px-3 py-2.5 text-chalk placeholder:text-chalk/40"
      />
      {error && <Banner kind="error">PIN incorrecto.</Banner>}
      <Button type="submit" className="w-full">Desbloquear</Button>
    </form>
  );
}
