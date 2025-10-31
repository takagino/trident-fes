// エフェクト：フローター（浮遊する生き物）- 触手修正版
class EffectFloaters {
  constructor() {
    this.is3D = true;
    this.floaters = [];
    this.numFloaters = 15;

    for (let i = 0; i < this.numFloaters; i++) {
      this.floaters.push(new Floater());
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

    for (let floater of this.floaters) {
      floater.update(avgVolume, bassLevel, midLevel, highLevel);
      floater.draw(palette);
    }
  }
}

// フローター（生き物）の設計図
class Floater {
  constructor() {
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-300, 300)
    );
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.maxSpeed = 1.0;
    this.maxForce = 0.03;
    this.baseSize = random(5, 20);

    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
    this.noiseOffsetZ = random(3000);

    this.currentSize = this.baseSize;
    this.currentColor = color(255);
    this.tentacleLength = 0;
    this.numTentacles = floor(random(8, 15));
    this.tentacleOffsets = [];
    for (let i = 0; i < this.numTentacles; i++) {
      // ★ 触手ごとに3Dのノイズシードを持たせる
      this.tentacleOffsets.push({
        end_x: random(1000),
        end_z: random(2000),
        mid_x: random(3000),
        mid_z: random(4000),
      });
    }
  }

  update(avgVolume, bassLevel, midLevel, highLevel) {
    const moveSpeed = map(avgVolume, 0, 80, 0.0005, 0.002);
    let target = createVector(
      map(
        noise(this.noiseOffsetX + frameCount * moveSpeed),
        0,
        1,
        -width / 2,
        width / 2
      ),
      map(
        noise(this.noiseOffsetY + frameCount * moveSpeed),
        0,
        1,
        -height / 2,
        height / 2
      ),
      map(noise(this.noiseOffsetZ + frameCount * moveSpeed), 0, 1, -300, 300)
    );

    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.acc.add(steer);

    const jumpForce = map(bassLevel, 100, 200, 0, 0.3);
    this.acc.add(0, jumpForce, 0);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.currentSize = this.baseSize + map(midLevel, 0, 100, 0, 15);
    this.tentacleLength = map(
      highLevel,
      0,
      100,
      this.currentSize * 2.0,
      this.currentSize * 6.0
    );

    // ループ処理
    const bottomEdge = height / 2 + this.tentacleLength;
    const topEdge = -height / 2 - this.currentSize;
    if (this.pos.y > bottomEdge) {
      this.pos.y = topEdge;
      this.pos.x = random(-width / 2, width / 2);
      this.pos.z = random(-300, 300);
      this.vel.mult(0);
      this.acc.mult(0);
    }
  }

  draw(palette) {
    push();
    translate(this.pos);

    const colorPos = map(
      this.pos.y,
      -height / 2,
      height / 2,
      0,
      palette.length - 1
    );
    const index1 = floor(colorPos);
    const index2 = constrain(ceil(colorPos), 0, palette.length - 1);
    const lerpAmt = colorPos - index1;

    let baseColor;
    if (palette[index1] && palette[index2]) {
      baseColor = lerpColor(palette[index1], palette[index2], lerpAmt);
    } else {
      baseColor = palette[0];
    }

    // 体（頭）
    noStroke();
    baseColor.setAlpha(200);
    ambientMaterial(baseColor);
    const bodyRadiusX = this.currentSize * 1.2;
    const bodyRadiusY = this.currentSize * 0.8;
    const bodyRadiusZ = this.currentSize * 1.2;
    ellipsoid(bodyRadiusX, bodyRadiusY, bodyRadiusZ);

    // 触手
    strokeWeight(4);
    let tentacleColor = color(
      hue(baseColor),
      saturation(baseColor),
      brightness(baseColor)
    );
    tentacleColor.setAlpha(180);
    stroke(tentacleColor);
    noFill(); // ★ 触手は線だけなので noFill()

    for (let i = 0; i < this.numTentacles; i++) {
      const noiseSpeed = 0.005;
      const offsets = this.tentacleOffsets[i];

      // ★ 1. 付け根 (Start)
      const startY = bodyRadiusY / 2; // 体の底
      const startX = map(
        noise(offsets.end_x),
        0,
        1,
        -this.currentSize * 0.3,
        this.currentSize * 0.3
      );
      const startZ = map(
        noise(offsets.end_z),
        0,
        1,
        -this.currentSize * 0.3,
        this.currentSize * 0.3
      );

      // ★ 2. 先端 (End)
      const endY = startY + this.tentacleLength;
      const endX =
        startX +
        map(
          noise(frameCount * noiseSpeed + offsets.end_x),
          0,
          1,
          -this.currentSize * 2,
          this.currentSize * 2
        );
      const endZ =
        startZ +
        map(
          noise(frameCount * noiseSpeed + offsets.end_z),
          0,
          1,
          -this.currentSize * 2,
          this.currentSize * 2
        );

      // ★ 3. 中間点 (Mid) - 独立したノイズで揺らす
      const midY = lerp(startY, endY, 0.5); // 付け根と先端の中間
      const midWiggle = this.currentSize * 1.5;
      const midX =
        lerp(startX, endX, 0.5) +
        map(
          noise(frameCount * noiseSpeed * 2 + offsets.mid_x),
          0,
          1,
          -midWiggle,
          midWiggle
        );
      const midZ =
        lerp(startZ, endZ, 0.5) +
        map(
          noise(frameCount * noiseSpeed * 2 + offsets.mid_z),
          0,
          1,
          -midWiggle,
          midWiggle
        );

      // ★ 4. curveVertexで滑らかな線を描画
      beginShape();
      curveVertex(endX, endY, endZ); // 終点
      curveVertex(endX, endY, endZ); // 制御点2
      curveVertex(midX, midY, midZ); // 中間点
      curveVertex(startX, startY, startZ); // 制御点1
      curveVertex(startX, startY, startZ); // 始点
      endShape();
    }

    pop();
  }
}
