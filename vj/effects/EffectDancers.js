class EffectDancers {
  constructor() {
    this.is3D = true;
    this.dancers = [];
    for (let i = 0; i < 20; i++) {
      this.dancers.push(new Dancer());
    }
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(60, 100, 100)];
    }
    lights();

    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 20;
    let high = 0;
    for (let i = spectrum.length - 50; i < spectrum.length; i++) {
      high += spectrum[i];
    }
    const highLevel = high / 50;

    for (let dancer of this.dancers) {
      dancer.update(bassLevel, highLevel);
      dancer.draw(palette, highLevel);
    }
  }
}

class Dancer {
  constructor() {
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-200, 200)
    );
    this.baseSize = random(10, 80);
    this.currentSize = this.baseSize;
    this.armAngle = 0;
    this.baseHue = random(360);
  }

  update(bass, high) {
    this.currentSize = this.baseSize + map(bass, 0, 200, 0, 70);
    const upwardSpeed = map(bass, 0, 150, 0.5, 3);
    this.pos.y -= upwardSpeed;
    this.armAngle = map(high, 0, 100, -PI, PI);
    this.pos.x += random(-1, 1);
    if (this.pos.y < -height / 2) {
      this.pos.y = height / 2;
    }
    if (this.pos.x < -width / 2) {
      this.pos.x = width / 2;
    }
    if (this.pos.x > width / 2) {
      this.pos.x = -width / 2;
    }
  }

  draw(palette, highLevel) {
    push();
    translate(this.pos);

    const colorIndex = floor(map(highLevel, 0, 100, 0, palette.length));
    const baseColor = palette[colorIndex % palette.length];
    const currentHue = (hue(baseColor) + map(highLevel, 0, 100, -20, 20)) % 360;

    const bodySize = this.currentSize * 0.8;
    fill(currentHue, saturation(baseColor), brightness(baseColor));
    noStroke();
    sphere(bodySize);

    push();
    translate(0, 0, bodySize);
    fill(0, 0, 100);
    push();
    translate(-this.currentSize * 0.3, 0, 0);
    sphere(5);
    pop();
    push();
    translate(this.currentSize * 0.3, 0, 0);
    sphere(5);
    pop();
    pop();

    stroke(currentHue, saturation(baseColor), brightness(baseColor));
    strokeWeight(4);
    rotateY(this.armAngle);
    line(-this.currentSize, 0, 0, this.currentSize, 0, 0);
    pop();
  }
}
