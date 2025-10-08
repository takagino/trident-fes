class EffectKaleidoscope {
  draw(spectrum) {
    push();
    translate(width / 2, height / 2);
    const segments = 8; // 8分割の万華鏡
    for (let i = 0; i < segments; i++) {
      rotate(TWO_PI / segments);
      for (let j = 0; j < spectrum.length; j += 10) {
        const r = map(spectrum[j], 0, 255, 0, width / 3);
        const hue = map(j, 0, spectrum.length, 180, 360);
        stroke(hue, 100, 100);
        strokeWeight(2);
        line(0, 0, r, 0);
      }
    }
    pop();
  }
}
