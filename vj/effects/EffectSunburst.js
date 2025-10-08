class EffectSunburst {
  draw(spectrum) {
    background(0, 0, 0, 0.1 * 255); // やや残像を残す
    push();
    translate(width / 2, height / 2);

    // 低音域の強さを取得
    let bass = 0;
    for (let i = 0; i < 40; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 40;

    const lines = 120; // 描画する線の数
    for (let i = 0; i < lines; i++) {
      const angle = map(i, 0, lines, 0, TWO_PI);

      // 低音の強さで線の長さを決める
      const len = map(bassLevel, 0, 150, 0, width * 0.8);

      // 中音域を線の太さに反映
      const midLevel = spectrum[floor(spectrum.length / 2)] || 0;
      const weight = map(midLevel, 0, 255, 1, 10);

      // 高音域を色に反映
      const highLevel = spectrum[spectrum.length - 1] || 0;
      const hue = map(highLevel, 0, 255, 200, 360);

      const x = len * cos(angle);
      const y = len * sin(angle);

      stroke(hue, 100, 100);
      strokeWeight(weight);
      line(0, 0, x, y);
    }
    pop();
  }
}
