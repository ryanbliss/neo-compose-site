"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface FlowNode {
  id: string;
  x: number;
  y: number;
  w: number;
  title: string;
  body: string;
  accent: string;
}

const nodes: FlowNode[] = [
  {
    id: "trigger",
    x: 150,
    y: 16,
    w: 220,
    title: "⚡ Trigger",
    body: "npc.Friendship > 50",
    accent: "var(--color-neon-yellow)",
  },
  {
    id: "choice",
    x: 120,
    y: 132,
    w: 280,
    title: "💬 Choice — fav color",
    body: "“What is your favorite color?”",
    accent: "var(--color-blurple-bright)",
  },
  {
    id: "blue",
    x: 16,
    y: 268,
    w: 200,
    title: "🟦 Blue",
    body: "save.FavColor = Blue",
    accent: "var(--color-ice)",
  },
  {
    id: "pink",
    x: 300,
    y: 268,
    w: 200,
    title: "🩷 Pink",
    body: "“If I were pink I would PIE”",
    accent: "var(--color-neon-pink)",
  },
  {
    id: "reward",
    x: 158,
    y: 384,
    w: 204,
    title: "🎁 Action",
    body: "save.Items.Add(StormCorn)",
    accent: "var(--color-neon-green)",
  },
];

const edges: Array<[string, string]> = [
  ["trigger", "choice"],
  ["choice", "blue"],
  ["choice", "pink"],
  ["blue", "reward"],
  ["pink", "reward"],
];

function center(node: FlowNode): { x: number; y: number } {
  return { x: node.x + node.w / 2, y: node.y + 36 };
}

export function FlowGraph() {
  const [active, setActive] = useState<string | null>(null);
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="relative h-[480px] w-[520px] max-w-full animate-float select-none">
      <svg
        viewBox="0 0 520 480"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {edges.map(([from, to]) => {
          const a = center(byId.get(from)!);
          const b = center(byId.get(to)!);
          const midY = (a.y + b.y) / 2 + 28;
          const isHot = active === from || active === to;
          return (
            <path
              key={`${from}-${to}`}
              d={`M ${a.x} ${a.y + 30} C ${a.x} ${midY}, ${b.x} ${midY - 40}, ${b.x} ${b.y - 4}`}
              fill="none"
              stroke={isHot ? "var(--color-blurple-bright)" : "var(--color-edge)"}
              strokeWidth={isHot ? 2.5 : 1.5}
              strokeDasharray="6 6"
              className="animate-dash transition-[stroke] duration-200"
            />
          );
        })}
      </svg>
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35 + index * 0.12, type: "spring", damping: 16 }}
          onHoverStart={() => setActive(node.id)}
          onHoverEnd={() => setActive(null)}
          whileHover={{ scale: 1.06, rotate: index % 2 === 0 ? -1 : 1 }}
          className="glass absolute cursor-grab rounded-xl p-3 shadow-xl"
          style={{
            left: node.x,
            top: node.y,
            width: node.w,
            borderColor: active === node.id ? node.accent : undefined,
          }}
        >
          <p
            className="font-display text-sm font-bold"
            style={{ color: node.accent }}
          >
            {node.title}
          </p>
          <p className="mt-1 truncate font-mono text-xs text-ink-dim">
            {node.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
