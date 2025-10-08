class EffectSwarm {
  constructor() {
    this.is3D = true;
    this.agents = [];
    for (let i = 0; i < 150; i++) {
      this.agents.push(new SwarmAgent());
    }
    // ★ WEBGL座標系でターゲットを初期化
    this.target = createVector(0, 0);
    this.noiseOffsetX = random(1000);
    this.previousBass = 0;
  }

  draw(spectrum) {
    // background(220, 80, 20, 0.2 * 255); // メインのdrawで描画するので不要

    // ★ WEBGL座標系でターゲットを動かす
    this.target.x = map(noise(this.noiseOffsetX), 0, 1, -width / 2, width / 2);
    this.target.y = map(
      noise(this.noiseOffsetX + 100),
      0,
      1,
      -height / 2,
      height / 2
    );
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
    // ★ WEBGL座標系で初期位置を設定
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2)
    );
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.maxForce = 0.3;
  }

  update(agents, target, maxSpeed, isBeat) {
    // ★ separateメソッドにmaxSpeedを渡す
    let separation = this.separate(agents, maxSpeed);
    let steering;

    if (isBeat) {
      // ★ WEBGLの中心(0,0)から逃げる
      let flee = p5.Vector.sub(this.pos, createVector(0, 0));
      flee.setMag(maxSpeed * 3);
      steering = p5.Vector.sub(flee, this.vel);
      steering.limit(this.maxForce * 10);
    } else {
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

    // ★ WEBGL座標系で画面端の処理
    if (this.pos.x < -width / 2) this.pos.x = width / 2;
    if (this.pos.x > width / 2) this.pos.x = -width / 2;
    if (this.pos.y < -height / 2) this.pos.y = height / 2;
    if (this.pos.y > height / 2) this.pos.y = -height / 2;
  }

  // ★ maxSpeedを引数で受け取るように変更
  separate(agents, maxSpeed) {
    let desiredSeparation = 20.0;
    let steer = createVector(0, 0);
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
      steer.mult(maxSpeed); // ★ this.maxSpeedではなく、引数のmaxSpeedを使う
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  draw() {
    push();
    // ★ WEBGLなので3D空間の座標として描画
    translate(this.pos.x, this.pos.y, 0);
    rotate(this.vel.heading());
    fill(40, 30, 100);
    noStroke();
    // Z軸回転を考慮して描画（WEBGLではrotate()は3D回転になるため）
    rotateZ(PI / 2);
    triangle(0, -5, 0, 5, 10, 0); // 矢印のような形に変更
    pop();
  }
}
