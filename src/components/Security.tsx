"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Eye,
  KeyRound,
  Lock,
  Rocket,
  Save,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

type RoleId = "owner" | "developer" | "translator" | "playtester";

interface Role {
  id: RoleId;
  label: string;
  emoji: string;
  blurb: string;
  channels: Record<ChannelId, { read: boolean; publish: boolean }>;
  saves: string;
}

type ChannelId = "development" | "staging" | "production";

const channels: Array<{ id: ChannelId; label: string; icon: typeof Rocket; note: string }> = [
  { id: "development", label: "Development", icon: Eye, note: "open to the team" },
  { id: "staging", label: "Staging / Beta", icon: UserCheck, note: "invited playtesters" },
  { id: "production", label: "Production", icon: Lock, note: "locked by default" },
];

const roles: Role[] = [
  {
    id: "owner",
    label: "Owner",
    emoji: "👑",
    blurb:
      "Org owners hold an immutable safety-net policy — no misconfigured rule can ever lock them out of their own project.",
    channels: {
      development: { read: true, publish: true },
      staging: { read: true, publish: true },
      production: { read: true, publish: true },
    },
    saves: "Can view playtester saves shared with the team to debug reports.",
  },
  {
    id: "developer",
    label: "Developer",
    emoji: "🛠",
    blurb:
      "Developers edit schema, values, and dialogues, and ship to internal channels — production stays out of reach unless granted.",
    channels: {
      development: { read: true, publish: true },
      staging: { read: true, publish: true },
      production: { read: true, publish: false },
    },
    saves: "Opens a beta tester's shared save in the web editor, fixes the corrupt value, ships the patch.",
  },
  {
    id: "translator",
    label: "Translator",
    emoji: "🌍",
    blurb:
      "Translators edit localized strings — and only localized strings. Status policies even control who can mark a string Approved.",
    channels: {
      development: { read: true, publish: false },
      staging: { read: true, publish: false },
      production: { read: false, publish: false },
    },
    saves: "No access to player saves. Scopes end where the job does.",
  },
  {
    id: "playtester",
    label: "Playtester",
    emoji: "🎮",
    blurb:
      "Invited by email, signs in from the shipped game via per-project OAuth. Sees exactly one channel — the beta they were invited to.",
    channels: {
      development: { read: false, publish: false },
      staging: { read: true, publish: false },
      production: { read: false, publish: false },
    },
    saves: "Owns their save files by default — and chooses to share one with the devs when something breaks.",
  },
];

export function Security() {
  const [roleId, setRoleId] = useState<RoleId>("developer");
  const role = roles.find((entry) => entry.id === roleId)!;

  return (
    <section id="security" className="relative py-24">
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-neon-green/8 blur-[130px]" />
      <div className="mx-auto w-[min(72rem,calc(100%-2rem))]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-ink-dim">
            <ShieldCheck className="size-4 text-neon-green" /> Enterprise-grade, indie-friendly
          </p>
          <h2 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Ship to the <span className="text-gradient">right players</span>.
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            Policy-based roles, per-channel access, and per-project OAuth with
            narrow scopes. Pick a role and see what it can touch.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {roles.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setRoleId(entry.id)}
              className={`rounded-xl px-5 py-2.5 font-display text-sm font-bold transition-all ${
                entry.id === roleId
                  ? "bg-blurple text-white shadow-[0_0_24px_rgb(108_92_231/0.5)]"
                  : "glass text-ink-dim hover:text-ink"
              }`}
            >
              {entry.emoji} {entry.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={roleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-center text-ink-dim"
          >
            {role.blurb}
          </motion.p>
        </AnimatePresence>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {channels.map((channel, index) => {
            const access = role.channels[channel.id];
            return (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.08 }}
                className={`glass rounded-2xl p-6 transition-all duration-300 ${
                  access.read ? "" : "opacity-45 saturate-50"
                }`}
              >
                <p className="flex items-center justify-between font-display font-bold">
                  <span className="flex items-center gap-2">
                    <channel.icon className="size-4 text-blurple-bright" />
                    {channel.label}
                  </span>
                  {channel.id === "production" && (
                    <Lock className="size-4 text-neon-yellow" />
                  )}
                </p>
                <p className="mt-1 text-xs text-ink-dim">{channel.note}</p>
                <div className="mt-5 flex gap-2">
                  <span
                    className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
                      access.read
                        ? "bg-neon-green/15 text-neon-green"
                        : "bg-panel-2 text-ink-dim line-through"
                    }`}
                  >
                    read
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
                      access.publish
                        ? "bg-neon-green/15 text-neon-green"
                        : "bg-panel-2 text-ink-dim line-through"
                    }`}
                  >
                    publish
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass rounded-2xl p-6"
          >
            <p className="flex items-center gap-2 font-display font-bold">
              <Save className="size-4 text-ice" /> Playtester saves, debugged in place
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={roleId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-3 leading-relaxed text-ink-dim"
              >
                {role.saves}
              </motion.p>
            </AnimatePresence>
            <p className="mt-4 rounded-xl bg-void/60 px-4 py-3 font-mono text-xs text-ink-dim">
              wandering-otter-619.save · shared by 🎮 ottilie → 🛠 team
              <span className="text-neon-green"> · snapshot restored ✓</span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.08 }}
            className="glass rounded-2xl p-6"
          >
            <p className="flex items-center gap-2 font-display font-bold">
              <KeyRound className="size-4 text-neon-yellow" /> Tokens that can&apos;t overreach
            </p>
            <ul className="mt-3 space-y-2 text-ink-dim">
              <li>· Per-project OAuth clients with player-consented scopes</li>
              <li>· Device-code sign-in from Unity and shipped games</li>
              <li>· Secure channels can require OAuth on top of API keys</li>
              <li>· Every policy editable — down to invited-email playtests</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
