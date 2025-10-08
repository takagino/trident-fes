class EffectDancers {
  constructor() {
    this.dancers = [];
    for (let i = 0; i < 20; i++) {
      this.dancers.push(new Dancer());
    }
  }

  draw(spectrum) {
    // 低音と高音のレベルを取得
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

    // 各ダンサーを更新・描画
    for (let dancer of this.dancers) {
      dancer.update(bassLevel, highLevel);
      dancer.draw();
    }
  }
}

// ダンサー自体の設計図
class Dancer {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.size = random(20, 50);
    this.armAngle = 0;
  }

  update(bass, high) {
    // 低音でジャンプ（上下に揺れる）
    const jump = map(bass, 0, 150, 0, -10);
    this.pos.y += jump;

    // 高音で腕を振る
    this.armAngle = map(high, 0, 100, -PI / 2, PI / 2);

    // 常に少し左右に動く
    this.pos.x += random(-1, 1);

    // 画面端に来たら反対側へ
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);

    // 体
    fill(60, 100, 100);
    noStroke();
    ellipse(0, 0, this.size, this.size * 1.2);

    // 目
    fill(180, 100, 100);
    ellipse(-this.size * 0.2, -this.size * 0.1, 5, 5);
    ellipse(this.size * 0.2, -this.size * 0.1, 5, 5);

    // 腕
    stroke(60, 100, 100);
    strokeWeight(4);
    line(0, 0, cos(this.armAngle) * this.size, sin(this.armAngle) * this.size);
    line(
      0,
      0,
      cos(this.armAngle + PI) * this.size,
      sin(this.armAngle + PI) * this.size
    );

    pop();
  }
}
