import * as THREE from 'three';

const container = document.getElementById('main');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(container.clientWidth, container.clientHeight, false);
container.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  2000
);
camera.position.set(0, 0, 500);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Példa: egy gömb a középpontban
const geometry = new THREE.SphereGeometry(50, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff8040 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

function onResize() {
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  camera.lookAt(0, 0, 0);
}
window.addEventListener('resize', onResize);

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();