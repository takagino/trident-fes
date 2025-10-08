class EffectLissajous {
  draw(spectrum) {
    push();
    translate(width / 2, height / 2);

    const freqX = map(spectrum[10] || 0, 0, 255, 1, 10);
    const freqY = map(spectrum[50] || 0, 0, 255, 1, 10);
    const phase = frameCount * 0.01;
    const amp = width / 3;

    stroke(50, 100, 100);
    strokeWeight(2);
    noFill();

    beginShape();
    for (let t = 0; t < TWO_PI; t += 0.01) {
      const x = sin(t * freqX + phase) * amp;
      const y = sin(t * freqY) * amp;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}
