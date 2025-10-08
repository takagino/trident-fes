class EffectCircles {
  constructor() {
    this.is3D = true; // ★ 3Dエフェクトとして定義
    this.circles = [];
  }

  draw(spectrum) {
    // このエフェクトは背景を描画しないため、他のエフェクトと重なります
    blendMode(ADD);

    // --- ビート検出（シンプル版）---
    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 20;

    // ★ 低音レベルがしきい値を超えたらビートと判断
    const BASS_THRESHOLD = 150; // この値を調整して感度を変える (100:敏感 ~ 200:鈍感)

    if (bassLevel > BASS_THRESHOLD) {
      // 生成する円の数をバスの強さに応じて変える
      const numToSpawn = floor(map(bassLevel, BASS_THRESHOLD, 255, 1, 5));
      for (let i = 0; i < numToSpawn; i++) {
        this.circles.push(new PulsingCircle(spectrum.length));
      }
    }

    // --- 円の更新と描画 ---
    for (let i = this.circles.length - 1; i >= 0; i--) {
      const circle = this.circles[i];
      circle.update(spectrum);
      circle.draw();
      if (circle.isDead()) {
        this.circles.splice(i, 1);
      }
    }

    blendMode(BLEND);
  }
}

class PulsingCircle {
  constructor(spectrumSize) {
    // ★ WEBGL座標系でランダムな3D位置を決定
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-400, 400)
    );
    this.lifespan = 120;
    this.freqBin = floor(random(spectrumSize));
    this.hue = random(180, 300); // 青〜紫系の色
  }

  update(spectrum) {
    const level = spectrum[this.freqBin] || 0;
    this.size = map(level, 0, 255, 10, 250);
    this.lifespan--;
  }

  draw() {
    push();
    translate(this.pos);

    const alpha = map(this.lifespan, 0, 120, 0, 100);

    noFill();
    strokeWeight(map(this.lifespan, 0, 120, 8, 1)); // 消える間際に細くなる
    stroke(this.hue, 90, 100, alpha);

    // ★ 3Dのトーラス（ドーナツ形状）を描画
    torus(this.size / 2, 4);
    pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}
