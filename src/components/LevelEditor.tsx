"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Axe, CalendarClock, Layers, Map as MapIcon, Swords } from "lucide-react";
import {
  ChestSprite,
  GoblinSprite,
  rubbleArt,
  ShroomSprite,
  StallSprite,
  tileArt,
  TreeSprite,
  type Tile,
} from "./level-editor-art";

type Tool = Tile | "tree" | "axe";

interface Cell {
  tile: Tile;
  tree: boolean;
  rubble: boolean;
}

const GRID_W = 12;
const GRID_H = 7;
const QUEST_WOOD = 3;

const tileTools = Object.keys(tileArt) as Tile[];

const routine = [
  { time: "06:00", icon: "🌱", label: "tend the soil", x: 2, y: 1, shopOpen: false },
  { time: "09:00", icon: "🪧", label: "open the stall", x: 4, y: 2, shopOpen: true },
  { time: "17:00", icon: "🪣", label: "fetch pond water", x: 8, y: 4, shopOpen: false },
  { time: "20:00", icon: "🏠", label: "head home", x: 0, y: 3, shopOpen: false },
];

const STALL = { x: 5, y: 2 };
const CHEST = { x: 11, y: 1 };
const SHROOM = { x: 10, y: 2 };

function at(x: number, y: number): number {
  return y * GRID_W + x;
}

function initialCells(): Cell[] {
  const cells: Cell[] = Array.from({ length: GRID_W * GRID_H }, () => ({
    tile: "grass" as Tile,
    tree: false,
    rubble: false,
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
    cells[at(x, y)] = { tile: "stone", tree: false, rubble: false };
  }
  // tilled soil patch, top-left
  for (let y = 0; y <= 1; y++) {
    for (let x = 1; x <= 3; x++) {
      cells[at(x, y)] = { tile: "soil", tree: false, rubble: false };
    }
  }
  // pond, bottom-right
  for (let y = 4; y <= 6; y++) {
    for (let x = 9; x <= 11; x++) {
      cells[at(x, y)] = { tile: "water", tree: false, rubble: false };
    }
  }
  cells[at(8, 5)] = { tile: "water", tree: false, rubble: false };
  // rubble sealing off the north-east glade
  for (let y = 0; y <= 2; y++) {
    for (let x = 10; x <= 11; x++) {
      cells[at(x, y)] = { tile: "grass", tree: false, rubble: true };
    }
  }
  cells[at(9, 0)] = { tile: "grass", tree: false, rubble: true };
  // oaks
  for (const [x, y] of [
    [6, 1],
    [8, 2],
    [2, 5],
  ] as const) {
    cells[at(x, y)] = { tile: "grass", tree: true, rubble: false };
  }
  return cells;
}

export function LevelEditor() {
  const [cells, setCells] = useState<Cell[]>(initialCells);
  const [tool, setTool] = useState<Tool>("soil");
  const [wood, setWood] = useState(0);
  const [questDone, setQuestDone] = useState(false);
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
      3400,
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
    writeTimer.current = setTimeout(() => setLastWrite(null), 2200);
  }

  function applyTool(index: number) {
    const cell = cells[index];
    if (cell.rubble) {
      flashWrite("⛔ quest-locked — turn in Firewood to clear");
      return;
    }
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
          ? { ...entry, tile: tool, tree: tool === "water" ? false : entry.tree }
          : entry,
      ),
    );
    const x = index % GRID_W;
    const y = Math.floor(index / GRID_W);
    flashWrite(`level.Tiles[${x},${y}] = ${tileArt[tool].record}`);
  }

  function turnInQuest() {
    if (questDone || wood < QUEST_WOOD) return;
    setWood((current) => current - QUEST_WOOD);
    setQuestDone(true);
    setCells((current) => current.map((entry) => ({ ...entry, rubble: false })));
    flashWrite("save.Quests.Firewood = Done → glade unlocked");
  }

  function sameTile(x: number, y: number, tile: Tile): boolean {
    if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return false;
    return cells[y * GRID_W + x].tile === tile;
  }

  const saveJson = JSON.stringify(
    {
      values: {
        Wood: wood,
        OakTrees: treeCount,
        ShopOpen: stop.shopOpen,
        Quests: { Firewood: questDone ? "Done" : "Active" },
      },
    },
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
            object palettes. Chop three oaks for Grubbins&apos; hearth — the
            rubble in the corner is quest-locked.
          </p>
        </motion.div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
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
                      backgroundImage: cell.rubble
                        ? `${rubbleArt.uri}, ${tileArt[tile].uri}`
                        : `${tileArt[tile].uri}, ${tileArt.grass.uri}`,
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
                    {x === STALL.x && y === STALL.y && (
                      <span className="absolute inset-0 grid place-items-center">
                        <StallSprite
                          open={stop.shopOpen}
                          className={`h-auto w-[96%] drop-shadow-[0_2px_4px_rgb(0_0_0/0.55)] transition-opacity duration-500 ${
                            stop.shopOpen ? "opacity-100" : "opacity-75"
                          }`}
                        />
                      </span>
                    )}
                    {questDone && x === CHEST.x && y === CHEST.y && (
                      <motion.span
                        initial={{ scale: 0, y: -8 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 9 }}
                        className="block w-[82%]"
                      >
                        <ChestSprite className="h-auto w-full drop-shadow-[0_2px_4px_rgb(0_0_0/0.5)]" />
                      </motion.span>
                    )}
                    {questDone && x === SHROOM.x && y === SHROOM.y && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 9, delay: 0.15 }}
                        className="block w-[70%]"
                      >
                        <ShroomSprite className="h-auto w-full" />
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
            <div className="mt-4 rounded-xl border border-edge bg-void/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-display text-sm font-bold">
                    <Swords className="size-4 text-neon-pink" /> Quest · Firewood
                    for the hearth
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-dim">
                    {questDone
                      ? "turned in — the rubble cleared"
                      : `chop oaks with the axe · Wood ${Math.min(wood, QUEST_WOOD)}/${QUEST_WOOD}`}
                  </p>
                </div>
                {questDone ? (
                  <span className="font-mono text-xs font-bold text-neon-green">
                    ✓ glade unlocked
                  </span>
                ) : (
                  <motion.button
                    whileHover={wood >= QUEST_WOOD ? { scale: 1.04 } : undefined}
                    whileTap={wood >= QUEST_WOOD ? { scale: 0.95 } : undefined}
                    onClick={turnInQuest}
                    disabled={wood < QUEST_WOOD}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      wood >= QUEST_WOOD
                        ? "border border-blurple/60 bg-blurple/15 text-blurple-bright hover:bg-blurple/30 shadow-[0_0_18px_rgb(108_92_231/0.35)]"
                        : "cursor-not-allowed border border-edge text-ink-dim/60"
                    }`}
                  >
                    Turn in {QUEST_WOOD} Wood
                  </motion.button>
                )}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-panel-2">
                <motion.div
                  animate={{
                    width: `${(Math.min(questDone ? QUEST_WOOD : wood, QUEST_WOOD) / QUEST_WOOD) * 100}%`,
                  }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                  className={`h-full rounded-full ${questDone ? "bg-neon-green" : "bg-blurple-bright"}`}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-dim">
                Tiles can be static art or live save data — and it&apos;s all
                NeoScript-aware. Chopping writes Wood to the save; turning in
                the quest clears the map.
              </p>
            </div>
            <AnimatePresence>
              {lastWrite && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute -top-3 right-6 rounded-lg border border-edge bg-panel px-3 py-2 font-mono text-xs text-blurple-bright shadow-lg"
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
                  ▾ Foreground · OakTree ×{treeCount} / MarketStall
                  {questDone ? " / Chest" : ""}
                </li>
                <li className="rounded-md px-3 py-1.5">
                  ▾ Background · Grass / Soil / Pond / StonePath
                  {questDone ? "" : " / Rubble 🔒"}
                </li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="flex items-center justify-between font-display text-sm font-bold text-ink-dim">
                <span className="flex items-center gap-2">
                  <CalendarClock className="size-4" /> Routine · Grubbins
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${
                    stop.shopOpen
                      ? "bg-neon-green/15 text-neon-green"
                      : "bg-panel-2 text-ink-dim"
                  }`}
                >
                  stall {stop.shopOpen ? "OPEN" : "CLOSED"}
                </span>
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
                Routines run on the clock and gate content through NeoScript —
                try buying the cursed sword at 20:00 and the trigger fails.
              </p>
            </div>
            <div className="glass rounded-2xl p-5 font-mono text-sm">
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
                className="mt-3 overflow-x-auto rounded-xl bg-void/70 p-4 text-xs leading-relaxed text-ice"
              >
                {saveJson}
              </motion.pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
