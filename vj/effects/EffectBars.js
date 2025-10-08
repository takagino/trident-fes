class EffectBars {
  constructor() {
    this.is3D = true;
  }

  draw(spectrum) {
    blendMode(SCREEN); // SCREENまたはADDモード
    noStroke();

    const halfLength = spectrum.length / 2;

    for (let i = 0; i < halfLength; i++) {
      const h = map(spectrum[i], 0, 255, 0, height * 1.5);
      const w = width / 2 / halfLength;

      // 透明度は音量に応じて変化させるとより綺麗です
      const alpha = map(spectrum[i], 0, 200, 0, 80);

      // --- 左側のバー ---
      const x_left = map(i, 0, halfLength, -width / 2, 0) + w / 2;
      push();
      translate(x_left, 0, 0); // バーの位置へ移動
      const hue = map(i, 0, halfLength, 0, 180);
      fill(hue, 100, 100, alpha);

      // ★ box() の代わりに rect() を使う
      // rectModeはデフォルト(CORNER)なので、左上の座標を指定
      rect(-w / 2, -h / 2, w, h);
      pop();

      // --- 右側のバー ---
      const x_right = -x_left;
      push();
      translate(x_right, 0, 0);
      fill(hue, 100, 100, alpha);
      // ★ こちらも rect() に変更
      rect(-w / 2, -h / 2, w, h);
      pop();
    }

    blendMode(BLEND); // モードを元に戻す
  }
}
