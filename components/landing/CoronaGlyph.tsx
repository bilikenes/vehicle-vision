"use client";

import { useEffect, useRef } from "react";

import styles from "./CoronaGlyph.module.css";

export type ColorStop = readonly [color: string, position: number];

export interface CoronaGlyphProps {
  readonly gradient?: ReadonlyArray<ColorStop>;
  readonly gradientAngleDeg?: number;
  readonly speedMultiplier?: number;
  readonly scale?: number;
  readonly dotSize?: number;
  readonly dotShape?: "circle" | "diamond";
  readonly halftone?: boolean;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export const DEFAULT_CORONA_GRADIENT: ReadonlyArray<ColorStop> = [
  ["#505379", 0.0],
  ["#515A89", 0.125],
  ["#586698", 0.25],
  ["#5973B2", 0.375],
  ["#5A7CC5", 0.5],
  ["#5D82CD", 0.625],
  ["#6D88BD", 0.75],
  ["#838FA6", 0.875],
  ["#8E929B", 1.0],
];

// ---- ViewBox & composition constants (ported from Eclipse) ----
const CX = 850;
const CY = 800;
const VBW = 1700;
const VBH = 1600;
const CROP = 1600;
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const TARGET_FPS = 24;
const FRAME_MS = 1000 / TARGET_FPS;

const P = {
  size: 146,
  sizeMin: 200,
  sizeMax: 280,
  count: 50,
  distMax: 400,
  distBias: 22,
  spikeVar: 55,
  overshoot: 17,
  rotSpread: 360,
  speedMin: 5,
  speedMax: 13,
  blur: 50,
  iter: 4,
  choke: 90,
  rOuter: 360,
  rInner: 220,
};

const FX = {
  rblurOn: true,
  rblurAmount: 30,
  rblurPasses: 5,
  halftoneOn: true,
  htRotation: 45,
  htFill: 1.0,
  htFalloff: 1.8,
};

const LOOP = { on: true, seconds: 16 };
const SEED = 1;
const GRAD_REACH = 291;
const SIZE_STEPS = [192, 256, 320, 384, 448, 512];
const MIN_PX = 160;
const MAX_DPR = 2;
const RB_SCALE = 0.5;

function hash01(id: number, n: number): number {
  let x = (id ^ Math.imul(n, 0x9e3779b1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function vnoise(id: number, t: number, mod: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);
  const wrap = mod ? (n: number) => ((n % mod) + mod) % mod : (n: number) => n;
  const a = hash01(id, wrap(i));
  const b = hash01(id, wrap(i + 1));
  return a + (b - a) * u;
}

function wiggleNoise(id: number, t: number, mod: number): number {
  return (
    (vnoise(id, t, mod) +
      vnoise(id ^ 0x5bd1e995, t, mod) +
      vnoise(id ^ 0x27d4eb2f, t, mod)) /
    3
  );
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

interface Flare {
  speedRand: number;
  reachRand: number;
  t: number;
  posId: number;
  posOff: number;
  angleRand: number;
  sizeId: number;
  sizeOff: number;
}

function makeFlare(i: number): Flare {
  const h = (k: number) => hash01(SEED ^ k, i);
  const ri = (k: number) => Math.floor(h(k) * 2147483647);
  return {
    speedRand: h(0x51ed),
    reachRand: h(0xa5a5),
    t: h(0x7f4a) * 1000,
    posId: ri(0x1b3c),
    posOff: h(0x2d9e) * 1000,
    angleRand: h(0x6a17),
    sizeId: ri(0x9e21),
    sizeOff: h(0xb7d3) * 1000,
  };
}

interface LayoutCircle {
  x: number;
  y: number;
  r: number;
}

function effectiveChoke(choke: number, iter: number): number {
  const L = 0.5 + (choke / 100 - 0.5) * Math.sqrt(4 / Math.max(1, iter));
  return Math.max(2, Math.min(98, L * 100));
}

function boxBlurH(
  src: Float32Array,
  dst: Float32Array,
  w: number,
  h: number,
  r: number,
) {
  const norm = 1 / (2 * r + 1);
  for (let y = 0; y < h; y++) {
    const o = y * w;
    let sum = 0;
    for (let k = -r; k <= r; k++) {
      const xi = k < 0 ? 0 : k >= w ? w - 1 : k;
      sum += src[o + xi];
    }
    for (let x = 0; x < w; x++) {
      dst[o + x] = sum * norm;
      const add = x + r + 1 >= w ? w - 1 : x + r + 1;
      const sub = x - r < 0 ? 0 : x - r;
      sum += src[o + add] - src[o + sub];
    }
  }
}

function boxBlurV(
  src: Float32Array,
  dst: Float32Array,
  w: number,
  h: number,
  r: number,
) {
  const norm = 1 / (2 * r + 1);
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let k = -r; k <= r; k++) {
      const yi = k < 0 ? 0 : k >= h ? h - 1 : k;
      sum += src[yi * w + x];
    }
    for (let y = 0; y < h; y++) {
      dst[y * w + x] = sum * norm;
      const add = y + r + 1 >= h ? h - 1 : y + r + 1;
      const sub = y - r < 0 ? 0 : y - r;
      sum += src[add * w + x] - src[sub * w + x];
    }
  }
}

function hardenAlpha(data: Uint8ClampedArray, choke: number) {
  const threshold = (choke / 100) * 255;
  const edge = 1.5;
  const lo = threshold - edge;
  const hi = threshold + edge;
  const inv = 255 / (hi - lo);
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    data[i] = a <= lo ? 0 : a >= hi ? 255 : (((a - lo) * inv + 0.5) | 0);
  }
}

const WORKER_SRC = `
function boxBlurH(src, dst, w, h, r) {
  var norm = 1 / (2 * r + 1);
  for (var y = 0; y < h; y++) {
    var o = y * w, sum = 0;
    for (var k = -r; k <= r; k++) { var xi = k < 0 ? 0 : (k >= w ? w - 1 : k); sum += src[o + xi]; }
    for (var x = 0; x < w; x++) {
      dst[o + x] = sum * norm;
      var add = x + r + 1; if (add >= w) add = w - 1;
      var sub = x - r;     if (sub < 0) sub = 0;
      sum += src[o + add] - src[o + sub];
    }
  }
}
function boxBlurV(src, dst, w, h, r) {
  var norm = 1 / (2 * r + 1);
  for (var x = 0; x < w; x++) {
    var sum = 0;
    for (var k = -r; k <= r; k++) { var yi = k < 0 ? 0 : (k >= h ? h - 1 : k); sum += src[yi * w + x]; }
    for (var y = 0; y < h; y++) {
      dst[y * w + x] = sum * norm;
      var add = y + r + 1; if (add >= h) add = h - 1;
      var sub = y - r;     if (sub < 0) sub = 0;
      sum += src[add * w + x] - src[sub * w + x];
    }
  }
}
function hardenAlpha(data, choke) {
  var threshold = choke / 100 * 255, edge = 1.5;
  var lo = threshold - edge, hi = threshold + edge, inv = 255 / (hi - lo);
  for (var i = 3; i < data.length; i += 4) {
    var a = data[i];
    data[i] = a <= lo ? 0 : a >= hi ? 255 : ((a - lo) * inv + 0.5) | 0;
  }
}
var A = null, B = null;
self.onmessage = function (e) {
  var d = e.data, data = new Uint8ClampedArray(d.buf);
  var rr = Math.round(d.r);
  if (rr >= 1) {
    var n = d.w * d.h;
    if (!A || A.length < n) { A = new Float32Array(n); B = new Float32Array(n); }
    for (var i = 0; i < n; i++) A[i] = data[i * 4 + 3];
    var N = Math.max(1, Math.round(d.iter));
    for (var it = 0; it < N; it++) { boxBlurH(A, B, d.w, d.h, rr); boxBlurV(B, A, d.w, d.h, rr); }
    for (var j = 0; j < n; j++) data[j * 4 + 3] = A[j];
  }
  hardenAlpha(data, d.choke);
  self.postMessage({ id: d.id, buf: data.buffer }, [data.buffer]);
};
`;

interface ScratchBuffers {
  a: HTMLCanvasElement;
  b: HTMLCanvasElement;
  tmp: HTMLCanvasElement;
  sa: HTMLCanvasElement;
  sb: HTMLCanvasElement;
  sw: number;
  sh: number;
  ca: CanvasRenderingContext2D;
  cb: CanvasRenderingContext2D;
  ctmp: CanvasRenderingContext2D;
  csa: CanvasRenderingContext2D;
  csb: CanvasRenderingContext2D;
}

function makeBuffers(w: number, h: number): ScratchBuffers {
  const mk = (ww: number, hh: number) => {
    const c = document.createElement("canvas");
    c.width = ww;
    c.height = hh;
    return c;
  };
  const a = mk(w, h);
  const b = mk(w, h);
  const tmp = mk(w, h);
  const sw = Math.max(1, Math.round(w * RB_SCALE));
  const sh = Math.max(1, Math.round(h * RB_SCALE));
  const sa = mk(sw, sh);
  const sb = mk(sw, sh);

  return {
    a,
    b,
    tmp,
    sa,
    sb,
    sw,
    sh,
    ca: a.getContext("2d", { willReadFrequently: true })!,
    cb: b.getContext("2d")!,
    ctmp: tmp.getContext("2d", { willReadFrequently: true })!,
    csa: sa.getContext("2d")!,
    csb: sb.getContext("2d")!,
  };
}

export function CoronaGlyph({
  gradient = DEFAULT_CORONA_GRADIENT,
  gradientAngleDeg = -10.4,
  speedMultiplier = 1,
  scale = 1.85,
  dotSize = 11,
  dotShape = "circle",
  halftone = false,
  className,
  style,
}: CoronaGlyphProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep latest props in refs for the render loop
  const propsRef = useRef({
    gradient,
    gradientAngleDeg,
    speedMultiplier,
    dotSize,
    dotShape,
    halftone,
  });

  useEffect(() => {
    propsRef.current = {
      gradient,
      gradientAngleDeg,
      speedMultiplier,
      dotSize,
      dotShape,
      halftone,
    };
  }, [gradient, gradientAngleDeg, speedMultiplier, dotSize, dotShape, halftone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const visibleCtx = canvas.getContext("2d");
    if (!visibleCtx) return;

    let sizeIdx = 2;
    let offN = 0;
    let offCanvas: HTMLCanvasElement | null = null;
    let offCtx: CanvasRenderingContext2D | null = null;
    let offBuf: ScratchBuffers | null = null;

    let blurWorker: Worker | null = null;
    let workerBlobUrl: string | null = null;
    let blurJobId = 0;
    const blurJobs: Record<
      number,
      {
        resolve: (buf: ArrayBuffer) => void;
        reject: (err: Error) => void;
        timer: ReturnType<typeof setTimeout>;
      }
    > = {};

    function killBlurWorker() {
      for (const k in blurJobs) {
        clearTimeout(blurJobs[k].timer);
        blurJobs[k].reject(new Error("blur worker terminated"));
        delete blurJobs[k];
      }
      if (blurWorker) {
        try {
          blurWorker.terminate();
        } catch {
          // Ignore termination errors
        }
        blurWorker = null;
      }
      if (workerBlobUrl) {
        URL.revokeObjectURL(workerBlobUrl);
        workerBlobUrl = null;
      }
    }

    try {
      workerBlobUrl = URL.createObjectURL(
        new Blob([WORKER_SRC], { type: "text/javascript" }),
      );
      blurWorker = new Worker(workerBlobUrl);
      blurWorker.onmessage = (e) => {
        const job = blurJobs[e.data.id];
        if (job) {
          clearTimeout(job.timer);
          delete blurJobs[e.data.id];
          job.resolve(e.data.buf);
        }
      };
      blurWorker.onerror = blurWorker.onmessageerror = () => {
        killBlurWorker();
      };
    } catch {
      blurWorker = null;
    }

    let blurSyncA: Float32Array | null = null;
    let blurSyncB: Float32Array | null = null;

    function boxBlurAlphaSync(
      data: Uint8ClampedArray,
      w: number,
      h: number,
      radius: number,
      iterations: number,
    ) {
      const r = Math.round(radius);
      const nIt = Math.max(1, Math.round(iterations));
      if (r < 1) return;
      const n = w * h;
      if (!blurSyncA || blurSyncA.length < n) {
        blurSyncA = new Float32Array(n);
        blurSyncB = new Float32Array(n);
      }
      const bA = blurSyncA;
      const bB = blurSyncB;
      if (!bA || !bB) return;
      for (let i = 0; i < n; i++) bA[i] = data[i * 4 + 3];
      for (let it = 0; it < nIt; it++) {
        boxBlurH(bA, bB, w, h, r);
        boxBlurV(bB, bA, w, h, r);
      }
      for (let j = 0; j < n; j++) data[j * 4 + 3] = bA[j];
    }

    function blurAndChoke(
      goo: ImageData,
      OW: number,
      OH: number,
      radius: number,
      iterations: number,
      chokeLevel: number,
    ): Promise<ImageData> {
      if (!blurWorker) {
        boxBlurAlphaSync(goo.data, OW, OH, radius, iterations);
        hardenAlpha(goo.data, chokeLevel);
        return Promise.resolve(goo);
      }
      const id = ++blurJobId;
      return new Promise<ArrayBuffer>((resolve, reject) => {
        const timer = setTimeout(() => {
          if (blurJobs[id]) killBlurWorker();
        }, 10000);
        blurJobs[id] = { resolve, reject, timer };
        blurWorker!.postMessage(
          {
            id,
            buf: goo.data.buffer,
            w: OW,
            h: OH,
            r: radius,
            iter: iterations,
            choke: chokeLevel,
          },
          [goo.data.buffer],
        );
      }).then((buf) => new ImageData(new Uint8ClampedArray(buf), OW, OH));
    }

    // Initialize flares
    const flares: Flare[] = [];
    for (let fi = 0; fi < P.count; fi++) flares.push(makeFlare(fi));

    const layout: LayoutCircle[] = [];
    let loopClock = 0;

    function computeLayout(advance: boolean, dt: number) {
      layout.length = 0;
      const sz = P.size / 100;
      layout.push({ x: CX, y: CY, r: P.rOuter * sz });

      const speedFactor = propsRef.current.speedMultiplier;
      const sp = advance ? dt * 60 * speedFactor : 0;
      if (advance && LOOP.on) {
        loopClock =
          (loopClock + dt * speedFactor) % Math.max(0.001, LOOP.seconds);
      }
      const loopFrac = LOOP.seconds > 0 ? loopClock / LOOP.seconds : 0;
      const rMax = P.distMax * (1 + P.overshoot / 100);
      const reachF = P.distBias / 100;
      const RB = 0.12;
      const bandLo = RB + 0.4 * (P.spikeVar / 100);
      const PUMP_FREQ = 3.0;
      const PUMP_SHARP = 1.7;

      for (let i = 0; i < flares.length; i++) {
        const b = flares[i];
        const speedVal = P.speedMin + (P.speedMax - P.speedMin) * b.speedRand;
        let tArg: number;
        let mod = 0;
        let pumpArg: number;

        if (LOOP.on) {
          const cellsPerLoop = Math.max(
            1,
            Math.round(speedVal * 0.06 * LOOP.seconds),
          );
          tArg = b.t + loopFrac * cellsPerLoop;
          mod = cellsPerLoop;
          const pumpCyclesPerLoop = Math.max(
            1,
            Math.round((cellsPerLoop * PUMP_FREQ) / TAU),
          );
          pumpArg =
            (b.t + b.posOff) * PUMP_FREQ + loopFrac * pumpCyclesPerLoop * TAU;
        } else {
          if (advance) b.t += (speedVal / 1000) * sp;
          tArg = b.t;
          pumpArg = (b.t + b.posOff) * PUMP_FREQ;
        }

        const mag = Math.abs(
          (wiggleNoise(b.posId, tArg + b.posOff, mod) - 0.5) * 2,
        );
        const thr = RB + b.reachRand * (1 - 2 * RB);
        const reachW = smoothstep(thr - bandLo, thr + RB, reachF);
        const pump = Math.pow((1 - Math.cos(pumpArg)) / 2, PUMP_SHARP);
        const dist = (mag + (pump - mag) * reachW) * rMax;
        const ang = b.angleRand * P.rotSpread * DEG;
        const rad =
          (P.sizeMin +
            (P.sizeMax - P.sizeMin) *
              wiggleNoise(b.sizeId, tArg + b.sizeOff, mod)) /
          2;

        layout.push({
          x: CX + Math.cos(ang) * dist * sz,
          y: CY + Math.sin(ang) * dist * sz,
          r: rad * sz,
        });
      }
    }

    function resolveCoronaFill(outCtx: CanvasRenderingContext2D, sc: number) {
      const angleRad = propsRef.current.gradientAngleDeg * DEG;
      const R = GRAD_REACH * (P.size / 100);
      const dx = Math.cos(angleRad) * R;
      const dy = Math.sin(angleRad) * R;
      const g = outCtx.createLinearGradient(
        (CX - dx) * sc,
        (CY - dy) * sc,
        (CX + dx) * sc,
        (CY + dy) * sc,
      );
      const gradStops = propsRef.current.gradient;
      for (let i = 0; i < gradStops.length; i++) {
        const [col, pos] = gradStops[i];
        g.addColorStop(pos, col);
      }
      return g;
    }

    function buildCoverage(
      OW: number,
      OH: number,
      sc: number,
      buf: ScratchBuffers,
    ): Promise<HTMLCanvasElement> {
      const { ca, cb, a, b, sa, sb, csa, csb, sw, sh } = buf;
      ca.setTransform(1, 0, 0, 1, 0, 0);
      ca.clearRect(0, 0, OW, OH);
      ca.globalAlpha = 1;
      ca.globalCompositeOperation = "source-over";
      ca.fillStyle = "#fff";
      ca.beginPath();
      for (let i = 0; i < layout.length; i++) {
        const bl = layout[i];
        const rr = Math.max(0.5, bl.r * sc);
        const cx = bl.x * sc;
        const cy = bl.y * sc;
        ca.moveTo(cx + rr, cy);
        ca.arc(cx, cy, rr, 0, TAU);
      }
      ca.fill();

      const level = effectiveChoke(P.choke, P.iter);
      const blurR = P.blur * (P.size / 100) * sc;
      const goo = ca.getImageData(0, 0, OW, OH);

      return blurAndChoke(goo, OW, OH, blurR, P.iter, level)
        .catch(() => {
          const g = ca.getImageData(0, 0, OW, OH);
          boxBlurAlphaSync(g.data, OW, OH, blurR, P.iter);
          hardenAlpha(g.data, level);
          return g;
        })
        .then((g) => {
          ca.putImageData(g, 0, 0);
          if (!FX.rblurOn || FX.rblurAmount <= 0) return a;

          const PASSES = Math.max(1, Math.round(FX.rblurPasses));
          const spread = (FX.rblurAmount / 100) * 0.4;
          let N = Math.round((10 + spread * 90) / Math.sqrt(PASSES / 2));
          N = Math.max(5, Math.min(33, N | 1));
          const rs = sw / OW;
          const cx2 = CX * sc * rs;
          const cy2 = CY * sc * rs;

          csa.setTransform(1, 0, 0, 1, 0, 0);
          csa.clearRect(0, 0, sw, sh);
          csa.globalCompositeOperation = "source-over";
          csa.globalAlpha = 1;
          csa.drawImage(a, 0, 0, OW, OH, 0, 0, sw, sh);

          let read = sa;
          let write = sb;
          for (let p = 0; p < PASSES; p++) {
            const wctx = write === sa ? csa : csb;
            wctx.setTransform(1, 0, 0, 1, 0, 0);
            wctx.clearRect(0, 0, sw, sh);
            wctx.globalCompositeOperation = "lighter";
            wctx.globalAlpha = 1 / N;
            for (let k = 0; k < N; k++) {
              const z = 1 + spread * ((2 * k) / (N - 1) - 1);
              wctx.setTransform(z, 0, 0, z, cx2 * (1 - z), cy2 * (1 - z));
              wctx.drawImage(read, 0, 0);
            }
            wctx.setTransform(1, 0, 0, 1, 0, 0);
            wctx.globalCompositeOperation = "source-over";
            wctx.globalAlpha = 1;
            const t = read;
            read = write;
            write = t;
          }
          cb.setTransform(1, 0, 0, 1, 0, 0);
          cb.clearRect(0, 0, OW, OH);
          cb.globalCompositeOperation = "source-over";
          cb.globalAlpha = 1;
          cb.imageSmoothingEnabled = true;
          cb.drawImage(read, 0, 0, sw, sh, 0, 0, OW, OH);
          return b;
        });
    }

    let powLUT: Float32Array | null = null;
    let powLUTExp = -1;
    function getPowLUT() {
      if (powLUTExp === FX.htFalloff && powLUT) return powLUT;
      powLUT = new Float32Array(256);
      for (let i = 0; i < 256; i++)
        powLUT[i] = Math.pow(i / 255, FX.htFalloff);
      powLUTExp = FX.htFalloff;
      return powLUT;
    }

    function drawHalftone(
      cov: Uint8ClampedArray,
      OW: number,
      OH: number,
      sc: number,
      ctx: CanvasRenderingContext2D,
      fill: CanvasGradient | string,
    ) {
      const activeDotSize = propsRef.current.dotSize;
      const isCircle = propsRef.current.dotShape === "circle";
      const cell = Math.max(2, activeDotSize * (P.size / 100) * sc);
      const ang = FX.htRotation * DEG;
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const halfW = OW / 2;
      const halfH = OH / 2;
      const dotAng = isCircle ? ang : ang + Math.PI / 4;
      const k1 = Math.cos(dotAng) - Math.sin(dotAng);
      const k2 = Math.cos(dotAng) + Math.sin(dotAng);
      const lut = getPowLUT();

      ctx.fillStyle = fill;
      ctx.beginPath();

      let uMin = Infinity;
      let uMax = -Infinity;
      let vMin = Infinity;
      let vMax = -Infinity;
      const corners = [
        [-cell, -cell],
        [OW + cell, -cell],
        [-cell, OH + cell],
        [OW + cell, OH + cell],
      ];
      for (let ci = 0; ci < 4; ci++) {
        const dx = corners[ci][0] - halfW;
        const dy = corners[ci][1] - halfH;
        const uu = ca * dx + sa * dy;
        const vv = -sa * dx + ca * dy;
        if (uu < uMin) uMin = uu;
        if (uu > uMax) uMax = uu;
        if (vv < vMin) vMin = vv;
        if (vv > vMax) vMax = vv;
      }
      const iu0 = Math.floor(uMin / cell);
      const iu1 = Math.ceil(uMax / cell);
      const iv0 = Math.floor(vMin / cell);
      const iv1 = Math.ceil(vMax / cell);

      for (let iu = iu0; iu <= iu1; iu++) {
        for (let iv = iv0; iv <= iv1; iv++) {
          const lx = iu * cell;
          const ly = iv * cell;
          const x = halfW + ca * lx - sa * ly;
          const y = halfH + sa * lx + ca * ly;
          if (x < -cell || x > OW + cell || y < -cell || y > OH + cell) continue;
          const px = Math.min(OW - 1, Math.max(0, x | 0));
          const py = Math.min(OH - 1, Math.max(0, y | 0));
          const aRaw = cov[(py * OW + px) * 4 + 3];
          if (aRaw <= 5) continue;
          const rr = lut[aRaw] * cell * FX.htFill;
          if (rr < 0.3) continue;

          if (isCircle) {
            ctx.moveTo(x + rr, y);
            ctx.arc(x, y, rr, 0, TAU);
          } else {
            ctx.moveTo(x + rr * k1, y + rr * k2);
            ctx.lineTo(x - rr * k2, y + rr * k1);
            ctx.lineTo(x - rr * k1, y - rr * k2);
            ctx.lineTo(x + rr * k2, y - rr * k1);
            ctx.closePath();
          }
        }
      }
      ctx.fill();
    }

    function sampleCoverage(
      cov: HTMLCanvasElement,
      buf: ScratchBuffers,
      OW: number,
      OH: number,
    ) {
      const ctmp = buf.ctmp;
      ctmp.setTransform(1, 0, 0, 1, 0, 0);
      ctmp.clearRect(0, 0, OW, OH);
      ctmp.globalCompositeOperation = "source-over";
      ctmp.drawImage(cov, 0, 0);
      return ctmp.getImageData(0, 0, OW, OH).data;
    }

    function tintTo(
      targetCtx: CanvasRenderingContext2D,
      src: HTMLCanvasElement,
      OW: number,
      OH: number,
      buf: ScratchBuffers,
      color: CanvasGradient | string,
    ) {
      const ctmp = buf.ctmp;
      ctmp.setTransform(1, 0, 0, 1, 0, 0);
      ctmp.clearRect(0, 0, OW, OH);
      ctmp.globalCompositeOperation = "source-over";
      ctmp.drawImage(src, 0, 0);
      ctmp.globalCompositeOperation = "source-in";
      ctmp.fillStyle = color;
      ctmp.fillRect(0, 0, OW, OH);
      ctmp.globalCompositeOperation = "source-over";
      targetCtx.drawImage(buf.tmp, 0, 0);
    }

    function renderCore(
      targetCtx: CanvasRenderingContext2D,
      OW: number,
      OH: number,
      sc: number,
      buf: ScratchBuffers,
    ): Promise<void> {
      return buildCoverage(OW, OH, sc, buf).then((cov) => {
        targetCtx.setTransform(1, 0, 0, 1, 0, 0);
        targetCtx.clearRect(0, 0, OW, OH);
        const fill = resolveCoronaFill(targetCtx, sc);
        if (propsRef.current.halftone) {
          drawHalftone(
            sampleCoverage(cov, buf, OW, OH),
            OW,
            OH,
            sc,
            targetCtx,
            fill,
          );
        } else {
          tintTo(targetCtx, cov, OW, OH, buf, fill);
        }
        if (P.rInner > 0) {
          targetCtx.save();
          targetCtx.beginPath();
          targetCtx.arc(
            CX * sc,
            CY * sc,
            P.rInner * (P.size / 100) * sc,
            0,
            TAU,
          );
          targetCtx.clip();
          targetCtx.clearRect(0, 0, OW, OH);
          targetCtx.restore();
        }
      });
    }

    function sizeFor(): [number, number] {
      const r = canvas!.getBoundingClientRect();
      if (!r.width || !r.height) return [0, 0];
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = r.width * dpr;
      const h = r.height * dpr;
      const longSide = Math.max(w, h);
      const cap = SIZE_STEPS[sizeIdx];
      let k = longSide > cap ? cap / longSide : 1;
      if (longSide * k < MIN_PX) k = MIN_PX / longSide;
      return [
        Math.max(2, Math.round(w * k)),
        Math.max(2, Math.round(h * k)),
      ];
    }

    function syncSizes(): boolean {
      const [w, h] = sizeFor();
      const targetSize = Math.min(w, h);
      if (targetSize <= 2) return false;

      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }

      if (targetSize !== offN) {
        offN = targetSize;
        const sc = offN / CROP;
        const OW = Math.max(2, Math.round(VBW * sc));
        const OH = Math.max(2, Math.round(VBH * sc));
        offCanvas = document.createElement("canvas");
        offCanvas.width = OW;
        offCanvas.height = OH;
        offCtx = offCanvas.getContext("2d");
        offBuf = makeBuffers(OW, OH);
      }
      return true;
    }

    function blit() {
      if (!offCanvas) return;
      const sc = offN / CROP;
      const sx = (CX - CROP / 2) * sc;
      const sy = (CY - CROP / 2) * sc;
      const side = CROP * sc;
      const cw = canvas!.width;
      const ch = canvas!.height;
      const d = Math.min(cw, ch);

      visibleCtx!.setTransform(1, 0, 0, 1, 0, 0);
      visibleCtx!.clearRect(0, 0, cw, ch);
      visibleCtx!.drawImage(
        offCanvas,
        sx,
        sy,
        side,
        side,
        (cw - d) / 2,
        (ch - d) / 2,
        d,
        d,
      );
    }

    const costs: number[] = [];
    function noteCost(ms: number) {
      costs.push(ms);
      if (costs.length < 8) return;
      costs.sort((a, b) => a - b);
      const med = costs[costs.length >> 1];
      costs.length = 0;
      if (med > FRAME_MS * 0.95 && sizeIdx > 0) sizeIdx--;
      else if (med < FRAME_MS * 0.45 && sizeIdx < SIZE_STEPS.length - 1)
        sizeIdx++;
    }

    let rendering = false;
    function computeAndDraw(advance: boolean, dt: number): Promise<void> {
      if (!syncSizes() || !offCtx || !offBuf || !offCanvas) {
        return Promise.resolve();
      }
      rendering = true;
      const t0 = performance.now();
      const sc = offN / CROP;
      computeLayout(advance, dt);
      return renderCore(offCtx, offCanvas.width, offCanvas.height, sc, offBuf)
        .then(blit)
        .catch(() => {
          // Keep last good frame on render failure
        })
        .then(() => {
          rendering = false;
          if (advance) noteCost(performance.now() - t0);
        });
    }

    let playing = false;
    let rafId = 0;
    let lastNow = 0;
    let onScreen = false;
    let reduceMotion = false;

    function scheduleFrame() {
      if (!rafId) rafId = requestAnimationFrame(frame);
    }

    function frame(now: number) {
      rafId = 0;
      if (!playing) return;
      if (rendering) {
        scheduleFrame();
        return;
      }
      const elapsed = lastNow ? now - lastNow : FRAME_MS;
      if (elapsed < FRAME_MS - 4) {
        scheduleFrame();
        return;
      }
      const dt = Math.min(0.1, elapsed / 1000);
      lastNow = now;
      computeAndDraw(true, dt).then(() => {
        if (playing) scheduleFrame();
      });
    }

    function updatePlayState() {
      const should = onScreen && !document.hidden && !reduceMotion;
      if (should === playing) return;
      playing = should;
      if (playing) {
        lastNow = 0;
        scheduleFrame();
      }
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion = mq.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      updatePlayState();
      if (reduceMotion) computeAndDraw(false, 0);
    };
    mq.addEventListener("change", onMotionChange);

    const onVisibilityChange = () => {
      updatePlayState();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        updatePlayState();
      },
      { rootMargin: "250px" },
    );
    io.observe(container);

    // Initial paint
    computeAndDraw(false, 0);

    return () => {
      playing = false;
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      mq.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      killBlurWorker();
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className={`${styles.coronaGlyph} ${className ?? ""}`}
      style={
        {
          ...style,
          "--corona-scale": scale,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.coronaCanvas} />
    </span>
  );
}
