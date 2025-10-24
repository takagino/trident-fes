class EffectBars {
  constructor() {
    this.is3D = true;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    blendMode(SCREEN);
    noStroke();

    const halfLength = spectrum.length / 2;

    for (let i = 0; i < halfLength; i++) {
      const h = map(spectrum[i], 0, 255, 0, height * 1.5);
      const w = width / 2 / halfLength;
      const alpha = map(spectrum[i], 0, 200, 0, 80);
      const colorPos = i / halfLength;

      const colorLerp = colorPos * (palette.length - 1);

      const index1 = floor(colorLerp);
      const index2 = ceil(colorLerp);
      const lerpAmt = colorLerp - index1;
      const barColor = lerpColor(
        palette[index1 % palette.length],
        palette[index2 % palette.length],
        lerpAmt
      );
      const x_left = map(i, 0, halfLength, -width / 2, 0) + w / 2;
      push();
      translate(x_left, 0, 0);
      fill(
        barColor.levels[0],
        barColor.levels[1],
        barColor.levels[2],
        alpha * 2.55
      );
      rect(-w / 2, -h / 2, w, h);
      pop();

      const x_right = -x_left;
      push();
      translate(x_right, 0, 0);
      fill(
        barColor.levels[0],
        barColor.levels[1],
        barColor.levels[2],
        alpha * 2.55
      );
      rect(-w / 2, -h / 2, w, h);
      pop();
    }

    blendMode(BLEND);
  }
}
