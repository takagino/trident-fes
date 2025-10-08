class EffectMoscowSchool {
  constructor() {
    this.is3D = true;
    this.moscowColors = [
      '#345580',
      '#D8CBBB',
      '#D57A72',
      '#EFB934',
      '#BB302E',
      '#338197',
    ];

    // 主要オブジェクトの位置やサイズを3D用に初期化
    this.glyphs = [];
    for (let i = 0; i < 3; i++) {
      this.glyphs.push({
        x: random(-width / 4, width / 4),
        y: random(-height / 4, height / 4),
        z: random(-200, 200),
        s: random(width / 10, width / 6),
      });
    }
    this.hash = {
      x: random(-width / 4, width / 4),
      y: random(-height / 4, height / 4),
      z: random(-200, 200),
      s: random(100, 300),
    };
    this.waves = { x: 0, y: 0, z: 0, s: random(300, 600) };

    this.rayangles = [];
    this.lastBeat = 0;
  }

  draw(spectrum) {
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
    lights();

    // ★ background()を削除し、blendModeをADDに変更
    // background(this.bgColor);
    blendMode(ADD);

    // にじみ（Bleed）
    this._bleed(spectrum);

    // グリフ
    for (let g of this.glyphs) {
      this._glyph(g.x, g.y, g.z, g.s, avgVolume);
    }

    // ハッシュ
    this._hash(this.hash.x, this.hash.y, this.hash.z, this.hash.s);

    // 波
    this._waves(
      this.waves.x,
      this.waves.y,
      this.waves.z,
      this.waves.s,
      bassLevel
    );

    // 三角形
    if (bassLevel > 180 && millis() - this.lastBeat > 200) {
      this.rayangles.push(this._createRayangle());
      this.lastBeat = millis();
    }
    this.rayangles = this.rayangles.filter((r) => r.lifespan > 0);
    for (let r of this.rayangles) {
      r.lifespan--;
      this._drawRayangle(r);
    }

    blendMode(BLEND);
  }

  // 以下、プライベートメソッド (_glyph, _hash など) は変更なしです
  _glyph(x, y, z, s, volume) {
    push();
    translate(x, y, z);
    stroke('#251723');
    strokeWeight(map(volume, 0, 100, 1, 5));
    emissiveMaterial(random(this.moscowColors));
    for (let i = 0; i < floor(random(1, 3)); i++) {
      let xoff = random(-s / 8, s / 8);
      line(xoff, -s / 2, 0, xoff, s / 2, 0);
    }
    for (let i = 0; i < floor(random(1, 5)); i++) {
      let length = random(s / 6, s / 4);
      let yoff = random(-s * 0.4, s * 0.4);
      line(-length / 2, yoff, 0, length / 2, yoff, 0);
    }
    pop();
  }
  _createRayangle() {
    return {
      color: random(this.moscowColors),
      p1: createVector(
        random(-width / 4, width / 4),
        random(-height / 4, height / 4)
      ),
      p2: p5.Vector.fromAngle(random(TWO_PI), width),
      p3: p5.Vector.fromAngle(random(TWO_PI), width),
      lifespan: 30,
    };
  }
  _drawRayangle(r) {
    push();
    blendMode(DIFFERENCE);
    let c = color(r.color);
    c.setAlpha(map(r.lifespan, 0, 30, 0, 255));
    fill(c);
    noStroke();
    triangle(r.p1.x, r.p1.y, r.p2.x, r.p2.y, r.p3.x, r.p3.y);
    pop(); // blendMode(DIFFERENCE)をリセットするためにpop()を追加
  }
  _hash(x, y, z, s) {
    push();
    translate(x, y, z);
    stroke('#251723');
    strokeWeight(random(1, 3));
    for (let gx = -s / 2; gx <= s / 2; gx += s / 5) {
      line(gx, -s / 2, z, gx, s / 2, z);
    }
    for (let gy = -s / 2; gy <= s / 2; gy += s / 5) {
      line(-s / 2, gy, z, s / 2, gy, z);
    }
    pop();
  }
  _waves(x, y, z, length, bass) {
    push();
    translate(x, y, z);
    stroke('#FFFFFF'); // 線を白に変更
    strokeWeight(length / 100);
    for (let yer = -length / 8; yer <= length / 8; yer += length / 8) {
      noFill();
      beginShape();
      for (let xer = -length / 2; xer < length / 2; xer += 10) {
        let waveAmp = map(bass, 0, 200, length / 40, length / 10);
        let wave = map(
          sin(frameCount * 0.01 + xer / 20),
          -1,
          1,
          -waveAmp,
          waveAmp
        );
        vertex(xer, yer + wave, z);
      }
      endShape();
    }
    pop();
  }
  _bleed(spectrum) {
    push();
    translate(0, 0, -400);
    noStroke();
    for (let i = 0; i < spectrum.length; i += 30) {
      let level = spectrum[i];
      if (level > 100) {
        let x = random(-width, width);
        let y = random(-height, height);
        let size = map(level, 100, 255, 100, 500);
        let c = color(random(this.moscowColors));
        c.setAlpha(80); // 透明度を少し下げる
        fill(c);
        ellipse(x, y, size, size);
      }
    }
    pop();
  }
}
