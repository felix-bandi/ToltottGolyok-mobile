const PI2 = Math.PI * 2;
const INDUL_GOLYO = 100;
//const MAX_GOLYO = 2000;
//let golyomax = MAX_GOLYO;


let kozpont = { x: 0, y: 0, z: 0, toltes: 0, szin: 0 };
let eger    = { x: 0, y: 0, z: 0, toltes: 0, szin: 0 };

import { allapot, state } from './core/state.js';
import { Golyo, golyok, specialGolyok } from './golyo.js';

export function szamol(korrekcio) {
  let a, b, c, k;
  //const N = Math.round((state.MAX_GOLYO - 23) * Math.pow(allapot.N / state.MAX_GOLYO, 2) + 1);
  const prevN = golyok.length;
  let LL = 0, valid;
  const tolt2 = allapot.toltes * allapot.toltes;
  if (allapot.N < prevN) {
    golyok.splice(allapot.N);
  }

  if (allapot.N > prevN) {

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
