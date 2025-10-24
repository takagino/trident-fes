class EffectLineTrails {
  constructor() {
    this.is3D = true;
    this.movers = [];
    this.numMovers = 50;
    for (let i = 0; i < this.numMovers; i++) {
      this.movers.push(
        new TrailMover(
          random(-width / 2, width / 2),
          random(-height / 2, height / 2),
          random(-200, 200)
        )
      );
    }
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

    for (let mover of this.movers) {
      mover.update(avgVolume, midLevel);
      mover.show(bassLevel, highLevel, palette);
    }

    blendMode(BLEND);
  }
}

class TrailMover {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(2);
    this.acc = createVector(0, 0, 0);
    this.maxforce = 0.1;
    this.history = [];
    this.historyLength = 30;
    this.angle = random(TAU);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update(avgVolume, midLevel) {
    const maxspeed = map(avgVolume, 0, 80, 2, 8);
    this.vel.add(this.acc);
    this.vel.limit(maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.history.push(this.pos.copy());
    if (this.history.length > this.historyLength) {
      this.history.splice(0, 1);
    }

    const margin = 50;
    if (this.pos.x < -width / 2 - margin) this.pos.x = width / 2 + margin;
    if (this.pos.x > width / 2 + margin) this.pos.x = -width / 2 - margin;
    if (this.pos.y < -height / 2 - margin) this.pos.y = height / 2 + margin;
    if (this.pos.y > height / 2 + margin) this.pos.y = -height / 2 - margin;
    if (this.pos.z < -400) this.pos.z = 400;
    if (this.pos.z > 400) this.pos.z = -400;

    const angleChange = map(midLevel, 0, 100, -0.05, 0.05);
    this.angle += angleChange;
    let desired = createVector(
      cos(this.angle),
      sin(this.angle),
      tan(this.angle * 0.5)
    );
    desired.mult(maxspeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }

  show(bassLevel, highLevel, palette) {
    const weight = map(bassLevel, 0, 150, 1, 8);
    strokeWeight(weight);

    const colorIndex = floor(map(highLevel, 0, 100, 0, palette.length));
    const trailColor = palette[colorIndex % palette.length];

    noFill();
    beginShape();
    for (let i = 0; i < this.history.length; i++) {
      let v = this.history[i];
      let alpha = map(i, 0, this.history.length, 10, 80);
      stroke(
        hue(trailColor),
        saturation(trailColor),
        brightness(trailColor),
        alpha
      );
      vertex(v.x, v.y, v.z);
    }
    endShape();

    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    fill(hue(trailColor), saturation(trailColor), brightness(trailColor), 90);
    noStroke();
    sphere(weight * 0.8);
    pop();
  }
}
