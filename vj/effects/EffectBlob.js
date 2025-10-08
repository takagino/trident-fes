class EffectBlob {
  constructor() {
    this.nodes = [];
    for (let i = 0; i < 10; i++) {
      this.nodes.push({
        angle: map(i, 0, 10, 0, TWO_PI),
        noiseOffset: random(1000),
      });
    }
  }
  draw(spectrum) {
    push();
    translate(width / 2, height / 2);

    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    const baseRadius = map(avgVolume, 0, 100, 100, 300);

    fill(300, 80, 100, 50);
    stroke(300, 80, 100);
    strokeWeight(4);

    beginShape();
    for (let node of this.nodes) {
      const radius = baseRadius + map(noise(node.noiseOffset), 0, 1, -50, 50);
      const x = radius * cos(node.angle);
      const y = radius * sin(node.angle);
      curveVertex(x, y);
      node.noiseOffset += 0.005;
    }
    endShape(CLOSE);
    pop();
  }
}
