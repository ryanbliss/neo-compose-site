"use client";

import { motion } from "motion/react";
import { Gamepad2 } from "lucide-react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#play", label: "Try a dialogue" },
  { href: "#code", label: "Code" },
  { href: "#sync", label: "Live sync" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav className="glass mx-auto mt-4 flex w-[min(72rem,calc(100%-2rem))] items-center justify-between rounded-2xl px-5 py-3">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative grid size-9 place-items-center rounded-xl bg-blurple/20">
            <Gamepad2 className="size-5 text-blurple-bright" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-neon-green animate-pulse-glow" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            neo<span className="text-blurple-bright">compose</span>
          </span>
        </a>
        <div className="hidden items-center gap-6 text-sm text-ink-dim md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="#cta"
          className="rounded-xl bg-blurple px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgb(108_92_231/0.5)] transition-transform hover:scale-105 active:scale-95"
        >
          Start building
        </a>
      </nav>
    </motion.header>
  );
}
