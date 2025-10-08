class EffectRadialShape {
  constructor() {
    this.is3D = true; // ★ 3Dエフェクトであることを示す
    this.num = 20;
  }

  // 形状を描画するヘルパー関数
  _customShape(bassLevel, avgVolume) {
    strokeWeight(map(avgVolume, 0, 100, 1, 10));
    beginShape();
    for (let i = 0; i < 360; i += 30) {
      let radius = map(bassLevel, 0, 200, height / 6, height / 4);
      radius += random(-20, 20);
      let x = cos(i) * radius;
      let y = sin(i) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  draw(spectrum) {
    // --- 音声解析 ---
    let bass = 0;
    for (let i = 0; i < 40; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 40;
    let mid = 0;
    for (let i = 40; i < 100; i++) {
      mid += spectrum[i];
    }
    const midLevel = mid / 60;
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;

    push();

    // ★ WEBGLでは原点が中央なのでtranslateは不要
    // translate(width / 2, height / 2);

    // ★ このエフェクト内だけ度数法(DEGREES)を使う
    angleMode(DEGREES);
    noFill();
    blendMode(ADD);

    const rotationSpeed = map(midLevel, 0, 100, 0.1, 1.0);

    // ★ 2D回転(rotate)を3DのZ軸回転(rotateZ)に置き換え
    rotateZ(frameCount * rotationSpeed);

    for (let i = 0; i < this.num; i++) {
      let scaleFactor = map(avgVolume, 0, 80, 0.5, 2.5);
      push();
      const hue = map(i, 0, this.num, 0, 360);
      stroke(hue, 90, 100);

      rotateZ(i * (360 / this.num));
      scale(scaleFactor);
      this._customShape(bassLevel, avgVolume);
      pop();
    }
    pop();

    // ★ angleModeはpush/popで自動的に元に戻るので、最後の呼び出しは不要
    // angleMode(RADIANS);
    blendMode(BLEND);
  }
}
