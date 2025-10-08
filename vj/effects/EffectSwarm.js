class EffectSwarm {
  constructor() {
    this.is3D = true;
    this.agents = [];
    for (let i = 0; i < 200; i++) {
      this.agents.push(new SwarmAgent());
    }
    // ★ ターゲットを3Dベクトルに
    this.target = createVector(0, 0, 0);
    this.noiseOffsetX = random(1000);
    this.previousBass = 0;
  }

  draw(spectrum) {
    // ★ ターゲットがZ軸方向にも動くようにする
    this.target.x = map(noise(this.noiseOffsetX), 0, 1, -width / 2, width / 2);
    this.target.y = map(
      noise(this.noiseOffsetX + 100),
      0,
      1,
      -height / 2,
      height / 2
    );
    this.target.z = map(noise(this.noiseOffsetX + 200), 0, 1, -400, 400);
    this.noiseOffsetX += 0.002;

    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    const maxSpeed = map(avgVolume, 0, 80, 2, 10);

    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const currentBass = bass / 20;
    const bassDifference = currentBass - this.previousBass;
    const BEAT_THRESHOLD = 20;
    let isBeat = bassDifference > BEAT_THRESHOLD;

    for (let agent of this.agents) {
      agent.update(this.agents, this.target, maxSpeed, isBeat);
      agent.draw();
    }

    this.previousBass = currentBass;
  }
}

class SwarmAgent {
  constructor() {
    // ★ Z座標も初期化
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-400, 400)
    );
    // ★ 3Dの速度ベクトル
    this.vel = p5.Vector.random3D();
    this.acc = createVector(0, 0, 0);
    this.maxForce = 0.3;
  }

  update(agents, target, maxSpeed, isBeat) {
    let separation = this.separate(agents, maxSpeed);
    let steering;

    if (isBeat) {
      let flee = p5.Vector.sub(this.pos, createVector(0, 0, 0));
      flee.setMag(maxSpeed * 3);
      steering = p5.Vector.sub(flee, this.vel);
      steering.limit(this.maxForce * 10);
    } else {
      // ★ ターゲットも3Dベクトルとして扱う
      let desired = p5.Vector.sub(target, this.pos);
      desired.setMag(maxSpeed);
      steering = p5.Vector.sub(desired, this.vel);
      steering.limit(this.maxForce);
    }

    separation.mult(2.0);
    steering.mult(1.0);
    this.acc.add(separation);
    this.acc.add(steering);

    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // ★ Z軸の画面端処理も追加
    const margin = 400;
    if (this.pos.x < -width / 2 - margin) this.pos.x = width / 2 + margin;
    if (this.pos.x > width / 2 + margin) this.pos.x = -width / 2 - margin;
    if (this.pos.y < -height / 2 - margin) this.pos.y = height / 2 + margin;
    if (this.pos.y > height / 2 + margin) this.pos.y = -height / 2 - margin;
    if (this.pos.z < -margin) this.pos.z = margin;
    if (this.pos.z > margin) this.pos.z = -margin;
  }

  separate(agents, maxSpeed) {
    let desiredSeparation = 30.0; // 少し距離を広げる
    let steer = createVector(0, 0, 0);
    let count = 0;
    for (let other of agents) {
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
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);

    // ★ 進行方向を向くように回転（少し複雑な計算）
    let dir = this.vel.copy();
    let rotY = atan2(dir.x, dir.z);
    let rotX = atan2(dir.y, createVector(dir.x, 0, dir.z).mag());
    rotateY(rotY);
    rotateX(-rotX);

    // ★ Z座標に応じて大きさを変える
    const size = map(this.pos.z, -400, 400, 5, 25);

    fill(40, 30, 100);
    noStroke();

    // ★ 基本のサイズを大きく
    triangle(0, 0, -size * 2, size, -size * 2, -size);
    pop();
  }
}
