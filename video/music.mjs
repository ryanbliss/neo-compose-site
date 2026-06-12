/**
 * Generates an original 8-bit chiptune (52s) as chiptune.wav.
 * Square-wave lead arpeggios over Am–F–C–G, square bass, noise hats,
 * and a pitch-dropping kick. Original composition → royalty-free.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100;
const DURATION = 52;
const BPM = 112;
const BEAT = 60 / BPM; // quarter note
const BAR = BEAT * 4;
const N = SR * DURATION;

const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const square = (phase, duty = 0.5) => ((phase % 1) < duty ? 1 : -1);

// chords as [bass midi, arp midi notes]
const Am = [45, [57, 60, 64, 69]];
const F = [41, [53, 57, 60, 65]];
const C = [48, [60, 64, 67, 72]];
const G = [43, [55, 59, 62, 67]];
const PROG = [Am, F, C, G];

// lead pattern: indices into the chord's arp notes, 8 eighth-notes per bar
const PATTERNS = [
  [0, 1, 2, 3, 2, 1, 3, 1],
  [0, 2, 1, 3, 0, 2, 3, 2],
];

const out = new Float32Array(N);

function addNote(start, dur, freq, gain, duty, decay) {
  const s0 = Math.floor(start * SR);
  const s1 = Math.min(N, Math.floor((start + dur) * SR));
  for (let i = s0; i < s1; i++) {
    const tt = (i - s0) / SR;
    const env = Math.exp(-tt * decay);
    out[i] += square(tt * freq, duty) * gain * env;
  }
}

function addKick(start, gain) {
  const s0 = Math.floor(start * SR);
  const s1 = Math.min(N, s0 + Math.floor(SR * 0.16));
  for (let i = s0; i < s1; i++) {
    const tt = (i - s0) / SR;
    const f = 130 * Math.exp(-tt * 26) + 38;
    out[i] += Math.sin(2 * Math.PI * f * tt * (1 + 8 * Math.exp(-tt * 30))) * gain * Math.exp(-tt * 16);
  }
}

let noiseState = 1;
function addHat(start, gain) {
  const s0 = Math.floor(start * SR);
  const s1 = Math.min(N, s0 + Math.floor(SR * 0.035));
  for (let i = s0; i < s1; i++) {
    const tt = (i - s0) / SR;
    // cheap LFSR-ish noise
    noiseState = (noiseState * 1103515245 + 12345) & 0x7fffffff;
    const n = (noiseState / 0x3fffffff) - 1;
    out[i] += n * gain * Math.exp(-tt * 90);
  }
}

const totalBars = Math.floor(DURATION / BAR);
for (let bar = 0; bar < totalBars; bar++) {
  const t0 = bar * BAR;
  const [bassMidi, arp] = PROG[bar % 4];
  const section = Math.floor(bar / 4) % 4; // 4-bar phrases
  const pattern = PATTERNS[Math.floor(bar / 8) % 2];
  const lift = section === 2 ? 12 : 0; // third phrase jumps an octave
  const last = bar >= totalBars - 2;

  // lead arpeggio — eighth notes
  if (!last) {
    for (let n = 0; n < 8; n++) {
      const noteMidi = arp[pattern[n] % arp.length] + lift;
      addNote(t0 + n * (BEAT / 2), BEAT / 2 - 0.02, midiHz(noteMidi), 0.105, 0.5, 7);
      // soft echo a 16th later for shimmer
      addNote(t0 + n * (BEAT / 2) + BEAT / 4, BEAT / 4, midiHz(noteMidi + 12), 0.028, 0.25, 14);
    }
  } else {
    // outro: held root arpeggio descending
    for (let n = 0; n < 4; n++) {
      addNote(t0 + n * BEAT, BEAT * 0.95, midiHz(arp[3 - n]), 0.09, 0.5, 3.5);
    }
  }

  // bass — quarter notes, duty 0.25 for that NES growl
  for (let n = 0; n < 4; n++) {
    addNote(t0 + n * BEAT, BEAT * 0.9, midiHz(bassMidi), 0.13, 0.25, 4);
  }

  // drums
  if (!last) {
    addKick(t0, 0.30);
    addKick(t0 + BEAT * 2, 0.26);
    for (let n = 0; n < 8; n++) {
      if (n % 2 === 1) addHat(t0 + n * (BEAT / 2), 0.05);
    }
    addHat(t0 + BEAT * 3.5, 0.07);
  }
}

// master: gentle fade in, fade out tail, soft clip, normalize
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(t / 1.2, 1) * Math.min(Math.max((DURATION - t) / 5, 0), 1);
  out[i] = Math.tanh(out[i] * 1.4) * fade;
}
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
const norm = 0.62 / peak;

// write 16-bit mono WAV
const data = Buffer.alloc(N * 2);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(out[i] * norm * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(1, 22); // mono
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
writeFileSync(path.join(__dirname, "chiptune.wav"), Buffer.concat([header, data]));
console.log("chiptune.wav written (52s)");
