class EffectBars {
  draw(spectrum) {
    noStroke();
    for (let i = 0; i < spectrum.length; i++) {
      const x = map(i, 0, spectrum.length, 0, width);
      const h = map(spectrum[i], 0, 255, 0, height);
      const w = width / spectrum.length;
      fill(map(i, 0, spectrum.length, 0, 360), 100, 100);
      rect(x, height - h, w, h);
    }
  }
}
