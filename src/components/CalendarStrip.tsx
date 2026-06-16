export interface CalendarDay {
  key: string;
  short: string; // 'Jue 11'
  count: number;
  isToday: boolean;
}

export function CalendarStrip({
  days,
  hasUndated,
  totalCount,
  selected,
  onSelect,
}: {
  days: CalendarDay[];
  hasUndated: boolean;
  totalCount: number;
  selected: string; // 'all' | dayKey | 'undated'
  onSelect: (value: string) => void;
}) {
  const chip = (active: boolean) =>
    `flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-center transition-colors ${
      active
        ? "border-grass-400 bg-grass-500 text-pitch-950"
        : "border-pitch-600 bg-pitch-800 text-chalk/80 hover:bg-pitch-700"
    }`;

  return (
    <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-1">
      <div className="flex gap-2" role="tablist" aria-label="Filtrar por día">
        <button role="tab" aria-selected={selected === "all"} className={chip(selected === "all")} onClick={() => onSelect("all")}>
          <span className="text-xs font-bold uppercase tracking-wide">Todos</span>
          <span className="tnum text-sm font-black">{totalCount}</span>
        </button>

        {days.map((d) => (
          <button
            key={d.key}
            role="tab"
            aria-selected={selected === d.key}
            className={chip(selected === d.key)}
            onClick={() => onSelect(d.key)}
          >
            <span className="text-[11px] font-bold uppercase tracking-wide">
              {d.isToday ? "Hoy" : d.short}
            </span>
            <span className="tnum text-sm font-black">{d.count}</span>
          </button>
        ))}

        {hasUndated && (
          <button
            role="tab"
            aria-selected={selected === "undated"}
            className={chip(selected === "undated")}
            onClick={() => onSelect("undated")}
          >
            <span className="text-[11px] font-bold uppercase tracking-wide">Sin fecha</span>
            <span className="tnum text-sm font-black">·</span>
          </button>
        )}
      </div>
    </div>
  );
}
