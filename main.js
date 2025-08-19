import { frameStart, frameEnd, getFps } from './stats.js';
import { initHud, updateHud } from './overlay.js';

//-------------------------------------------------------------------
function tick(t) {
  frameStart(t);

  szamol(korrekcio);
  updateGolyoInstancedMesh();

  frameEnd(t);
  updateHud({ fps: getFps(), balls: ballsCount });
  requestAnimationFrame(tick); 
}

// Inicializálás
initThreeJS();
golyo_init();
meretez();
scrollBar_init();
const toltesMax = scrollStructs.find(s => s.key === "toltes").max;
activeWheel = scrollBars.find(sb => sb.key === "eger_z");
initGolyoInstancedMesh();
initSpecialMeshes();
initLines();
updateGolyoInstancedMesh();
resizeThreeJS();

requestAnimationFrame(tick);