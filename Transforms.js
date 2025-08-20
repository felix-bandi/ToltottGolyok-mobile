export function getCanvasCoordsFrom3D() {
  if (!camera || !renderer || !eger) return { x: 0, y: 0 };  // <<< GUARD
  const v = new THREE.Vector3(eger.x, eger.y, eger.z).project(camera);
  const rect = renderer.domElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const vp = getViewportRect(); // belső pixelekben

  // viewport bal-fentje CSS koordinátában
  const vpCssX = rect.left + vp.x / dpr;
  const vpCssY = rect.top  + vp.y / dpr;
  const vpCssW = vp.w / dpr;
  const vpCssH = vp.h / dpr;

  return {
    x: vpCssX + ( v.x * 0.5 + 0.5 ) * vpCssW,
    y: vpCssY + ( -v.y * 0.5 + 0.5 ) * vpCssH
  };
}

export function worldToScreen(pos) {
  if (!camera || !renderer) return { x: 0, y: 0 };  // <<< GUARD
  const v = pos.clone().project(camera);
  const rect = renderer.domElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const vp = getViewportRect();

  const vpCssX = rect.left + vp.x / dpr;
  const vpCssY = rect.top  + vp.y / dpr;
  const vpCssW = vp.w / dpr;
  const vpCssH = vp.h / dpr;

  return {
    x: vpCssX + ( v.x * 0.5 + 0.5 ) * vpCssW,
    y: vpCssY + ( -v.y * 0.5 + 0.5 ) * vpCssH
  };
}

export function screenTo3DWithZ(clientX, clientY, zVilag, camera, renderer) {
  const rect = renderer.domElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const vp = getViewportRect();

  // Egér pozíció CSS -> belső px
  const mouseCssX = clientX - rect.left;
  const mouseCssY = clientY - rect.top;
  const mousePxX  = mouseCssX * dpr;
  const mousePxY  = mouseCssY * dpr;

  // NDC a BAL VIEWPORTBAN!
  const ndcX = ((mousePxX - vp.x) / vp.w) * 2 - 1;
  const ndcY = -(((mousePxY - vp.y) / vp.h) * 2 - 1);

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -zVilag);
  const pont = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, pont);
  return pont;
}