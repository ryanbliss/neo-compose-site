"use client";

import { motion } from "motion/react";
import { ArrowRight, Gamepad2 } from "lucide-react";

export function Footer() {
  return (
    <footer id="cta" className="relative overflow-hidden pb-12 pt-24">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[28rem] w-[64rem] -translate-x-1/2 rounded-full bg-blurple/20 blur-[140px]" />
      <div className="mx-auto w-[min(72rem,calc(100%-2rem))]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="glass glow-ring rounded-3xl px-8 py-16 text-center"
        >
          <h2 className="font-display mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Your game&apos;s story deserves better than a
            <span className="text-gradient"> spreadsheet</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-dim">
            Schema, dialogue, saves, locales, releases — one project, typed
            end to end, synced to Unity in realtime.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#top"
              className="group flex items-center gap-2 rounded-xl bg-blurple px-7 py-3.5 font-semibold text-white shadow-[0_0_32px_rgb(108_92_231/0.55)] transition-transform hover:scale-105 active:scale-95"
            >
              Create your first project
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <code className="glass rounded-xl px-5 py-3.5 font-mono text-sm text-ink-dim">
              <span className="text-neon-green">$</span> npx neo-compose init
            </code>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-edge pt-8 text-sm text-ink-dim md:flex-row">
          <p className="flex items-center gap-2">
            <Gamepad2 className="size-4 text-blurple-bright" />
            <span className="font-display font-bold text-ink">
              neo<span className="text-blurple-bright">compose</span>
            </span>
            · built for story-driven games
          </p>
          <p>© {new Date().getFullYear()} Studio Bliss</p>
        </div>
      </div>
    </footer>
  );
}
