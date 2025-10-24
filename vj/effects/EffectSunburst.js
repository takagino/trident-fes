class EffectSunburst {
  constructor() {
    this.is3D = true;
    this.previousBass = 0;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    blendMode(ADD);
    lights();

    let totalVolume = 0;
    for (let v of spectrum) totalVolume += v;
    const avgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) bass += spectrum[i];
    const bassLevel = bass / 40;
    const bassDifference = bassLevel - this.previousBass;
    const beatThreshold = 30;
    let isBeat = bassDifference > beatThreshold;
    this.previousBass = bassLevel;

    push();
    rotateX(frameCount * 0.002);
    rotateY(frameCount * 0.003);

    const numLines = 128;

    for (let i = 0; i < numLines; i++) {
      const spectrumIndex = floor(map(i, 0, numLines, 0, spectrum.length));
      const level = spectrum[spectrumIndex] || 0;

      const theta = map(i, 0, numLines, 0, TWO_PI);
      const phi = map(i, 0, numLines, 0, PI);
      const baseLen = map(avgVolume, 0, 80, 20, 100);
      let currentLen = map(level, 0, 255, baseLen, height * 0.8);
      if (isBeat) {
        currentLen *= map(bassDifference, beatThreshold, 100, 1.1, 2.0);
      }

      const x = currentLen * sin(phi) * cos(theta);
      const y = currentLen * sin(phi) * sin(theta);
      const z = currentLen * cos(phi);
      const weight = map(level, 0, 255, 1, 12);
      const colorPos = i / numLines;
      const colorLerp = colorPos * (palette.length - 1);
      const index1 = floor(colorLerp);
      const index2 = ceil(colorLerp);
      const lerpAmt = colorLerp - index1;
      const lineColor = lerpColor(
        palette[index1 % palette.length],
        palette[index2 % palette.length],
        lerpAmt
      );

      const brightness = map(level, 0, 200, 60, 100);
      const alpha = map(level, 0, 255, 10, 100);

      stroke(hue(lineColor), saturation(lineColor), brightness, alpha);
      strokeWeight(weight);
      line(0, 0, 0, x, y, z);
    }
    pop();
    blendMode(BLEND);
  }
}
