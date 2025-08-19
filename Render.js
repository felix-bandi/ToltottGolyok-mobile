const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const wrapper = document.getElementById('fullscreen-wrapper');
let scene=null, camera=null, renderer=null, container=null;
let threeCamera=null, cameraControls=null;
let golyoInstancedMesh = null;
let golyoGeometry = null;
let golyoMaterial = null;
let linesMesh = null;
let rafId = null, running = false, _ctxLossHandlersAttached = false;

function initThreeJS() {
  container = document.getElementById('container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  // Kamera helyes aspect aránnyal
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 50000);
  camera.position.set(0, 0, 500);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);// élesítés HiDPI-n
  applyViewportAndCamera(); // első beállítás
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.left = '0px';
  renderer.domElement.style.top = '0px';
  renderer.domElement.style.zIndex = '1';

  container.appendChild(renderer.domElement);

  // Világítás
  const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(100, 100, 100);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
}

function initGolyoInstancedMesh() {
  if (golyoInstancedMesh) {
    scene.remove(golyoInstancedMesh);
    golyoInstancedMesh.dispose();
  }
  if (golyoGeometry) {
    golyoGeometry.dispose();
  }
  if (golyoMaterial) {
    golyoMaterial.dispose();
  }
  golyoGeometry = new THREE.SphereGeometry(10, 16, 16);
  golyoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff8040,
    metalness: 0.7,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    reflectivity: 0.8,
    transmission: 0.0,
    ior: 1.5
  });
  golyoInstancedMesh = new THREE.InstancedMesh(golyoGeometry, golyoMaterial, MAX_GOLYO);

  scene.add(golyoInstancedMesh);
  kozpont.toltes = allapot.kozpont;
  eger.toltes = allapot.eger;
  tolt2 = allapot.toltes * allapot.toltes;
  eger.z = allapot.eger_z;
  const r = 0;
  const g = allapot.toltes / toltesMax * 255;
  const b = allapot.toltes / toltesMax * 80;
  golyoszin = (r << 16) | (g << 8) | b;
  camera.fov = allapot.fov;
  camera.position.set(0, 0, allapot.tavolsag);
  camera.updateProjectionMatrix();
}

function updateGolyoInstancedMesh() {
  //console.log("golyok.length =", golyok.length);
  for (let i = 0; i < golyok.length; ++i) {
    const g = golyok[i];
    if (isNaN(g.x) || isNaN(g.y) || isNaN(g.z)) {
      console.warn(`Golyó ${i} pozíciója hibás:`, g);
    }
  }

  if (!golyoInstancedMesh) return;
  for (let i = 0; i < golyok.length; ++i) {
    const g = golyok[i];
    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(g.x, g.y, g.z);
    golyoInstancedMesh.setMatrixAt(i, matrix);
  }
  golyoInstancedMesh.count = golyok.length;
  golyoInstancedMesh.instanceMatrix.needsUpdate = true;
  golyoMaterial.color.setHex(golyoszin); // Alapértelmezett szín
  updateSpecialMeshes();
  updateLines();
}

function initSpecialMeshes() {
  // Központ golyó mesh (zöld, MeshPhongMaterial árnyékolással)
  if (kozpontMesh) {
    scene.remove(kozpontMesh);
    kozpontMesh.geometry.dispose();
    kozpontMesh.material.dispose();
  }
  const kozpontGeometry = new THREE.SphereGeometry(12, 16, 16);
  const kozpontMaterial = new THREE.MeshPhongMaterial({ color: 0x44ff00 });
  kozpontMesh = new THREE.Mesh(kozpontGeometry, kozpontMaterial);
  kozpontMesh.castShadow = true;
  kozpontMesh.receiveShadow = true;
  scene.add(kozpontMesh);

  if (egerMesh) {
    scene.remove(egerMesh);
    egerMesh.geometry.dispose();
    egerMesh.material.dispose();
  }
  const egerGeometry = new THREE.SphereGeometry(12, 16, 16);
  const egerMaterial = new THREE.MeshPhongMaterial({ color: 0x44ff00 });
  egerMesh = new THREE.Mesh(egerGeometry, egerMaterial);
  egerMesh.castShadow = true;
  egerMesh.receiveShadow = true;
  scene.add(egerMesh);
}

function updateSpecialMeshes() {
  if (kozpontMesh && kozpont) {
    kozpontMesh.position.set(kozpont.x, kozpont.y, kozpont.z);
  }
  if (egerMesh && eger) {
    egerMesh.position.set(eger.x, eger.y, eger.z);
  }
}

function initLines() {
  if (linesMesh) {
    scene.remove(linesMesh);
    linesMesh.geometry.dispose();
    linesMesh.material.dispose();
  }
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(MAX_GOLYO * 2 * 3); // 2 pont/golyó, 3 koordináta/pont
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const colors = new Float32Array(MAX_GOLYO * 2 * 3); // RGB minden ponthoz 
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.LineBasicMaterial({
    vertexColors: true, // <- fontos!
    transparent: true,
    opacity: 0.8
  });
  linesMesh = new THREE.LineSegments(geometry, material);
  scene.add(linesMesh);
}

function updateLines() {
  if (!linesMesh) initLines();
  const positions = linesMesh.geometry.attributes.position.array;
  const colors = linesMesh.geometry.attributes.color.array;
  for (let i = 0; i < golyok.length; i++) {
    const x1 = kozpont.x, y1 = kozpont.y, z1 = kozpont.z;
    const x2 = golyok[i].x, y2 = golyok[i].y, z2 = golyok[i].z;
    positions[i * 6 + 0] = x1;
    positions[i * 6 + 1] = y1;
    positions[i * 6 + 2] = z1;
    positions[i * 6 + 3] = x2;
    positions[i * 6 + 4] = y2;
    positions[i * 6 + 5] = z2;

    // Vonalhossz
    const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
    szalhossz[i] = Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  for (let i = 0; i < golyok.length; i++) {
    const L = szalhossz[i];
    const r = Math.min(1, L / 500), g = 0.5, b = 0;
    colors[i * 6 + 0] = r;
    colors[i * 6 + 1] = g;
    colors[i * 6 + 2] = b;
    colors[i * 6 + 3] = r;
    colors[i * 6 + 4] = g;
    colors[i * 6 + 5] = b;
  }
  linesMesh.count = golyok.length;
  linesMesh.geometry.setDrawRange(0, golyok.length * 2);
  linesMesh.geometry.attributes.position.needsUpdate = true;
  linesMesh.geometry.attributes.color.needsUpdate = true;
}

function cleanup() {
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

  // --- Canvas 2D context törlés ---
  if (ctx && canvas) {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    // (opcionális) buffer reset: canvas.width = canvas.width;
  }

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

function cleanupLight() {
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