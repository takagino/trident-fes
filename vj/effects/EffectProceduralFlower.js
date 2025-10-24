class EffectProceduralFlower {
  constructor() {
    this.is3D = true;
    this.flowers = [];
    this.numFlowers = 70;
    for (let i = 0; i < this.numFlowers; i++) {
      this.flowers.push({
        pos: createVector(
          random(-width * 0.6, width * 0.6),
          height / 2,
          random(-300, 300)
        ),
        baseSize: random(0.2, 0.6),
        baseHue: random(360),
        petalSharpness: random(0.4, 1.5),
        petalCount: floor(random(4, 9)),
      });
    }
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    lights();
    blendMode(BLEND);
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
    for (let flower of this.flowers) {
      this._drawSingleFlower(
        flower,
        avgVolume,
        bassLevel,
        midLevel,
        highLevel,
        palette
      );
    }
  }

  _drawSingleFlower(
    flowerData,
    avgVolume,
    bassLevel,
    midLevel,
    highLevel,
    palette
  ) {
    const { pos, baseSize, baseHue, petalSharpness, petalCount } = flowerData;
    const pNum = petalCount;
    const currentSize = baseSize * map(avgVolume, 0, 80, 0.8, 1.2);
    const fD = map(midLevel, 0, 100, 30, 60) * currentSize;
    const pLen = map(avgVolume, 0, 80, 10, 50) * currentSize;
    const pSharp = petalSharpness;
    const fHeight = 100 * currentSize;
    const curve1 = 1.0;
    const curve2 = 0.2;
    const b = 0;
    const bNum = 0;
    const stemHeight = 150 * baseSize;
    const shading = 1.5;

    push();
    translate(pos.x, height / 3, pos.z);

    push();
    translate(0, -stemHeight / 2, 0);
    ambientMaterial((baseHue + 120) % 360, 60, 40);
    cylinder(max(2, fD * 0.05 * baseSize), stemHeight);
    pop();

    push();
    translate(0, -stemHeight, 0);

    let v = [];
    const rows = 20;
    const cols = 30;

    for (let theta = 0; theta < rows; theta += 1) {
      v.push([]);
      const thetaNorm = theta / (rows - 1);
      for (let phi = 0; phi < cols; phi += 1) {
        const phiNorm = phi / (cols - 1);
        const ang = TAU * phiNorm;

        const r =
          (pLen * pow(abs(sin((pNum / 2) * ang)), pSharp) + fD) * thetaNorm;
        const x = r * cos(ang);
        const z = r * sin(ang);

        const y =
          this._vShape(fHeight, r / 100, curve1, curve2) +
          this._bumpiness(b, r / 100, bNum, ang);

        v[theta].push(createVector(x, -y, z));
      }
    }

    for (let theta = 0; theta < v.length - 1; theta++) {
      const alpha = map(bassLevel, 0, 150, 30, 80);
      const colorIndex = floor(map(highLevel, 0, 100, 0, palette.length));
      const layerColor = palette[colorIndex % palette.length];
      const petalSaturation = saturation(layerColor) - theta * shading;
      fill(
        hue(layerColor),
        constrain(petalSaturation, 40, 100),
        brightness(layerColor),
        alpha
      );

      beginShape(TRIANGLE_STRIP);
      for (let phi = 0; phi < v[theta].length; phi++) {
        vertex(v[theta][phi].x, v[theta][phi].y, v[theta][phi].z);
        vertex(v[theta + 1][phi].x, v[theta + 1][phi].y, v[theta + 1][phi].z);
      }
      vertex(v[theta][0].x, v[theta][0].y, v[theta][0].z);
      vertex(v[theta + 1][0].x, v[theta + 1][0].y, v[theta + 1][0].z);
      endShape();
    }
    pop();

    pop();
  }

  _vShape(A, r, a, b) {
    return A * pow(Math.E, -b * pow(abs(r), 1.5)) * pow(abs(r), a);
  }
  _bumpiness(A, r, f, angle) {
    return A * pow(r, 2) * sin(f * angle);
  }
}
