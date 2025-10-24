class EffectNoiseRibbons {
  constructor() {
    this.is3D = true;
    this.numLayers = 8;
    this.noiseScale = 0.005;
    this.layerDepth = 50;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    lights();
    blendMode(ADD);
    noStroke();

    let totalVolume = 0;
    for (let v of spectrum) totalVolume += v;
    const avgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) bass += spectrum[i];
    const bassLevel = bass / 40;
    let mid = 0;
    for (let i = 40; i < 100; i++) mid += spectrum[i];
    const midLevel = mid / 60;
    let high = 0;
    for (let i = spectrum.length - 80; i < spectrum.length; i++)
      high += spectrum[i];
    const highLevel = high / 80;

    const yAmplitude = map(midLevel, 0, 100, height * 0.1, height * 0.4);
    const ribbonHeight = map(highLevel, 0, 80, 5, 50);
    const timeSpeed = map(avgVolume, 0, 80, 0.001, 0.01);
    const currentTime = frameCount * timeSpeed;

    push();
    rotateX(0.2);
    rotateY(-0.1);

    for (let i = 0; i < this.numLayers; i++) {
      const z = map(
        i,
        0,
        this.numLayers - 1,
        (-this.numLayers * this.layerDepth) / 2,
        (this.numLayers * this.layerDepth) / 2
      );

      const colorIndex = floor(map(highLevel, 0, 100, 0, palette.length));
      const layerColor = palette[colorIndex % palette.length];

      fill(hue(layerColor), saturation(layerColor), brightness(layerColor), 70); // 70% alpha

      beginShape(TRIANGLE_STRIP);
      for (let x = -width / 2; x <= width / 2; x += 20) {
        const noiseValY = noise(x * this.noiseScale, i * 0.1, currentTime);
        const yMax = yAmplitude * sin(map(x, -width / 2, width / 2, 0, PI));
        const y = map(noiseValY, 0, 1, -yMax, yMax);
        const yTop = y + ribbonHeight / 2;
        const yBottom = y - ribbonHeight / 2;
        vertex(x, yTop, z);
        vertex(x, yBottom, z);
      }
      endShape();
    }
    pop();
    blendMode(BLEND);
  }
}
