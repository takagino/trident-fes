class EffectCircles {
  draw(spectrum) {
    noStroke();
    for (let i = 0; i < spectrum.length; i++) {
      const x = map(i, 0, spectrum.length, 0, width);
      const w = width / spectrum.length;
      const diameter = map(spectrum[i], 0, 255, 0, height);
      fill(map(i, 0, spectrum.length, 180, 540) % 360, 100, 100, 0.8 * 255);
      ellipse(x, height / 2, w, diameter);
    }
  }
}
