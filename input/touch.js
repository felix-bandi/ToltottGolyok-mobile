// input/touch.js
import { eger } from '../golyo.js';

// Egyszerű egyujjas érintés követése
export function attachTouchControls(element) {
  if (!element) return;

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      eger.x = (touch.clientX / window.innerWidth) * 2 - 1;
      eger.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      eger.aktiv = true;
    }
    e.preventDefault();
  }

  function onTouchMove(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      eger.x = (touch.clientX / window.innerWidth) * 2 - 1;
      eger.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    }
    e.preventDefault();
  }

  function onTouchEnd(e) {
    eger.aktiv = false;
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

