// ...existing code...
let scene=null, camera=null, renderer=null;
let threeCamera=null, cameraControls=null;

let linesMesh = null;
let rafId = null, running = false, _ctxLossHandlersAttached = false;

export function cleanup() {
  console.log("🧹 Cleanup indul...");

  // --- Render loop leállítás ---
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  if (renderer?.setAnimationLoop) renderer.setAnimationLoop(null);
  running = false;

  // --- Saját tömbök, adatok törlése ---
  golyok.length = 0;
  scrollBars.length = 0;
  fpsHistory.length = 0;

  // --- THREE objektumok felszabadítása ---
  const disposedGeoms = new Set();
  const disposedMats  = new Set();
  const MAP_KEYS = [
    'map','normalMap','roughnessMap','metalnessMap','aoMap',
    'emissiveMap','specularMap','envMap','alphaMap','bumpMap','displacementMap'
  ];

  if (scene) {
    scene.traverse(obj => {
      // geometry
      const g = obj.geometry;
      if (g && !disposedGeoms.has(g) && typeof g.dispose === 'function') {
        g.dispose();
        disposedGeoms.add(g);
      }
      // material(ok)
      const mats = Array.isArray(obj.material) ? obj.material : (obj.material ? [obj.material] : []);
      for (const m of mats) {
        if (!m || disposedMats.has(m)) continue;

        // textúra map-ek
        for (const k of MAP_KEYS) {
          const tex = m[k];
          if (tex && typeof tex.dispose === 'function') {
            tex.dispose();
            m[k] = null;
          }
        }
        if (typeof m.dispose === 'function') m.dispose();
        disposedMats.add(m);
      }
    });

    // scene.environment felszabadítása (ha volt)
    if (scene.environment && typeof scene.environment.dispose === 'function') {
      scene.environment.dispose();
    }
    scene.environment = null;

    scene.clear();
  }

  // --- Renderer felszabadítás ---
  if (renderer) {
    try { renderer.setRenderTarget?.(null); } catch {}
    renderer.dispose?.();
    // forceContextLoss akkor kell, ha tényleg azonnali VRAM elengedés kell
    try { renderer.forceContextLoss?.(); } catch {}
    try { renderer.domElement?.remove?.(); } catch {}
    renderer = null;
  }

  // --- Kamera / Scene nullázás ---
  camera = null;
  scene = null;

  // ...canvas 2D context törlés eltávolítva...

  // --- Egyéb globálisok safe default ---
  korrekcio = 0;
  FPS = 0;
  FPS_atlag = 0;
  kurzor = {x:0, y:0};
  eger   = {x:0, y:0, z:0};

  // --- Pointer lock ki (ha aktív) ---
  if (document.pointerLockElement) {
    document.exitPointerLock?.();
  }

  console.log("✅ Cleanup kész");
}

export function cleanupLight() {
  try {
    // 1) loop leáll
    if (typeof stopLoop === 'function') stopLoop();

    // 2) renderer „könnyű” takarítás (nincs dispose!)
    if (renderer) {
      renderer.setRenderTarget?.(null);
      // belső render listák ürítése (ártalmatlan, hasznos hosszú idle után)
      renderer.renderLists?.dispose?.();
      // idő reset a nagy delta elkerülésére
      if (typeof performance !== 'undefined') {
        lastTime = performance.now();
      }
    }

    console.log('🧽 cleanupLight kész (állapot megőrizve)');
  } catch (e) {
    console.warn('cleanupLight hiba:', e);
  }
}