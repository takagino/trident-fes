class EffectBouncers {
  constructor() {
    this.is3D = true;
    this.bouncers = [];
    for (let i = 0; i < 50; i++) {
      this.bouncers.push(new Bouncer());
    }
  }
  draw(spectrum) {
    // このエフェクトは背景を描画しない
    for (let bouncer of this.bouncers) {
      bouncer.update(spectrum);
      bouncer.draw();
    }
  }
}

class Bouncer {
  constructor() {
    // WEBGL座標系で初期化
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2)
    );
    this.speed = random(1, 5);
    this.hue = random(0, 60);
  }
  update(spectrum) {
    // 全体の音量でスピードを変えながら、ただ上に移動するだけ
    const avgVolume =
      spectrum.reduce((sum, val) => sum + val, 0) / spectrum.length;
    this.pos.y += this.speed * map(avgVolume, 0, 80, 0.5, 3);

    // 上端まで行ったら下から再登場
    if (this.pos.y > height / 2) {
      this.pos.y = -height / 2;
    }
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y, 0);
    noStroke();
    fill(this.hue, 100, 100);
    sphere(10);
    pop();
  }
}
