import { frameStart, frameEnd, getFps } from './stats.js';
import { initHud, updateHud } from './overlay.js';
import { resize } from './Resize.js';
import { initThreeJS, resizeThreeJS } from './threeInit.js';
import { initGolyoInstancedMesh, updateGolyoInstancedMesh } from './golyoInstanced.js';
import { initSpecialMeshes, updateSpecialMeshes } from './specialMeshes.js';
import { initLines } from './lines.js';
import { golyo_init, szamol } from './golyo.js';

initHud();
let ballsCount = 1;
resize();
requestAnimationFrame(tick);
//-------------------------------------------------------------------
function tick(t) {
  frameStart(t);

  szamol(korrekcio);
  updateGolyoInstancedMesh();
  updateSpecialMeshes();
  updateLines();
  
  frameEnd(t);
  updateHud({ fps: getFps(), balls: ballsCount });
  requestAnimationFrame(tick); 
}

// Inicializálás
initThreeJS();
golyo_init();
initGolyoInstancedMesh();
initSpecialMeshes();
initLines();
resizeThreeJS();
updateGolyoInstancedMesh();
updateSpecialMeshes();
updateLines();