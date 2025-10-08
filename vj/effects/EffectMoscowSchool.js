// エフェクト：Moscow School (Provided Sketch Refactor)
class EffectMoscowSchool {
  constructor() {
    this.moscowColors = [
      '#345580',
      '#D8CBBB',
      '#D57A72',
      '#EFB934',
      '#BB302E',
      '#338197',
    ];
    this.bgColor = '#D8CBBB';

    // 毎回ランダムだとちらつくので、主要なオブジェクトの位置やサイズは最初に決めておく
    this.glyphs = [];
    for (let i = 0; i < 3; i++) {
      this.glyphs.push({
        x: random(width * 0.1, width * 0.9),
        y: random(height * 0.1, height * 0.9),
        s: random(width / 10, width / 6),
      });
    }
    this.hash = {
      x: random(width * 0.1, width * 0.9),
      y: random(height * 0.1, height * 0.9),
      s: random(100, 300),
    };
    this.waves = {
      x: random(width * 0.2, width * 0.8),
      y: random(height * 0.2, height * 0.8),
      s: random(300, 600),
    };

    this.rayangles = [];
    this.lastBeat = 0;
  }

  draw(spectrum) {
    // --- 音声データを使いやすいように整理 ---
    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const bassLevel = bass / 20;
    let total = 0;
    for (let v of spectrum) {
      total += v;
    }
    const avgVolume = total / spectrum.length;

    // --- 描画処理 ---
    blendMode(BLEND); // ブレンドモードを一旦リセット
    background(this.bgColor);
    noStroke();
    blendMode(MULTIPLY);

    // にじみ（Bleed）: 全体の音量で大きさを変える
    this._bleed(
      random(width),
      random(height),
      map(avgVolume, 0, 80, 50, 400),
      floor(random(6)),
      floor(random(6)),
      floor(random(6))
    );

    // グリフの描画
    for (let g of this.glyphs) {
      this._glyph(g.x, g.y, g.s, avgVolume);
    }

    // ハッシュの描画
    this._hash(this.hash.x, this.hash.y, this.hash.s);

    // 波の描画
    this._waves(this.waves.x, this.waves.y, this.waves.s, bassLevel);

    // 三角形（Rayangle）: ビートを検出したら生成
    if (bassLevel > 180 && millis() - this.lastBeat > 200) {
      // しきい値は要調整
      this.rayangles.push(this._createRayangle());
      this.lastBeat = millis();
    }

    // 寿命が尽きた三角形を消す
    this.rayangles = this.rayangles.filter((r) => r.lifespan > 0);
    // 三角形を描画
    for (let r of this.rayangles) {
      r.lifespan--;
      this._drawRayangle(r);
    }

    blendMode(BLEND); // 他のエフェクトに影響しないようモードを戻す
  }

  // --- 元の関数をプライベートメソッドとして移植 ---

  _glyph(x, y, s, volume) {
    strokeCap(SQUARE);
    stroke('#251723');
    strokeWeight(map(volume, 0, 100, 1, 5)); // 音量で線の太さを変える
    fill('#251723');
    push();
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = s / 20;
    drawingContext.shadowColor = random(this.moscowColors);
    translate(x, y);
    let startVLines = floor(random(1, 3));
    for (let i = 0; i < startVLines; i++) {
      let xoff = random(-s / 8, s / 8);
      line(xoff, -s / 2, xoff, s / 2);
    }
    let startHLines = floor(random(1, 5));
    let length = random(s / 6, s / 4);
    for (let i = 0; i < startHLines; i++) {
      let yoff = random(-s * 0.4, s * 0.4);
      let offset = random(-length / 8, length / 8);
      line(-length / 2 + offset, yoff, length / 2 + offset, yoff);
    }
    pop();
  }

  _createRayangle() {
    return {
      color: random(this.moscowColors),
      p1: createVector(
        random(width / 3, width - width / 3),
        random(height / 3, height - height / 3)
      ),
      p2: p5.Vector.fromAngle(random(TWO_PI), width),
      p3: p5.Vector.fromAngle(random(TWO_PI), width),
      lifespan: 30,
    };
  }

  _drawRayangle(r) {
    blendMode(DIFFERENCE);
    let c = color(r.color);
    c.setAlpha(map(r.lifespan, 0, 30, 0, 255));
    fill(c);
    noStroke();
    triangle(r.p1.x, r.p1.y, r.p2.x, r.p2.y, r.p3.x, r.p3.y);
    blendMode(MULTIPLY); // 基本のモードに戻す
  }

  _hash(x, y, s) {
    const noOfVert = floor(random(3, 6));
    const noOfHor = floor(random(3, 6));
    const vSpacer = s / noOfVert + 2;
    const hSpacer = s / noOfHor + 2;
    push();
    translate(x, y);
    // ... (hash関数の残りの部分は変更なし)
    stroke('#251723');
    strokeWeight(random(1, 3));
    blendMode(MULTIPLY);
    for (let x = -s / 2 + hSpacer; x < s / 2; x += hSpacer) {
      line(x, -s / 2, x, s / 2);
    }
    for (let y = -s / 2 + vSpacer; y < s / 2; y += vSpacer) {
      line(-s / 2, y, s / 2, y);
    }
    pop();
  }

  _waves(x, y, length, bass) {
    stroke('#251723');
    strokeWeight(length / 100);
    push();
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = length / 50;
    drawingContext.shadowColor = random(this.moscowColors);
    translate(x, y);
    for (let yer = -length / 8; yer <= length / 8; yer += length / 8) {
      noFill();
      beginShape();
      for (let xer = -length / 2; xer < length / 2; xer += 5) {
        // 頂点を減らして処理を軽く
        // ベースの強さで波の振幅を変化させる
        let waveAmp = map(bass, 0, 200, length / 40, length / 10);
        let wave = map(
          sin(frameCount * 0.01 + xer / 20),
          -1,
          1,
          -waveAmp,
          waveAmp
        );
        vertex(xer, yer + wave);
      }
      endShape();
    }
    pop();
  }

  _bleed(x, y, r, c1, c2, c3) {
    push();
    translate(x, y);
    let edge = color(this.bgColor);
    edge.setAlpha(0);
    let coloring = drawingContext.createRadialGradient(0, 0, r, 0, 0, 1);
    coloring.addColorStop(0, edge);
    coloring.addColorStop(0.333, this.moscowColors[c2]);
    coloring.addColorStop(1, this.moscowColors[c1]);
    drawingContext.fillStyle = coloring;
    beginShape();
    let differ = random(1000);
    for (let i = 0; i < TWO_PI; i += 0.03) {
      let xoffset = cos(i * 2) + differ;
      let yoffset = sin(i * 2) + differ;
      let rnoised = map(noise(xoffset, yoffset), 0, 1, r * 0.85, r * 1.2);
      vertex(cos(i) * rnoised, sin(i) * rnoised);
    }
    endShape();
    pop();
  }
}
