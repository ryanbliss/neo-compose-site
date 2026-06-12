"use client";

import { motion } from "motion/react";
import {
  BookOpenText,
  Boxes,
  CloudUpload,
  GitBranch,
  Languages,
  MessageSquareMore,
  SquareTerminal,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  accent: string;
  className?: string;
}

const features: Feature[] = [
  {
    icon: MessageSquareMore,
    title: "Dialogue flows that know your game",
    body: "A node-graph editor wired to your actual data model. Smart triggers, priorities, and lookup groups pick the right line for the right NPC — choices persist straight into the save file.",
    accent: "text-blurple-bright",
    className: "md:col-span-2",
  },
  {
    icon: Boxes,
    title: "Visual schema builder",
    body: "Design assets, saves, and session data with custom types, enums, lists, and computed getters — no spreadsheets, no hand-rolled JSON.",
    accent: "text-neon-pink",
  },
  {
    icon: Wand2,
    title: "Typed C# for Unity",
    body: "One click exports project.json plus generated C#. neo.Save.World, Dialogues.NPC.Talk.TryTrigger(npc, out var line) — autocomplete all the way down.",
    accent: "text-neon-green",
  },
  {
    icon: CloudUpload,
    title: "Cloud saves & live sessions",
    body: "Per-project OAuth, cross-platform save sync, and realtime live sessions: edit a value on the web and watch it change in-game while you playtest.",
    accent: "text-ice",
    className: "md:col-span-2",
  },
  {
    icon: Languages,
    title: "Localization built in",
    body: "ICU strings, locale source chains, translation statuses, and import/export pipelines — every player-facing string versioned per locale.",
    accent: "text-neon-yellow",
  },
  {
    icon: GitBranch,
    title: "Version everything",
    body: "Semver releases, branches, channels, migrations, and full changelogs. Patch drafts can't break your runtime contract — the tool enforces it.",
    accent: "text-blurple-bright",
  },
  {
    icon: BookOpenText,
    title: "A wiki that's part of the game",
    body: "Notion-style pages with live database blocks. Document a quest next to the actual quest data — it's never out of date.",
    accent: "text-neon-pink",
  },
  {
    icon: SquareTerminal,
    title: "Schema as code",
    body: "The neo CLI mirrors your project as compilable C#: pull, push, diff, branch, merge. Perfect for code review — and for your coding agents.",
    accent: "text-neon-green",
  },
];

export function FeatureBento() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto w-[min(72rem,calc(100%-2rem))]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            One project. <span className="text-gradient">Every system.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            Everything your narrative, design, and engineering teams touch —
            in a single versioned source of truth.
          </p>
        </motion.div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (index % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className={`glass group relative overflow-hidden rounded-2xl p-6 transition-colors hover:border-blurple ${feature.className ?? ""}`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blurple/10 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
              <feature.icon className={`size-7 ${feature.accent}`} />
              <h3 className="font-display mt-4 text-xl font-bold">
                {feature.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-dim">{feature.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
