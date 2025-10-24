class EffectLissajous {
  constructor() {
    this.is3D = true;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(50, 100, 100)];
    }

    blendMode(ADD);

    push();

    const freqX = map(spectrum[10] || 0, 0, 255, 1, 10);
    const freqY = map(spectrum[50] || 0, 0, 255, 1, 10);
    const freqZ = map(spectrum[150] || 0, 0, 255, 1, 10);
    let high = 0;
    for (let i = spectrum.length - 80; i < spectrum.length; i++)
      high += spectrum[i];
    const highLevel = high / 80;

    const phase = frameCount * 0.01;
    const amp = width / 3;
    const colorIndex = floor(map(highLevel, 0, 100, 0, palette.length));
    const curveColor = palette[colorIndex % palette.length];

    stroke(curveColor);
    strokeWeight(3);
    noFill();

    rotateY(frameCount * 0.002);
    rotateX(frameCount * 0.003);

    beginShape();
    for (let t = 0; t < TWO_PI; t += 0.01) {
      const x = sin(t * freqX + phase) * amp;
      const y = sin(t * freqY) * amp;
      const z = sin(t * freqZ) * amp;
      vertex(x, y, z);
    }
    endShape();
    pop();

    blendMode(BLEND);
  }
}
