class EffectMatrix {
  constructor() {
    this.is3D = true;
    this.characters = [];
    this.charSet = '01ABCDFEGH789!@#$%^&*()-_+=[]{}|;:,.<>?/`~';

    for (let i = 0; i < 200; i++) {
      this.characters.push({
        x: random(-width / 2, width / 2),
        y: random(-height / 2, height / 2),
        z: random(-800, 800),
        char: random(this.charSet.split('')),
        initialY: random(-height / 2, height / 2),
        currentRotationZ: random(TWO_PI),
      });
    }
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(120, 100, 100)];
    }

    blendMode(ADD);
    textFont(myFont);
    textAlign(CENTER, CENTER);

    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    let bass = spectrum[5] || 0;
    let mid = spectrum[50] || 0;
    let high = spectrum[120] || 0;

    for (let charData of this.characters) {
      push();

      charData.currentRotationZ += map(high, 0, 255, 0.01, 0.1);
      rotateZ(charData.currentRotationZ);

      const baseSize = 20;
      const sizeMultiplier = map(avgVolume, 0, 100, 1, 3);
      textSize(baseSize * sizeMultiplier);

      translate(charData.x, charData.y, charData.z);

      const colorIndex = floor(map(mid, 0, 255, 0, palette.length));
      const charColor = palette[colorIndex % palette.length];

      const brightness = map(
        noise(charData.x * 0.01, charData.y * 0.01 + frameCount * 0.005),
        0,
        1,
        50,
        100
      );
      const alpha = map(bass, 0, 255, 10, 100);

      fill(hue(charColor), saturation(charColor), brightness, alpha);

      text(charData.char, 0, 0);
      pop();

      const speedY = map(high, 0, 255, 1, 10);
      charData.y -= speedY;
      const speedZ = map(bass, 0, 255, 0.5, 3);
      charData.z -= speedZ;

      if (charData.y < -height / 2 || charData.z < -1000) {
        charData.y = height / 2;
        charData.x = random(-width / 2, width / 2);
        charData.z = random(500, 1000);
        charData.char = random(this.charSet.split(''));
      }
    }

    blendMode(BLEND);
  }
}
