import * as THREE from 'three';
import { frameStart, frameEnd, getFps } from './stats.js';
import { initHud, updateHud } from './overlay.js';
//import { resize } from './Resize.js';
import { initGolyoInstancedMesh, updateGolyoInstancedMesh } from './golyoInstanced.js';
//import { initSpecialMeshes, updateSpecialMeshes } from './specialMeshes.js';
//import { initLines } from './line.js';
import { golyo_init } from './golyo.js';
import { szamol } from './Physics.js';
// main.js
import { initThree } from './core/initThree.js';
import { state } from './core/state.js';

const canvas = document.getElementById('glcanvas');
const container = document.getElementById('main');
initThree({ canvas, container });
const { scene, camera, renderer } = state;
// … itt már építheted a jelenetet
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
//-------------------------------------------------------------------
// FIXED-STEP fizika, korrekció nélkül
const FIXED_DT_SEC = 1 / 60;     // 60 Hz fizika (állítható)
const MAX_STEPS    = 5;          // „safety” – ha lag van, ne darálja be magát

let acc = 0;
let last = performance.now();

function tick(t) {
  frameStart(t);
  // időkülönbség felhalmozása
  const dt = (t - last) / 1000;
  last = t;
  acc += Math.min(dt, FIXED_DT_SEC * MAX_STEPS);

  // ennyiszer léptetjük a fizikát fix lépéssel
  let steps = 0;
  while (acc >= FIXED_DT_SEC && steps < MAX_STEPS) {
    // NINCS korrekció: minden lépésben ugyanazt a „1” egységet adod át
    szamol(1);                 // <<— itt eddig korrekcio ment, most FIX: 1
    acc   -= FIXED_DT_SEC;
    steps += 1;
  }
  //szamol(korrekcio);
  //updateGolyoInstancedMesh();
  //updateSpecialMeshes();
  //updateLines();

  //mesh.rotation.x = t * 0.0006;
  //mesh.rotation.y = t * 0.0008;

  renderer.render(scene, camera);
  frameEnd(t);
  updateHud({ fps: getFps(), balls: ballsCount });
  requestAnimationFrame(tick); 
}
resize();
requestAnimationFrame(tick);
console.log('THREE r' + THREE.REVISION);
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

