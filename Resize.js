let BAL_ARANY = 0.60; // tartalék, ha scrollBar_left nem elérhető

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

function meretez() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  scrollBar_width = canvas.width / 4;
  scrollBar_left = canvas.width - scrollBar_width * 1.1;

  // Az origo a bal fekete rész közepére - scrollBar_left a jobb szélét jelöli
  //origo.x = scrollBar_left / 2;  // A bal fekete rész közepére
  //origo.y = canvas.height / 2;

  const rect = canvas.getBoundingClientRect();
  const m = rect.height / 12;
  const o = (rect.height - m) / scrollStructs.length;

  scrollBars.forEach((sb, i) => {
    let top = o * (i + 0.5);
    let left = scrollBar_left;
    let bottom = top + m;
    let right = scrollBar_left + scrollBar_width;
    sb.meretez(left, right, top, bottom);
  });

  resizeThreeJS();
}

function resizeThreeJS() {
   if (!camera || !renderer) return;

  // 1) a renderer canvasa továbbra is a teljes ablakot követi
  const threeW = window.innerWidth;
  const threeH = window.innerHeight;
  renderer.setSize(threeW, threeH); // CSS + belső méret frissül

  // 2) viewport + aspect a bal sávhoz igazítva
  applyViewportAndCamera();

  // opcionális: egy render itt, hogy azonnal frissüljön
  renderer.render(scene, camera);
}