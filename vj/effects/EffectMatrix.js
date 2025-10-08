class EffectMatrix {
  constructor() {
    this.characters = [];
    this.charSet =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?#$%&';
    for (let i = 0; i < 100; i++) {
      this.characters.push({
        x: random(width),
        y: random(height),
        char: random(this.charSet.split('')),
      });
    }
  }
  draw(spectrum) {
    textFont(myFont);
    textSize(16);
    textAlign(CENTER, CENTER);

    let bass = spectrum[5] || 0;
    let mid = spectrum[50] || 0;
    let high = spectrum[120] || 0;

    for (let char of this.characters) {
      const brightness = map(
        noise(char.x * 0.01, char.y * 0.01),
        0,
        1,
        50,
        100
      );
      const alpha = map(bass, 0, 255, 10, 100);
      const hue = map(mid, 0, 255, 100, 200);
      fill(hue, 80, brightness, alpha);
      text(char.char, char.x, char.y);

      char.y += map(high, 0, 255, 0.5, 5);
      if (char.y > height) {
        char.y = 0;
        char.x = random(width);
      }
    }
  }
}
