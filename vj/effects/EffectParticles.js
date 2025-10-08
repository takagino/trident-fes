class EffectParticles {
  constructor() {
    this.is3D = true; // 3Dエフェクトであることを示す
    this.particles = [];
  }

  draw(spectrum) {
    // background(0, 0, 0, 0.2 * 255); // 背景はmain.jsで描画

    lights(); // ★ 3D空間に照明を当てる
    blendMode(ADD); // 光が美しく重なるように加算ブレンド

    // 全体の音量を取得
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;

    // 音量が大きい時にパーティクルを生成
    if (avgVolume > 40) {
      // しきい値は要調整
      const p = new Particle(0, 0, 0); // ★ 画面中央(0,0,0)から生成
      this.particles.push(p);
    }

    // パーティクルを更新・描画
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].draw();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1); // 寿命が尽きたら消す
      }
    }

    blendMode(BLEND); // ブレンドモードを元に戻す
  }
}
