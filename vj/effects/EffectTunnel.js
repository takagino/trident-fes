class EffectTunnel {
  constructor() {
    this.is3D = true;
    this.stars = [];
    this.numStars = 600;

    this.targetOffsetX = 0;
    this.targetOffsetY = 0;
    this.noiseOffsetX_target = random(1000);
    this.noiseOffsetY_target = random(2000);
  }

  init() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      const initialOffsetX = map(
        noise(this.noiseOffsetX_target),
        0,
        1,
        -width / 3,
        width / 3
      );
      const initialOffsetY = map(
        noise(this.noiseOffsetY_target),
        0,
        1,
        -height / 3,
        height / 3
      );
      this.stars[i] = {
        x: random(-width, width) + initialOffsetX,
        y: random(-height, height) + initialOffsetY,
        z: random(width * 0.5, width * 1.5),
      };
    }
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    if (this.stars.length === 0) {
      this.init();
    }

    blendMode(ADD);
    lights();

    let totalVolume = 0;
    for (let val of spectrum) totalVolume += val;
    const speed = map(totalVolume / spectrum.length, 0, 100, 2, 40);

    const targetMoveSpeed = 0.005;
    this.targetOffsetX = map(
      noise(this.noiseOffsetX_target + frameCount * targetMoveSpeed),
      0,
      1,
      -width,
      width
    );
    this.targetOffsetY = map(
      noise(this.noiseOffsetY_target + frameCount * targetMoveSpeed),
      0,
      1,
      -height,
      height
    );

    for (let star of this.stars) {
      star.z -= speed;
      if (star.z < 1) {
        star.z = width * 1.5;
        star.x = random(-width, width) + this.targetOffsetX;
        star.y = random(-height, height) + this.targetOffsetY;
      }

      push();
      translate(star.x, star.y, star.z);

      const colorPos = map(star.z, width * 1.5, 1, 0, 1);
      const colorLerp = colorPos * (palette.length - 1);
      const index1 = floor(colorLerp);
      const index2 = ceil(colorLerp);
      const lerpAmt = colorLerp - index1;
      const starColor = lerpColor(
        palette[index1 % palette.length],
        palette[index2 % palette.length],
        lerpAmt
      );
      const brightness = map(star.z, 0, width * 1.5, 100, 60);
      const alpha = map(star.z, 0, width * 1.5, 90, 40);
      fill(hue(starColor), saturation(starColor), brightness, alpha);

      noStroke();
      const r = map(star.z, 0, width * 1.5, 15, 1);
      sphere(max(1, r));

      pop();
    }
    blendMode(BLEND);
  }
}
