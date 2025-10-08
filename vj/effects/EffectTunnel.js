class EffectTunnel {
  constructor() {
    this.stars = [];
    for (let i = 0; i < 400; i++) {
      this.stars[i] = {
        x: random(-width, width),
        y: random(-height, height),
        z: random(width),
      };
    }
  }
  draw(spectrum) {
    push();
    translate(width / 2, height / 2);
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const speed = map(totalVolume / spectrum.length, 0, 100, 1, 20);
    for (let star of this.stars) {
      star.z -= speed;
      if (star.z < 1) {
        star.z = width;
        star.x = random(-width, width);
        star.y = random(-height, height);
      }
      const sx = map(star.x / star.z, 0, 1, 0, width);
      const sy = map(star.y / star.z, 0, 1, 0, height);
      const r = map(star.z, 0, width, 12, 0);
      const hue = map(star.z, 0, width, 180, 300);
      fill(hue, 100, 100);
      noStroke();
      ellipse(sx, sy, r, r);
    }
    pop();
  }
}
