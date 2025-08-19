// stats.js
let last = 0;
let ema = 0;            // simított FPS
const alpha = 0.18;     // simítás mértéke (0..1)

export function frameStart(/* now = performance.now() */) {
  // helyfoglaló – szimmetria kedvéért
}

export function frameEnd(now = performance.now()) {
  if (!last) { last = now; return; }
  const dt = Math.max(1, now - last); // ms
  const inst = 1000 / dt;
  ema = ema ? ema + alpha * (inst - ema) : inst;
  last = now;
}

export function getFps() {
  return Math.round(ema || 0);
}

export function resetStats() {
  last = 0; ema = 0;
}
