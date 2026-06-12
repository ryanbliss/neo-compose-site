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
const ok = "text-neon-green";

const csharpLines: Line[] = [
  [{ text: "// Generated from your project — reads like hand-written Unity code", color: comment }],
  [
    { text: "public sealed class", color: keyword },
    { text: " CursedSword", color: type },
    { text: " : ", color: plain },
    { text: "Weapon", color: type },
    { text: "   ", color: plain },
    { text: "// your abstract types, real inheritance", color: comment },
  ],
  [
    { text: "{", color: plain },
  ],
  [
    { text: "    public float", color: keyword },
    { text: " CurseLevel => ", color: plain },
    { text: "value", color: plain },
    { text: ".CurseLevel; ", color: plain },
    { text: "// 0.1f, tops", color: comment },
  ],
  [{ text: "}", color: plain }],
  [],
  [
    { text: "var", color: keyword },
    { text: " neo = ", color: plain },
    { text: "RustyGoblInnNeo", color: type },
    { text: ".Instance;", color: plain },
  ],
  [
    { text: "if", color: keyword },
    { text: " (neo.Dialogues.Shop.Grubbins.", color: plain },
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
  [
    { text: "neo.Save.", color: plain },
    { text: "OnChanged", color: fn },
    { text: "(Save.Fields.RatFriendship,", color: plain },
  ],
  [
    { text: "    rat => bartholomew.", color: plain },
    { text: "Squeak", color: fn },
    { text: "());      ", color: plain },
    { text: "// typed, no string keys", color: comment },
  ],
];

const cliLines: Line[] = [
  [
    { text: "$ ", color: comment },
    { text: "neo pull", color: plain },
  ],
  [{ text: "  ✓ schema synced → neo/Schema/*.cs", color: ok }],
  [],
  [
    { text: "$ ", color: comment },
    { text: "neo branch create dlc-rat-king", color: plain },
  ],
  [
    { text: "$ ", color: comment },
    { text: "neo push", color: plain },
  ],
  [{ text: "  ✓ 12 records committed (minor bump)", color: ok }],
  [],
  [
    { text: "$ ", color: comment },
    { text: "neo merge dlc-rat-king --into main", color: plain },
  ],
  [{ text: "  ✓ field-level merge — 0 conflicts", color: ok }],
  [],
  [{ text: "# Your repo, your review flow, your agents.", color: comment }],
];

const flowLines: Line[] = [
  [{ text: "// Smart triggers, authored visually", color: comment }],
  [
    { text: "group", color: keyword },
    { text: " Shop.Grubbins ", color: plain },
    { text: "lookup", color: keyword },
    { text: "(Assets.NPCs)", color: plain },
  ],
  [
    { text: "  when", color: keyword },
    { text: " save.Gold >= Assets.Prices.CursedSword", color: plain },
  ],
  [],
  [
    { text: "dialogue", color: keyword },
    { text: " ", color: plain },
    { text: "\"Sword sales pitch\"", color: str },
    { text: " priority ", color: plain },
    { text: "High", color: type },
  ],
  [
    { text: "dialogue", color: keyword },
    { text: " ", color: plain },
    { text: "\"Rat gossip\"", color: str },
    { text: " priority ", color: plain },
    { text: "Low", color: type },
  ],
  [],
  [{ text: "// Both eligible? The pitch wins on priority.", color: comment }],
  [{ text: "// Equal priority would draw at random —", color: comment }],
  [{ text: "// fresh lines every playthrough.", color: comment }],
];

const tabs = [
  { id: "csharp", label: "Unity C#", lines: csharpLines },
  { id: "cli", label: "neo CLI", lines: cliLines },
  { id: "flow", label: "NeoScript", lines: flowLines },
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
            <br />
            Nothing sacrificed.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-dim">
            Moving your schema into Neo Compose doesn&apos;t mean giving up
            what makes C# great. The generated code feels native to Unity —
            and stays byte-for-byte in sync with what you see in the UI.
          </p>
          <ul className="mt-6 space-y-3 text-ink-dim">
            {[
              "Inheritance and abstract custom types generate real C# class hierarchies",
              "Bind NeoScript functions to your own native C# methods",
              "Typed change subscriptions — no string keys, no reflection in your hot path",
              "Autocomplete across your entire data model; if it compiles, it matches the project",
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
              className="min-h-[24rem] overflow-x-auto p-6 font-mono text-sm leading-7"
            >
              {active.lines.map((line, lineIndex) => (
                <motion.div
                  key={`${activeId}-${lineIndex}`}
                  initial={{ opacity: 0, y: activeId === "cli" ? 4 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: activeId === "cli" ? lineIndex * 0.22 : 0,
                    duration: 0.18,
                  }}
                >
                  {line.length === 0
                    ? " "
                    : line.map((token, tokenIndex) => (
                        <span key={tokenIndex} className={token.color}>
                          {token.text}
                        </span>
                      ))}
                </motion.div>
              ))}
            </motion.pre>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
