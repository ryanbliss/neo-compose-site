# neo-compose-site

Marketing landing page for **Neo Compose** — the game content platform for
story-driven games. Built with Next.js (App Router, TypeScript), Tailwind CSS
v4, [motion](https://motion.dev) for animation, and lucide-react icons.

## Highlights

- **Animated hero** with a floating, hover-reactive dialogue-flow node graph.
- **Playable dialogue demo** — a mini branching dialogue with a typewriter
  effect whose choices write into a live save-file JSON panel, mirroring the
  real save overlay model.
- **Live sync toy** — drag sliders in the "web editor" panel and watch the
  "Unity play mode" panel react in realtime.
- **Code showcase** — tabbed Unity C# / `neo` CLI / NeoScript snippets with
  copy-to-clipboard.
- Discord-flavored dark theme: blurple + neon accents, glassmorphism, grid
  backdrop, marquee capability strip.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build && npm start
```

## Promo video

[video/](./video) contains a 52-second motion graphic built from the site's
design language. `scene.html` is a deterministic 1920×1080 animation driven by
`window.seek(t)`; `render.mjs` steps it frame-by-frame through headless Chrome
(puppeteer-core) and assembles `neo-compose-promo.mp4` with ffmpeg-static,
with an original generated 8-bit chiptune soundtrack.

```bash
cd video
npm install
node render.mjs   # → video/neo-compose-promo.mp4
```

Open `scene.html?play` in a browser to preview the animation in realtime.
