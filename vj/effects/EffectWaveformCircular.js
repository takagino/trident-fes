class EffectWaveformCircular {
  constructor() {
    this.is3D = true;
    this.phase = 0;

    // ★ 各軸の回転角度を保存する変数を追加
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
  }

  draw(spectrum) {
    noFill();
    strokeWeight(6);
    blendMode(ADD);

    push();

    // ★ 全体の一様な回転を削除
    // rotateY(frameCount * 0.005);
    // rotateX(frameCount * 0.002);

    // --- 音声データから各パラメーターを計算 ---
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    const phaseSpeed = map(avgVolume, 0, 50, 0, 0.05);
    this.phase += phaseSpeed;

    let bass = 0;
    for (let i = 0; i < 40; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 40;

    let mid = 0;
    for (let i = 80; i < 160; i++) {
      mid += spectrum[i];
    }
    const midLevel = mid / 80;

    let high = 0;
    for (let i = 160; i < spectrum.length; i++) {
      high += spectrum[i];
    }
    const highLevel = high / (spectrum.length - 160);

    // ★ 音の各成分に応じて、各軸の回転スピードを決定
    const speedX = map(bassLevel, 0, 150, 0, 0.02);
    const speedY = map(midLevel, 0, 100, 0, 0.03);
    const speedZ = map(highLevel, 0, 80, 0, 0.04);

    // ★ 回転角度を更新
    this.rotationX += speedX;
    this.rotationY += speedY;
    this.rotationZ += speedZ;

    // --- 3つのリングを描画 ---
    // 各リングに異なる回転を適用する
    this.drawRing(spectrum.slice(0, 80), color(0, 80, 100), bassLevel, {
      x: this.rotationX,
      y: this.rotationY,
    });
    this.drawRing(spectrum.slice(80, 160), color(120, 80, 100), midLevel, {
      y: this.rotationY,
      z: this.rotationZ,
    });
    this.drawRing(spectrum.slice(160), color(240, 80, 100), highLevel, {
      z: this.rotationZ,
      x: -this.rotationX,
    }); // X軸だけ逆回転

    pop();
    blendMode(BLEND);
  }

  // ★ drawRing関数に回転情報(rotation)を受け取る引数を追加
  drawRing(bandSpectrum, baseColor, overallLevel, rotation) {
    const baseRadius = map(overallLevel, 0, 150, height / 5, height / 2.5);
    const vertices = 120;

    push();

    // ★ 受け取った回転情報を適用
    if (rotation.x) rotateX(rotation.x);
    if (rotation.y) rotateY(rotation.y);
    if (rotation.z) rotateZ(rotation.z);

    translate(0, 0, map(overallLevel, 0, 150, -100, 100));

    beginShape();
    for (let i = 0; i < vertices; i++) {
      const angle = map(i, 0, vertices, 0, TWO_PI) + this.phase;
      const spectrumIndex = floor(map(i, 0, vertices, 0, bandSpectrum.length));
      const level = bandSpectrum[spectrumIndex] || 0;
      const radius = baseRadius + map(level, 0, 255, -150, 150);
      const x = radius * cos(angle);
      const y = radius * sin(angle);
      let currentHue =
        (baseColor.levels[0] + map(i, 0, vertices, -30, 30)) % 360;
      if (currentHue < 0) currentHue += 360;
      stroke(currentHue, baseColor.levels[1], baseColor.levels[2], 80);
      curveVertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}
