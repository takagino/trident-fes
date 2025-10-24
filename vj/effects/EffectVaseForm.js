class EffectVaseForm {
  constructor() {
    this.is3D = true;
    this.mySize = min(width, height) * 0.9;
    this.branch = 30;
    this.angle_c = 0;
    this.t = 0;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    lights();
    blendMode(ADD);

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

    const rotationSpeed = map(avgVolume, 0, 80, 0.001, 0.01);
    const globalScale = map(midLevel, 0, 100, 0.8, 1.3);
    const pointSize = map(bassLevel, 0, 150, 1, 8);
    const circleFormRadiusMult = map(bassLevel, 0, 150, 0.5, 1.5);

    push();
    scale(globalScale);
    translate(0, 0, -this.mySize * 1.5);
    rotateX(PI / 2 + this.t * 5);
    rotateY(frameCount * rotationSpeed);

    this._circleForm(
      this.mySize * 0.8,
      pointSize,
      highLevel,
      circleFormRadiusMult,
      palette
    );
    this._circleForm(
      this.mySize * 0.8 * 0.66,
      pointSize,
      highLevel,
      circleFormRadiusMult,
      palette
    );
    this._circleForm(
      this.mySize * 0.8 * 0.33,
      pointSize,
      highLevel,
      circleFormRadiusMult,
      palette
    );

    let layers = 16;
    let rings = 32;
    noStroke();

    for (let yIdx = 0; yIdx < layers; yIdx++) {
      let yNorm = map(yIdx, 0, layers - 1, -1, 1);
      let radius = this._vaseProfile(yNorm, midLevel);
      let y = yNorm * this.mySize * 1.2;

      for (let r = 0; r < rings; r++) {
        let angle = map(r, 0, rings, 0, TWO_PI);
        let x = radius * cos(angle);
        let z = radius * sin(angle);

        push();
        translate(x, y, z);

        const colorIndex =
          floor(
            map(r, 0, rings, 0, palette.length) +
              map(highLevel, 0, 100, 0, palette.length / 2)
          ) % palette.length;
        const pointColor = palette[colorIndex];

        fill(
          hue(pointColor),
          saturation(pointColor),
          brightness(pointColor),
          80
        );

        sphere(pointSize);
        pop();
      }
    }
    pop();

    this.t += 0.1 / random(10, 1) / random(3, 7) / 100;
    blendMode(BLEND);
  }

  _circleForm(d, pointSize, highLevel, radiusMultiplier, palette) {
    const ang = TWO_PI / this.branch;
    const radius = d * radiusMultiplier;
    noStroke();

    for (let i = 0; i < this.branch; i++) {
      const angle1 = ang * i;
      let x1 = radius * cos(angle1);
      let y1 = radius * sin(angle1);
      let z1 = 0;

      push();
      translate(x1, y1, z1);

      const colorIndex =
        floor(
          map(i, 0, this.branch, 0, palette.length) +
            map(highLevel, 0, 100, 0, palette.length / 2)
        ) % palette.length;
      const pointColor = palette[colorIndex];

      fill(hue(pointColor), saturation(pointColor), brightness(pointColor), 70);

      sphere(pointSize * 1.5);
      pop();
    }
  }

  _vaseProfile(yNorm, midLevel) {
    const bulge = map(midLevel, 0, 100, 0.7, 1.2);
    return (
      this.mySize * 0.7 * sin((PI * (yNorm + 1)) / 2) * bulge +
      this.mySize * 0.1 * cos(3 * PI * yNorm) +
      this.mySize * 0.1
    );
  }
}
