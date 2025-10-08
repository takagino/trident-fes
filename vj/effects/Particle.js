// パーティクル自体の設計図を3D用に改造
class Particle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);

    // ★ 速度を3Dのランダムな方向に設定
    this.vel = p5.Vector.random3D().mult(random(1, 8)); // 速度を少し上げる

    this.lifespan = 255; // 寿命
    this.hue = random(180, 240); // 青系の色
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 3; // 少しゆっくり消えるように
  }

  draw() {
    push();
    // ★ 3D空間の座標に移動
    translate(this.pos.x, this.pos.y, this.pos.z);

    noStroke();
    // 寿命に応じて透明度と明るさを変える
    const brightness = map(this.lifespan, 0, 255, 0, 100);
    const alpha = map(this.lifespan, 0, 255, 0, 80);
    fill(this.hue, 80, brightness, alpha);

    // ★ 2Dのellipseから3Dのsphereに変更
    sphere(12);

    pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}
