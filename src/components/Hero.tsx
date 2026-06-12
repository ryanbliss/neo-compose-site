"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { FlowGraph } from "./FlowGraph";

export function Hero() {
  return (
    <section
      id="top"
      className="bg-grid relative overflow-hidden pb-24 pt-40"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-blurple/25 blur-[140px]" />
      <div className="mx-auto flex w-[min(72rem,calc(100%-2rem))] flex-col items-center gap-16 lg:flex-row lg:items-start">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-ink-dim"
          >
            <Sparkles className="size-4 text-neon-yellow" />
            The content platform for story-driven games
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl"
          >
            Build <span className="text-gradient">worlds</span>,<br />
            not spreadsheets.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg leading-relaxed text-ink-dim"
          >
            Neo Compose turns your game&apos;s data — schemas, branching
            dialogue, saves, and translations — into one living project that
            ships straight into Unity as typed C#. Author it on the web, sync
            it in realtime, version it like code.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#cta"
              className="group flex items-center gap-2 rounded-xl bg-blurple px-6 py-3 font-semibold text-white shadow-[0_0_32px_rgb(108_92_231/0.55)] transition-transform hover:scale-105 active:scale-95"
            >
              Start your project
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#play"
              className="glass rounded-xl px-6 py-3 font-semibold text-ink transition-colors hover:border-blurple-bright"
            >
              ▶ Play a dialogue
            </a>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 font-mono text-sm text-ink-dim"
          >
            <span className="text-neon-green">$</span> npx neo-compose init
          </motion.p>
        </div>
        <div className="relative shrink-0">
          <FlowGraph />
        </div>
      </div>
    </section>
  );
}
