// overlay.js
let root, fpsEl, ballsEl, lastUpdate = 0;

export function initHud(parent = document.body) {
  // Ha már létezik a HUD (#hud), csak referenciákat állítunk be
  root = document.getElementById('hud');
  if (root) {
    fpsEl = root.querySelector('#fps');
    ballsEl = root.querySelector('#balls');
    return root;
  }
  // Ha nincs, létrehozzuk
  root = document.createElement('div');
  root.id = 'hud';
  root.style.cssText = [
    'position:fixed','top:8px','left:8px','z-index:9999',
    'color:#ddd','background:rgba(0,0,0,.35)','padding:6px 8px',
    'border-radius:8px','font:12px/1.3 system-ui,Segoe UI,Roboto,Arial,sans-serif',
    'pointer-events:none','user-select:none'
  ].join(';');
  root.innerHTML = 'FPS: <b id="fps">–</b> &nbsp; Golyók: <b id="balls">–</b>';
  parent.appendChild(root);
  fpsEl = root.querySelector('#fps');
  ballsEl = root.querySelector('#balls');
  return root;
}

export function updateHud({ fps, balls }, now = performance.now()) {
  if (!root) return;
  if (now - lastUpdate < 150) return;     // 6–7 frissítés/mp elég
  if (typeof fps === 'number')   fpsEl.textContent   = String(fps);
  if (typeof balls === 'number') ballsEl.textContent = String(balls);
  lastUpdate = now;
}

export function destroyHud() {
  if (root?.parentNode) root.parentNode.removeChild(root);
  root = fpsEl = ballsEl = null;
}
