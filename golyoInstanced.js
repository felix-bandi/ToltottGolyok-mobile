import * as THREE from 'three';
import { state, allapot } from './core/state.js';
import { golyok, kozpont, e_world } from './golyo.js';

let golyoInstancedMesh = null;
let golyoGeometry = null;
let golyoMaterial = null;
//let golyoszin = 0xFFffff; // Alapértelmezett szín

export function initGolyoInstancedMesh() {
  if (golyoInstancedMesh) {
    state.scene.remove(golyoInstancedMesh);
    //golyoInstancedMesh.dispose();
  }
  if (golyoGeometry) {
    golyoGeometry.dispose();
  }
  if (golyoMaterial) {
    golyoMaterial.dispose();
  }
  golyoGeometry = new THREE.SphereGeometry(10, 16, 16);
  golyoMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x557799,
  roughness: 0.5,
  metalness: 0.5,
  clearcoat: 0.5,
  clearcoatRoughness: 0.1,
  reflectivity: 1.0,
});
  golyoInstancedMesh = new THREE.InstancedMesh(golyoGeometry, golyoMaterial, state.MAX_GOLYO);

  state.scene.add(golyoInstancedMesh);
  kozpont.toltes = allapot.kozpont;
  e_world.toltes = allapot.eger;
  
  //eger.z = allapot.eger_z;
  //const r = 0;
  //const g = allapot.toltes / state.MAX_GOLYO * 255;
  //const b = allapot.toltes / state.MAX_GOLYO * 80;
  //golyoszin = (r << 16) | (g << 8) | b;
  state.camera.fov = allapot.fov;
  state.camera.position.set(0, 0, allapot.tavolsag);
  state.camera.updateProjectionMatrix();
}

export function updateGolyoInstancedMesh() {
  //console.log("golyok.length =", golyok.length);
  for (let i = 0; i < golyok.length; ++i) {
    const g = golyok[i];
    if (isNaN(g.x) || isNaN(g.y) || isNaN(g.z)) {
      console.warn(`Golyó ${i} pozíciója hibás:`, g);
    }
  }

  if (!golyoInstancedMesh) return;
  for (let i = 0; i < golyok.length; ++i) {
    const g = golyok[i];
    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(g.x, g.y, g.z);
    golyoInstancedMesh.setMatrixAt(i, matrix);
  }
  golyoInstancedMesh.count = golyok.length;
  golyoInstancedMesh.instanceMatrix.needsUpdate = true;
  //golyoMaterial.color.setHex(golyoszin); // Alapértelmezett szín
}

