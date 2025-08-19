import * as THREE from 'three';
import { state, allapot } from './core/state.js';
import { golyok, kozpont, eger } from './golyo.js';
let kozpontMesh, egerMesh;

export function initSpecialMeshes() {
  // Központ golyó mesh (zöld, MeshPhongMaterial árnyékolással)
  if (kozpontMesh) {
    scene.remove(kozpontMesh);
    kozpontMesh.geometry.dispose();
    kozpontMesh.material.dispose();
  }
  const kozpontGeometry = new THREE.SphereGeometry(12, 16, 16);
  const kozpontMaterial = new THREE.MeshPhongMaterial({ color: 0x44ff00 });
  kozpontMesh = new THREE.Mesh(kozpontGeometry, kozpontMaterial);
  kozpontMesh.castShadow = true;
  kozpontMesh.receiveShadow = true;
  state.scene.add(kozpontMesh);

  if (egerMesh) {
    scene.remove(egerMesh);
    egerMesh.geometry.dispose();
    egerMesh.material.dispose();
  }
  const egerGeometry = new THREE.SphereGeometry(12, 16, 16);
  const egerMaterial = new THREE.MeshPhongMaterial({ color: 0x44ff00 });
  egerMesh = new THREE.Mesh(egerGeometry, egerMaterial);
  egerMesh.castShadow = true;
  egerMesh.receiveShadow = true;
  state.scene.add(egerMesh);
}

export function updateSpecialMeshes() {
  if (kozpontMesh && kozpont) {
    kozpontMesh.position.set(kozpont.x, kozpont.y, kozpont.z);
  }
  if (egerMesh && eger) {
    egerMesh.position.set(eger.x, eger.y, eger.z);
  }
}