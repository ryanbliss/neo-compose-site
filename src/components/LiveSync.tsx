"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Globe, MonitorPlay, Zap } from "lucide-react";

interface BiomeAction {
  label: string;
  delta: number;
}

const biomes: Array<{ name: string; emoji: string; actions: BiomeAction[] }> = [
  {
    name: "Tavern",
    emoji: "🍺",
    actions: [
      { label: "Drink ale", delta: -5 },
      { label: "Order stew", delta: +8 },
    ],
  },
  {
    name: "Swamp",
    emoji: "🐸",
    actions: [
      { label: "Lick the frog", delta: -10 },
      { label: "Forage herbs", delta: +6 },
    ],
  },
  {
    name: "Crypt",
    emoji: "💀",
    actions: [
      { label: "Touch the orb", delta: -20 },
      { label: "Light a candle", delta: +4 },
    ],
  },
  {
    name: "Rat Tunnels",
    emoji: "🐀",
    actions: [
      { label: "Share cheese", delta: +10 },
      { label: "Pet too many rats", delta: -3 },
    ],
  },
];

function clampHp(value: number): number {
  return Math.min(100, Math.max(1, value));
}

function formatDelta(delta: number): string {
  return `${delta > 0 ? "+" : ""}${delta} HP`;
}

export function LiveSync() {
  const [hp, setHp] = useState(72);
  const [biomeIndex, setBiomeIndex] = useState(0);
  const [actionIndex, setActionIndex] = useState(0);
  const [lastSource, setLastSource] = useState<"web" | "game">("web");
  const biome = biomes[biomeIndex];
  const action = biome.actions[actionIndex] ?? biome.actions[0];

  return (
    <section id="sync" className="relative py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-neon-green/8 blur-[120px]" />
      <div className="mx-auto w-[min(72rem,calc(100%-2rem))]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Tune values <span className="text-gradient">while you playtest</span>.
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            Live save sessions stream patches both ways over a realtime
            socket. Drag a slider in the web editor — or play from the game
            side — and watch the other end follow.
          </p>
        </motion.div>

        <div className="relative mt-14 grid items-stretch gap-6 md:grid-cols-2">
          <div className="pointer-events-none absolute -top-4 left-1/2 z-10 hidden -translate-x-1/2 md:block">
            <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-neon-green">
              <Zap className="size-3.5 animate-pulse-glow" /> realtime ⇄
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass rounded-2xl p-6"
          >
            <p className="flex items-center gap-2 font-display font-bold text-ink-dim">
              <Globe className="size-4" /> Neo Compose · web editor
            </p>
            <div className="mt-6 space-y-7">
              <label className="block">
                <span className="flex justify-between font-mono text-sm">
                  <span className="text-ink-dim">save.Player.HP</span>
                  <motion.span
                    key={hp}
                    initial={{ scale: lastSource === "game" ? 1.25 : 1 }}
                    animate={{ scale: 1 }}
                    className={`${lastSource === "game" ? "text-neon-green" : "text-ice"}`}
                  >
                    {hp}
                  </motion.span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={hp}
                  onChange={(event) => {
                    setHp(Number(event.target.value));
                    setLastSource("web");
                  }}
                  className="mt-2 w-full accent-[var(--color-blurple)]"
                />
              </label>
              <label className="block">
                <span className="flex justify-between font-mono text-sm">
                  <span className="text-ink-dim">save.Biome (enum Biome)</span>
                  <span className="text-ice">{biome.name}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={biomes.length - 1}
                  value={biomeIndex}
                  onChange={(event) => {
                    setBiomeIndex(Number(event.target.value));
                    setActionIndex(0);
                    setLastSource("web");
                  }}
                  className="mt-2 w-full accent-[var(--color-neon-pink)]"
                />
              </label>
            </div>
            <p className="mt-6 font-mono text-xs text-ink-dim">
              gameSaves.patchLiveSnapshot · per-key merge · offline queue
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass glow-ring overflow-hidden rounded-2xl p-6"
          >
            <p className="flex items-center justify-between font-display font-bold text-ink-dim">
              <span className="flex items-center gap-2">
                <MonitorPlay className="size-4" /> Unity · play mode
              </span>
              <span className="rounded-md bg-neon-green/15 px-2 py-0.5 text-xs font-bold text-neon-green">
                LIVE
              </span>
            </p>
            <div className="mt-6 rounded-xl bg-void/70 p-5">
              <div className="flex min-w-0 items-center gap-3">
                <motion.span
                  key={biomeIndex}
                  initial={{ scale: 0.5, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="shrink-0 text-4xl"
                >
                  {biome.emoji}
                </motion.span>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold">
                    {biome.name}
                  </p>
                  <p className="truncate font-mono text-xs text-ink-dim">
                    wandering-otter-619 · The Rusty Gobl-Inn
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <p className="mb-1 flex justify-between font-mono text-xs text-ink-dim">
                  <span>HP</span>
                  <span>{hp}/100</span>
                </p>
                <div className="h-3 overflow-hidden rounded-full bg-panel-2">
                  <motion.div
                    animate={{ width: `${hp}%` }}
                    transition={{ type: "spring", stiffness: 160, damping: 20 }}
                    className={`h-full rounded-full ${
                      hp > 50
                        ? "bg-neon-green"
                        : hp > 25
                          ? "bg-neon-yellow"
                          : "bg-neon-pink"
                    }`}
                  />
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <select
                  value={actionIndex}
                  onChange={(event) => setActionIndex(Number(event.target.value))}
                  aria-label="Choose an action"
                  className="min-w-0 flex-1 truncate rounded-xl border border-edge bg-panel-2 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-blurple-bright"
                >
                  {biome.actions.map((entry, index) => (
                    <option key={entry.label} value={index}>
                      {entry.label} ({formatDelta(entry.delta)})
                    </option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setHp((current) => clampHp(current + action.delta));
                    setLastSource("game");
                  }}
                  className="shrink-0 whitespace-nowrap rounded-xl border border-blurple/60 bg-blurple/15 px-5 py-2 text-sm font-semibold text-blurple-bright transition-colors hover:bg-blurple/30"
                >
                  Do it
                </motion.button>
              </div>
              <motion.p
                key={`${hp}-${biomeIndex}-${lastSource}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1.4 }}
                className="mt-5 font-mono text-xs text-neon-green"
              >
                {lastSource === "game"
                  ? "⇄ patch streamed to the web editor"
                  : "⟲ patch applied in-game"}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
