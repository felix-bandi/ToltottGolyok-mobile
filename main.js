import * as THREE from 'three';
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
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.setClearColor(0x202024, 1);
container.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);
const amb = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(amb);
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(3, 5, 2);
scene.add(dir);

// --- Objektum: LÁTSSZON BIZTOSAN ---
const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const mat = new THREE.MeshNormalMaterial();   // önárnyékolás nélkül is színes
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
initHud();
let ballsCount = 1;
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  const aspect = w > 0 ? (w / h) : 1;
  if (Math.abs(camera.aspect - aspect) > 1e-6) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }
}
window.addEventListener('resize', resize);
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
  mesh.rotation.x = t * 0.0006;
  mesh.rotation.y = t * 0.0008;

  renderer.render(scene, camera);
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
//updateLines();*/

