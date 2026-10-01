import * as THREE from "three";

/**
 * Procedural "etched interface" textures for the artifact's glass layers.
 * Each layer depicts one discipline: grid → layout → type → components → code.
 * Drawn once on a 2D canvas — no image downloads.
 */

const W = 1024;
const H = 640;

type Painter = (ctx: CanvasRenderingContext2D) => void;

const line = (a = 0.5) => `rgba(255,255,255,${a})`;
const AMBER = "rgba(242,163,58,0.95)";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

const painters: Painter[] = [
  // 0 — Grid
  (ctx) => {
    ctx.strokeStyle = line(0.22);
    ctx.lineWidth = 1.5;
    const cols = 12;
    const gutter = 18;
    const colW = (W - 96 - gutter * (cols - 1)) / cols;
    for (let i = 0; i < cols; i++) {
      const x = 48 + i * (colW + gutter);
      ctx.strokeRect(x, 40, colW, H - 80);
    }
    ctx.fillStyle = line(0.35);
    for (let y = 64; y < H - 40; y += 32) {
      for (let x = 48; x < W - 40; x += 32) ctx.fillRect(x, y, 2, 2);
    }
  },
  // 1 — Layout wireframe
  (ctx) => {
    ctx.strokeStyle = line(0.6);
    ctx.lineWidth = 2.5;
    roundRect(ctx, 48, 40, W - 96, 44, 22);
    ctx.stroke();
    ctx.strokeRect(48, 120, 560, 300);
    ctx.beginPath();
    ctx.moveTo(48, 120);
    ctx.lineTo(608, 420);
    ctx.moveTo(608, 120);
    ctx.lineTo(48, 420);
    ctx.strokeStyle = line(0.25);
    ctx.stroke();
    ctx.strokeStyle = line(0.6);
    ctx.strokeRect(640, 120, 336, 140);
    ctx.strokeRect(640, 280, 336, 140);
    [0, 1, 2].forEach((i) => ctx.strokeRect(48 + i * 316, 452, 296, 148));
  },
  // 2 — Typography
  (ctx) => {
    ctx.fillStyle = line(0.85);
    ctx.font = "italic 132px Georgia, 'Times New Roman', serif";
    ctx.fillText("Аа", 56, 180);
    ctx.fillStyle = line(0.7);
    [520, 420].forEach((w, i) => ctx.fillRect(300, 92 + i * 52, w, 30));
    ctx.fillStyle = line(0.3);
    for (let i = 0; i < 7; i++) ctx.fillRect(56, 260 + i * 34, i === 6 ? 380 : 620 - (i % 3) * 60, 10);
    ctx.fillStyle = AMBER;
    ctx.fillRect(56, 520, 120, 6);
    ctx.font = "500 22px ui-monospace, monospace";
    ctx.fillStyle = line(0.55);
    ctx.fillText("DISPLAY 104 / 0.95", 720, 560);
  },
  // 3 — Components
  (ctx) => {
    ctx.lineWidth = 2.5;
    ctx.fillStyle = line(0.9);
    roundRect(ctx, 56, 70, 240, 64, 32);
    ctx.fill();
    ctx.strokeStyle = line(0.7);
    roundRect(ctx, 316, 70, 240, 64, 32);
    ctx.stroke();
    ctx.strokeStyle = line(0.45);
    roundRect(ctx, 56, 170, 500, 60, 30);
    ctx.stroke();
    ctx.fillStyle = AMBER;
    ctx.beginPath();
    ctx.arc(520, 200, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = line(0.55);
    [0, 1].forEach((i) => {
      ctx.strokeRect(600 + i * 196, 70, 176, 240);
      ctx.fillStyle = line(0.15);
      ctx.fillRect(612 + i * 196, 82, 152, 140);
    });
    ctx.fillStyle = line(0.35);
    for (let i = 0; i < 4; i++) {
      roundRect(ctx, 56 + i * 124, 280, 104, 36, 18);
      ctx.fill();
    }
    ctx.strokeStyle = line(0.3);
    ctx.strokeRect(56, 360, W - 112, 220);
  },
  // 4 — Code
  (ctx) => {
    const rows = [
      [0, 180, 1],
      [1, 320, 0],
      [1, 260, 0],
      [2, 380, 2],
      [2, 220, 0],
      [1, 140, 0],
      [0, 90, 1],
      [0, 0, 0],
      [0, 240, 1],
      [1, 420, 0],
      [2, 300, 2],
      [1, 160, 0],
      [0, 80, 1],
    ] as const;
    rows.forEach(([indent, w, kind], i) => {
      if (!w) return;
      ctx.fillStyle = kind === 2 ? AMBER : kind === 1 ? line(0.75) : line(0.35);
      ctx.fillRect(96 + indent * 40, 56 + i * 42, w, 12);
    });
    ctx.fillStyle = line(0.2);
    for (let i = 0; i < 13; i++) ctx.fillRect(48, 56 + i * 42, 20, 12);
  },
];

export function createPaneTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  painters[index % painters.length]!(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/** Soft round sprite for the light-ring particles. */
export function createGlowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const PANE_COUNT = painters.length;
