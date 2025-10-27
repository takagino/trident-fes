class EffectSwarm {
  constructor() {
    this.is3D = true;
    this.agents = [];
    for (let i = 0; i < 150; i++) {
      this.agents.push(new SwarmAgent());
    }
    this.target = createVector(0, 0, 0);
    this.noiseOffsetX = random(1000);
    this.previousBass = 0;
  }

  draw(spectrum, palette) {
    if (!palette || palette.length === 0) {
      palette = [color(40, 30, 100)];
    }

    this.target.x = map(noise(this.noiseOffsetX), 0, 1, -width / 2, width / 2);
    this.target.y = map(
      noise(this.noiseOffsetX + 100),
      0,
      1,
      -height / 2,
      height / 2
    );
    this.target.z = map(noise(this.noiseOffsetX + 200), 0, 1, -400, 400);
    this.noiseOffsetX += 0.002;

    let totalVolume = 0;
    for (let val of spectrum) totalVolume += val;
    const avgVolume = totalVolume / spectrum.length;
    const maxSpeed = map(avgVolume, 0, 80, 2, 10);

    let bass = 0;
    for (let i = 0; i < 20; i++) {
      bass += spectrum[i];
    }
    const currentBass = bass / 20;
    const bassDifference = currentBass - this.previousBass;
    const BEAT_THRESHOLD = 20;
    let isBeat = bassDifference > BEAT_THRESHOLD;

    for (let agent of this.agents) {
      agent.update(this.agents, this.target, maxSpeed, isBeat);
      agent.draw(palette);
    }

    this.previousBass = currentBass;
  }
}

class SwarmAgent {
  constructor() {
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-400, 400)
    );
    this.vel = p5.Vector.random3D();
    this.acc = createVector(0, 0, 0);
    this.maxForce = 0.3;
  }

  update(agents, target, maxSpeed, isBeat) {
    let separation = this.separate(agents, maxSpeed);
    let steering;
    if (isBeat) {
      let flee = p5.Vector.sub(this.pos, createVector(0, 0, 0));
      flee.setMag(maxSpeed * 3);
      steering = p5.Vector.sub(flee, this.vel);
      steering.limit(this.maxForce * 10);
    } else {
      let desired = p5.Vector.sub(target, this.pos);
      desired.setMag(maxSpeed);
      steering = p5.Vector.sub(desired, this.vel);
      steering.limit(this.maxForce);
    }
    separation.mult(2.0);
    steering.mult(1.0);
    this.acc.add(separation);
    this.acc.add(steering);
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    const margin = 400;
    if (this.pos.x < -width / 2 - margin) this.pos.x = width / 2 + margin;
    if (this.pos.x > width / 2 + margin) this.pos.x = -width / 2 - margin;
    if (this.pos.y < -height / 2 - margin) this.pos.y = height / 2 + margin;
    if (this.pos.y > height / 2 + margin) this.pos.y = -height / 2 - margin;
    if (this.pos.z < -margin) this.pos.z = margin;
    if (this.pos.z > margin) this.pos.z = -margin;
  }

  separate(agents, maxSpeed) {
    let desiredSeparation = 30.0;
    let steer = createVector(0, 0, 0);
    let count = 0;
    for (let other of agents) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  draw(palette) {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);

    let dir = this.vel.copy();
    if (dir.magSq() > 0.01) {
      let rotY = atan2(dir.x, dir.z);
      let rotX = atan2(dir.y, createVector(dir.x, 0, dir.z).mag());
      rotateY(rotY);
      rotateX(-rotX);
    }

    const size = map(this.pos.z, -400, 400, 5, 25);
    const speed = this.vel.mag();

    const colorPos = constrain(
      map(speed, 0, 10, 0, palette.length - 1),
      0,
      palette.length - 1
    );
    const index1 = floor(colorPos);
    const index2 = constrain(ceil(colorPos), 0, palette.length - 1);
    const lerpAmt = colorPos - index1;

    let agentColor;
    if (palette[index1] && palette[index2]) {
      agentColor = lerpColor(palette[index1], palette[index2], lerpAmt);
    } else {
      agentColor = palette[0];
    }

    fill(hue(agentColor), saturation(agentColor), brightness(agentColor), 80);
    noStroke();

    triangle(0, 0, -size * 2, size, -size * 2, -size);
    pop();
  }
}
