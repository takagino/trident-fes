class EffectWaveformCircular {
  draw(spectrum) {
    noFill();
    stroke(255);
    strokeWeight(3);
    push();
    translate(width / 2, height / 2);
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      const angle = map(i, 0, spectrum.length, 0, TWO_PI);
      const radius = map(spectrum[i], 0, 255, 100, 400);
      const x = radius * cos(angle);
      const y = radius * sin(angle);
      stroke(map(i, 0, spectrum.length, 0, 360), 100, 100);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}
