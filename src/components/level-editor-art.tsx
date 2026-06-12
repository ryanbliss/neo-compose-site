/**
 * Hand-pixeled 16x16 SVG tile textures for the level editor demo,
 * tuned to the site's night palette so the canvas reads as part of
 * the page rather than a pasted-in screenshot.
 */

export type Tile = "grass" | "soil" | "water" | "stone";

function svgUri(body: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function px(x: number, y: number, fill: string, w = 1, h = 1, opacity?: number): string {
  const alpha = opacity === undefined ? "" : ` opacity="${opacity}"`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${alpha}/>`;
}

const grassArt = svgUri(
  [
    px(0, 0, "#1b2a24", 16, 16),
    // mottling
    px(1, 2, "#243b31"),
    px(4, 7, "#243b31"),
    px(7, 1, "#243b31"),
    px(10, 5, "#243b31"),
    px(13, 9, "#243b31"),
    px(2, 12, "#243b31"),
    px(8, 13, "#243b31"),
    px(14, 3, "#243b31"),
    px(5, 11, "#243b31"),
    px(11, 14, "#243b31"),
    px(6, 4, "#16221d"),
    px(12, 11, "#16221d"),
    px(3, 14, "#16221d"),
    px(9, 6, "#16221d"),
    // grass blades
    px(3, 4, "#2f5240", 1, 2),
    px(9, 8, "#2f5240", 1, 2),
    px(12, 2, "#2f5240", 1, 2),
    px(6, 10, "#2f5240", 1, 2),
    px(14, 12, "#2f5240", 1, 2),
    // faint neon dew
    px(5, 3, "#3ddc84", 1, 1, 0.28),
    px(13, 13, "#3ddc84", 1, 1, 0.22),
    px(2, 8, "#3ddc84", 1, 1, 0.18),
  ].join(""),
);

const soilArt = svgUri(
  [
    px(0, 0, "#30241d", 16, 16),
    // furrows
    px(0, 3, "#251b15", 16, 1),
    px(0, 7, "#251b15", 16, 1),
    px(0, 11, "#251b15", 16, 1),
    px(0, 15, "#251b15", 16, 1),
    // clods
    px(2, 1, "#413126"),
    px(6, 5, "#413126"),
    px(10, 9, "#413126"),
    px(13, 1, "#413126"),
    px(4, 13, "#413126"),
    px(9, 12, "#413126"),
    px(12, 5, "#413126"),
    px(1, 6, "#413126"),
    px(7, 9, "#413126"),
    // catch-light
    px(3, 5, "#523e2e"),
    px(8, 1, "#523e2e"),
    px(14, 9, "#523e2e"),
    px(5, 9, "#523e2e"),
    px(11, 13, "#523e2e"),
  ].join(""),
);

const waterArt = svgUri(
  [
    px(0, 0, "#122435", 16, 16),
    // depth
    px(0, 13, "#0e1c2b", 16, 3),
    px(0, 0, "#0e1c2b", 16, 1),
    // waves
    px(1, 3, "#1e3d58", 3, 1),
    px(6, 6, "#1e3d58", 4, 1),
    px(10, 2, "#1e3d58", 3, 1),
    px(3, 10, "#1e3d58", 4, 1),
    px(9, 12, "#1e3d58", 3, 1),
    px(13, 8, "#1e3d58", 2, 1),
    // crests
    px(2, 3, "#2b5b82"),
    px(7, 6, "#2b5b82"),
    px(11, 2, "#2b5b82"),
    px(4, 10, "#2b5b82"),
    // sparkle
    px(12, 4, "#5ad7ff", 1, 1, 0.55),
    px(5, 8, "#5ad7ff", 1, 1, 0.45),
    px(8, 13, "#5ad7ff", 1, 1, 0.4),
    px(2, 6, "#5ad7ff", 1, 1, 0.25),
  ].join(""),
);

const stoneArt = svgUri(
  [
    px(0, 0, "#262344", 16, 16),
    // mortar seams (offset flagstone courses)
    px(0, 5, "#181530", 16, 1),
    px(0, 11, "#181530", 16, 1),
    px(7, 0, "#181530", 1, 5),
    px(3, 6, "#181530", 1, 5),
    px(11, 6, "#181530", 1, 5),
    px(7, 12, "#181530", 1, 4),
    // stone shading
    px(1, 1, "#2e2a52", 5, 3),
    px(9, 2, "#2e2a52", 5, 2),
    px(5, 7, "#2e2a52", 5, 3),
    px(13, 7, "#2e2a52", 2, 3),
    px(1, 13, "#2e2a52", 5, 2),
    px(9, 13, "#2e2a52", 5, 2),
    // worn highlights
    px(2, 2, "#3d3868"),
    px(10, 3, "#3d3868"),
    px(6, 8, "#3d3868"),
    px(13, 13, "#3d3868"),
    px(0, 8, "#3d3868"),
  ].join(""),
);

export const tileArt: Record<Tile, { label: string; record: string; uri: string; base: string }> = {
  grass: { label: "Night grass", record: "GrassTile", uri: grassArt, base: "#1b2a24" },
  soil: { label: "Tilled soil", record: "SoilTile", uri: soilArt, base: "#30241d" },
  water: { label: "Pond", record: "PondTile", uri: waterArt, base: "#122435" },
  stone: { label: "Flagstones", record: "StonePathTile", uri: stoneArt, base: "#262344" },
};

export function GoblinSprite({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      aria-label="Grubbins the goblin"
      role="img"
    >
      {/* ground shadow */}
      <rect x="5" y="15" width="6" height="1" fill="#000000" opacity="0.35" />
      {/* ears */}
      <rect x="2" y="4" width="3" height="1" fill="#4f9e5d" />
      <rect x="11" y="4" width="3" height="1" fill="#4f9e5d" />
      <rect x="2" y="5" width="2" height="1" fill="#3d7d49" />
      <rect x="12" y="5" width="2" height="1" fill="#3d7d49" />
      {/* head */}
      <rect x="5" y="2" width="6" height="5" fill="#57a85f" />
      <rect x="5" y="2" width="6" height="1" fill="#6fcf7c" />
      <rect x="5" y="6" width="6" height="1" fill="#3d7d49" />
      {/* eyes */}
      <rect x="6" y="4" width="1" height="1" fill="#ffd166" />
      <rect x="9" y="4" width="1" height="1" fill="#ffd166" />
      {/* tunic */}
      <rect x="5" y="7" width="6" height="5" fill="#3a2b4e" />
      <rect x="5" y="7" width="6" height="1" fill="#4a3863" />
      <rect x="5" y="9" width="6" height="1" fill="#6c5ce7" opacity="0.85" />
      {/* arms */}
      <rect x="4" y="8" width="1" height="3" fill="#4f9e5d" />
      <rect x="11" y="8" width="1" height="3" fill="#4f9e5d" />
      {/* legs */}
      <rect x="6" y="12" width="1" height="3" fill="#2a2440" />
      <rect x="9" y="12" width="1" height="3" fill="#2a2440" />
    </svg>
  );
}

export function TreeSprite({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      aria-label="Oak tree"
      role="img"
    >
      <circle cx="8" cy="6" r="6.5" fill="#3ddc84" opacity="0.1" />
      {/* canopy */}
      <rect x="5" y="1" width="6" height="1" fill="#2f6a4d" />
      <rect x="4" y="2" width="8" height="1" fill="#2f6a4d" />
      <rect x="3" y="3" width="10" height="2" fill="#2a5d44" />
      <rect x="4" y="5" width="8" height="1" fill="#234d38" />
      <rect x="5" y="6" width="6" height="1" fill="#1f4434" />
      {/* leaf highlights */}
      <rect x="5" y="2" width="1" height="1" fill="#3ddc84" opacity="0.65" />
      <rect x="9" y="1" width="1" height="1" fill="#3ddc84" opacity="0.45" />
      <rect x="4" y="4" width="1" height="1" fill="#3ddc84" opacity="0.5" />
      <rect x="10" y="3" width="1" height="1" fill="#3ddc84" opacity="0.55" />
      <rect x="7" y="5" width="1" height="1" fill="#2f6a4d" />
      {/* trunk */}
      <rect x="7" y="7" width="2" height="4" fill="#4a3626" />
      <rect x="7" y="7" width="1" height="4" fill="#5a4330" />
      <rect x="6" y="11" width="4" height="1" fill="#3a2a1e" />
    </svg>
  );
}
