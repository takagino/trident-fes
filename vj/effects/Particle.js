class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 5));
    this.lifespan = 255;
  }
  update() {
    this.pos.add(this.vel);
    this.lifespan -= 4;
  }
  draw() {
    noStroke();
    fill(60, 100, 100, (this.lifespan / 255) * 100);
    ellipse(this.pos.x, this.pos.y, 10);
  }
  isDead() {
    return this.lifespan < 0;
  }
}
