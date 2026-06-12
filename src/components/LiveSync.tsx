"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Globe, MonitorPlay, Zap } from "lucide-react";

const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

export function LiveSync() {
  const [hp, setHp] = useState(72);
  const [planetIndex, setPlanetIndex] = useState(6);

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
            Live save sessions stream edits over a realtime socket. Drag the
            sliders in the &quot;web editor&quot; — that&apos;s your game on
            the right, mid-playtest.
          </p>
        </motion.div>

        <div className="relative mt-14 grid items-stretch gap-6 md:grid-cols-2">
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-neon-green">
              <Zap className="size-3.5 animate-pulse-glow" /> realtime
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
                  <span className="text-ice">{hp}</span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={hp}
                  onChange={(event) => setHp(Number(event.target.value))}
                  className="mt-2 w-full accent-[var(--color-blurple)]"
                />
              </label>
              <label className="block">
                <span className="flex justify-between font-mono text-sm">
                  <span className="text-ink-dim">save.World (enum Planet)</span>
                  <span className="text-ice">{planets[planetIndex]}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={planets.length - 1}
                  value={planetIndex}
                  onChange={(event) => setPlanetIndex(Number(event.target.value))}
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
              <div className="flex items-center gap-3">
                <motion.span
                  key={planetIndex}
                  initial={{ scale: 0.5, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="text-4xl"
                >
                  {["☿️", "♀️", "🌍", "🔴", "🟠", "🪐", "🌀", "🔵"][planetIndex]}
                </motion.span>
                <div>
                  <p className="font-display text-lg font-bold">
                    {planets[planetIndex]}
                  </p>
                  <p className="font-mono text-xs text-ink-dim">
                    Outpost wandering-otter-619
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
              <motion.p
                key={`${hp}-${planetIndex}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1.4 }}
                className="mt-5 font-mono text-xs text-neon-green"
              >
                ⟲ patch applied in-game
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
