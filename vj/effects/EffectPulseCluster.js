class EffectPulseCluster {
  constructor() {
    this.is3D = true;
    this.spheres = [];
    const numSpheres = 500;
    const clusterRadius = height / 3;

    for (let i = 0; i < numSpheres; i++) {
      const pos = p5.Vector.random3D().mult(random(clusterRadius));
      this.spheres.push({ pos: pos });
    }
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    lights();
    blendMode(BLEND);

    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 20;
    let mid = 0;
    for (let i = 40; i < 100; i++) {
      mid += spectrum[i];
    }
    const midLevel = mid / 60;
    let high = 0;
    for (let i = 150; i < spectrum.length; i++) {
      high += spectrum[i];
    }
    const highLevel = high / (spectrum.length - 150);

    const zWobble = map(midLevel, 0, 100, -50, 50);

    for (let sphereData of this.spheres) {
      const finalPos = sphereData.pos.copy().add(0, 0, zWobble);

      push();
      translate(finalPos);

      const colorPos =
        (map(highLevel, 0, 100, 0, palette.length) +
          map(
            sphereData.pos.y,
            -height / 3,
            height / 3,
            0,
            palette.length / 2
          )) %
        palette.length;

      const index1 = floor(colorPos);
      const index2 = (index1 + 1) % palette.length;
      const lerpAmt = colorPos - index1;
      const sphereColor = lerpColor(palette[index1], palette[index2], lerpAmt);
      const flash = map(highLevel, 0, 80, 0, 40);
      const finalBrightness = constrain(60 + flash, 0, 100);

      fill(hue(sphereColor), saturation(sphereColor), finalBrightness);
      noStroke();

      const baseSize = 15;
      const pulse = map(midLevel, 50, 200, 0.5, 3.5);

      sphere(baseSize * pulse);
      pop();
    }
  }
}
