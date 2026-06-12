const chips = [
  "🧬 Visual schemas",
  "💬 Branching dialogue",
  "🛠 Typed C# codegen",
  "☁️ Cloud saves",
  "⚡ Realtime live sync",
  "🌍 ICU localization",
  "🏷 Semver releases",
  "📖 Game wiki",
  "🤖 Agent-friendly CLI",
  "🧩 Built for modding",
];

export function Marquee() {
  const row = [...chips, ...chips];
  return (
    <div className="relative overflow-hidden border-y border-edge bg-panel py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      <div className="flex w-max animate-marquee gap-4">
        {row.map((chip, index) => (
          <span
            key={`${chip}-${index}`}
            className="glass whitespace-nowrap rounded-full px-5 py-2 font-display text-sm font-semibold text-ink-dim"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
