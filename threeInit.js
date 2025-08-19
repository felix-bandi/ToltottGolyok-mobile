function initThreeJS() {
  container = document.getElementById('container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  // Kamera helyes aspect aránnyal
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 50000);
  camera.position.set(0, 0, 500);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);// élesítés HiDPI-n
  applyViewportAndCamera(); // első beállítás
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.left = '0px';
  renderer.domElement.style.top = '0px';
  renderer.domElement.style.zIndex = '1';

  container.appendChild(renderer.domElement);

  // Világítás
  const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(100, 100, 100);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
}

function resizeThreeJS() {
   if (!camera || !renderer) return;

  // 1) a renderer canvasa továbbra is a teljes ablakot követi
  const threeW = window.innerWidth;
  const threeH = window.innerHeight;
  renderer.setSize(threeW, threeH); // CSS + belső méret frissül

  // 2) viewport + aspect a bal sávhoz igazítva
  applyViewportAndCamera();

  // opcionális: egy render itt, hogy azonnal frissüljön
  renderer.render(scene, camera);
}