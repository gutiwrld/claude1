import { useState } from "react";
import { unlock } from "../lib/storage";
import { BRAND } from "../data/constants";
import { Button, Input } from "../components/ui";

export default function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (unlock(pin)) {
      onUnlock();
    } else {
      setError(true);
      setPin("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-paper p-8 shadow-lift">
        <h1 className="font-display text-2xl font-semibold">
          {BRAND}
          <span className="text-terracotta-500">.</span>
        </h1>
        <p className="mt-1 text-sm text-ink-600">Panel interno · introduce el PIN</p>
        <Input
          autoFocus
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          placeholder="••••"
          className="mt-5 text-center text-lg tracking-widest"
        />
        {error && <p className="mt-2 text-sm text-red-600">PIN incorrecto.</p>}
        <Button type="submit" className="mt-4 w-full">
          Entrar
        </Button>
        <a href="/" className="mt-4 block text-center text-sm text-ink-400 hover:text-ink">
          ← Volver a la web
        </a>
      </form>
    </div>
  );
}
