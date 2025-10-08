class EffectEqualizerGrid {
  constructor() {
    this.cols = 32;
    this.rows = 18;
  }

  draw(spectrum) {
    const cellWidth = width / this.cols;
    const cellHeight = height / this.rows;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        // グリッドの位置から、対応するスペクトルデータを取り出す
        const spectrumIndex = floor(map(x, 0, this.cols, 0, spectrum.length));
        const level = spectrum[spectrumIndex] || 0;

        const size = map(level, 0, 255, 0, cellWidth * 2);
        const hue = map(y, 0, this.rows, 0, 360); // 行の位置で色相を変化
        const brightness = map(level, 0, 255, 20, 100);

        fill(hue, 90, brightness);
        noStroke();
        rectMode(CENTER);
        rect(
          x * cellWidth + cellWidth / 2,
          y * cellHeight + cellHeight / 2,
          size,
          size
        );
      }
    }
    rectMode(CORNER); // モードを元に戻す
  }
}
