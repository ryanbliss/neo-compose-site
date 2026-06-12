"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";

type SaveState = {
  favColor: string | null;
  stormCorn: number;
  metKeeper: boolean;
};

interface DialogueNode {
  speaker: string;
  text: (save: SaveState) => string;
  choices?: Array<{
    label: string;
    next: string;
    apply?: (save: SaveState) => SaveState;
    badge?: string;
  }>;
  next?: string;
}

const script: Record<string, DialogueNode> = {
  start: {
    speaker: "Outpost Keeper",
    text: () =>
      "You came back. Good. Close the door — Neptune's storms chew up dirtsider ships for breakfast.",
    next: "favColor",
  },
  favColor: {
    speaker: "Outpost Keeper",
    text: () => "Before I trust you with the vault… what is your favorite color?",
    choices: [
      {
        label: "Blue",
        next: "blue",
        apply: (save) => ({ ...save, favColor: "Blue", metKeeper: true }),
        badge: "save.FavColor = Blue",
      },
      {
        label: "Pink",
        next: "pink",
        apply: (save) => ({ ...save, favColor: "Pink", metKeeper: true }),
        badge: "save.FavColor = Pink",
      },
      {
        label: "Green",
        next: "green",
        apply: (save) => ({ ...save, favColor: "Green", metKeeper: true }),
        badge: "save.FavColor = Green",
      },
    ],
  },
  blue: {
    speaker: "Outpost Keeper",
    text: () => "Blue. Like the home you left behind. I'm blue too — if I were green I would die.",
    next: "reward",
  },
  pink: {
    speaker: "Outpost Keeper",
    text: () => "Pink?! Ha! If I were pink I would PIE.",
    next: "reward",
  },
  green: {
    speaker: "Outpost Keeper",
    text: () => "Green — the one color this planet has never seen. You'll fit right in.",
    next: "reward",
  },
  reward: {
    speaker: "Outpost Keeper",
    text: () => "Here. Storm Corn from the hydro bay. Don't ask how it's grown.",
    choices: [
      {
        label: "Take the Storm Corn 🌽",
        next: "end",
        apply: (save) => ({ ...save, stormCorn: save.stormCorn + 1 }),
        badge: "save.Items.Add(StormCorn)",
      },
    ],
  },
  end: {
    speaker: "Outpost Keeper",
    text: (save) =>
      `Next time you visit, I'll remember you like ${save.favColor ?? "…nothing"}. That's the point — this conversation lives in your save file.`,
  },
};

const initialSave: SaveState = { favColor: null, stormCorn: 0, metKeeper: false };

function useTypewriter(text: string): string {
  const [typed, setTyped] = useState({ text, count: 0 });
  if (typed.text !== text) {
    setTyped({ text, count: 0 });
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setTyped((prev) => {
        if (prev.count >= prev.text.length) {
          clearInterval(timer);
          return prev;
        }
        return { text: prev.text, count: prev.count + 2 };
      });
    }, 18);
    return () => clearInterval(timer);
  }, [text]);
  return typed.text === text ? text.slice(0, typed.count) : "";
}

export function DialogueDemo() {
  const [nodeId, setNodeId] = useState("start");
  const [save, setSave] = useState<SaveState>(initialSave);
  const [lastWrite, setLastWrite] = useState<string | null>(null);
  const node = script[nodeId];
  const fullText = node.text(save);
  const typed = useTypewriter(fullText);
  const done = typed.length >= fullText.length;
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveJson = useMemo(
    () =>
      JSON.stringify(
        {
          values: {
            FavColor: save.favColor,
            MetKeeper: save.metKeeper,
            Items: save.stormCorn > 0 ? [`StormCorn x${save.stormCorn}`] : [],
          },
        },
        null,
        2,
      ),
    [save],
  );

  function choose(choice: NonNullable<DialogueNode["choices"]>[number]) {
    if (choice.apply) {
      setSave(choice.apply(save));
      if (choice.badge) {
        setLastWrite(choice.badge);
        if (writeTimer.current) clearTimeout(writeTimer.current);
        writeTimer.current = setTimeout(() => setLastWrite(null), 2200);
      }
    }
    setNodeId(choice.next);
  }

  function reset() {
    setSave(initialSave);
    setNodeId("start");
    setLastWrite(null);
  }

  return (
    <section id="play" className="relative py-24">
      <div className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 rounded-full bg-neon-pink/10 blur-[120px]" />
      <div className="mx-auto w-[min(72rem,calc(100%-2rem))]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Choices that <span className="text-gradient">stick</span>.
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            This dialogue was authored as a flow. Pick an option and watch it
            write into the save file — exactly what your game gets at runtime.
          </p>
        </motion.div>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[3fr_2fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass glow-ring flex flex-col rounded-2xl p-6"
          >
            <div className="flex items-center justify-between border-b border-edge pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-blurple/25 text-lg">
                  🪐
                </span>
                <div>
                  <p className="font-display font-bold">{node.speaker}</p>
                  <p className="text-xs text-ink-dim">Outpost Caelus Anchorpoint · Uranus</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-edge px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-blurple-bright hover:text-ink"
              >
                <RotateCcw className="size-3.5" /> Replay
              </button>
            </div>
            <p className="min-h-28 py-6 text-lg leading-relaxed">
              {typed}
              {!done && <span className="animate-pulse text-blurple-bright">▌</span>}
            </p>
            <div className="mt-auto flex flex-wrap gap-3">
              <AnimatePresence mode="popLayout">
                {done && node.choices?.map((choice) => (
                  <motion.button
                    key={choice.label}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => choose(choice)}
                    className="rounded-xl border border-blurple/60 bg-blurple/15 px-5 py-2.5 font-semibold text-blurple-bright transition-colors hover:bg-blurple/30"
                  >
                    {choice.label}
                  </motion.button>
                ))}
                {done && !node.choices && node.next && (
                  <motion.button
                    key="continue"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setNodeId(node.next!)}
                    className="rounded-xl border border-edge px-5 py-2.5 font-semibold text-ink-dim transition-colors hover:border-blurple-bright hover:text-ink"
                  >
                    Continue →
                  </motion.button>
                )}
                {done && !node.choices && !node.next && (
                  <motion.p
                    key="fin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-sm text-neon-green"
                  >
                    ✓ dialogue complete — state saved
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass relative flex flex-col rounded-2xl p-6 font-mono text-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-ink-dim">
                <span className="text-neon-green">●</span> wandering-otter-619.save
              </p>
              <span className="rounded-md bg-neon-green/15 px-2 py-0.5 text-xs font-bold text-neon-green">
                LIVE
              </span>
            </div>
            <motion.pre
              key={saveJson}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="mt-4 grow overflow-auto rounded-xl bg-void/70 p-4 leading-relaxed text-ice"
            >
              {saveJson}
            </motion.pre>
            <AnimatePresence>
              {lastWrite && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute bottom-4 left-6 right-6 rounded-lg bg-blurple/20 px-3 py-2 text-xs text-blurple-bright"
                >
                  ✏️ {lastWrite}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
