class EffectFlowField {
  constructor() {
    this.is3D = true;
    this.particles = [];
    this.variation = 0;
    this.changeDuration = 5000;
    this.lastChange = 0;
    this.flowScale = 10;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    blendMode(ADD);
    lights();

    push();
    scale(2);

    let totalVolume = 0;
    for (let v of spectrum) totalVolume += v;
    const avgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) bass += spectrum[i];
    const bassLevel = bass / 40;
    let high = 0;
    for (let i = spectrum.length - 80; i < spectrum.length; i++)
      high += spectrum[i];
    const highLevel = high / 80;

    const emissionRate = map(avgVolume, 0, 100, 0, 15);
    if (emissionRate > 1) {
      for (let i = 0; i < floor(emissionRate); i++) {
        const pos = createVector(
          random(-50, 50),
          random(-50, 50),
          random(-200, 200)
        );
        this.particles.push({
          pos: pos,
          lastPos: pos.copy(),
          size: random(1, 5),
          color: random(palette),
          direction: random(0.1, 1) * (random() > 0.5 ? 1 : -1),
          lifespan: random(100, 200),
        });
      }
    }

    let time = millis();
    if (time - this.lastChange > this.changeDuration) {
      this.lastChange = time;
      this.variation = (this.variation + 1) % 12;
    }

    const stepsize = map(avgVolume, 0, 80, 0.001, 0.01);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.lifespan--;
      const border = max(width, height);
      if (
        p.lifespan <= 0 ||
        abs(p.pos.x) > border ||
        abs(p.pos.y) > border ||
        abs(p.pos.z) > border
      ) {
        this.particles.splice(i, 1);
        continue;
      }

      const flowX = p.pos.x / this.flowScale;
      const flowY = p.pos.y / this.flowScale;
      let slopeX = this._getSlopeX(flowX, flowY);
      let slopeY = this._getSlopeY(flowX, flowY);

      let vel = createVector(slopeX, slopeY, 0);
      vel.mult(p.direction * this.flowScale * stepsize);
      p.pos.add(vel);

      const weight = map(bassLevel, 0, 150, 1, p.size * 2);
      const strokeHue = (hue(p.color) + map(highLevel, 0, 100, -30, 30)) % 360;
      const alpha = map(p.lifespan, 0, 150, 0, 80);

      stroke(strokeHue, saturation(p.color), brightness(p.color), alpha);
      strokeWeight(weight);
      line(p.pos.x, p.pos.y, p.pos.z, p.lastPos.x, p.lastPos.y, p.lastPos.z);
      p.lastPos.set(p.pos);
    }

    pop();
    blendMode(BLEND);
  }

  _getSlopeY(x, y) {
    switch (this.variation) {
      case 0:
        return Math.sin(x);
      case 1:
        return Math.sin(x * 5) * y * 0.3;
      case 2:
        return Math.cos(x * y);
      case 3:
        return Math.sin(x) * Math.cos(y);
      case 4:
        return Math.cos(x) * y * y;
      case 5:
        return Math.log(Math.abs(x) + 0.1) * Math.log(Math.abs(y) + 0.1); // Avoid log(0)
      case 6:
        return Math.tan(x) * Math.cos(y);
      case 7:
        return -Math.sin(x * 0.1) * 3;
      case 8:
        return (x - x * x * x) * 0.01;
      case 9:
        return -Math.sin(x);
      case 10:
        return -y - Math.sin(1.5 * x) + 0.7;
      case 11:
        return Math.sin(x) * Math.cos(y);
      default:
        return 0;
    }
  }

  _getSlopeX(x, y) {
    switch (this.variation) {
      case 0:
        return Math.cos(y);
      case 1:
        return Math.cos(y * 5) * x * 0.3;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return 1;
      case 7:
        return Math.sin(y * 0.1) * 3;
      case 8:
        return y / 3;
      case 9:
        return -y;
      case 10:
        return -1.5 * y;
      case 11:
        return Math.sin(y) * Math.cos(x);
      default:
        return 0;
    }
  }
}
