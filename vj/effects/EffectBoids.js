// エフェクト：EffectBoids（蝶々の群れ）
class EffectBoids {
  constructor() {
    this.is3D = true;
    this.boids = [];
    this.numBoids = 120; // 蝶々の数を多めに

    for (let i = 0; i < this.numBoids; i++) {
      this.boids.push(new Boid());
    }

    this.smoothedBass = 0;
    this.smoothedMid = 0;
    this.smoothedHigh = 0;
    this.smoothedVolume = 0;
    this.lerpAmount = 0.08;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }

    lights();
    blendMode(BLEND);

    let totalVolume = 0;
    for (let v of spectrum) totalVolume += v;
    const currentAvgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) bass += spectrum[i];
    const currentBassLevel = bass / 40;
    let mid = 0;
    for (let i = 40; i < 100; i++) mid += spectrum[i];
    const currentMidLevel = mid / 60;
    let high = 0;
    for (let i = spectrum.length - 80; i < spectrum.length; i++)
      high += spectrum[i];
    const currentHighLevel = high / 80;

    this.smoothedVolume = lerp(
      this.smoothedVolume,
      currentAvgVolume,
      this.lerpAmount
    );
    this.smoothedBass = lerp(
      this.smoothedBass,
      currentBassLevel,
      this.lerpAmount
    );
    this.smoothedMid = lerp(this.smoothedMid, currentMidLevel, this.lerpAmount);
    this.smoothedHigh = lerp(
      this.smoothedHigh,
      currentHighLevel,
      this.lerpAmount
    );

    // Boidルールに影響を与えるパラメータ
    const separationForce = map(this.smoothedBass, 0, 150, 0.2, 0.8);
    const cohesionForce = map(this.smoothedMid, 0, 100, 0.8, 1.5);
    const alignmentForce = map(this.smoothedHigh, 0, 100, 0.8, 1.2);
    const maxSpeed = map(this.smoothedVolume, 0, 80, 2, 6);

    for (let boid of this.boids) {
      boid.update(
        this.boids,
        separationForce,
        cohesionForce,
        alignmentForce,
        maxSpeed
      );
      boid.draw(palette);
    }
  }
}

// 蝶々（Boid）の設計図
class Boid {
  constructor() {
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-300, 300)
    );
    this.vel = p5.Vector.random3D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector(0, 0, 0);
    this.maxForce = 0.08;
    this.r = 20; // 蝶々の大きさの基準
    this.hueOffset = random(360); // 個体ごとの色相オフセット
    this.wingFlapOffset = random(100); // 個体ごとの羽ばたきオフセット
  }

  update(boids, separationForce, cohesionForce, alignmentForce, maxSpeed) {
    let separation = this.separate(boids, maxSpeed);
    let alignment = this.align(boids, maxSpeed);
    let cohesion = this.cohesion(boids, maxSpeed);

    separation.mult(separationForce);
    alignment.mult(alignmentForce);
    cohesion.mult(cohesionForce);

    this.acc.add(separation);
    this.acc.add(alignment);
    this.acc.add(cohesion);

    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    const margin = width / 2;
    if (this.pos.x < -margin) this.pos.x = margin;
    if (this.pos.x > margin) this.pos.x = -margin;
    if (this.pos.y < -margin) this.pos.y = margin;
    if (this.pos.y > margin) this.pos.y = -margin;
    if (this.pos.z < -margin) this.pos.z = margin;
    if (this.pos.z > margin) this.pos.z = -margin;
  }

  separate(boids, maxSpeed) {
    let desiredSeparation = this.r * 3; // 離れたい距離を少し大きく
    let steer = createVector(0, 0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.magSq() > 0) {
      steer.setMag(maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  align(boids, maxSpeed) {
    let neighborDist = 60; // 周囲の考慮範囲を少し広げる
    let sum = createVector(0, 0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborDist) {
        sum.add(other.vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      if (sum.magSq() > 0) {
        sum.setMag(maxSpeed);
        sum.sub(this.vel);
        sum.limit(this.maxForce);
      }
    }
    return sum;
  }

  cohesion(boids, maxSpeed) {
    let neighborDist = 60; // 周囲の考慮範囲を少し広げる
    let sum = createVector(0, 0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborDist) {
        sum.add(other.pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum, maxSpeed);
    }
    return createVector(0, 0, 0);
  }

  seek(target, maxSpeed) {
    let desired = p5.Vector.sub(target, this.pos);
    if (desired.magSq() > 0) {
      desired.setMag(maxSpeed);
    }
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // ★★★ 蝶々の描画 ★★★
  draw(palette) {
    push();
    translate(this.pos);

    // 進行方向を向くように回転 (Y軸方向が上)
    let dir = this.vel.copy();
    if (dir.magSq() > 0.01) {
      let angle = atan2(dir.y, dir.x);
      rotateZ(angle); // Z軸周りの回転 (水平方向)
      let pitch = -atan2(dir.z, sqrt(dir.x * dir.x + dir.y * dir.y));
      rotateY(pitch); // Y軸周りの回転 (垂直方向の傾き)
    }

    // 色をパレットと自身の位置で決定
    const colorLerpAmount = map(this.pos.z, -300, 300, 0, palette.length - 1);
    const index1 = floor(constrain(colorLerpAmount, 0, palette.length - 1));
    const index2 = constrain(ceil(colorLerpAmount), 0, palette.length - 1);
    const lerpAmt = colorLerpAmount - index1;

    let butterflyColor;
    if (palette[index1] && palette[index2]) {
      butterflyColor = lerpColor(palette[index1], palette[index2], lerpAmt);
    } else {
      butterflyColor = palette[0];
    }

    butterflyColor.setAlpha(220); // 少し透明度を残す
    ambientMaterial(butterflyColor);

    noStroke();
    // --- 蝶々の本体 ---
    const bodyLength = this.r * 1.5;
    const bodyThickness = this.r * 0.4;
    push();
    rotateX(PI / 2); // Y軸が上になるように調整
    translate(0, 0, -bodyLength / 2); // 体が中心にくるように
    cylinder(bodyThickness, bodyLength); // 本体（円柱）
    pop();

    // --- 蝶々の羽 (左右2枚) ---
    const wingWidth = this.r * 3;
    const wingHeight = this.r * 2;
    const flapSpeed = 0.15; // 羽ばたく速度
    const flapAngle = map(
      sin(frameCount * flapSpeed + this.wingFlapOffset),
      -1,
      1,
      -PI / 4,
      PI / 4
    ); // 羽ばたき角度

    // 左の羽
    push();
    translate(0, 0, -bodyThickness / 2); // 体の横に配置
    // rotateY(-PI / 2); // 羽を横向きに
    rotateZ(flapAngle); // 羽ばたきのアニメーション
    plane(wingWidth, wingHeight); // 左の羽
    pop();

    // 右の羽
    push();
    translate(0, 0, bodyThickness / 2); // 体の横に配置
    // rotateY(PI / 2); // 羽を横向きに
    rotateZ(-flapAngle); // 逆方向に羽ばたき
    plane(wingWidth, wingHeight); // 右の羽
    pop();

    pop();
  }
}
