class EffectMatrix {
  constructor() {
    this.is3D = true;
    this.characters = [];
    // 文字セットをよりサイバーな雰囲気に
    this.charSet = '01ABCDFEGH789!@#$%^&*()-_+=[]{}|;:,.<>?/`~';

    for (let i = 0; i < 200; i++) {
      // 文字の数をさらに増やす
      this.characters.push({
        x: random(-width / 2, width / 2),
        y: random(-height / 2, height / 2),
        z: random(-800, 800), // Z軸の範囲を広げる
        char: random(this.charSet.split('')),
        initialY: random(-height / 2, height / 2), // 初期Y位置を保存
        currentRotationZ: random(TWO_PI), // 各文字の初期Z軸回転
      });
    }
  }
  draw(spectrum) {
    blendMode(ADD);

    textFont(myFont);
    textAlign(CENTER, CENTER);

    // 全体音量を計算
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;

    let bass = spectrum[5] || 0;
    let mid = spectrum[50] || 0;
    let high = spectrum[120] || 0;

    for (let char of this.characters) {
      push();

      // ★ Z軸の回転を音量に連動させる
      char.currentRotationZ += map(high, 0, 255, 0.01, 0.1);
      rotateZ(char.currentRotationZ);

      // ★ 文字のサイズを全体音量と周波数でダイナミックに変化させる
      const baseSize = 20;
      const sizeMultiplier = map(avgVolume, 0, 100, 1, 3); // 音量が大きいほど大きく
      textSize(baseSize * sizeMultiplier);

      translate(char.x, char.y, char.z);

      const brightness = map(
        noise(char.x * 0.01, char.y * 0.01 + frameCount * 0.005),
        0,
        1,
        50,
        100
      );
      const alpha = map(bass, 0, 255, 10, 100);
      const hue = map(mid, 0, 255, 100, 200); // 緑系の色

      fill(hue, 80, brightness, alpha);
      text(char.char, 0, 0);
      pop();

      // ★ Y軸の移動速度を音に連動させる (降ってくるような動き)
      const speedY = map(high, 0, 255, 1, 10);
      char.y -= speedY;

      // ★ Z軸もゆっくり手前（カメラ方向）に移動させる
      const speedZ = map(bass, 0, 255, 0.5, 3);
      char.z -= speedZ;

      // 画面外に出たら、反対側から再登場させる
      if (char.y < -height / 2 || char.z < -1000) {
        // Zが一定値より手前でもリセット
        char.y = height / 2;
        char.x = random(-width / 2, width / 2);
        char.z = random(500, 1000); // 遠い位置から出現
        char.char = random(this.charSet.split('')); // 文字も更新
      }
    }

    blendMode(BLEND);
  }
}
