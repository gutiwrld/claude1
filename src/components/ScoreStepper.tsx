export function ScoreStepper({
  value,
  onChange,
  disabled,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  const clamp = (v: number) => Math.max(0, Math.min(20, v));
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`Subir ${ariaLabel}`}
        disabled={disabled || value >= 20}
        onClick={() => onChange(clamp(value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-pitch-700 text-lg font-bold text-chalk hover:bg-pitch-600 disabled:opacity-40"
      >
        +
      </button>
      <span
        aria-label={ariaLabel}
        className="tnum w-10 text-center font-score text-2xl font-black tabular-nums text-flare"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`Bajar ${ariaLabel}`}
        disabled={disabled || value <= 0}
        onClick={() => onChange(clamp(value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-pitch-700 text-lg font-bold text-chalk hover:bg-pitch-600 disabled:opacity-40"
      >
        −
      </button>
    </div>
  );
}
