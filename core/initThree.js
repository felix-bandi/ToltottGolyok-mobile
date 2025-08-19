// core/initThree.js
import * as THREE from 'three';
import { state, setThree, setDom } from './state.js';

export function initThree({ canvas, container, fov = 60, near = 0.1, far = 2000 }) {
  if (!canvas && !container) {
    throw new Error('initThree: legalább canvas vagy container szükséges.');
  }

  // DOM referenciák
  setDom({ canvas, container });

  const host = container ?? canvas;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas ?? undefined,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
    preserveDrawingBuffer: false,
  });

  // Színmenedzsment / tone mapping (modern Three)
  // Ha régebbi Three-t használsz, lehet hogy outputEncoding kell:
  // renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Árnyékok – ha nem kell, maradhat kikapcsolva
  renderer.shadowMap.enabled = false;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // DPR és méret
  const dpr = globalThis.devicePixelRatio || 1;
  renderer.setPixelRatio(dpr);

  const w = host.clientWidth || 0;
  const h = host.clientHeight || 0;
  renderer.setSize(w, h, false);

  // Kamera + szcéna
  const camera = new THREE.PerspectiveCamera(fov, (w || 1) / Math.max(1, h), near, far);
  camera.position.set(0, 0, 10);

  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x000000); // ha kell háttér

  // Állapot frissítése
  state.dpr = dpr;
  state.width = w;
  state.height = h;
  setThree({ scene, camera, renderer });

  // Egyszeri resize listener
  if (!initThree._resizeBound) {
    globalThis.addEventListener?.('resize', onResize, { passive: true });
    initThree._resizeBound = true;
  }
}

export function onResize() {
  const { renderer, camera, container, canvas } = state;
  if (!renderer || !camera) return;

  const host = container ?? canvas;
  const w = host?.clientWidth ?? 0;
  const h = host?.clientHeight ?? 0;

  camera.aspect = (w || 1) / Math.max(1, h);
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);

  state.width = w;
  state.height = h;
}
