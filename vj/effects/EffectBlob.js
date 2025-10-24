class EffectBlob {
  constructor() {
    this.is3D = true;
    this.nodes = [];
    for (let i = 0; i < 30; i++) {
      this.nodes.push({
        angle: map(i, 0, 30, 0, TWO_PI),
        noiseOffset: random(1000),
      });
    }
    this.smoothedMidLevel = 0;
    this.smoothedBassLevel = 0;
    this.smoothedAvgVolume = 0;
    this.lerpAmount = 0.1;
  }

  draw(spectrum, palette) {
    blendMode(ADD);
    push();

    let bass = 0;
    for (let i = 0; i < 40; i++) {
      bass += spectrum[i];
    }
    const currentBassLevel = bass / 40;
    let mid = 0;
    for (let i = 40; i < 100; i++) {
      mid += spectrum[i];
    }
    const currentMidLevel = mid / 60;
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const currentAvgVolume = totalVolume / spectrum.length;

    this.smoothedBassLevel = lerp(
      this.smoothedBassLevel,
      currentBassLevel,
      this.lerpAmount
    );
    this.smoothedMidLevel = lerp(
      this.smoothedMidLevel,
      currentMidLevel,
      this.lerpAmount
    );
    this.smoothedAvgVolume = lerp(
      this.smoothedAvgVolume,
      currentAvgVolume,
      this.lerpAmount
    );

    const zPos = map(this.smoothedAvgVolume, 0, 80, -100, 100);
    translate(0, 0, zPos);
    const baseRadius = map(
      this.smoothedBassLevel,
      0,
      150,
      height / 8,
      height / 3
    );

    const colorIndex = floor(
      map(this.smoothedMidLevel, 0, 100, 0, palette.length)
    );
    const blobColor = palette[colorIndex % palette.length];

    fill(hue(blobColor), saturation(blobColor), brightness(blobColor), 30);
    stroke(hue(blobColor), saturation(blobColor), brightness(blobColor), 80);
    strokeWeight(2);

    beginShape();
    const firstNode = this.nodes[0];
    const radiusWobble = map(this.smoothedMidLevel, 0, 100, 30, 80);
    let firstRadius =
      baseRadius +
      map(
        noise(firstNode.noiseOffset + frameCount * 0.005),
        0,
        1,
        -radiusWobble,
        radiusWobble
      );
    curveVertex(
      firstRadius * cos(firstNode.angle),
      firstRadius * sin(firstNode.angle)
    );

    for (let node of this.nodes) {
      const radius =
        baseRadius +
        map(
          noise(node.noiseOffset + frameCount * 0.005),
          0,
          1,
          -radiusWobble,
          radiusWobble
        );
      const x = radius * cos(node.angle);
      const y = radius * sin(node.angle);
      curveVertex(x, y);
    }

    curveVertex(
      firstRadius * cos(firstNode.angle),
      firstRadius * sin(firstNode.angle)
    );
    let secondActualRadius =
      baseRadius +
      map(
        noise(this.nodes[0].noiseOffset + frameCount * 0.005),
        0,
        1,
        -radiusWobble,
        radiusWobble
      );
    curveVertex(
      secondActualRadius * cos(this.nodes[0].angle),
      secondActualRadius * sin(this.nodes[0].angle)
    );

    endShape(CLOSE);

    pop();
    blendMode(BLEND);
  }
}
