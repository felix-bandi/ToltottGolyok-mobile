// core/initThree.js
import * as THREE from 'three';
import { state, allapot, setThree, setDom } from './state.js';
import { applyViewportAndCamera } from '../Resize.js';

export function initThree({ container, fov = 60, near = 0.1, far = 2000 }) {
  if (!container) {
    throw new Error('initThree: container szükséges.');
  }
  setDom({ container });
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
    preserveDrawingBuffer: false,
  });
  container.appendChild(renderer.domElement);
  // Színmenedzsment / tone mapping (modern Three)
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Árnyékok – ha nem kell, maradhat kikapcsolva
  renderer.shadowMap.enabled = false;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const host = container;
  // DPR és méret
  const dpr = globalThis.devicePixelRatio || 1;
  renderer.setPixelRatio(dpr);

  const w = host.clientWidth  || globalThis.innerWidth  || 1;
  const h = host.clientHeight || globalThis.innerHeight || 1;
  renderer.setSize(w, h, false);

  // Kamera + szcéna
  const camera = new THREE.PerspectiveCamera(allapot.fov ?? fov, (w || 1) / Math.max(1, h), near, far);
  camera.position.set(0, 0, allapot.tavolsag ?? 500);
  camera.lookAt(0, 0, 0);
  const scene = new THREE.Scene();

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
  const { renderer, camera, container } = state;
  if (!renderer || !camera) return;

  const host = container;
  // DPR változás (mobil zoom/orientáció)
  const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
  renderer.setPixelRatio(dpr);
  const w = host?.clientWidth  || globalThis.innerWidth  || 1;
  const h = host?.clientHeight || globalThis.innerHeight || 1;

  camera.aspect = (w || 1) / Math.max(1, h);
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  camera.lookAt(0, 0, 0);

  state.width = w;
  state.height = h;
  state.dpr = dpr;
  applyViewportAndCamera();
}
