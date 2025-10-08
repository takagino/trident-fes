class EffectParticles {
  constructor() {
    this.particles = [];
  }
  draw(spectrum) {
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    if (avgVolume > 40) {
      this.particles.push(new Particle(width / 2, height / 2));
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].draw();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}
