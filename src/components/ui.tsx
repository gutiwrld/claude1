import type { ReactNode } from "react";

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-chalk/70" role="status">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-grass-500/30 border-t-grass-400" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function Banner({
  kind = "info",
  children,
}: {
  kind?: "info" | "error" | "success";
  children: ReactNode;
}) {
  const styles: Record<string, string> = {
    info: "bg-pitch-700 border-pitch-600 text-chalk/90",
    error: "bg-red-950/60 border-red-800/70 text-red-200",
    success: "bg-grass-600/20 border-grass-600/50 text-grass-300",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[kind]}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-pitch-600 px-6 py-12 text-center text-chalk/60">
      <p className="text-base font-medium text-chalk/80">{title}</p>
      {hint && <p className="mt-1 text-sm">{hint}</p>}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "subtle";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-grass-500 text-pitch-950 hover:bg-grass-400",
    ghost: "border border-pitch-600 text-chalk hover:bg-pitch-700",
    danger: "bg-red-900/70 text-red-100 hover:bg-red-800",
    subtle: "bg-pitch-700 text-chalk hover:bg-pitch-600",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "open" | "closed" | "final" | "live" }) {
  const tones: Record<string, string> = {
    neutral: "bg-pitch-700 text-chalk/70",
    open: "bg-grass-600/20 text-grass-300",
    closed: "bg-flare/15 text-flare",
    final: "bg-pitch-600 text-chalk/80",
    live: "bg-red-600/20 text-red-300",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>
  );
}
