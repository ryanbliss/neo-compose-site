"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Bot, PanelsTopLeft, RefreshCw } from "lucide-react";

interface TerminalLine {
  prefix?: string;
  text: string;
  suffix?: string;
  className?: string;
}

function TerminalTyper({ lines }: { lines: TerminalLine[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);
  const total = lines.reduce((sum, line) => sum + line.text.length, 0);

  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setCount((current) => {
        if (current >= total) {
          clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 26);
    return () => clearInterval(timer);
  }, [inView, total]);

  const offsets = lines.map((_, index) =>
    lines.slice(0, index).reduce((sum, line) => sum + line.text.length, 0),
  );
  return (
    <div
      ref={ref}
      className="mt-6 min-h-32 rounded-xl bg-void/60 p-4 font-mono text-xs leading-6 text-ink-dim"
    >
      {lines.map((line, index) => {
        const shown = Math.max(
          0,
          Math.min(line.text.length, count - offsets[index]),
        );
        const started = shown > 0;
        const done = shown >= line.text.length;
        if (!started) return null;
        return (
          <p key={index} className={line.className}>
            {line.prefix && (
              <span className="text-neon-green">{line.prefix} </span>
            )}
            {line.text.slice(0, shown)}
            {!done && <span className="animate-pulse text-ink">▌</span>}
            {done && line.suffix && (
              <span className="text-neon-green"> {line.suffix}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

const terminalLines: TerminalLine[] = [
  { prefix: "$", text: "neo dev" },
  { text: "⟳ watching… changes sync both ways", className: "text-neon-green" },
  { prefix: "$", text: 'claude "add a quest chain for the rat king"' },
  { text: "agent edits neo/Schema/Save.cs → neo push", suffix: "✓" },
];

type FieldType = "int" | "float" | "string";

const typeToCSharp: Record<FieldType, string> = {
  int: "int",
  float: "float",
  string: "string",
};

const defaultByType: Record<FieldType, string> = {
  int: "0",
  float: "0f",
  string: "\"\"",
};

export function SchemaSync() {
  const [fieldName, setFieldName] = useState("RatFriendship");
  const [fieldType, setFieldType] = useState<FieldType>("int");
  const [optional, setOptional] = useState(false);

  const safeName = (fieldName.replace(/[^a-zA-Z0-9_]/g, "") || "NewField")
    .replace(/^[0-9]+/, "");
  const csType = `${typeToCSharp[fieldType]}${optional ? "?" : ""}`;

  return (
    <section id="agents" className="relative py-24">
      <div className="pointer-events-none absolute right-1/4 top-0 h-96 w-96 rounded-full bg-blurple/12 blur-[130px]" />
      <div className="mx-auto w-[min(72rem,calc(100%-2rem))]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-ink-dim">
            <Bot className="size-4 text-neon-green" /> Built for humans <em>and</em> agents
          </p>
          <h2 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            The UI <span className="text-gradient">is</span> the code.
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            Every project is also a C# working copy. Edit the schema below and
            watch the code follow — the same files your team reviews in PRs
            and your coding agents read, edit, and <code className="font-mono text-base">neo push</code> right back.
          </p>
        </motion.div>

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass rounded-2xl p-6"
          >
            <p className="flex items-center gap-2 font-display font-bold text-ink-dim">
              <PanelsTopLeft className="size-4" /> Schema editor · web UI
            </p>
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm text-ink-dim">Attribute name</span>
                <input
                  value={fieldName}
                  onChange={(event) => setFieldName(event.target.value)}
                  maxLength={24}
                  className="mt-1.5 w-full rounded-xl border border-edge bg-void/60 px-4 py-2.5 font-mono text-sm text-ink outline-none transition-colors focus:border-blurple-bright"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-ink-dim">Type</span>
                  <select
                    value={fieldType}
                    onChange={(event) =>
                      setFieldType(event.target.value as FieldType)
                    }
                    className="mt-1.5 w-full rounded-xl border border-edge bg-void/60 px-4 py-2.5 font-mono text-sm text-ink outline-none transition-colors focus:border-blurple-bright"
                  >
                    <option value="int"># Integer</option>
                    <option value="float"># Float</option>
                    <option value="string">Aa String</option>
                  </select>
                </label>
                <label className="mt-7 flex items-center gap-3 rounded-xl border border-edge bg-void/60 px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={optional}
                    onChange={(event) => setOptional(event.target.checked)}
                    className="size-4 accent-[var(--color-blurple)]"
                  />
                  <span className="text-sm text-ink-dim">Optional</span>
                </label>
              </div>
            </div>
            <TerminalTyper lines={terminalLines} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass glow-ring rounded-2xl p-6"
          >
            <p className="flex items-center justify-between font-display font-bold text-ink-dim">
              <span className="flex items-center gap-2">
                <RefreshCw className="size-4" /> neo/Schema/Save.cs
              </span>
              <span className="rounded-md bg-neon-green/15 px-2 py-0.5 text-xs font-bold text-neon-green">
                IN SYNC
              </span>
            </p>
            <pre className="mt-6 overflow-x-auto rounded-xl bg-void/70 p-5 font-mono text-sm leading-7">
              <div>
                <span className="text-neon-pink">namespace</span>{" "}
                <span className="text-ice">RustyGoblInn.Schema</span>;
              </div>
              <div> </div>
              <div>
                <span className="text-ink-dim">[NeoCustomType]</span>
              </div>
              <div>
                <span className="text-neon-pink">public partial class</span>{" "}
                <span className="text-ice">Save</span>
              </div>
              <div>{"{"}</div>
              <div>
                {"    "}
                <span className="text-neon-pink">public</span>{" "}
                <span className="text-neon-pink">int</span>{" "}
                <span className="text-ink">Gold</span>
                {" = "}
                <span className="text-neon-yellow">80</span>;
              </div>
              <motion.div
                key={`${safeName}-${csType}`}
                initial={{ backgroundColor: "rgba(108, 92, 231, 0.35)" }}
                animate={{ backgroundColor: "rgba(108, 92, 231, 0)" }}
                transition={{ duration: 1.2 }}
                className="rounded"
              >
                {"    "}
                <span className="text-neon-pink">public</span>{" "}
                <span className="text-neon-pink">{csType}</span>{" "}
                <span className="text-ink">{safeName}</span>
                <span className="text-ink"> = </span>
                <span className="text-neon-yellow">
                  {optional ? "null" : defaultByType[fieldType]}
                </span>
                ;
              </motion.div>
              <div>
                {"    "}
                <span className="text-neon-pink">public</span>{" "}
                <span className="text-ice">List</span>
                {"<"}
                <span className="text-ice">Item</span>
                {"> "}
                <span className="text-ink">Items</span> = [];
              </div>
              <div>{"}"}</div>
            </pre>
            <p className="mt-4 text-sm text-ink-dim">
              Same source of truth as the visual editor — pull it, grep it,
              review it, let an agent refactor it. Nothing drifts.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
