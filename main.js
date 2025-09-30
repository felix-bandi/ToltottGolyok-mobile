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
import { attachTouchControls } from './input/touch.js';
//import { applyViewportAndCamera } from './Resize.js';

onResize();
state.container = document.getElementById('main');
initThree({ container: state.container });
const { scene, camera, renderer } = state;
attachTouchControls(renderer.domElement);

onResize();
//applyViewportAndCamera();
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
    szamol(1);
    acc   -= FIXED_DT_SEC;
    steps += 1;
  }
  updateGolyoInstancedMesh();
  updateSpecialMeshes();
  updateLines();

  // DEBUG INFO KIÍRÁS
  let debug = document.getElementById('debug');
  if (!debug) {
    debug = document.createElement('pre');
    debug.id = 'debug';
    debug.style.cssText = 'position:fixed;bottom:0;left:0;z-index:99999;background:rgba(0,0,0,0.7);color:#fff;font-size:12px;padding:6px;max-width:100vw;max-height:40vh;overflow:auto;pointer-events:none;';
    document.body.appendChild(debug);
  }
  debug.textContent =
    `camera.position: ${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}\n` +
    `camera.aspect: ${camera.aspect.toFixed(3)}\n` +
    `renderer size: ${renderer.domElement.width} x ${renderer.domElement.height}\n` +
    `container size: ${state.container?.clientWidth ?? 'n/a'} x ${state.container?.clientHeight ?? 'n/a'}\n`;

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

