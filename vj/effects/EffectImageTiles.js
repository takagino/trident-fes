class EffectImageTiles {
  constructor() {
    this.is3D = true;
    this.cols = 5;
    this.rows = 5;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
  }

  draw(spectrum, palette) {
    const moveSpeed = 0.002;
    const offsetX = map(
      noise(this.noiseOffsetX + frameCount * moveSpeed),
      0,
      1,
      -30,
      30
    );
    const offsetY = map(
      noise(this.noiseOffsetY + frameCount * moveSpeed),
      0,
      1,
      -30,
      30
    );

    noStroke();

    if (currentImage) {
      texture(currentImage);
    } else {
      fill(255);
    }

    const tileWidth = width / this.cols;
    const tileHeight = height / this.rows;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        push();
        const posX =
          map(x, 0, this.cols, -width / 2, width / 2) + tileWidth / 2;
        const posY =
          map(y, 0, this.rows, -height / 2, height / 2) + tileHeight / 2;
        translate(posX + offsetX, posY + offsetY, 0);
        plane(tileWidth, tileHeight);
        pop();
      }
    }
  }
}
