const PI2 = Math.PI * 2;
const INDUL_GOLYO = 100;
const MAX_GOLYO = 2000;
let golyomax = MAX_GOLYO;
let hossz = 50; // Csökkentve a jobb láthatóság érdekében
let golyok = [], szalhossz = [], specialGolyok = [];
let kozpont = { x: 0, y: 0, z: 0, toltes: 0, szin: 0 };
let eger    = { x: 0, y: 0, z: 0, toltes: 0, szin: 0 };

class Golyo {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 500;

    this.r = 10;
    this.szin = szin;

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this.Fx = 0;
    this.Fy = 0;
    this.Fz = 0;
  }
}

function golyo_init() {
  golyok.length = 0;
  szalhossz.length = 0;
  specialGolyok.length = 0;
  for (let i = 0; i < allapot.N; ++i) golyok.push(new Golyo());
  for (let i = 0; i < allapot.N; ++i) {
    let a = Math.random() - 0.5;
    let b = Math.random() - 0.5;
    let c = Math.random() - 0.5;
    let k = hossz / Math.sqrt(a * a + b * b + c * c);
    golyok[i].x = k * a;
    golyok[i].y = k * b;
    golyok[i].z = k * c;
    golyok[i].szin = 0xFF8040;
  }

  // Központ és egér golyók KÜLÖN kezelése - NEM kerülnek a golyok tömbbe
  kozpont = new Golyo();
  kozpont.x = 0;
  kozpont.y = 0;
  kozpont.z = 0;
  kozpont.toltes = allapot.kozpont;
  kozpont.szin = 0x222222;
  specialGolyok.push(kozpont);
  eger = new Golyo();
  eger.x = 0;
  eger.y = 0;
  eger.z = 0;
  eger.toltes = allapot.eger;
  eger.szin = 0x222222;
  specialGolyok.push(eger);
}

function szamol(korrekcio) {
  let a, b, c, k;
  const N = Math.round(1999 * Math.pow(allapot.N / MAX_GOLYO, 2) + 1);
  const prevN = golyok.length;
  let LL = 0, valid;

  if (N < prevN) {
    golyok.splice(N);
  }

  if (N > prevN) {

    for (let i = 0; i < prevN; ++i) {
      const Lx = 0 - golyok[i].x;
      const Ly = 0 - golyok[i].y;
      const Lz = 0 - golyok[i].z;
      LL += Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz);
    }

    let hi = Math.floor(LL / prevN);
    if (hi < 50) hi = 50;

    for (let i = prevN; i < N; ++i) {
      let g = new Golyo();
      let attempts = 0;
      const maxAttempts = 100; // Korlátozzuk a próbálkozások számát

      do {
        a = Math.random() - 0.5;
        b = Math.random() - 0.5;
        c = Math.random() - 0.5;
        k = hi / Math.sqrt(a * a + b * b + c * c);
        g.x = k * a;
        g.y = k * b;
        g.z = k * c;
        valid = true;
        for (let j = 0; j < i && valid; ++j) { // Early break optimalizáció
          let rx = g.x - golyok[j].x;
          let ry = g.y - golyok[j].y;
          let rz = g.z - golyok[j].z;
          let L = Math.sqrt(rx * rx + ry * ry + rz * rz);
          if (L < 10) {
            valid = false;
          }
        }
        attempts++;
        //console.log(`Attempt ${attempts}: Golyó ${i} pozíció: (${g.x.toFixed(2)}, ${g.y.toFixed(2)}, ${g.z.toFixed(2)}) - Valid: ${valid}`);
      } while (!valid && attempts < maxAttempts);

      // Ha túl sok próbálkozás után sem sikerült, akkor elfogadjuk
      if (attempts >= maxAttempts) {
        //console.warn(`Golyó ${i} pozíciója nem érvényes, de elfogadva:`, g);
        valid = true;
      }

      golyok.push(g);
    }
  }

  for (const g of golyok) { g.Fx = 0; g.Fy = 0; g.Fz = 0; }
  for (let i = 0; i < golyok.length - 1; ++i)
    for (let j = i + 1; j < golyok.length; ++j) {
      const Rx = golyok[j].x - golyok[i].x;
      const Ry = golyok[j].y - golyok[i].y;
      const Rz = golyok[j].z - golyok[i].z;
      const R2 = Rx * Rx + Ry * Ry + Rz * Rz;
      let Fx, Fy, Fz;
      if (R2 > 0.001) {
        const R = Math.sqrt(R2);
        const R3 = R2 * R;
        Fx = Rx / R3;
        Fy = Ry / R3;
        Fz = Rz / R3;
      } else { Fx = 0; Fy = 0; Fz = 0; }
      golyok[i].Fx += Fx;
      golyok[j].Fx -= Fx;
      golyok[i].Fy += Fy;
      golyok[j].Fy -= Fy;
      golyok[i].Fz += Fz;
      golyok[j].Fz -= Fz;
    }

  for (const g of golyok) { g.Fx *= tolt2; g.Fy *= tolt2; g.Fz *= tolt2; }

  for (let i = 0; i < specialGolyok.length; ++i)
    for (let j = 0; j < golyok.length; ++j) {
      const Rx = golyok[j].x - specialGolyok[i].x;
      const Ry = golyok[j].y - specialGolyok[i].y;
      const Rz = golyok[j].z - specialGolyok[i].z;
      const R2 = Rx * Rx + Ry * Ry + Rz * Rz;
      let Fx, Fy, Fz;
      if (R2 > 0.0001) {
        const R = Math.sqrt(R2);
        const R3 = R2 * R;
        Fx = Rx / R3 * specialGolyok[i].toltes * allapot.toltes;
        Fy = Ry / R3 * specialGolyok[i].toltes * allapot.toltes;
        Fz = Rz / R3 * specialGolyok[i].toltes * allapot.toltes;
      } else { Fx = 0; Fy = 0; Fz = 0; }
      golyok[j].Fx -= Fx;
      golyok[j].Fy -= Fy;
      golyok[j].Fz -= Fz;
    }
  const tomeg = allapot.tomeg / korrekcio;
  for (const g of golyok) {
    g.vx -= (allapot.D * g.x + g.Fx) / tomeg;
    g.vx *= allapot.csill;
    g.x += g.vx;
    g.vy -= (allapot.D * g.y + g.Fy) / tomeg;
    g.vy *= allapot.csill;
    g.y += g.vy;
    g.vz -= (allapot.D * g.z + g.Fz) / tomeg;
    g.vz *= allapot.csill;
    g.z += g.vz;
  }
}

function updateLines() {
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

