class EffectIcosahedron {
  constructor() {
    this.is3D = true;
    this.radius = height / 4;
    this.subdivisions = 1;
    this.triangles = [];
    this.rotationY = 0;
    this.lastSubdivisionLevel = this.subdivisions;
    this.previousBass = 0;
    this.triangleCount = 0;
    this.isExploding = false;
    this.explodeProgress = 0;
    this._createIcosahedron();
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    lights();
    blendMode(ADD);
    strokeWeight(0.5);

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

    const rotationSpeed = map(avgVolume, 0, 80, 0.001, 0.01);
    this.rotationY += rotationSpeed;
    const scaleFactor = map(midLevel, 0, 100, 0.8, 1.5);

    const bassDifference = bassLevel - this.previousBass;
    const beatThreshold = 40;
    if (bassDifference > beatThreshold && frameCount % 20 === 0) {
      this.subdivisions = (this.subdivisions + 1) % 3;
      if (this.subdivisions !== this.lastSubdivisionLevel) {
        this._createIcosahedron();
        this.lastSubdivisionLevel = this.subdivisions;
      }
    }

    const explodeBeatThreshold = 10;
    if (bassDifference > explodeBeatThreshold && !this.isExploding) {
      this.isExploding = true;
      this.explodeProgress = 0;
    }
    this.previousBass = bassLevel;

    let explodeFactor = 0;
    if (this.isExploding) {
      this.explodeProgress += 0.05;
      explodeFactor =
        sin(this.explodeProgress * PI) * map(bassLevel, 0, 200, 50, 150);
      if (this.explodeProgress >= 1.0) {
        this.isExploding = false;
        this.explodeProgress = 0;
      }
    }

    push();
    rotateY(this.rotationY);
    rotateX(frameCount * 0.001);
    scale(scaleFactor);

    for (let t of this.triangles) {
      const center = p5.Vector.add(t.v1, p5.Vector.add(t.v2, t.v3)).div(3);
      const explosionOffset = center.copy().normalize().mult(explodeFactor);

      push();
      translate(explosionOffset);

      const colorIndex =
        floor(t.id * 0.5 + map(highLevel, 0, 100, 0, palette.length * 0.5)) %
        palette.length;
      const triColor = palette[colorIndex];

      const brightness = map(
        sin(t.id * 0.5 + frameCount * 0.02),
        -1,
        1,
        60,
        100
      );
      const alpha = map(avgVolume, 0, 80, 50, 90);

      fill(hue(triColor), saturation(triColor), brightness, alpha);
      stroke(
        hue(triColor),
        saturation(triColor),
        brightness * 1.2,
        alpha * 0.5
      );

      beginShape();
      vertex(t.v1.x, t.v1.y, t.v1.z);
      vertex(t.v2.x, t.v2.y, t.v2.z);
      vertex(t.v3.x, t.v3.y, t.v3.z);
      endShape(CLOSE);
      pop();
    }
    pop();

    blendMode(BLEND);
  }

  _normalizeAndScale(v) {
    v.normalize();
    v.mult(this.radius);
    return v;
  }
  _subdivide(v1, v2, v3, depth) {
    if (depth === 0) {
      this.triangles.push({ v1: v1, v2: v2, v3: v3, id: this.triangleCount++ });
      return;
    }
    let v12 = this._normalizeAndScale(p5.Vector.add(v1, v2));
    let v23 = this._normalizeAndScale(p5.Vector.add(v2, v3));
    let v31 = this._normalizeAndScale(p5.Vector.add(v3, v1));
    this._subdivide(v1, v12, v31, depth - 1);
    this._subdivide(v2, v23, v12, depth - 1);
    this._subdivide(v3, v31, v23, depth - 1);
    this._subdivide(v12, v23, v31, depth - 1);
  }
  _createIcosahedron() {
    this.triangles = [];
    this.triangleCount = 0;
    const X = 0.525731112119133606 * this.radius;
    const Z = 0.850650808352039932 * this.radius;
    const vdata = [
      createVector(-X, 0.0, Z),
      createVector(X, 0.0, Z),
      createVector(-X, 0.0, -Z),
      createVector(X, 0.0, -Z),
      createVector(0.0, Z, X),
      createVector(0.0, Z, -X),
      createVector(0.0, -Z, X),
      createVector(0.0, -Z, -X),
      createVector(Z, X, 0.0),
      createVector(-Z, X, 0.0),
      createVector(Z, -X, 0.0),
      createVector(-Z, -X, 0.0),
    ];
    this._subdivide(vdata[0], vdata[4], vdata[1], this.subdivisions);
    this._subdivide(vdata[0], vdata[9], vdata[4], this.subdivisions);
    this._subdivide(vdata[9], vdata[5], vdata[4], this.subdivisions);
    this._subdivide(vdata[4], vdata[5], vdata[8], this.subdivisions);
    this._subdivide(vdata[4], vdata[8], vdata[1], this.subdivisions);
    this._subdivide(vdata[8], vdata[10], vdata[1], this.subdivisions);
    this._subdivide(vdata[8], vdata[3], vdata[10], this.subdivisions);
    this._subdivide(vdata[5], vdata[3], vdata[8], this.subdivisions);
    this._subdivide(vdata[5], vdata[2], vdata[3], this.subdivisions);
    this._subdivide(vdata[2], vdata[7], vdata[3], this.subdivisions);
    this._subdivide(vdata[7], vdata[10], vdata[3], this.subdivisions);
    this._subdivide(vdata[7], vdata[6], vdata[10], this.subdivisions);
    this._subdivide(vdata[7], vdata[11], vdata[6], this.subdivisions);
    this._subdivide(vdata[11], vdata[0], vdata[6], this.subdivisions);
    this._subdivide(vdata[0], vdata[1], vdata[6], this.subdivisions);
    this._subdivide(vdata[6], vdata[1], vdata[10], this.subdivisions);
    this._subdivide(vdata[9], vdata[0], vdata[11], this.subdivisions);
    this._subdivide(vdata[9], vdata[11], vdata[2], this.subdivisions);
    this._subdivide(vdata[9], vdata[2], vdata[5], this.subdivisions);
    this._subdivide(vdata[7], vdata[2], vdata[11], this.subdivisions);
  }
}
