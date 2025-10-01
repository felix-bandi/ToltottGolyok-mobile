import { allapot } from './core/state.js';

export class Golyo {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 500;

    this.r = 10;
    this.szin = "yellow";

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this.Fx = 0;
    this.Fy = 0;
    this.Fz = 0;
  }
}

export let golyok = [], szalhossz = [], specialGolyok = [], kozpont, eger, e_world ;

export function golyo_init() {
  golyok.length = 0;
  szalhossz.length = 0;
  specialGolyok.length = 0;
  for (let i = 0; i < allapot.N; ++i) golyok.push(new Golyo());
  for (let i = 0; i < allapot.N; ++i) {
    let a = Math.random() - 0.5;
    let b = Math.random() - 0.5;
    let c = Math.random() - 0.5;
    let k = 50 / Math.sqrt(a * a + b * b + c * c);
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
  // eger: csak képernyő koordináta (-1..1), NEM része a specialGolyok fizikai mezőnek
  eger = { x: 0, y: 0, aktiv: false }; // nincs z itt, mert képernyő tér

  // e_world: a világban létező megfelelő (fizikához)
  e_world = new Golyo();
  e_world.x = 0;
  e_world.y = 0;
  e_world.z = 0;
  e_world.toltes = allapot.eger;
  e_world.szin = 0x222222;
  specialGolyok.push(e_world);
}