class EffectImageGrid {
  draw(spectrum) {
    const stepSize = 20;
    let bass = 0;
    for (let i = 0; i < 10; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 10;

    for (let y = 0; y < height; y += stepSize) {
      for (let x = 0; x < width; x += stepSize) {
        const imgX = floor(map(x, 0, width, 0, img.width));
        const imgY = floor(map(y, 0, height, 0, img.height));
        const c = img.get(imgX, imgY);

        noStroke();
        fill(c);

        const size = map(brightness(c), 0, 100, 0, stepSize * 1.5);
        const pulse = map(bassLevel, 0, 200, 1, 3);
        ellipse(x, y, size * pulse, size * pulse);
      }
    }
  }
}
