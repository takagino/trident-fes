class EffectRotatingCircles {
  constructor() {
    this.is3D = true;
    this.num = 6;
    this.rotX = [];
    this.rotY = [];
    this.rotZ = [];
    for (let i = 0; i < this.num; i++) {
      this.rotX.push(float(random(-2, 2)));
      this.rotY.push(float(random(-2, 2)));
      this.rotZ.push(float(random(-2, 2)));
    }
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    let bass = 0;
    for (let i = 0; i < 40; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 40;
    let mid = 0;
    for (let i = 40; i < 100; i++) {
      mid += spectrum[i];
    }
    const midLevel = mid / 60;
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;

    blendMode(ADD);
    noFill();

    const speedMultiplier = map(avgVolume, 0, 80, 0.5, 3.0);
    const sizePulse = map(midLevel, 0, 100, 0, width / 4);

    for (let i = 0; i < this.num; i++) {
      push();

      rotateX(((frameCount * this.rotX[i]) / 100) * speedMultiplier);
      rotateY(((frameCount * this.rotY[i]) / 100) * speedMultiplier);
      rotateZ(((frameCount * this.rotZ[i]) / 100) * speedMultiplier);

      strokeWeight(map(bassLevel, 0, 180, 1, 6));

      const circleColor = palette[i % palette.length];

      stroke(
        hue(circleColor),
        saturation(circleColor),
        brightness(circleColor),
        80
      );

      circle(0, 0, (width * i) / this.num + sizePulse);

      pop();
    }
    blendMode(BLEND);
  }
}
