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