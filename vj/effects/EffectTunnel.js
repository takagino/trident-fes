class EffectTunnel {
  constructor() {
    this.is3D = true;
    this.stars = [];
  }

  // ★ setup時に呼び出される初期化関数を追加
  init() {
    this.stars = [];
    for (let i = 0; i < 800; i++) {
      this.stars[i] = {
        x: random(-width, width),
        y: random(-height, height),
        z: random(1, width), // ★ Z座標の初期範囲を1からに修正
      };
    }
  }

  draw(spectrum) {
    // ★ 最初のフレームで初期化関数を呼び出す
    if (this.stars.length === 0) {
      this.init();
    }

    rotateY(frameCount * 0.001);

    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const speed = map(totalVolume / spectrum.length, 0, 100, 2, 25);

    for (let star of this.stars) {
      star.z -= speed;

      if (star.z < 1) {
        star.z = width;
        star.x = random(-width, width);
        star.y = random(-height, height);
      }

      push();
      translate(star.x, star.y, star.z);
      const r = map(star.z, 0, width, 12, 0);
      const hue = map(star.z, 0, width, 180, 300);
      fill(hue, 100, 100);
      noStroke();
      sphere(r / 2);
      pop();
    }
  }
}
