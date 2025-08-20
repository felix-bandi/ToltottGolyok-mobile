// input/touch.js
import * as THREE from 'three';

// Egyszerű egyujjas forgatás + kétujjas pinch-zoom
export function attachTouchControls(element, camera, {
  rotateSpeed = 0.005,
  minPhi = 0.01,
  maxPhi = Math.PI - 0.01,
  minRadius = 2,
  maxRadius = 2000
} = {}) {
  if (!element || !camera) return;

  let isDown = false;
  let lastX = 0, lastY = 0;
  let startPinchDist = 0;
  const spherical = new THREE.Spherical().setFromVector3(camera.position.clone());

  function getPinchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function applyCamera() {
    spherical.phi = Math.min(maxPhi, Math.max(minPhi, spherical.phi));
    spherical.radius = Math.min(maxRadius, Math.max(minRadius, spherical.radius));
    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, 0);
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDown = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      spherical.setFromVector3(camera.position);
    } else if (e.touches.length === 2) {
      isDown = false;
      startPinchDist = getPinchDist(e.touches);
      spherical.setFromVector3(camera.position);
    }
    e.preventDefault();
  }

  function onTouchMove(e) {
    if (e.touches.length === 1 && isDown) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - lastX;
      const dy = y - lastY;
      lastX = x; lastY = y;
      spherical.theta -= dx * rotateSpeed;
      spherical.phi   -= dy * rotateSpeed;
      applyCamera();
      e.preventDefault();
    } else if (e.touches.length === 2) {
      const d = getPinchDist(e.touches);
      if (startPinchDist > 0 && d > 0) {
        const scale = startPinchDist / d; // >1 távolodik, <1 közelít
        spherical.radius *= scale;
        applyCamera();
        startPinchDist = d; // folytonos pinch
      }
      e.preventDefault();
    }
  }

  function onTouchEnd() {
    if (e.touches?.length === 0) {
      isDown = false;
      startPinchDist = 0;
    } else {
      isDown = false;
      startPinchDist = 0;
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
