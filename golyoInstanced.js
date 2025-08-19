

export function initGolyoInstancedMesh() {
  if (golyoInstancedMesh) {
    scene.remove(golyoInstancedMesh);
    golyoInstancedMesh.dispose();
  }
  if (golyoGeometry) {
    golyoGeometry.dispose();
  }
  if (golyoMaterial) {
    golyoMaterial.dispose();
  }
  golyoGeometry = new THREE.SphereGeometry(10, 16, 16);
  golyoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff8040,
    metalness: 0.7,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    reflectivity: 0.8,
    transmission: 0.0,
    ior: 1.5
  });
  golyoInstancedMesh = new THREE.InstancedMesh(golyoGeometry, golyoMaterial, MAX_GOLYO);

  scene.add(golyoInstancedMesh);
  kozpont.toltes = allapot.kozpont;
  eger.toltes = allapot.eger;
  tolt2 = allapot.toltes * allapot.toltes;
  eger.z = allapot.eger_z;
  const r = 0;
  const g = allapot.toltes / toltesMax * 255;
  const b = allapot.toltes / toltesMax * 80;
  golyoszin = (r << 16) | (g << 8) | b;
  camera.fov = allapot.fov;
  camera.position.set(0, 0, allapot.tavolsag);
  camera.updateProjectionMatrix();
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
  golyoMaterial.color.setHex(golyoszin); // Alapértelmezett szín
}