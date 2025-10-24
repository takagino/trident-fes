class EffectBouncers {
  constructor() {
    this.is3D = true;
    this.bouncers = [];
    const spectrumLength = 1024 - 24;
    for (let i = 0; i < spectrumLength; i++) {
      this.bouncers.push(new Bouncer(i, spectrumLength));
    }
  }
  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }
    blendMode(ADD);
    lights();
    for (let i = 0; i < spectrum.length; i++) {
      if (this.bouncers[i]) {
        this.bouncers[i].update(spectrum[i]);
        this.bouncers[i].draw(palette);
      }
    }
    blendMode(BLEND);
  }
}

class Bouncer {
  constructor(i, total) {
    const x = map(i, 0, total - 1, -width / 2, width / 2);
    const y = -height / 2;
    this.pos = createVector(x, y, random(-200, 200));
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.size = 10;
    this.gravity = createVector(0, -0.5, 0);
    this.index = i;
    this.total = total;
  }
  applyForce(force) {
    this.acc.add(force);
  }
  update(level) {
    const upwardForce = map(level, 0, 255, 0, 5);
    this.applyForce(createVector(0, upwardForce, 0));
    this.applyForce(this.gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.mult(0.98);
    const floor = -height / 2 + this.size / 2;
    if (this.pos.y < floor) {
      this.pos.y = floor;
      this.vel.y *= -0.5;
    }
    const ceiling = height / 2 - this.size / 2;
    if (this.pos.y > ceiling) {
      this.pos.y = ceiling;
      this.vel.y *= -0.5;
    }
    const leftWall = -width / 2 + this.size / 2;
    const rightWall = width / 2 - this.size / 2;
    if (this.pos.x < leftWall || this.pos.x > rightWall) {
      this.vel.x *= -0.5;
    }
    const backWall = -400;
    const frontWall = 400;
    if (this.pos.z < backWall || this.pos.z > frontWall) {
      this.vel.z *= -0.5;
    }
  }

  draw(palette) {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();

    const colorPos = this.index / (this.total - 1);
    const colorLerp = colorPos * (palette.length - 1);
    const index1 = floor(colorLerp);
    const index2 = ceil(colorLerp);
    const lerpAmt = colorLerp - index1;
    const ballColor = lerpColor(
      palette[index1 % palette.length],
      palette[index2 % palette.length],
      lerpAmt
    );

    fill(
      ballColor.levels[0],
      ballColor.levels[1],
      ballColor.levels[2],
      80 * 2.55
    );

    sphere(this.size);
    pop();
  }
}
