import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30;
const DURATION = 52;
const FRAMES = FPS * DURATION;
const framesDir = path.join(__dirname, "frames");
const outFile = path.join(__dirname, "neo-compose-promo.mp4");

console.log("Generating chiptune…");
execFileSync(process.execPath, [path.join(__dirname, "music.mjs")], {
  stdio: "inherit",
});

rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

console.log("Launching Chrome…");
const browser = await puppeteer.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--force-device-scale-factor=1", "--hide-scrollbars", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(__dirname, "scene.html"), {
  waitUntil: "networkidle0",
  timeout: 60_000,
});
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction("typeof window.seek === 'function'");
await new Promise((resolve) => setTimeout(resolve, 400));

console.log(`Capturing ${FRAMES} frames at ${FPS}fps…`);
const started = Date.now();
for (let frame = 0; frame < FRAMES; frame++) {
  const t = frame / FPS;
  await page.evaluate((time) => window.seek(time), t);
  await page.screenshot({
    path: path.join(framesDir, `frame_${String(frame).padStart(4, "0")}.jpg`),
    type: "jpeg",
    quality: 92,
  });
  if (frame % 90 === 0) {
    const elapsed = ((Date.now() - started) / 1000).toFixed(0);
    console.log(`  frame ${frame}/${FRAMES} (${elapsed}s elapsed)`);
  }
}
await browser.close();
console.log("Frames captured. Encoding with ffmpeg…");

execFileSync(
  ffmpegPath,
  [
    "-y",
    // video: captured frames
    "-framerate", String(FPS),
    "-i", path.join(framesDir, "frame_%04d.jpg"),
    // audio: generated original chiptune
    "-i", path.join(__dirname, "chiptune.wav"),
    "-af", "lowpass=f=9500,volume=0.85,afade=t=out:st=47:d=5",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "19",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "128k",
    "-shortest",
    "-movflags", "+faststart",
    outFile,
  ],
  { stdio: "inherit" },
);
console.log("Done →", outFile);
