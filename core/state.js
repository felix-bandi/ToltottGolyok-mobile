export const state = {
  // three-hoz
  scene: null,
  camera: null,
  renderer: null,

  // DOM
  container: null,

  // hasznos: DPR és méretek cache-elése
  dpr: 1,
  width: 0,
  height: 0,

  MAX_GOLYO: 500 // max golyók száma
};


export const allapot = {
  N: 300,        
  csill: 0.98,
  tomeg: 3,
  toltes: 4,
  D: 0.005,
  kozpont: 1500,
  eger: 300,
  eger_z: 0,
  fov: 30,
  tavolsag: 500
};

// opcionális getter/setterek, ha szeretnéd kontrollálni a beállítást:
export const setThree = ({ scene, camera, renderer }) => {
  if (scene) state.scene = scene;
  if (camera) state.camera = camera;
  if (renderer) state.renderer = renderer;
};

export const setDom = ({ container }) => {
  if (container) state.container = container;
};
