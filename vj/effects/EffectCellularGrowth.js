class EffectCellularGrowth {
  constructor() {
    this.is3D = true;
    this.cellSize = 30;
    this.cols = floor(width / this.cellSize);
    this.rows = floor(height / this.cellSize);
    this.grid = [];
    this.maxAge = 100;
    this.previousBass = 0;

    for (let i = 0; i < this.cols; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = {
          alive: false,
          age: 0,
          shape: random(['sphere', 'cone', 'box']),
        };
      }
    }
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    lights();
    blendMode(BLEND);

    let totalVolume = 0;
    for (let v of spectrum) totalVolume += v;
    const avgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) bass += spectrum[i];
    const bassLevel = bass / 40;
    let mid = 0;
    for (let i = 40; i < 100; i++) mid += spectrum[i];
    const midLevel = mid / 60;
    let high = 0;
    for (let i = spectrum.length - 80; i < spectrum.length; i++)
      high += spectrum[i];
    const highLevel = high / 80;

    const bassDifference = bassLevel - this.previousBass;
    const beatThreshold = 15;
    if (bassDifference > beatThreshold) {
      for (let k = 0; k < 2; k++) {
        let x = floor(random(this.cols));
        let y = floor(random(this.rows));
        if (!this.grid[x][y].alive) {
          this.grid[x][y] = {
            alive: true,
            age: 0,
            shape: random(['sphere', 'cone', 'box']),
          };
        }
      }
    }
    this.previousBass = bassLevel;

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let cell = this.grid[i][j];
        if (cell.alive) {
          const baseSize = map(
            cell.age,
            0,
            this.maxAge,
            2,
            this.cellSize * 1.2
          );
          const size = baseSize * map(avgVolume, 0, 80, 0.8, 1.5);
          const xPos = map(
            i,
            0,
            this.cols - 1,
            -width / 2 + this.cellSize / 2,
            width / 2 - this.cellSize / 2
          );
          const yPos = map(
            j,
            0,
            this.rows - 1,
            -height / 2 + this.cellSize / 2,
            height / 2 - this.cellSize / 2
          );
          push();
          translate(xPos, yPos, 0);
          const cellColor = this._getFlowingColor(
            i,
            j,
            cell.age,
            highLevel,
            avgVolume,
            palette
          );
          fill(cellColor);
          noStroke();
          this._drawShape(cell.shape, size);
          pop();
        }
      }
    }
    this._updateGrowth(midLevel);
  }

  _drawShape(shape, s) {
    s = max(s, 1);
    rotateZ(s * 0.01 + frameCount * 0.01);
    switch (shape) {
      case 'sphere':
        sphere(s / 2);
        break;
      case 'cone':
        rotateX(PI);
        cone(s / 2, s * 1.5);
        break;
      case 'box':
        box(s);
        break;
    }
  }

  _getFlowingColor(i, j, age, highLevel, avgVolume, palette) {
    let px = i / this.cols;
    let py = j / this.rows;
    let timeFactor = (frameCount * 0.01) % 1;
    let blendBase = (sin(px * 5 + timeFactor * TWO_PI) * 0.5 + 0.5 + py) / 2;
    let ageFactor = constrain(age / this.maxAge, 0, 1);
    let breathing = sin(frameCount * 0.02 + avgVolume * 0.01) * 0.5 + 0.5;
    let blend = blendBase * 0.6 + ageFactor * 0.4;
    let indexA = floor(blend * (palette.length - 1));
    let indexB = (indexA + 1) % palette.length;
    let mix = (blend * (palette.length - 1)) % 1;
    let c = lerpColor(palette[indexA], palette[indexB], mix);
    let finalHue = (hue(c) + map(highLevel, 0, 100, -30, 30)) % 360;
    let finalBrightness = constrain(
      brightness(c) * (0.5 + breathing * 0.5),
      20,
      100
    );
    let finalAlpha =
      map(age, 0, this.maxAge, 50, 10) * map(avgVolume, 0, 80, 0.5, 1.0);
    return color(finalHue, saturation(c), finalBrightness, finalAlpha);
  }

  _updateGrowth(midLevel) {
    let next = [];
    for (let i = 0; i < this.cols; i++) {
      next[i] = [];
      for (let j = 0; j < this.rows; j++) {
        next[i][j] = { ...this.grid[i][j] };
      }
    }
    const spreadProbability = map(midLevel, 0, 100, 0.02, 0.15);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let cell = this.grid[i][j];
        if (cell.alive) {
          next[i][j].age++;
          if (next[i][j].age > this.maxAge) {
            next[i][j].alive = false;
          } else {
            let neighbors = this._getNeighbors(i, j).filter(
              (n) => !this.grid[n.x][n.y].alive
            );
            if (neighbors.length > 0 && random() < spreadProbability) {
              let n = random(neighbors);
              next[n.x][n.y] = {
                alive: true,
                age: 0,
                shape: random(['sphere', 'cone', 'box']),
              };
            }
          }
        }
      }
    }
    this.grid = next;
  }

  _getNeighbors(x, y) {
    let neighbors = [];
    if (x > 0) neighbors.push({ x: x - 1, y: y });
    if (x < this.cols - 1) neighbors.push({ x: x + 1, y: y });
    if (y > 0) neighbors.push({ x: x, y: y - 1 });
    if (y < this.rows - 1) neighbors.push({ x: x, y: y + 1 });
    return neighbors;
  }
}
