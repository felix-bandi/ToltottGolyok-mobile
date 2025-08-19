import * as THREE from 'three';
import { frameStart, frameEnd, getFps } from './stats.js';
import { initHud, updateHud } from './overlay.js';

const container = document.getElementById('app');

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
container.appendChild(renderer.domElement);

// scene + camera
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(0, 0, 5);

// demo: kocka (helyfoglaló a saját rendereidig)
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshNormalMaterial());
scene.add(mesh);

// HUD
initHud();
let ballsCount = 1; // később a fizikából jön

// méretezés
function resize(){
  const w = container.clientWidth, h = container.clientHeight || 1;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(container);

// loop
function tick(t){
  frameStart(t);

  // anim (helyfoglaló)
  mesh.rotation.x = t * 0.0003;
  mesh.rotation.y = t * 0.0005;

  renderer.render(scene, camera);

  frameEnd(t);
  updateHud({ fps: getFps(), balls: ballsCount });
  requestAnimationFrame(tick);
}

resize();
requestAnimationFrame(tick);
console.log('THREE r' + THREE.REVISION);
