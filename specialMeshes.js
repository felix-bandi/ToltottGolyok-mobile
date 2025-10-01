import * as THREE from 'three';
import { state, allapot } from './core/state.js';
import { golyok, kozpont, eger, e_world } from './golyo.js';
let kozpontMesh, egerMesh;

export function initSpecialMeshes() {
  // Központ golyó mesh (zöld, MeshPhongMaterial árnyékolással)
  if (kozpontMesh) {
    state.scene.remove(kozpontMesh);
    kozpontMesh.geometry.dispose();
    kozpontMesh.material.dispose();
  }
  const kozpontGeometry = new THREE.SphereGeometry(10, 12, 8);
  const kozpontMaterial = new THREE.MeshPhysicalMaterial({ 
    color: 0x44ff00,
  roughness: 0.5,
  metalness: 0.5,
  clearcoat: 0.5,
  clearcoatRoughness: 0.1,
  reflectivity: 1.0, 
  });
  kozpontMesh = new THREE.Mesh(kozpontGeometry, kozpontMaterial);
  kozpontMesh.castShadow = false;
  kozpontMesh.receiveShadow = false;
  state.scene.add(kozpontMesh);

  if (egerMesh) {
    state.scene.remove(egerMesh);
    egerMesh.geometry.dispose();
    egerMesh.material.dispose();
  }
  const egerGeometry = new THREE.SphereGeometry(10, 12, 8);
  const egerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
  roughness: 0.5,
  metalness: 0.5,
  clearcoat: 0.5,
  clearcoatRoughness: 0.1,
  reflectivity: 1.0,
 });
  egerMesh = new THREE.Mesh(egerGeometry, egerMaterial);
  egerMesh.castShadow = false;
  egerMesh.receiveShadow = false;
  state.scene.add(egerMesh);
}

export function updateSpecialMeshes() {
  if (kozpontMesh && kozpont) {
    kozpontMesh.position.set(kozpont.x, kozpont.y, kozpont.z);
  }
  if (egerMesh && e_world) {
      egerMesh.position.set(e_world.x, e_world.y, e_world.z);
      //egerMesh.visible = !!eger?.aktiv;
    }
}