class EffectBouncers {
  constructor() {
    this.is3D = true;
    this.bouncers = [];
    // ★ FFTの解像度に合わせてボールを生成
    // main.jsのFFT_SIZEやCUT_LOW_FREQと数を合わせる
    const spectrumLength = 1024 - 24;
    for (let i = 0; i < spectrumLength; i++) {
      // ★ 各ボールに、担当するスペクトルのインデックスを教える
      this.bouncers.push(new Bouncer(i, spectrumLength));
    }
  }
  draw(spectrum) {
    blendMode(ADD);
    lights();

    for (let i = 0; i < spectrum.length; i++) {
      // ★ 各ボールに、対応する音量データを渡して更新・描画
      if (this.bouncers[i]) {
        this.bouncers[i].update(spectrum[i]);
        this.bouncers[i].draw();
      }
    }
    blendMode(BLEND);
  }
}

class Bouncer {
  // ★ 担当するインデックス(i)と全体の数(total)を受け取る
  constructor(i, total) {
    // ★ インデックスに応じて、画面の左から右へ初期配置する
    const x = map(i, 0, total - 1, -width / 2, width / 2);
    const y = -height / 2; // 最初は地面に
    this.pos = createVector(x, y, random(-200, 200));

    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.size = 10;

    // ★ インデックスに応じて色を決定
    this.hue = map(i, 0, total, 0, 360);
    this.gravity = createVector(0, -0.5, 0); // 重力
  }

  applyForce(force) {
    this.acc.add(force);
  }

  // ★ 対応する音量レベル(level)を直接受け取る
  update(level) {
    // ★ 音量レベルに応じて上向きの力を生成
    const upwardForce = map(level, 0, 255, 0, 1.5);
    this.applyForce(createVector(0, upwardForce, 0));

    // 物理演算
    this.applyForce(this.gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 速度が速すぎないように摩擦をかける
    this.vel.mult(0.98);

    // --- 壁での反射判定 ---
    const floor = -height / 2 + this.size / 2;
    if (this.pos.y < floor) {
      this.pos.y = floor;
      this.vel.y *= -0.5;
    }
    const ceiling = height / 2 - this.size / 2;
    if (this.pos.y > ceiling) {
      this.pos.y = ceiling;
      this.vel.y *= -0.5;
    }
    const leftWall = -width / 2 + this.size / 2;
    const rightWall = width / 2 - this.size / 2;
    if (this.pos.x < leftWall || this.pos.x > rightWall) {
      this.vel.x *= -0.5;
    }
    const backWall = -400;
    const frontWall = 400;
    if (this.pos.z < backWall || this.pos.z > frontWall) {
      this.vel.z *= -0.5;
    }
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.hue, 90, 100, 80);
    sphere(this.size);
    pop();
  }
}
