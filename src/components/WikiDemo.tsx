"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileClock, Link2, ShieldCheck } from "lucide-react";

interface Npc {
  id: string;
  emoji: string;
  name: string;
  role: string;
  friendship: number;
  changelog: Array<{ version: string; change: string }>;
  dialogues: string[];
}

const npcs: Npc[] = [
  {
    id: "grubbins",
    emoji: "👺",
    name: "Grubbins",
    role: "Shopkeeper",
    friendship: 12,
    changelog: [
      { version: "1.2.0", change: "Friendship default 0 → 12 (returning players)" },
      { version: "1.1.0", change: "Added CursedSword to shop inventory" },
      { version: "1.0.0", change: "Created with role Shopkeeper" },
    ],
    dialogues: ["Sword sales pitch", "Curse disclosure", "Haggling 101"],
  },
  {
    id: "bartholomew",
    emoji: "🐀",
    name: "Bartholomew",
    role: "Shop rat",
    friendship: 99,
    changelog: [
      { version: "1.2.0", change: "Promoted from prop to NPC (community demand)" },
      { version: "1.1.2", change: "Bite chance 100% → 97%" },
    ],
    dialogues: ["Squeak (loving)", "Squeak (menacing)"],
  },
  {
    id: "ratking",
    emoji: "👑",
    name: "The Rat King",
    role: "??? (DLC)",
    friendship: 0,
    changelog: [
      { version: "dlc-rat-king", change: "Drafted on branch — unmerged" },
    ],
    dialogues: ["A thousand squeaks as one"],
  },
];

export function WikiDemo() {
  const [selectedId, setSelectedId] = useState("grubbins");
  const npc = npcs.find((entry) => entry.id === selectedId)!;

  return (
    <section id="wiki" className="relative py-24">
      <div className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-neon-yellow/8 blur-[130px]" />
      <div className="mx-auto w-[min(72rem,calc(100%-2rem))]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Docs that <span className="text-gradient">can&apos;t go stale</span>.
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            The wiki embeds the same database your game code reads. Pick an
            NPC — the values, changelog, and linked dialogues are live, not
            copy-pasted screenshots.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="glass glow-ring mt-14 grid overflow-hidden rounded-2xl md:grid-cols-[2fr_3fr]"
        >
          <div className="border-b border-edge p-6 md:border-b-0 md:border-r">
            <p className="font-display text-sm font-bold text-ink-dim">
              📖 Wiki · Cast of The Rusty Gobl-Inn
            </p>
            <p className="mt-3 text-sm text-ink-dim">
              Embedded database block —{" "}
              <span className="font-mono text-xs text-ice">Assets.NPCs</span>
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-edge">
              <div className="grid grid-cols-[2fr_1.4fr_1fr] gap-2 border-b border-edge bg-panel-2 px-4 py-2 font-mono text-xs text-ink-dim">
                <span>Name</span>
                <span>Role</span>
                <span className="text-right">❤️</span>
              </div>
              {npcs.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  className={`grid w-full grid-cols-[2fr_1.4fr_1fr] items-center gap-2 px-4 py-3 text-left text-sm transition-colors ${
                    entry.id === selectedId
                      ? "bg-blurple/20 text-ink"
                      : "text-ink-dim hover:bg-panel-2"
                  }`}
                >
                  <span className="truncate">
                    {entry.emoji} {entry.name}
                  </span>
                  <span className="truncate text-xs">{entry.role}</span>
                  <span className="text-right font-mono text-xs">
                    {entry.friendship}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-dim">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-neon-green" />
              Wiki editor &amp; moderator roles control who writes — built for
              community-facing docs and mod teams.
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={npc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-6"
            >
              <h3 className="font-display text-2xl font-bold">
                {npc.emoji} {npc.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-ink-dim">
                Assets.NPCs.{npc.name.replace(/[^a-zA-Z]/g, "")} · {npc.role}
              </p>

              <p className="mt-6 flex items-center gap-2 font-display text-sm font-bold text-ink-dim">
                <FileClock className="size-4" /> Changelog — auto-linked to values
              </p>
              <ul className="mt-3 space-y-2">
                {npc.changelog.map((entry) => (
                  <li
                    key={`${entry.version}-${entry.change}`}
                    className="flex items-start gap-3 rounded-lg bg-void/50 px-3 py-2 text-sm"
                  >
                    <span className="shrink-0 rounded-md bg-blurple/20 px-2 py-0.5 font-mono text-xs text-blurple-bright">
                      {entry.version}
                    </span>
                    <span className="text-ink-dim">{entry.change}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex items-center gap-2 font-display text-sm font-bold text-ink-dim">
                <Link2 className="size-4" /> Linked dialogues
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {npc.dialogues.map((dialogue) => (
                  <span
                    key={dialogue}
                    className="rounded-full border border-edge bg-panel-2 px-3 py-1.5 text-xs text-ink-dim"
                  >
                    💬 {dialogue}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
