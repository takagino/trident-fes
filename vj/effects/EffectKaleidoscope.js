class EffectKaleidoscope {
  constructor() {
    this.is3D = true;
    this.particles = [];
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    blendMode(ADD);
    lights();

    push();
    rotateZ(frameCount * 0.002);
    rotateX(frameCount * 0.001);

    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 40;

    const segments = floor(map(bassLevel, 0, 150, 2, 8));

    if (avgVolume > 80) {
      for (let k = 0; k < map(avgVolume, 80, 200, 1, 3); k++) {
        this.particles.push(new KaleidoParticle(palette));
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(spectrum);
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = 0; i < segments; i++) {
      push();
      rotateY((TWO_PI / segments) * i);
      for (let particle of this.particles) {
        particle.draw();
      }
      pop();
    }
    pop();

    blendMode(BLEND);
  }
}

class KaleidoParticle {
  constructor(palette) {
    this.pos = createVector(
      random(-width / 4, width / 4),
      random(-height / 4, height / 4),
      random(-200, 200)
    );
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.lifespan = random(50, 100);
    this.maxLifespan = this.lifespan;
    this.color = random(palette);
  }

  update(spectrum) {
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    this.vel.mult(map(avgVolume, 0, 150, 0.98, 1.02));
    this.pos.add(this.vel);
    this.lifespan -= 1;
    if (this.pos.x > width / 2 || this.pos.x < -width / 2) this.vel.x *= -1;
    if (this.pos.y > height / 2 || this.pos.y < -height / 2) this.vel.y *= -1;
    if (this.pos.z > 400 || this.pos.z < -400) this.vel.z *= -1;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();

    const brightness = map(this.lifespan, 0, this.maxLifespan, 0, 100);
    const alpha = map(this.lifespan, 0, this.maxLifespan, 0, 100);
    fill(hue(this.color), saturation(this.color), brightness, alpha);

    sphere(map(this.lifespan, 0, this.maxLifespan, 2, 8));
    pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}
