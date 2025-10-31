// エフェクト：オービットボックス (スムージング版)
class EffectOrbitingBoxes {
  constructor() {
    this.is3D = true;
    this.boxes = [];
    this.numBoxes = 40;
    this.centerPos = createVector(0, 0, 0);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
    this.noiseOffsetZ = random(3000);

    for (let i = 0; i < this.numBoxes; i++) {
      this.boxes.push(new OrbitBox(i));
    }

    // ★★★ スムージング用の変数を追加 ★★★
    this.smoothedAvgVolume = 0;
    this.smoothedBassLevel = 0;
    this.smoothedMidLevel = 0;
    this.smoothedHighLevel = 0;
    // ★ lerpAmount: 0.1 = 10%ずつ追従 (小さいほど滑らか)
    this.lerpAmount = 0.05;
    // ★★★★★★★★★★★★★★★★★★★★★★★
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(255)];
    }
    lights();
    blendMode(ADD);

    // --- 音声解析 (現在の値) ---
    let totalVolume = 0;
    for (let v of spectrum) totalVolume += v;
    const currentAvgVolume = totalVolume / spectrum.length;
    let bass = 0;
    for (let i = 0; i < 40; i++) bass += spectrum[i];
    const currentBassLevel = bass / 40;
    let mid = 0;
    for (let i = 40; i < 100; i++) mid += spectrum[i];
    const currentMidLevel = mid / 60;
    let high = 0;
    for (let i = spectrum.length - 80; i < spectrum.length; i++)
      high += spectrum[i];
    const currentHighLevel = high / 80;

    // ★★★ オーディオレベルをスムージング ★★★
    this.smoothedAvgVolume = lerp(
      this.smoothedAvgVolume,
      currentAvgVolume,
      this.lerpAmount
    );
    this.smoothedBassLevel = lerp(
      this.smoothedBassLevel,
      currentBassLevel,
      this.lerpAmount
    );
    this.smoothedMidLevel = lerp(
      this.smoothedMidLevel,
      currentMidLevel,
      this.lerpAmount
    );
    this.smoothedHighLevel = lerp(
      this.smoothedHighLevel,
      currentHighLevel,
      this.lerpAmount
    );
    // ★★★★★★★★★★★★★★★★★★★★★★★★★★★

    // ★ スムージングされた値を使って中心を更新
    const moveSpeed = map(this.smoothedAvgVolume, 0, 80, 0.0005, 0.003);
    this.centerPos.x = map(
      noise(this.noiseOffsetX + frameCount * moveSpeed),
      0,
      1,
      -width / 4,
      width / 4
    );
    this.centerPos.y = map(
      noise(this.noiseOffsetY + frameCount * moveSpeed),
      0,
      1,
      -height / 4,
      height / 4
    );
    this.centerPos.z = map(
      noise(this.noiseOffsetZ + frameCount * moveSpeed),
      0,
      1,
      -200,
      200
    );

    for (let box of this.boxes) {
      // ★ スムージングされた値をbox.updateに渡す
      box.update(
        this.centerPos,
        this.smoothedBassLevel,
        this.smoothedMidLevel,
        this.smoothedHighLevel
      );
      box.draw(palette);
    }

    blendMode(BLEND);
  }
}

class OrbitBox {
  constructor(id) {
    this.id = id;
    this.pos = createVector(0, 0, 0);
    this.baseRadius = random(height * 0.1, height * 0.4);
    this.angleX = random(TAU);
    this.angleY = random(TAU);
    this.speedX = random(-0.02, 0.02);
    this.speedY = random(-0.02, 0.02);
    this.currentSize = 10;
    this.colorPos = random(1);
  }

  // ★ 引数名がbassLevelなどになっていることを確認
  update(centerPos, bassLevel, midLevel, highLevel) {
    // ★ ここの計算も自動的にスムージングされた値を使うことになる
    const orbitRadius = this.baseRadius + map(midLevel, 0, 100, 0, 100);
    const speedMultiplier = map(highLevel, 0, 100, 0.5, 2.0);
    this.angleX += this.speedX * speedMultiplier;
    this.angleY += this.speedY * speedMultiplier;
    this.currentSize = map(bassLevel, 0, 150, 5, 40);

    this.colorPos = (((this.angleX % TAU) + TAU) % TAU) / TAU;

    this.pos.x =
      centerPos.x + orbitRadius * cos(this.angleX) * sin(this.angleY);
    this.pos.y =
      centerPos.y + orbitRadius * sin(this.angleX) * sin(this.angleY);
    this.pos.z = centerPos.z + orbitRadius * cos(this.angleY);
  }

  draw(palette) {
    push();
    translate(this.pos);

    const colorLerp = constrain(
      map(this.colorPos, 0, 1, 0, palette.length - 1),
      0,
      palette.length - 1
    );
    const index1 = floor(colorLerp);
    const index2 = constrain(ceil(colorLerp), 0, palette.length - 1);
    const lerpAmt = colorLerp - index1;

    let boxColor;
    if (palette[index1] && palette[index2]) {
      boxColor = lerpColor(palette[index1], palette[index2], lerpAmt);
    } else {
      boxColor = palette[0];
    }

    fill(hue(boxColor), saturation(boxColor), brightness(boxColor), 80);
    noStroke();

    box(this.currentSize);
    pop();
  }
}
