// input/touch.js
import * as THREE from 'three';
import { eger, e_world } from '../golyo.js';
import { state, allapot } from '../core/state.js';
import { screenToNDC } from '../Resize.js';

// Egyszerű egyujjas érintés + kétujjas pinch zoom a kamera távolságra
export function attachTouchControls(element) {
  if (!element) return;

  let pinchStartDist = null;
  let startCamDist = null;
  const MIN_DIST = 50;
  const MAX_DIST = 2000;

  function getTouchDistance(t1, t2) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  }

  function applyCameraDistance(dist) {
    if (!state.camera) return;
    const clamped = Math.min(MAX_DIST, Math.max(MIN_DIST, dist));
    state.camera.position.set(0, 0, clamped);
    allapot.tavolsag = clamped;
    state.camera.updateProjectionMatrix();
  }

  function projectToPlane(ndcX, ndcY) {
    if (!state.camera) return;
    const cam = state.camera;
    // Használjuk az aktuális e_world.z értéket; ha nincs, fallback a sliderre
    const planeZ = (e_world && typeof e_world.z === 'number') ? e_world.z : allapot.eger_z;
    const p = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(cam);
    const dir = p.sub(cam.position).normalize();
    const denom = dir.z;
    if (Math.abs(denom) < 1e-6) return;
    const t = (planeZ - cam.position.z) / denom;
    if (t <= 0) return;
    if (e_world) {
      e_world.x = cam.position.x + dir.x * t;
      e_world.y = cam.position.y + dir.y * t;
      // e_world.z NEM változik itt
    }
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const ndc = screenToNDC(touch.clientX, touch.clientY);
      if (ndc.inside) {
        eger.x = ndc.x;
        eger.y = ndc.y;
        eger.aktiv = true;
        projectToPlane(eger.x, eger.y);
      } else {
        eger.aktiv = false;
      }
    } else if (e.touches.length === 2) {
      pinchStartDist = getTouchDistance(e.touches[0], e.touches[1]);
      startCamDist = allapot.tavolsag || Math.abs(state.camera?.position.z || 500);
      eger.aktiv = false; // kétujjasnál ne mozgassuk a "egér" pontot
    }
    e.preventDefault();
  }

  function onTouchMove(e) {
    if (e.touches.length === 1 && pinchStartDist == null) {
      const touch = e.touches[0];
      const ndc = screenToNDC(touch.clientX, touch.clientY);
      if (ndc.inside) {
        eger.x = ndc.x;
        eger.y = ndc.y;
        projectToPlane(eger.x, eger.y);
      }
    } else if (e.touches.length === 2) {
      const d = getTouchDistance(e.touches[0], e.touches[1]);
      if (pinchStartDist && startCamDist) {
        const ratio = d / pinchStartDist; // nagyobb => közelebb akarunk menni
        const newDist = startCamDist / ratio; // pinch kifelé => ratio>1 => kisebb távolság
        applyCameraDistance(newDist);
      }
    }
    e.preventDefault();
  }

  function onTouchEnd(e) {
    if (e.touches.length < 2) {
      pinchStartDist = null;
      startCamDist = null;
    }
    if (e.touches.length === 0) {
      eger.aktiv = false;
    }
  }

  element.addEventListener('touchstart', onTouchStart, { passive: false });
  element.addEventListener('touchmove',  onTouchMove,  { passive: false });
  element.addEventListener('touchend',   onTouchEnd,   { passive: false });
  element.addEventListener('touchcancel',onTouchEnd,   { passive: false });

  // lecsatoló
  return () => {
    element.removeEventListener('touchstart', onTouchStart);
    element.removeEventListener('touchmove',  onTouchMove);
    element.removeEventListener('touchend',   onTouchEnd);
    element.removeEventListener('touchcancel',onTouchEnd);
  };
}

