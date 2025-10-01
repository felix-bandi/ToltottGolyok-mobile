import * as THREE from 'three';
import { state } from './core/state.js';
import { kozpont } from './golyo.js';

// Visszaadja az aktuális viewport metaadatot
export function getActiveViewport() {
  return state.viewport || null;
}

// Képernyő koordinátából (clientX, clientY) NDC (-1..1) konverzió a square viewporton belül
export function screenToNDC(clientX, clientY) {
  const vp = state.viewport;
  if (!vp) return { x: 0, y: 0, inside: false };
  // Ellenőrizzük, hogy a pointer a viewport téglalapban van-e
  const inside = clientX >= vp.x && clientX <= vp.x + vp.w && clientY >= (vp.canvasH - (vp.y + vp.h)) && clientY <= (vp.canvasH - vp.y);
  if (!inside) return { x: 0, y: 0, inside: false };
  // A WebGL y eredet alul van; a clientY felülről számol – ezért tükrözünk
  const yFromBottom = vp.canvasH - clientY; // alsó eredet
  const relX = (clientX - vp.x) / vp.w;      // 0..1
  const relY = (yFromBottom - vp.y) / vp.h;  // 0..1
  const ndcX = relX * 2 - 1;                 // -1..1
  const ndcY = relY * 2 - 1;                 // -1..1 (már alsó eredetből indultunk)
  return { x: ndcX, y: ndcY, inside: true };
}

// A viewport négyzet alakúra szabása és kamera frissítés
export function applyViewportAndCamera({ square = true } = {}) {
  if (!state.renderer || !state.camera) return;

  const w = state.container?.clientWidth || 1;
  const h = state.container?.clientHeight || 1;

  let vx = 0, vy = 0, vw = w, vh = h;

  if (square) {
    const side = Math.min(w, h);
    vw = vh = side;
    vy = h - side; // felülre helyezzük
  }

  state.renderer.setViewport(vx, vy, vw, vh);
  state.renderer.setScissor(vx, vy, vw, vh);
  state.renderer.setScissorTest(true);

  // Mentjük – clientY felülről érkezik, ezért canvasH tárolása kell a konverzióhoz
  state.viewport = { x: vx, y: vy, w: vw, h: vh, canvasW: w, canvasH: h };

  const desiredAspect = square ? 1 : (w / h);
  if (Math.abs(state.camera.aspect - desiredAspect) > 1e-6) {
    state.camera.aspect = desiredAspect;
    state.camera.updateProjectionMatrix();
  }

  if (kozpont) state.camera.lookAt(kozpont.x, kozpont.y, kozpont.z);
  if (typeof cameraControls !== 'undefined' && cameraControls && kozpont) {
    cameraControls.target.set(kozpont.x, kozpont.y, kozpont.z);
    cameraControls.update();
  }
}