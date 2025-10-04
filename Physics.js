const PI2 = Math.PI * 2;
const INDUL_GOLYO = 100;
//const MAX_GOLYO = 2000;
//let golyomax = MAX_GOLYO;


let kozpont = { x: 0, y: 0, z: 0, toltes: 0, szin: 0 };

import * as THREE from 'three';
import { allapot, state } from './core/state.js';
import { Golyo, golyok, specialGolyok, eger, e_world } from './golyo.js';

//let prevEgerAktiv = false;

export function szamol(korrekcio) {
  // Képernyő (eger: -1..1) -> világ (e_world) leképezés: sugár metszi az aktuális slider szerinti z síkot
  if (eger && eger.aktiv && state.camera) {
    const targetZ = (typeof allapot.eger_z === 'number') ? allapot.eger_z : (e_world ? e_world.z : 0);
    const near = new THREE.Vector3(eger.x, eger.y, 0).unproject(state.camera);
    const far  = new THREE.Vector3(eger.x, eger.y, 1).unproject(state.camera);
    const dir = far.clone().sub(near);
    if (Math.abs(dir.z) > 1e-6) {
      const t = (targetZ - near.z) / dir.z;
      if (t >= 0) {
        if (e_world) {
          e_world.x = near.x + dir.x * t;
          e_world.y = near.y + dir.y * t;
          e_world.z = targetZ; // slider szerinti sík
        }
      }
    }
  }

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

    // FIX: korábban: for (let i = prevN; i < N; ++i)  -> N nem létezett
    for (let i = prevN; i < allapot.N; ++i) {
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
      } while (!valid && attempts < maxAttempts);

      if (attempts >= maxAttempts) {
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
  // Új integráció: a rugó (origó felé mutató) irányú sebesség komponens csillapodik, tangenciális érintetlen.
  for (const g of golyok) {
    // Gyorsulás (Hooke + elektromos): a = -(D * x + Fx) / m  stb.
    const ax = -(allapot.D * g.x + g.Fx) / tomeg;
    const ay = -(allapot.D * g.y + g.Fy) / tomeg;
    const az = -(allapot.D * g.z + g.Fz) / tomeg;

    g.vx += ax;
    g.vy += ay;
    g.vz += az;

    // Radiális irány v_r = (v · r̂) r̂, ahol r̂ = r / |r|. Ezt csillapítjuk.
    const rx = g.x, ry = g.y, rz = g.z;
    const r2 = rx*rx + ry*ry + rz*rz;
    if (r2 > 1e-9) {
      const rInv = 1 / Math.sqrt(r2);
      const ux = rx * rInv, uy = ry * rInv, uz = rz * rInv; // r̂
      const vr = g.vx * ux + g.vy * uy + g.vz * uz; // skalár radiális sebesség
  // Teljes sebesség = radiális + tangenciális. Tangenciális = v - vr*r̂
      const vx_t = g.vx - vr * ux;
      const vy_t = g.vy - vr * uy;
      const vz_t = g.vz - vr * uz;
      // Csillapítások
  const vrNew = vr * allapot.csill;
  // Új komponensek összerakása: csak radiális csillapítás
  g.vx = vrNew * ux + vx_t;
  g.vy = vrNew * uy + vy_t;
  g.vz = vrNew * uz + vz_t;
    }


    // Izotróp közegellenállás (sebességalapú csillapítás) – log sliderrel állítható csill_vel
    if (allapot.csill_vel !== undefined && allapot.csill_vel < 1.0) {
      g.vx *= allapot.csill_vel;
      g.vy *= allapot.csill_vel;
      g.vz *= allapot.csill_vel;
    }

    // Pozíció frissítés
    g.x += g.vx;
    g.y += g.vy;
    g.z += g.vz;
  }
}
