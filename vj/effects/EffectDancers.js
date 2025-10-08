class EffectDancers {
  constructor() {
    this.is3D = true;
    this.dancers = [];
    for (let i = 0; i < 20; i++) {
      this.dancers.push(new Dancer());
    }
  }
  draw(spectrum) {
    lights();
    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 20;
    let high = 0;
    for (let i = spectrum.length - 50; i < spectrum.length; i++) {
      high += spectrum[i];
    }
    const highLevel = high / 50;
    for (let dancer of this.dancers) {
      dancer.update(bassLevel, highLevel);
      dancer.draw();
    }
  }
}

// ダンサー自体の設計図を修正
class Dancer {
  constructor() {
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-200, 200)
    );
    this.baseSize = random(5, 60);
    this.currentSize = this.baseSize;
    this.hue = 60;
    this.armAngle = 0;
  }
  update(bass, high) {
    this.currentSize = this.baseSize + map(bass, 0, 200, 0, 50);
    this.hue = map(high, 0, 100, 60, 180);
    const upwardSpeed = map(bass, 0, 150, 0.5, 3);
    this.pos.y -= upwardSpeed;
    this.armAngle = map(high, 0, 100, -PI, PI);
    this.pos.x += random(-1, 1);
    if (this.pos.y < -height / 2) {
      this.pos.y = height / 2;
    }
    if (this.pos.x < -width / 2) {
      this.pos.x = width / 2;
    }
    if (this.pos.x > width / 2) {
      this.pos.x = -width / 2;
    }
  }

  draw() {
    push();
    translate(this.pos);

    // 体
    const bodySize = this.currentSize * 0.8;
    fill(this.hue, 100, 100);
    noStroke();
    sphere(bodySize);

    // ★ 1. 目の描画位置を、体の球体の表面に修正
    push();
    // Y座標は変更せず、Z座標(手前方向)に体の半径分だけ移動
    translate(0, 0, bodySize);
    fill(0, 0, 100);

    // 左目
    push();
    translate(-this.currentSize * 0.3, 0, 0);
    sphere(5);
    pop();

    // 右目
    push();
    translate(this.currentSize * 0.3, 0, 0);
    sphere(5);
    pop();
    pop();

    // ★ 2. 腕の回転軸をY軸に変更
    stroke(this.hue, 100, 100);
    strokeWeight(4);
    // rotateZ(this.armAngle); // Z軸回転（プロペラ回転）をやめる
    rotateY(this.armAngle); // Y軸回転（左右に振る動き）に変更
    line(-this.currentSize, 0, 0, this.currentSize, 0, 0);
    pop();
  }
}
