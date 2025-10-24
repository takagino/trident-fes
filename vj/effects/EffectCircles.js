class EffectCircles {
  constructor() {
    this.is3D = true;
    this.circles = [];
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    blendMode(ADD);

    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 20;
    const BASS_THRESHOLD = 150;

    if (bassLevel > BASS_THRESHOLD) {
      const numToSpawn = floor(map(bassLevel, BASS_THRESHOLD, 255, 1, 5));
      for (let i = 0; i < numToSpawn; i++) {
        this.circles.push(new PulsingCircle(spectrum.length, palette));
      }
    }

    for (let i = this.circles.length - 1; i >= 0; i--) {
      const circle = this.circles[i];
      circle.update(spectrum);
      circle.draw();
      if (circle.isDead()) {
        this.circles.splice(i, 1);
      }
    }

    blendMode(BLEND);
  }
}

class PulsingCircle {
  constructor(spectrumSize, palette) {
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-400, 400)
    );
    this.lifespan = 120;
    this.freqBin = floor(random(spectrumSize));
    this.color = random(palette);
  }

  update(spectrum) {
    const level = spectrum[this.freqBin] || 0;
    this.size = map(level, 0, 255, 10, 250);
    this.lifespan--;
  }

  draw() {
    push();
    translate(this.pos);

    const alpha = map(this.lifespan, 0, 120, 0, 100);

    noFill();
    strokeWeight(map(this.lifespan, 0, 120, 8, 1));

    stroke(
      hue(this.color),
      saturation(this.color),
      brightness(this.color),
      alpha
    );

    torus(this.size / 2, 4);
    pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}
