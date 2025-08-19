window.addEventListener('dragstart', e => {
  e.preventDefault();
});

window.addEventListener('contextmenu', e => {
  e.preventDefault();
});

canvas.addEventListener('contextmenu', e => {
  e.preventDefault();
});

canvas.addEventListener("mousedown", function (e) {
  if (!renderer || !camera || !scene) return;   // <<< GUARD
  if (document.pointerLockElement !== canvas) {
    canvas.requestPointerLock();
    canvas.style.cursor = "none";
  }

  kurzor = getCanvasCoordsFrom3D();

  if (kurzor.x < scrollBar_left) {
    activeScrollBar = null;
    if (e.button === 0) { // Bal gomb - előre
      let currentIndex = -1;
      if (activeWheel) {
        currentIndex = scrollBars.indexOf(activeWheel);
      }
      let nextIndex = (currentIndex + 1) % scrollBars.length;
      activeWheel = scrollBars[nextIndex];
      return;
    } else if (e.button === 2) { // Jobb gomb - hátra  
      let currentIndex = -1;
      if (activeWheel) {
        currentIndex = scrollBars.indexOf(activeWheel);
      }
      let prevIndex = currentIndex <= 0 ? scrollBars.length - 1 : currentIndex - 1;
      activeWheel = scrollBars[prevIndex];
      return;
    }
  }

  for (let sb of scrollBars) {
    const { cs_l, cs_r, cs_t, cs_b } = sb.getSliderRect();
    if (
      kurzor.x >= cs_l && kurzor.x <= cs_r &&
      kurzor.y >= cs_t && kurzor.y <= cs_b
    ) {
      activeScrollBar = sb;
      scrollBarOffsetX = kurzor.x - cs_l;
    }
    if (!activeScrollBar) {
      if (kurzor.x >= sb.left && kurzor.x <= sb.right && kurzor.y >= sb.top && kurzor.y <= sb.bottom) {
        activeWheel = sb;
      }
    }
  }
  console.log(`scrollBarOffsetX: ${scrollBarOffsetX}, 
    activeScrollBar: ${activeScrollBar ? activeScrollBar.key : 'null'}, 
    activeWheel: ${activeWheel ? activeWheel.key : 'null'}`);
});

canvas.addEventListener("mousemove", function (e) {
  if (!renderer || !camera || !scene) return;   // <<< GUARD
  const tiltottScrollok = ["eger_z", "fov", "tavolsag"];
  const aktivTiltott = tiltottScrollok.includes(activeScrollBar?.key);
  const rect = canvas.getBoundingClientRect();
  if (document.pointerLockElement !== canvas) {
    const pos = screenTo3DWithZ(e.clientX, e.clientY, eger.z, camera, renderer.domElement);
    eger.x = pos.x;
    eger.y = pos.y;
  } else if (!mouseupwait && !aktivTiltott) {
    eger.x += e.movementX;
    eger.y -= e.movementY;
    egertav = Math.sqrt(eger.x * eger.x + eger.y * eger.y + eger.z * eger.z);

    kurzor = getCanvasCoordsFrom3D();

    const kilogX = (kurzor.x < rect.left || kurzor.x > rect.right);
    const kilogY = (kurzor.y < rect.top || kurzor.y > rect.bottom);

    if ((kilogX || kilogY) && egertav > 300) {
      if (kurzor.x < rect.left && e.movementX < 0) { eger.x -= e.movementX; }
      if (kurzor.x > rect.right && e.movementX > 0) { eger.x -= e.movementX; }
      if (kurzor.y < rect.top && e.movementY < 0) { eger.y += e.movementY; }
      if (kurzor.y > rect.bottom && e.movementY > 0) { eger.y += e.movementY; }
    }

  }
  if (activeScrollBar && !mouseupwait && !aktivTiltott) {
    const margin = activeScrollBar.height * SCROLLBAR_MARGIN_RATIO;
    const sliderWidth = activeScrollBar.width * SCROLLBAR_SLIDER_WIDTH_RATIO;
    const range = activeScrollBar.width - sliderWidth - 2 * margin;
    let x = kurzor.x - rect.left;
    let ratio = (x - activeScrollBar.left - margin - scrollBarOffsetX) / range;
    activeScrollBar.ratio = Math.max(0, Math.min(1, ratio));
    activeScrollBar.obj[activeScrollBar.key] = activeScrollBar.value;
    kozpont.toltes = allapot.kozpont;
    eger.toltes = allapot.eger;
    tolt2 = allapot.toltes * allapot.toltes;
    eger.z = allapot.eger_z;
    const r = allapot.toltes / toltesMax * 40;
    const g = allapot.toltes / toltesMax * 255;
    const b = allapot.toltes / toltesMax * 40;
    golyoszin = (r << 16) | (g << 8) | b;
    camera.fov = allapot.fov;
    camera.position.set(0, 0, allapot.tavolsag);
    camera.updateProjectionMatrix();
  }
});

canvas.addEventListener("mouseup", function () {
  activeScrollBar = null;
  mouseupwait = true;
  setTimeout(() => mouseupwait = false, 50);
});

canvas.addEventListener("wheel", function (e) {
  e.preventDefault();
  if (activeWheel) {
    const delta = e.deltaY > 0 ? -0.1 : 0.1; // Görgetés iránya
    activeWheel.ratio += delta;
    activeWheel.ratio = Math.max(0, Math.min(1, activeWheel.ratio));
    activeWheel.obj[activeWheel.key] = activeWheel.value;
  }
  kozpont.toltes = allapot.kozpont;
  eger.toltes = allapot.eger;
  tolt2 = allapot.toltes * allapot.toltes;
  eger.z = allapot.eger_z;
  const r = allapot.toltes / toltesMax * 40;
  const g = allapot.toltes / toltesMax * 255;
  const b = allapot.toltes / toltesMax * 40;
  golyoszin = (r << 16) | (g << 8) | b;
  camera.fov = allapot.fov;
  camera.position.set(0, 0, allapot.tavolsag)
  camera.updateProjectionMatrix();
});

canvas.addEventListener("mouseleave", function () {
  activeScrollBar = null;
});

window.addEventListener("resize", meretez);

window.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    //const container = document.getElementById("container");
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
});

document.addEventListener("fullscreenchange", function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  renderer.domElement.width = width;
  renderer.domElement.height = height;
  canvas.width = width;
  canvas.height = height;
  if (camera) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  meretez();
});

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement !== canvas) {
    canvas.style.cursor = "default";
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cleanupLight(); // stop + render-list reset + lastTime frissítés
    console.log("⏸️ Szünetel: háttérbe került az oldal");
  } else if (renderer && scene && camera) {
    lastTime = performance.now(); // extra biztonság
    startLoop();
    console.log("▶️ Újraindult: előtérbe került az oldal");
  }
});

let tearingDown = false;
const onTeardown = () => {
  if (tearingDown) return;
  tearingDown = true;
  try { cleanup(); } catch (e) { console.warn('cleanup hiba:', e); }
};

window.addEventListener('beforeunload', onTeardown);
window.addEventListener('pagehide', onTeardown); // iOS/Safari biztos ami biztos

let _needReinit = false;

const glCanvas = renderer?.domElement || document.querySelector('canvas'); // ha több canvasod van, azt használd, amin a WebGL megy

glCanvas?.addEventListener('webglcontextlost', (e) => {
  e.preventDefault(); // fontos: így kapunk 'restored' eseményt
  _needReinit = true;
  if (typeof stopLoop === 'function') stopLoop();
  console.warn('⚠️ WebGL context lost – várjuk a visszaállítást...');
}, { passive: false });

glCanvas?.addEventListener('webglcontextrestored', () => {
  console.log('🔁 WebGL context restored – teljes újraépítés');
  try {
    // teljes tisztítás, majd init és indulás (feltételezve, hogy van init())
    cleanup();
    if (typeof init === 'function') init();
    if (typeof startLoop === 'function') startLoop();
    _needReinit = false;
  } catch (e) {
    console.warn('Context restore utáni újraépítés hiba:', e);
  }
});

