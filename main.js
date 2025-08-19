import * as THREE from 'three';
import { frameStart, frameEnd, getFps } from './stats.js';
import { initHud, updateHud } from './overlay.js';
//import { resize } from './Resize.js';
import { initGolyoInstancedMesh, updateGolyoInstancedMesh } from './golyoInstanced.js';
import { initSpecialMeshes, updateSpecialMeshes } from './specialMeshes.js';
import { initLines, updateLines } from './line.js';
import { golyo_init, golyok } from './golyo.js';
import { szamol } from './Physics.js';
import { initThree, onResize } from './core/initThree.js';
import { state } from './core/state.js';

const canvas = document.getElementById('glcanvas');
const container = document.getElementById('main');

initThree({ canvas, container });
const { scene, camera, renderer } = state;
onResize();
initHud();
//let ballsCount = 1;
golyo_init();
initGolyoInstancedMesh();
initSpecialMeshes();
initLines();
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
    
    szamol(1);                 // <<— itt eddig korrekcio ment, most FIX: 1
    acc   -= FIXED_DT_SEC;
    steps += 1;
  }
  
  updateGolyoInstancedMesh();
  updateSpecialMeshes();
  updateLines();

  renderer.render(scene, camera);
  frameEnd(t);
  updateHud({ fps: getFps(), balls: golyok.length });
  requestAnimationFrame(tick);
}

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

