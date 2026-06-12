"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Layers, Map as MapIcon } from "lucide-react";

type Tile = "grass" | "dirt" | "water";
type Tool = Tile | "tree" | "axe";

interface Cell {
  tile: Tile;
  tree: boolean;
}

const GRID_W = 12;
const GRID_H = 7;

const tileColors: Record<Tile, string> = {
  grass: "#3a7d44",
  dirt: "#8a5a33",
  water: "#2f6f9f",
};

const tools: Array<{ id: Tool; label: string; emoji: string }> = [
  { id: "grass", label: "Grass", emoji: "🌿" },
  { id: "dirt", label: "Dirt", emoji: "🟫" },
  { id: "water", label: "Water", emoji: "💧" },
  { id: "tree", label: "Oak tree", emoji: "🌳" },
  { id: "axe", label: "Axe", emoji: "🪓" },
];

function initialCells(): Cell[] {
  const cells: Cell[] = Array.from({ length: GRID_W * GRID_H }, () => ({
    tile: "grass" as Tile,
    tree: false,
  }));
  for (const index of [14, 27, 40]) cells[index] = { tile: "grass", tree: true };
  return cells;
}

export function LevelEditor() {
  const [cells, setCells] = useState<Cell[]>(initialCells);
  const [tool, setTool] = useState<Tool>("dirt");
  const [wood, setWood] = useState(0);
  const [lastWrite, setLastWrite] = useState<string | null>(null);
  const painting = useRef(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stop = () => {
      painting.current = false;
    };
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);

  const treeCount = useMemo(
    () => cells.filter((cell) => cell.tree).length,
    [cells],
  );

  function flashWrite(message: string) {
    setLastWrite(message);
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => setLastWrite(null), 2000);
  }

  function applyTool(index: number) {
    const cell = cells[index];
    if (tool === "tree") {
      if (cell.tree) return;
      setCells((current) =>
        current.map((entry, i) => (i === index ? { ...entry, tree: true } : entry)),
      );
      flashWrite("session.Objects.Add(OakTree)");
      return;
    }
    if (tool === "axe") {
      if (!cell.tree) return;
      setCells((current) =>
        current.map((entry, i) =>
          i === index ? { ...entry, tree: false } : entry,
        ),
      );
      setWood((current) => current + 1);
      flashWrite("save.Inventory.Wood += 1");
      return;
    }
    if (cell.tile === tool) return;
    setCells((current) =>
      current.map((entry, i) => (i === index ? { ...entry, tile: tool } : entry)),
    );
    const x = index % GRID_W;
    const y = Math.floor(index / GRID_W);
    flashWrite(`level.Tiles[${x},${y}] = ${tool[0].toUpperCase()}${tool.slice(1)}Tile`);
  }

  function sameTile(x: number, y: number, tile: Tile): boolean {
    if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return false;
    return cells[y * GRID_W + x].tile === tile;
  }

  const saveJson = JSON.stringify(
    { values: { Wood: wood, OakTrees: treeCount } },
    null,
    2,
  );

  return (
    <section id="editor" className="relative py-24">
      <div className="pointer-events-none absolute left-1/3 top-0 h-96 w-96 rounded-full bg-blurple/12 blur-[130px]" />
      <div className="mx-auto w-[min(72rem,calc(100%-2rem))]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-ink-dim">
            <MapIcon className="size-4 text-neon-yellow" /> Coming soon
          </p>
          <h2 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Design levels like it&apos;s <span className="text-gradient">Figma</span>.
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            A collaborative level editor with pages, layers, smart tiles, and
            object palettes — where any tile can be static art <em>or</em> live
            save data. Paint below, plant some trees, then grab the axe.
          </p>
        </motion.div>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[3fr_2fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass glow-ring relative flex flex-col rounded-2xl p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge pb-4">
              <p className="font-display font-bold text-ink-dim">
                🗺 GardenPatch · Background layer
              </p>
              <div className="flex gap-1.5">
                {tools.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setTool(entry.id)}
                    title={entry.label}
                    className={`rounded-lg px-2.5 py-1.5 text-lg transition-all ${
                      tool === entry.id
                        ? "bg-blurple/30 ring-1 ring-blurple-bright"
                        : "hover:bg-panel-2"
                    }`}
                  >
                    {entry.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="mt-5 grid touch-none select-none gap-px overflow-hidden rounded-xl bg-void/60 p-1.5"
              style={{ gridTemplateColumns: `repeat(${GRID_W}, minmax(0, 1fr))` }}
            >
              {cells.map((cell, index) => {
                const x = index % GRID_W;
                const y = Math.floor(index / GRID_W);
                const tile = cell.tile;
                const top = sameTile(x, y - 1, tile);
                const bottom = sameTile(x, y + 1, tile);
                const left = sameTile(x - 1, y, tile);
                const right = sameTile(x + 1, y, tile);
                return (
                  <div
                    key={index}
                    onPointerDown={() => {
                      painting.current = true;
                      applyTool(index);
                    }}
                    onPointerEnter={() => {
                      if (painting.current) applyTool(index);
                    }}
                    className="relative grid aspect-square cursor-crosshair place-items-center"
                    style={{
                      backgroundColor: tileColors[tile],
                      borderTopLeftRadius: !top && !left ? 8 : 0,
                      borderTopRightRadius: !top && !right ? 8 : 0,
                      borderBottomLeftRadius: !bottom && !left ? 8 : 0,
                      borderBottomRightRadius: !bottom && !right ? 8 : 0,
                    }}
                  >
                    {cell.tree && (
                      <motion.span
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 10 }}
                        className="text-base md:text-xl"
                      >
                        🌳
                      </motion.span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 font-mono text-xs text-ink-dim">
              smart tiles · Extend Neighbor on — edges resolve themselves
            </p>
            <AnimatePresence>
              {lastWrite && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute bottom-4 right-6 rounded-lg bg-blurple/20 px-3 py-2 font-mono text-xs text-blurple-bright"
                >
                  ✏️ {lastWrite}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-4"
          >
            <div className="glass rounded-2xl p-5">
              <p className="flex items-center gap-2 font-display text-sm font-bold text-ink-dim">
                <Layers className="size-4" /> Layers
              </p>
              <ul className="mt-3 space-y-1.5 font-mono text-xs text-ink-dim">
                <li className="rounded-md bg-panel-2 px-3 py-1.5">
                  ▾ Foreground · OakTree ×{treeCount}
                </li>
                <li className="rounded-md px-3 py-1.5">
                  ▾ Background · GrassTile / DirtTile / WaterTile
                </li>
                <li className="rounded-md px-3 py-1.5 text-ink-dim/70">
                  ▸ Collisions · auto from colliders
                </li>
              </ul>
            </div>
            <div className="glass grow rounded-2xl p-5 font-mono text-sm">
              <p className="flex items-center justify-between text-xs text-ink-dim">
                <span>
                  <span className="text-neon-green">●</span> wandering-otter-619.save
                </span>
                <span className="rounded-md bg-neon-green/15 px-2 py-0.5 font-bold text-neon-green">
                  LIVE
                </span>
              </p>
              <motion.pre
                key={saveJson}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="mt-3 rounded-xl bg-void/70 p-4 text-xs leading-relaxed text-ice"
              >
                {saveJson}
              </motion.pre>
              <p className="mt-3 text-xs leading-relaxed text-ink-dim">
                Tiles and objects can be <span className="text-ink">static</span>{" "}
                (authored art) or <span className="text-ink">saved</span> (live
                player state) — the sandbox-game dream. And it&apos;s all
                NeoScript-aware: chop a tree and Wood lands in the inventory;
                finish a quest and a new map area unlocks.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
