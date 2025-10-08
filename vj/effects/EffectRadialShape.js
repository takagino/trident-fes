class EffectRadialShape {
  constructor() {
    // このエフェクトで使う固有の変数を初期化
    this.num = 20; // 図形を繰り返す回数
  }

  // privateメソッドとしてcustomShapeをクラス内に移動
  customShape(bassLevel, avgVolume) {
    // 音量に応じて線の太さを変える
    //strokeWeight(map(avgVolume, 0, 100, 1, 15));

    beginShape();
    for (let i = 0; i < 360; i += 30) {
      // 低音に応じて図形の基本半径を脈動させる
      let radius = map(bassLevel, 0, 200, height / 6, height / 4);
      // さらにランダムな揺らぎを加える
      radius += random(-20, 20);

      let x = cos(i) * radius;
      let y = sin(i) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  draw(spectrum) {
    // --- 音声データを使いやすいように整理 ---
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
    // このエフェクト内だけ度数法(DEGREES)を使う
    angleMode(DEGREES);
    translate(width / 2, height / 2);
    noFill();

    // 中音域の強さで回転速度を変える
    const rotationSpeed = map(midLevel, 0, 100, 0.1, 1.0);
    rotate(frameCount * rotationSpeed);

    for (let i = 0; i < this.num; i++) {
      // 描画スケールを音量で変化させる
      let scaleFactor = map(avgVolume, 0, 80, 0.5, 2.5);

      push();
      // 周波数の位置で色を変化
      const hue = map(i, 0, this.num, 0, 360);
      stroke(hue, 90, 100);

      rotate(i * (360 / this.num));
      scale(scaleFactor);
      this.customShape(bassLevel, avgVolume); // 描画メソッドに音量データを渡す
      pop();
    }
    pop();

    // angleModeをデフォルトのRADIANSに戻す（他のエフェクトのため）
    angleMode(RADIANS);
  }
}
