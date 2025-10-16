class EffectPulseCluster {
  constructor() {
    this.is3D = true;
    this.spheres = [];
    const numSpheres = 500;
    const clusterRadius = height / 3;

    for (let i = 0; i < numSpheres; i++) {
      const pos = p5.Vector.random3D().mult(random(clusterRadius));
      const hue = random(360);
      this.spheres.push({ pos: pos, hue: hue });
    }
  }

  draw(spectrum) {
    lights();

    blendMode(BLEND);

    // --- 音声解析 ---
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

      const flash = map(highLevel, 0, 80, 0, 40);

      // ★ 2. 基本の明るさを80から60に下げる
      const finalBrightness = constrain(60 + flash, 0, 100);

      fill(sphereData.hue, 90, finalBrightness);
      noStroke();

      const baseSize = 15;
      const pulse = map(bassLevel, 0, 200, 0.5, 2.5);

      sphere(baseSize * pulse);
      pop();
    }

    //blendMode(BLEND);
  }
}
