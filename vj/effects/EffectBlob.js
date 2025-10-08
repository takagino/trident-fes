class EffectBlob {
  constructor() {
    this.is3D = true;
    this.nodes = [];
    for (let i = 0; i < 30; i++) {
      // 頂点数をさらに増やして、より滑らかに
      this.nodes.push({
        angle: map(i, 0, 30, 0, TWO_PI),
        noiseOffset: random(1000),
      });
    }
  }

  draw(spectrum) {
    // lights(); // 透明化のためライトは一時的にオフ
    blendMode(ADD);

    push();

    // --- 音声解析 ---
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

    // 全体音量でZ軸（奥行き）を変化させる
    const zPos = map(avgVolume, 0, 80, -100, 100); // 奥行きの動きも控えめに
    translate(0, 0, zPos);

    // ★ 基本の大きさを控えめに調整
    const baseRadius = map(bassLevel, 0, 150, height / 8, height / 3);

    // ★ fill()を使って透明度を設定
    // 色を少し変えて、より有機的な印象に
    const hue = map(midLevel, 0, 100, 280, 320); // 紫〜マゼンタ系
    fill(hue, 80, 100, 10); // 30%の透明度

    // ★ 線（ストローク）も付けて、縁を強調
    stroke(hue, 80, 100, 80); // こちらは少し不透明に
    strokeWeight(2);

    // --- 1つのブロブを描画 ---
    beginShape();

    // ★ curveVertexの開始と終了の修正
    // 最初の頂点を2回追加
    const firstNode = this.nodes[0];
    let firstRadius =
      baseRadius +
      map(
        noise(firstNode.noiseOffset + frameCount * 0.01),
        0,
        1,
        -map(midLevel, 0, 100, 30, 80),
        map(midLevel, 0, 100, 30, 80)
      );
    curveVertex(
      firstRadius * cos(firstNode.angle),
      firstRadius * sin(firstNode.angle)
    );

    for (let node of this.nodes) {
      // ★ 中音域の強さで表面の凹凸を激しくする (範囲を調整)
      const radiusWobble = map(midLevel, 0, 100, 30, 80); // 凹凸の最大値を少し抑える
      const radius =
        baseRadius +
        map(
          noise(node.noiseOffset + frameCount * 0.01),
          0,
          1,
          -radiusWobble,
          radiusWobble
        );

      const x = radius * cos(node.angle);
      const y = radius * sin(node.angle);
      curveVertex(x, y);
    }

    // 最後の頂点を2回追加 (CLOSEのために最初の頂点と同じ座標を使う)
    curveVertex(
      firstRadius * cos(firstNode.angle),
      firstRadius * sin(firstNode.angle)
    );

    endShape(CLOSE);

    pop();
    blendMode(BLEND);
  }
}
