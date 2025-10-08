class EffectKaleidoscope {
  constructor() {
    this.is3D = true;
    this.particles = []; // 万華鏡全体で使うパーティクル配列
    this.particleCount = 20; // 各フレームで生成するパーティクルの初期数
  }

  draw(spectrum) {
    blendMode(ADD);
    lights(); // 光の粒子が立体的に見えるように照明を当てる

    push();
    // 全体の回転
    rotateZ(frameCount * 0.002);
    rotateX(frameCount * 0.001);

    // --- 音声解析 ---
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 40;

    // ★ 低音の強さに応じて、万華鏡の分割数を変化させる (4〜12)
    const segments = floor(map(bassLevel, 0, 150, 2, 8));

    // --- パーティクル生成と更新 ---
    // 全体音量が大きい時に新しいパーティクルを生成
    if (avgVolume > 60) {
      // しきい値は調整可能
      for (let k = 0; k < map(avgVolume, 60, 200, 1, 3); k++) {
        // 音量に応じて生成数を増やす
        this.particles.push(new KaleidoParticle());
      }
    }

    // パーティクルを更新・削除
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(spectrum);
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }

    // --- 万華鏡描画 ---
    for (let i = 0; i < segments; i++) {
      push();
      rotateY((TWO_PI / segments) * i); // 各セグメントの回転

      // 各セグメント内でパーティクルを描画
      for (let particle of this.particles) {
        particle.draw();
      }
      pop();
    }
    pop();

    blendMode(BLEND);
  }
}

// 万華鏡用のパーティクルクラス
class KaleidoParticle {
  constructor() {
    // ★ 画面中央に近い、限定された範囲にパーティクルを初期化
    this.pos = createVector(
      random(-width / 4, width / 4),
      random(-height / 4, height / 4),
      random(-200, 200)
    );
    // ★ 速度をランダムな3D方向に設定
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.lifespan = random(100, 300); // 寿命をランダムに
    this.maxLifespan = this.lifespan;
    this.hue = random(0, 360); // 全ての彩度をカバー
  }

  update(spectrum) {
    // 音量に応じて速度に影響を与える
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    this.vel.mult(map(avgVolume, 0, 150, 0.98, 1.02)); // 音量が大きいと加速、小さいと減速

    this.pos.add(this.vel);
    this.lifespan -= 1;

    // 画面外に出たら反対側から出現させる（トンネル効果）
    if (this.pos.x > width / 2 || this.pos.x < -width / 2) this.vel.x *= -1; // 画面端で跳ね返る
    if (this.pos.y > height / 2 || this.pos.y < -height / 2) this.vel.y *= -1;
    if (this.pos.z > 400 || this.pos.z < -400) this.vel.z *= -1; // Z軸も跳ね返る
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();

    // 寿命に応じて透明度と明るさを変化させる
    const brightness = map(this.lifespan, 0, this.maxLifespan, 0, 100);
    const alpha = map(this.lifespan, 0, this.maxLifespan, 0, 100);
    fill(this.hue, 80, brightness, alpha);

    sphere(map(this.lifespan, 0, this.maxLifespan, 2, 8)); // 消えるときに小さくなる
    pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}
