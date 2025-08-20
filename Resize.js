import * as THREE from 'three';
import { state } from './core/state.js';
import { kozpont } from './golyo.js';

function getViewportRect() {
  // teljes belső pixelméret (renderer canvas)
  const pxW = state.renderer.domElement.width;
  const pxH = state.renderer.domElement.height;
  //const dpr = window.devicePixelRatio || 1; 
  return { x: 0, y: 0, w: pxW, h: pxH };
}

export function applyViewportAndCamera() {
  if (!state.renderer || !state.camera) return;
  const vp = getViewportRect();

  state.renderer.setViewport(0, 0, state.renderer.domElement.width, state.renderer.domElement.height);
  state.renderer.setScissor(0, 0, state.renderer.domElement.width, state.renderer.domElement.height);
  state.renderer.setScissorTest(false);

  const w = state.renderer.domElement.width;
  const h = state.renderer.domElement.height;
  const newAspect = w > 0 ? (w / h) : 1;
  if (Math.abs(state.camera.aspect - newAspect) > 1e-6) {
    state.camera.aspect = newAspect;
    state.camera.updateProjectionMatrix();
  }

  // mindig a központra nézzen
  if (typeof kozpont === 'object' && kozpont) {
    state.camera.lookAt(kozpont.x, kozpont.y, kozpont.z);
  }
  if (typeof cameraControls !== 'undefined' && cameraControls && kozpont) {
    cameraControls.target.set(kozpont.x, kozpont.y, kozpont.z);
    cameraControls.update();
  }
}