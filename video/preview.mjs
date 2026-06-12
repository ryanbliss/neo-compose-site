import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const times = [13.2, 24.4, 31.9, 36.8, 41.4, 49.2];

const browser = await puppeteer.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto("file://" + path.join(__dirname, "scene.html"), {
  waitUntil: "networkidle0",
});
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction("typeof window.seek === 'function'");
await new Promise((r) => setTimeout(r, 400));
for (const t of times) {
  await page.evaluate((time) => window.seek(time), t);
  await page.screenshot({
    path: `/tmp/neo-video-t${String(t).replace(".", "_")}.jpg`,
    type: "jpeg",
    quality: 85,
  });
  console.log("captured t=" + t);
}
await browser.close();
