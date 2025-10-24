class EffectGeometricNoise {
  constructor() {
    this.is3D = true;
    this.mySize = min(width, height) * 0.9;
    this.t = 0;
    this.rez = 0.01;
    this.seed = random(10000);
    this.rotationAxis = floor(random(3));
    this.rotationDir = random([-1, 1]);
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    blendMode(BLEND);
    strokeWeight(1);

    let totalVolume = 0;
    for (let v of spectrum) totalVolume += v;
    const avgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) bass += spectrum[i];
    const bassLevel = bass / 40;

    const timeSpeed = map(avgVolume, 0, 80, 0.0001, 0.001);
    this.t += timeSpeed;
    const noiseMultiplier = 2.0;
    const rotationSpeedFactor = 0.003;
    const globalScale = map(avgVolume, 0, 80, 0.8, 1.5);

    push();
    translate(0, 0, -this.mySize * 0.1);
    if (this.rotationAxis === 0)
      rotateX(this.rotationDir * frameCount * rotationSpeedFactor);
    else if (this.rotationAxis === 1)
      rotateY(this.rotationDir * frameCount * rotationSpeedFactor);
    else rotateZ(this.rotationDir * frameCount * rotationSpeedFactor);
    scale(globalScale);

    const cubeSize = this.mySize / 2.5;
    const plus = cubeSize / 5;
    const range = cubeSize / 3;

    randomSeed(this.seed + floor(frameCount / 3000));

    for (let i = -range; i < range; i += plus) {
      for (let j = -range; j < range; j += plus) {
        for (let k = -range; k < range; k += plus) {
          const n =
            noise(
              i * this.rez + this.t,
              j * this.rez + this.t,
              k * this.rez + this.t
            ) * noiseMultiplier;
          push();
          translate(i * n, j * n, k * n);
          rotateX(n * 2 + frameCount * rotationSpeedFactor * 0.1);
          rotateY(n * 1.5 + frameCount * rotationSpeedFactor * 0.08);
          rotateZ(n * 1 + frameCount * rotationSpeedFactor * 0.06);

          const basePlaneSize = this.mySize / random([16, 32]);
          const planeSize = basePlaneSize * map(bassLevel, 0, 150, 0.5, 2.0);
          const chosenColor = random(palette);

          if (random() < 0.5) {
            noStroke();
            fill(chosenColor);
            plane(planeSize);
          } else {
            noFill();
            stroke(chosenColor);
            box(planeSize);
          }
          pop();
        }
      }
    }
    pop();
  }
}
