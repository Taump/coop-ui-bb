type Contributor = {
  initial: string;
  name: string;
  size: number;
  strength: 1 | 2 | 3;
  color: string;
};

const contributors: Contributor[] = [
  { initial: "A", name: "Alice", size: 48, strength: 3, color: "indigo" },
  { initial: "B", name: "Bob", size: 48, strength: 2, color: "emerald" },
  { initial: "C", name: "Carol", size: 48, strength: 1, color: "amber" },
  { initial: "D", name: "Dave", size: 48, strength: 1, color: "rose" },
];

const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
  indigo: {
    bg: "from-indigo-500/40 to-indigo-500/15",
    text: "text-indigo-100",
    dot: "bg-indigo-400/80",
  },
  emerald: {
    bg: "from-emerald-500/40 to-emerald-500/15",
    text: "text-emerald-100",
    dot: "bg-emerald-400/80",
  },
  amber: {
    bg: "from-amber-500/40 to-amber-500/15",
    text: "text-amber-100",
    dot: "bg-amber-400/80",
  },
  rose: {
    bg: "from-rose-500/40 to-rose-500/15",
    text: "text-rose-100",
    dot: "bg-rose-400/80",
  },
};

export const VisualizationIllustration = () => {
  return (
    <div aria-hidden className="flex h-full flex-col justify-end gap-5">
      {contributors.map((c) => {
        const colors = colorMap[c.color];
        return (
          <div key={c.name} className="flex items-center gap-4">
            <div
              className={`bg-linear-to-br ${colors.bg} flex shrink-0 items-center justify-center rounded-full`}
              style={{ width: c.size, height: c.size }}
            >
              <span
                className={`font-semibold ${colors.text}`}
                style={{ fontSize: c.size * 0.42 }}
              >
                {c.initial}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between">
              <span className="text-foreground text-base font-medium">
                {c.name}
              </span>
              <div className="flex gap-1.5">
                {Array.from({ length: c.strength }).map((_, i) => (
                  <span
                    key={i}
                    className={`size-2 rounded-full ${colors.dot}`}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
