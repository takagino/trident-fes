class EffectEyesGrid {
  constructor() {
    this.is3D = true;
    this.eyeCount = 50;
    this.eyes = [];

    for (let i = 0; i < this.eyeCount; i++) {
      const specLength = 1024 - 24;
      this.eyes.push({
        pos: createVector(
          random(-width / 2, width / 2),
          random(-height / 2, height / 2),
          random(-300, 300)
        ),
        baseSize: random(30, 100),
        freqIndex: floor(random(specLength)),
      });
    }
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(200, 80, 80)];
    }

    lights();
    blendMode(BLEND);

    let high = 0;
    for (let i = spectrum.length - 80; i < spectrum.length; i++) {
      high += spectrum[i];
    }
    const highLevel = high / 80;

    for (let eye of this.eyes) {
      const freqIndex = eye.freqIndex;
      const level = spectrum[freqIndex] || 0;
      this._eye(eye.pos, eye.baseSize, level, highLevel, palette);
    }
  }

  _eye(pos, baseSize, level, highLevel, palette) {
    const eyeWhiteSize = map(level, 0, 255, baseSize * 0.5, baseSize * 2.5);
    const irisSize = eyeWhiteSize * 0.7;
    const pupilMultiplier = map(highLevel, 0, 100, 0.3, 2.0);
    const pupilSize = eyeWhiteSize * pupilMultiplier;
    const highlightSize = irisSize * 0.25;

    push();
    translate(pos.x, pos.y, pos.z);

    fill(0, 0, 100);
    noStroke();
    ellipse(0, 0, eyeWhiteSize, eyeWhiteSize);

    const colorIndex = floor(map(highLevel, 0, 100, 0, palette.length));
    const irisColor = palette[colorIndex % palette.length];
    fill(irisColor);

    ellipse(0, 0, irisSize, irisSize);

    fill(0, 0, 0);
    ellipse(0, 0, pupilSize, pupilSize);

    if (irisSize > 5 && highlightSize < irisSize / 2) {
      fill(0, 0, 100);
      ellipse(-irisSize * 0.25, -irisSize * 0.25, highlightSize, highlightSize);
    }

    pop();
  }
}
