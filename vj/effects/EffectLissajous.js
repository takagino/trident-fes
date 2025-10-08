class EffectLissajous {
  constructor() {
    this.is3D = true; // 3Dエフェクトであることを示す
  }

  draw(spectrum) {
    // background(0, 0, 0, 0.1 * 255); // 背景はmain.jsで描画
    blendMode(ADD);

    push();
    // translate(width / 2, height / 2); // ★ WEBGLでは不要なので削除

    // --- 音声データを周波数にマッピング ---
    const freqX = map(spectrum[10] || 0, 0, 255, 1, 10); // 低音域
    const freqY = map(spectrum[50] || 0, 0, 255, 1, 10); // 中音域
    const freqZ = map(spectrum[150] || 0, 0, 255, 1, 10); // ★ 高音域をZ軸用に追加

    const phase = frameCount * 0.01;
    const amp = width / 3; // 図形全体の大きさ

    stroke(50, 100, 100);
    strokeWeight(2);
    noFill();

    // ★ 全体をゆっくり回転させて立体的に見せる
    rotateY(frameCount * 0.002);
    rotateX(frameCount * 0.003);

    beginShape();
    for (let t = 0; t < TWO_PI; t += 0.01) {
      const x = sin(t * freqX + phase) * amp;
      const y = sin(t * freqY) * amp;
      const z = sin(t * freqZ) * amp; // ★ Z座標を計算

      vertex(x, y, z); // ★ vertexにz座標を追加
    }
    endShape(); // ★ CLOSEを外して、線の始点と終点を繋がないようにする
    pop();

    blendMode(BLEND);
  }
}
