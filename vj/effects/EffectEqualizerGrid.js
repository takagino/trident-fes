class EffectEqualizerGrid {
  constructor() {
    this.is3D = true;
    this.cols = 32;
    this.rows = 18;
  }

  draw(spectrum) {
    noStroke();

    const cellWidth = width / this.cols;
    const cellHeight = height / this.rows;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        // ★★★ ここからが修正箇所 ★★★
        // グリッドの中央からの距離を計算 (0.0 ~ 1.0)
        const distFromCenter = abs(x - this.cols / 2) / (this.cols / 2);
        // その距離に応じて、スペクトルデータを取り出す
        // 中央(距離0)が低音域(インデックス0)、外側(距離1)が高音域になる
        const spectrumIndex = floor(
          map(distFromCenter, 0, 1, 0, spectrum.length)
        );
        // ★★★ 修正ここまで ★★★

        const level = spectrum[spectrumIndex] || 0;

        const px = map(x, 0, this.cols, -width / 2, width / 2) + cellWidth / 2;
        const py =
          map(y, 0, this.rows, -height / 2, height / 2) + cellHeight / 2;

        push();
        translate(px, py, 0);

        const size = map(level, 0, 255, 0, cellWidth * 1.5);
        const hue = map(y, 0, this.rows, 0, 360);
        const brightness = map(level, 0, 255, 20, 100);

        fill(hue, 90, brightness);
        box(size, size, size);

        pop();
      }
    }
  }
}
