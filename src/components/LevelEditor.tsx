"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Axe, CalendarClock, Layers, Map as MapIcon } from "lucide-react";
import { GoblinSprite, tileArt, TreeSprite, type Tile } from "./level-editor-art";

type Tool = Tile | "tree" | "axe";

interface Cell {
  tile: Tile;
  tree: boolean;
}

const GRID_W = 12;
const GRID_H = 7;

const tileTools = Object.keys(tileArt) as Tile[];

const routine = [
  { time: "06:00", icon: "🌱", label: "tend the soil", x: 2, y: 1 },
  { time: "17:00", icon: "🪣", label: "fetch pond water", x: 8, y: 4 },
  { time: "20:00", icon: "🏠", label: "head home", x: 0, y: 3 },
];

function at(x: number, y: number): number {
  return y * GRID_W + x;
}

function initialCells(): Cell[] {
  const cells: Cell[] = Array.from({ length: GRID_W * GRID_H }, () => ({
    tile: "grass" as Tile,
    tree: false,
  }));
  // flagstone path winding in from the left
  for (const [x, y] of [
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [4, 4],
    [5, 4],
    [6, 4],
  ] as const) {
    cells[at(x, y)] = { tile: "stone", tree: false };
  }
  // tilled soil patch, top-left
  for (let y = 0; y <= 1; y++) {
    for (let x = 1; x <= 3; x++) {
      cells[at(x, y)] = { tile: "soil", tree: false };
    }
  }
  // pond, bottom-right
  for (let y = 4; y <= 6; y++) {
    for (let x = 9; x <= 11; x++) {
      cells[at(x, y)] = { tile: "water", tree: false };
    }
  }
  cells[at(8, 5)] = { tile: "water", tree: false };
  // oaks
  for (const [x, y] of [
    [6, 1],
    [9, 2],
    [2, 5],
  ] as const) {
    cells[at(x, y)] = { tile: "grass", tree: true };
  }
  return cells;
}

export function LevelEditor() {
  const [cells, setCells] = useState<Cell[]>(initialCells);
  const [tool, setTool] = useState<Tool>("soil");
  const [wood, setWood] = useState(0);
  const [lastWrite, setLastWrite] = useState<string | null>(null);
  const [routineIndex, setRoutineIndex] = useState(0);
  const painting = useRef(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = routine[routineIndex];

  useEffect(() => {
    const halt = () => {
      painting.current = false;
    };
    window.addEventListener("pointerup", halt);
    return () => window.removeEventListener("pointerup", halt);
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setRoutineIndex((current) => (current + 1) % routine.length),
      3600,
    );
    return () => clearInterval(timer);
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
      if (cell.tree || cell.tile === "water") return;
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
      current.map((entry, i) =>
        i === index
          ? { tile: tool, tree: tool === "water" ? false : entry.tree }
          : entry,
      ),
    );
    const x = index % GRID_W;
    const y = Math.floor(index / GRID_W);
    flashWrite(`level.Tiles[${x},${y}] = ${tileArt[tool].record}`);
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
            object palettes — where any tile can be static art{" "}
            <em>or</em>{" "}
            live save data. Tend the Gobl-Inn&apos;s night garden below, then
            grab the axe.
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
              <p className="min-w-0 truncate font-display font-bold text-ink-dim">
                🌒 Gobl-Inn back garden · Background
              </p>
              <div className="flex gap-1.5">
                {tileTools.map((id) => (
                  <button
                    key={id}
                    onClick={() => setTool(id)}
                    title={tileArt[id].label}
                    aria-label={tileArt[id].label}
                    className={`rounded-lg p-1.5 transition-all ${
                      tool === id
                        ? "bg-blurple/30 ring-1 ring-blurple-bright"
                        : "hover:bg-panel-2"
                    }`}
                  >
                    <span
                      className="block size-5 rounded-[5px]"
                      style={{
                        backgroundColor: tileArt[id].base,
                        backgroundImage: tileArt[id].uri,
                        backgroundSize: "100% 100%",
                        imageRendering: "pixelated",
                        boxShadow: "inset 0 0 0 1px rgb(232 230 245 / 0.12)",
                      }}
                    />
                  </button>
                ))}
                <button
                  onClick={() => setTool("tree")}
                  title="Oak tree"
                  aria-label="Oak tree"
                  className={`rounded-lg p-1.5 transition-all ${
                    tool === "tree"
                      ? "bg-blurple/30 ring-1 ring-blurple-bright"
                      : "hover:bg-panel-2"
                  }`}
                >
                  <TreeSprite className="size-5" />
                </button>
                <button
                  onClick={() => setTool("axe")}
                  title="Axe"
                  aria-label="Axe"
                  className={`rounded-lg p-1.5 transition-all ${
                    tool === "axe"
                      ? "bg-blurple/30 ring-1 ring-blurple-bright"
                      : "hover:bg-panel-2"
                  }`}
                >
                  <Axe className="size-5 text-neon-yellow" />
                </button>
              </div>
            </div>
            <div
              className="relative mt-5 grid touch-none select-none gap-0 overflow-hidden rounded-xl border border-edge"
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
                    className="relative grid aspect-square cursor-crosshair place-items-center transition-[filter] duration-75 hover:brightness-150"
                    style={{
                      backgroundColor: tileArt.grass.base,
                      backgroundImage: `${tileArt[tile].uri}, ${tileArt.grass.uri}`,
                      backgroundSize: "100% 100%",
                      imageRendering: "pixelated",
                      borderTopLeftRadius: !top && !left ? 10 : 0,
                      borderTopRightRadius: !top && !right ? 10 : 0,
                      borderBottomLeftRadius: !bottom && !left ? 10 : 0,
                      borderBottomRightRadius: !bottom && !right ? 10 : 0,
                      boxShadow: "inset 0 0 0 0.5px rgb(11 10 20 / 0.45)",
                    }}
                  >
                    {cell.tree && (
                      <motion.span
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 10 }}
                        className="block w-[88%]"
                      >
                        <TreeSprite className="h-auto w-full drop-shadow-[0_2px_4px_rgb(0_0_0/0.5)]" />
                      </motion.span>
                    )}
                  </div>
                );
              })}
              <div
                className="pointer-events-none absolute z-10 transition-all duration-[2000ms] ease-in-out"
                style={{
                  left: `${((stop.x + 0.5) / GRID_W) * 100}%`,
                  top: `${((stop.y + 0.5) / GRID_H) * 100}%`,
                  width: `${(1 / GRID_W) * 100}%`,
                  transform: "translate(-50%, -58%)",
                }}
              >
                <motion.div
                  animate={{ y: [0, -2.5, 0] }}
                  transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
                >
                  <GoblinSprite className="h-auto w-full drop-shadow-[0_2px_4px_rgb(0_0_0/0.55)]" />
                </motion.div>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={stop.time}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="glass pointer-events-none absolute left-2 top-2 z-10 rounded-lg px-2.5 py-1.5 font-mono text-xs text-ink"
                >
                  🕐 {stop.time} · Grubbins: {stop.label}
                </motion.p>
              </AnimatePresence>
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
                  ▾ Background · GrassTile / SoilTile / PondTile / StonePathTile
                </li>
                <li className="rounded-md px-3 py-1.5 text-ink-dim/70">
                  ▸ Collisions · auto from colliders
                </li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="flex items-center gap-2 font-display text-sm font-bold text-ink-dim">
                <CalendarClock className="size-4" /> Routine · Grubbins
              </p>
              <ul className="mt-3 space-y-1.5 font-mono text-xs">
                {routine.map((entry, index) => (
                  <li
                    key={entry.time}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
                      index === routineIndex
                        ? "bg-blurple/20 text-ink"
                        : "text-ink-dim"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        index === routineIndex
                          ? "bg-neon-green animate-pulse-glow"
                          : "bg-edge"
                      }`}
                    />
                    {entry.time} {entry.icon} {entry.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-ink-dim">
                NPC routines are schedules on the clock — and every stop can
                gate dialogue and quests through NeoScript.
              </p>
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
