import * as THREE from 'three';
import { state } from './core/state.js';
import { golyok, kozpont, szalhossz } from './golyo.js';
let linesMesh;

export function initLines() {
  if (linesMesh) {
    state.scene.remove(linesMesh);
    linesMesh.geometry.dispose();
    linesMesh.material.dispose();
  }
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(state.MAX_GOLYO * 2 * 3); // 2 pont/golyó, 3 koordináta/pont
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const colors = new Float32Array(state.MAX_GOLYO * 2 * 3); // RGB minden ponthoz 
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.LineBasicMaterial({
    vertexColors: true, // <- fontos!
    transparent: true,
    opacity: 0.8
  });
  linesMesh = new THREE.LineSegments(geometry, material);
  state.scene.add(linesMesh);
}

export function updateLines() {
  if (!linesMesh) initLines();
  const positions = linesMesh.geometry.attributes.position.array;
  const colors = linesMesh.geometry.attributes.color.array;
  for (let i = 0; i < golyok.length; i++) {
    const x1 = kozpont.x, y1 = kozpont.y, z1 = kozpont.z;
    const x2 = golyok[i].x, y2 = golyok[i].y, z2 = golyok[i].z;
    positions[i * 6 + 0] = x1;
    positions[i * 6 + 1] = y1;
    positions[i * 6 + 2] = z1;
    positions[i * 6 + 3] = x2;
    positions[i * 6 + 4] = y2;
    positions[i * 6 + 5] = z2;

    // Vonalhossz
    const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
    szalhossz[i] = Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  for (let i = 0; i < golyok.length; i++) {
    const L = szalhossz[i];
    const r = Math.min(1, L / 500), g = 0.5, b = 0;
    colors[i * 6 + 0] = r;
    colors[i * 6 + 1] = g;
    colors[i * 6 + 2] = b;
    colors[i * 6 + 3] = r;
    colors[i * 6 + 4] = g;
    colors[i * 6 + 5] = b;
  }
  linesMesh.count = golyok.length;
  linesMesh.geometry.setDrawRange(0, golyok.length * 2);
  linesMesh.geometry.attributes.position.needsUpdate = true;
  linesMesh.geometry.attributes.color.needsUpdate = true;
}