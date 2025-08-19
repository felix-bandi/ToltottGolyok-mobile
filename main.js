import { frameStart, frameEnd, getFps } from './stats.js';
import { initHud, updateHud } from './overlay.js';
//import { resize } from './Resize.js';
//import { initThreeJS, resizeThreeJS } from './threeInit.js';
//import { initGolyoInstancedMesh, updateGolyoInstancedMesh } from './golyoInstanced.js';
//import { initSpecialMeshes, updateSpecialMeshes } from './specialMeshes.js';
//import { initLines } from './lines.js';
//import { golyo_init, szamol } from './golyo.js';
const container = document.getElementById('app');

// --- Three bootstrap ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
container.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(0, 0, 5);

// helyfoglaló mesh – amíg a fizikát bekötjük
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial()
);
scene.add(mesh);
initHud();
let ballsCount = 1;
function resize() {
  const { clientWidth: w, clientHeight: h } = container;
  renderer.setSize(w, h, false);
  const aspect = w > 0 ? w / h : 1;
  if (Math.abs(camera.aspect - aspect) > 1e-6) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }
}
resize();
requestAnimationFrame(tick);
console.log('THREE r' + THREE.REVISION);
//-------------------------------------------------------------------
function tick(t) {
  frameStart(t);

  //szamol(korrekcio);
  //updateGolyoInstancedMesh();
  //updateSpecialMeshes();
  //updateLines();

  frameEnd(t);
  updateHud({ fps: getFps(), balls: ballsCount });
  requestAnimationFrame(tick); 
}

// Inicializálás
//initThreeJS();
//golyo_init();
//initGolyoInstancedMesh();
//initSpecialMeshes();
//initLines();
//resizeThreeJS();
//updateGolyoInstancedMesh();
//updateSpecialMeshes();
//updateLines();