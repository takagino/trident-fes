class EffectImageGrid {
  constructor() {
    this.is3D = true;
  }
  draw(spectrum) {
    lights();
    blendMode(ADD);

    // --- 音声解析 ---
    let totalVolume = 0;
    for (let val of spectrum) {
      totalVolume += val;
    }
    const avgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 20;
    let mid = 0;
    for (let i = 40; i < 100; i++) {
      mid += spectrum[i];
    }
    const midLevel = mid / 60;
    let high = 0;
    for (let i = 150; i < spectrum.length; i++) {
      high += spectrum[i];
    }
    const highLevel = high / (spectrum.length - 150);

    // ★★★ ここからが修正箇所 ★★★

    // 1. グリッドの描画範囲を定義 (例: 画面の半分の大きさ)
    const gridWidth = width / 2;
    const gridHeight = height / 2;

    // 2. グリッドの密度を調整 (数値を大きくすると軽くなる)
    const stepSize = 25;

    // 3. forループの範囲を、定義した描画範囲に変更
    for (let y = -gridHeight / 2; y < gridHeight / 2; y += stepSize) {
      for (let x = -gridWidth / 2; x < gridWidth / 2; x += stepSize) {
        // ★★★ 修正ここまで ★★★

        const imgX = floor(map(x, -gridWidth / 2, gridWidth / 2, 0, img.width));
        const imgY = floor(
          map(y, -gridHeight / 2, gridHeight / 2, 0, img.height)
        );
        const c = color(img.get(imgX, imgY));

        const zBase = map(brightness(c), 0, 100, -150, 150);
        const zWobble = map(midLevel, 0, 100, 0, 100);
        const z = zBase + zWobble;

        push();
        translate(x, y, z);

        const flash = map(highLevel, 0, 80, 0, 50);
        const finalBrightness = constrain(brightness(c) + flash, 0, 100);
        fill(hue(c), saturation(c), finalBrightness);
        noStroke();

        const size = map(brightness(c), 0, 100, 0, stepSize * 1.5);
        const pulse = map(bassLevel, 0, 200, 1, 3);

        sphere((size * pulse) / 2);
        pop();
      }
    }

    blendMode(BLEND);
  }
}
