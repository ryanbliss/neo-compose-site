"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";

interface Token {
  text: string;
  color?: string;
}

type Line = Token[];

const keyword = "text-neon-pink";
const type = "text-ice";
const str = "text-neon-yellow";
const fn = "text-blurple-bright";
const comment = "text-ink-dim";
const plain = "text-ink";

const csharpLines: Line[] = [
  [{ text: "// Generated from your project — fully typed", color: comment }],
  [
    { text: "var", color: keyword },
    { text: " neo = ", color: plain },
    { text: "HelloWorldNeo", color: type },
    { text: ".Instance;", color: plain },
  ],
  [],
  [
    { text: "if", color: keyword },
    { text: " (neo.Dialogues.NPC.Talk.", color: plain },
    { text: "TryTrigger", color: fn },
    { text: "(npc, ", color: plain },
    { text: "out var", color: keyword },
    { text: " line))", color: plain },
  ],
  [
    { text: "    DialogueUI.", color: plain },
    { text: "Show", color: fn },
    { text: "(line);", color: plain },
  ],
  [],
  [{ text: "// Typed change subscriptions", color: comment }],
  [
    { text: "neo.Save.", color: plain },
    { text: "OnChanged", color: fn },
    { text: "(Save.Fields.StormCorn,", color: plain },
  ],
  [
    { text: "    corn => hud.", color: plain },
    { text: "SetCornCount", color: fn },
    { text: "(corn));", color: plain },
  ],
  [],
  [
    { text: "await", color: keyword },
    { text: " neo.Client.", color: plain },
    { text: "CommitAsync", color: fn },
    { text: "(); ", color: plain },
    { text: "// cloud save ☁️", color: comment },
  ],
];

const cliLines: Line[] = [
  [
    { text: "$ ", color: comment },
    { text: "neo pull", color: plain },
  ],
  [
    { text: "  ✓ schema synced → neo/Schema/*.cs", color: "text-neon-green" },
  ],
  [],
  [
    { text: "$ ", color: comment },
    { text: "neo branch create dlc-frost-moon", color: plain },
  ],
  [
    { text: "$ ", color: comment },
    { text: "neo push", color: plain },
  ],
  [
    { text: "  ✓ 12 records committed (minor bump)", color: "text-neon-green" },
  ],
  [],
  [
    { text: "$ ", color: comment },
    { text: "neo merge dlc-frost-moon --into main", color: plain },
  ],
  [
    { text: "  ✓ field-level merge — 0 conflicts", color: "text-neon-green" },
  ],
  [],
  [{ text: "# Your repo, your review flow, your agents.", color: comment }],
];

const flowLines: Line[] = [
  [{ text: "// Smart triggers, authored visually", color: comment }],
  [
    { text: "group", color: keyword },
    { text: " NPC.Talk ", color: plain },
    { text: "lookup", color: keyword },
    { text: "(Assets.NPCs)", color: plain },
  ],
  [
    { text: "  when", color: keyword },
    { text: " npc.DayTalkCount < Assets.Flags.MaxTalks", color: plain },
  ],
  [],
  [
    { text: "dialogue", color: keyword },
    { text: " ", color: plain },
    { text: "\"Storm warning\"", color: str },
    { text: " priority ", color: plain },
    { text: "High", color: type },
  ],
  [
    { text: "  when", color: keyword },
    { text: " save.Weather == Weather.", color: plain },
    { text: "GyreStorm", color: type },
  ],
  [],
  [{ text: "// Ties break by priority, then random —", color: comment }],
  [{ text: "// fresh lines every playthrough.", color: comment }],
];

const tabs = [
  { id: "csharp", label: "Unity C#", lines: csharpLines, raw: "var neo = HelloWorldNeo.Instance;" },
  { id: "cli", label: "neo CLI", lines: cliLines, raw: "neo pull" },
  { id: "flow", label: "NeoScript", lines: flowLines, raw: "group NPC.Talk lookup(Assets.NPCs)" },
];

export function CodeShowcase() {
  const [activeId, setActiveId] = useState("csharp");
  const [copied, setCopied] = useState(false);
  const active = tabs.find((tab) => tab.id === activeId)!;

  async function copy() {
    await navigator.clipboard.writeText(
      active.lines
        .map((line) => line.map((token) => token.text).join(""))
        .join("\n"),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section id="code" className="relative py-24">
      <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-ice/10 blur-[120px]" />
      <div className="mx-auto grid w-[min(72rem,calc(100%-2rem))] items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Your content, <span className="text-gradient">compiled</span>.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-dim">
            Every schema, dialogue, and string you author becomes typed C# and
            JSON your game consumes directly. No stringly-typed lookups, no
            drift between design and code — if it compiles, it matches the
            project.
          </p>
          <ul className="mt-6 space-y-3 text-ink-dim">
            {[
              "Generated SDK client with autocomplete for your whole data model",
              "NeoScript conditions evaluated at runtime, authored in UI",
              "A CLI that round-trips the project as reviewable C# files",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-neon-green" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          className="glass glow-ring overflow-hidden rounded-2xl"
        >
          <div className="flex items-center justify-between border-b border-edge px-4 py-2">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveId(tab.id)}
                  className={`rounded-lg px-4 py-1.5 font-mono text-sm transition-colors ${
                    tab.id === activeId
                      ? "bg-blurple/25 text-blurple-bright"
                      : "text-ink-dim hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={copy}
              aria-label="Copy code"
              className="rounded-lg p-2 text-ink-dim transition-colors hover:text-ink"
            >
              {copied ? (
                <Check className="size-4 text-neon-green" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.pre
              key={activeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="min-h-[22rem] overflow-x-auto p-6 font-mono text-sm leading-7"
            >
              {active.lines.map((line, lineIndex) => (
                <div key={lineIndex}>
                  {line.length === 0
                    ? " "
                    : line.map((token, tokenIndex) => (
                        <span key={tokenIndex} className={token.color}>
                          {token.text}
                        </span>
                      ))}
                </div>
              ))}
            </motion.pre>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
