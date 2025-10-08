class EffectSunburst {
  constructor() {
    this.is3D = true; // 3Dエフェクトであることを示す
  }

  draw(spectrum) {
    // background(0, 0, 0, 0.1 * 255); // 背景はmain.jsで描画
    blendMode(ADD);

    push();
    // 全体をゆっくり回転させる
    rotateX(frameCount * 0.002);
    rotateY(frameCount * 0.003);

    // 描画する線の数を定義
    const numLines = 128;

    for (let i = 0; i < numLines; i++) {
      // ★ 各線に対応するスペクトルデータを取り出す
      const spectrumIndex = floor(map(i, 0, numLines, 0, spectrum.length));
      const level = spectrum[spectrumIndex] || 0;

      // 線の角度（経度・緯度のように2つの角度を使う）
      const theta = map(i, 0, numLines, 0, TWO_PI); // XY平面上の角度
      const phi = map(i, 0, numLines, 0, PI); // YZ平面上の角度

      // ★ 音量で線の長さを決める
      const len = map(level, 0, 255, 50, height);

      // ★ 球面座標を使って、3D空間での線の終点を計算
      const x = len * sin(phi) * cos(theta);
      const y = len * sin(phi) * sin(theta);
      const z = len * cos(phi);

      // ★ 音量で線の太さと色を決める
      const weight = map(level, 0, 255, 1, 8);
      const hue = map(i, 0, numLines, 0, 360);

      stroke(hue, 100, 100);
      strokeWeight(weight);

      // 原点(0,0,0)から計算した終点(x,y,z)まで線を描画
      line(0, 0, 0, x, y, z);
    }
    pop();

    blendMode(BLEND);
  }
}
