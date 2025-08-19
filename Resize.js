
function resize(){
  const w = container.clientWidth, h = container.clientHeight || 1;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function getViewportRect() {
  // teljes belső pixelméret (renderer canvas)
  const pxW = renderer.domElement.width;
  const pxH = renderer.domElement.height;
  const dpr = window.devicePixelRatio || 1;

  // ha már számolsz scrollBar_left-tel (CSS px), skálázzuk fel DPR-rel
  const leftPx = (typeof scrollBar_left === 'number')
    ? Math.max(0, Math.min(pxW, Math.round(scrollBar_left * dpr)))
    : Math.round(pxW * BAL_ARANY);

  return { x: 0, y: 0, w: leftPx, h: pxH };
}

function applyViewportAndCamera() {
  if (!renderer || !camera) return;
  const vp = getViewportRect();

  renderer.setViewport(vp.x, vp.y, vp.w, vp.h);
  renderer.setScissor(vp.x, vp.y, vp.w, vp.h);
  renderer.setScissorTest(true);

  const newAspect = vp.w > 0 ? (vp.w / vp.h) : 1;
  if (Math.abs(camera.aspect - newAspect) > 1e-6) {
    camera.aspect = newAspect;
    camera.updateProjectionMatrix();
  }

  // mindig a központra nézzen
  if (typeof kozpont === 'object' && kozpont) {
    camera.lookAt(kozpont.x, kozpont.y, kozpont.z);
  }
  if (typeof cameraControls !== 'undefined' && cameraControls && kozpont) {
    cameraControls.target.set(kozpont.x, kozpont.y, kozpont.z);
    cameraControls.update();
  }
}