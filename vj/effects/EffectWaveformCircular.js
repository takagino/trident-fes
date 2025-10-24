class EffectWaveformCircular {
  constructor() {
    this.is3D = true;
    this.phase = 0;
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    noFill();
    strokeWeight(6);
    blendMode(ADD);

    push();

    let totalVolume = 0;
    for (let val of spectrum) totalVolume += val;
    const avgVolume = totalVolume / spectrum.length;
    const phaseSpeed = map(avgVolume, 0, 50, 0, 0.05);
    this.phase += phaseSpeed;
    let bass = 0;
    for (let i = 0; i < 40; i++) bass += spectrum[i];
    const bassLevel = bass / 40;
    let mid = 0;
    for (let i = 80; i < 160; i++) mid += spectrum[i];
    const midLevel = mid / 80;
    let high = 0;
    for (let i = 160; i < spectrum.length; i++) high += spectrum[i];
    const highLevel = high / (spectrum.length - 160);
    const speedX = map(bassLevel, 0, 150, 0, 0.02);
    const speedY = map(midLevel, 0, 100, 0, 0.03);
    const speedZ = map(highLevel, 0, 80, 0, 0.04);
    this.rotationX += speedX;
    this.rotationY += speedY;
    this.rotationZ += speedZ;

    this.drawRing(
      spectrum.slice(0, 80),
      bassLevel,
      { x: this.rotationX, y: this.rotationY },
      palette
    );
    this.drawRing(
      spectrum.slice(80, 160),
      midLevel,
      { y: this.rotationY, z: this.rotationZ },
      palette
    );
    this.drawRing(
      spectrum.slice(160),
      highLevel,
      { z: this.rotationZ, x: -this.rotationX },
      palette
    );

    pop();
    blendMode(BLEND);
  }

  drawRing(bandSpectrum, overallLevel, rotation, palette) {
    const baseRadius = map(overallLevel, 0, 150, height / 5, height / 2.5);
    const vertices = 120;

    push();
    if (rotation.x) rotateX(rotation.x);
    if (rotation.y) rotateY(rotation.y);
    if (rotation.z) rotateZ(rotation.z);
    translate(0, 0, map(overallLevel, 0, 150, -100, 100));

    beginShape();
    for (let i = 0; i < vertices; i++) {
      const angle = map(i, 0, vertices, 0, TWO_PI) + this.phase;
      const spectrumIndex = floor(map(i, 0, vertices, 0, bandSpectrum.length));
      const level = bandSpectrum[spectrumIndex] || 0;
      const radius = baseRadius + map(level, 0, 255, -150, 150);
      const x = radius * cos(angle);
      const y = radius * sin(angle);
      const colorPos = i / vertices;
      const colorLerp = colorPos * (palette.length - 1);
      const index1 = floor(colorLerp);
      const index2 = ceil(colorLerp);
      const lerpAmt = colorLerp - index1;
      const ringColor = lerpColor(
        palette[index1 % palette.length],
        palette[index2 % palette.length],
        lerpAmt
      );
      stroke(hue(ringColor), saturation(ringColor), brightness(ringColor), 80);

      curveVertex(x, y);
    }
    let firstIndex = 0;
    let firstAngle = map(firstIndex, 0, vertices, 0, TWO_PI) + this.phase;
    let firstSpectrumIndex = floor(
      map(firstIndex, 0, vertices, 0, bandSpectrum.length)
    );
    let firstLevel = bandSpectrum[firstSpectrumIndex] || 0;
    let firstRadius = baseRadius + map(firstLevel, 0, 255, -150, 150);
    let firstX = firstRadius * cos(firstAngle);
    let firstY = firstRadius * sin(firstAngle);
    curveVertex(firstX, firstY);
    let secondIndex = 1;
    let secondAngle = map(secondIndex, 0, vertices, 0, TWO_PI) + this.phase;
    let secondSpectrumIndex = floor(
      map(secondIndex, 0, vertices, 0, bandSpectrum.length)
    );
    let secondLevel = bandSpectrum[secondSpectrumIndex] || 0;
    let secondRadius = baseRadius + map(secondLevel, 0, 255, -150, 150);
    let secondX = secondRadius * cos(secondAngle);
    let secondY = secondRadius * sin(secondAngle);
    curveVertex(secondX, secondY);

    endShape();
    pop();
  }
}
