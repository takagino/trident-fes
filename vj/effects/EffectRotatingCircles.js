// エフェクト：回転するサークル
class EffectRotatingCircles {
  constructor() {
    this.is3D = true; // このエフェクトが3Dであることを示す
    this.num = 20; // 円の数

    // 各円のプロパティを保存する配列
    this.strokeColor = [];
    this.rotX = [];
    this.rotY = [];
    this.rotZ = [];

    // setupの内容をここに移動し、各円の初期値を設定
    for (let i = 0; i < this.num; i++) {
      this.strokeColor.push(color(int(random(200, 360)), 100, 100));
      this.rotX.push(float(random(-2, 2)));
      this.rotY.push(float(random(-2, 2)));
      this.rotZ.push(float(random(-2, 2)));
    }
  }

  draw(spectrum) {
    // --- 音声データを使いやすいように整理 ---
    let bass = 0;
    for (let i = 0; i < 40; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 40;

    let mid = 0;
    for (let i = 40; i < 100; i++) {
      mid += spectrum[i];
    }
    const midLevel = mid / 60;

    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;

    // --- 描画処理 ---

    // マウスで3D空間を操作できるようにする
    //orbitControl();

    blendMode(BLEND);
    background(0);
    blendMode(ADD); // 光が重なるように加算ブレンド
    noFill();

    // 全体の回転速度を音量で制御
    const speedMultiplier = map(avgVolume, 0, 80, 0.5, 3.0);
    // 中音域で円の大きさを脈動させる
    const sizePulse = map(midLevel, 0, 100, 0, width / 4);

    for (let i = 0; i < this.num; i++) {
      push();

      // 各円に固有の回転を適用
      rotateX(((frameCount * this.rotX[i]) / 100) * speedMultiplier);
      rotateY(((frameCount * this.rotY[i]) / 100) * speedMultiplier);
      rotateZ(((frameCount * this.rotZ[i]) / 100) * speedMultiplier);

      // 低音で線の太さを変える
      strokeWeight(map(bassLevel, 0, 180, 1, 5));
      stroke(this.strokeColor[i]);

      // 円を描画
      circle(0, 0, (width * i) / this.num + sizePulse);

      pop();
    }
  }
}
