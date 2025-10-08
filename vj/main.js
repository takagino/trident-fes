let mic,
  fft,
  isMicActive = false,
  img,
  myFont;

const FFT_SIZE = 1024;
const CUT_LOW_FREQ = 224;

let effects = [];
let activeIndex1 = 0,
  activeIndex2 = 1;
let lastSwitchTime = 0;
const SWITCH_INTERVAL = 5000;

function preload() {
  img = loadImage(
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  );
  myFont = loadFont('assets/RobotoMono-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);
  mic = new p5.AudioIn();
  fft = new p5.FFT(0.8, FFT_SIZE);
  fft.setInput(mic);

  effects.push(new EffectBars());
  effects.push(new EffectCircles());
  effects.push(new EffectWaveformCircular());
  effects.push(new EffectParticles());
  effects.push(new EffectTunnel());
  effects.push(new EffectKaleidoscope());
  effects.push(new EffectMatrix());
  effects.push(new EffectBlob());
  effects.push(new EffectImageGrid());
  effects.push(new EffectLissajous());
  effects.push(new EffectSunburst());
  effects.push(new EffectEqualizerGrid());
  effects.push(new EffectDancers());
  effects.push(new EffectRadialShape());
  //effects.push(new EffectMoscowSchool());
  effects.push(new EffectRotatingCircles());

  pickTwoRandomEffects();
}

function draw() {
  if (!isMicActive) {
    background(0);
    textFont(myFont);
    fill(0, 0, 100);
    textAlign(CENTER, CENTER);
    textSize(24);
    text('CLICK TO START', 0, 0);
    return;
  }

  background(0);

  if (millis() - lastSwitchTime > SWITCH_INTERVAL) {
    pickTwoRandomEffects();
  }

  const fullSpectrum = fft.analyze();
  const spectrum = fullSpectrum.slice(CUT_LOW_FREQ);

  const effect1 = effects[activeIndex1];
  const effect2 = effects[activeIndex2];

  if (effect1.is3D || effect2.is3D) {
    if (effect1.is3D) effect1.draw(spectrum);
    if (effect2.is3D) effect2.draw(spectrum);
  } else {
    push();
    translate(-width / 2, -height / 2);
    background(0);
    effect1.draw(spectrum);
    effect2.draw(spectrum);
    pop();
  }
}

function mousePressed() {
  if (!isMicActive) {
    getAudioContext()
      .resume()
      .then(() => {
        console.log('AudioContext resumed!');
        mic.start();
        isMicActive = true;
        lastSwitchTime = millis();
      });
  }
}

function pickTwoRandomEffects() {
  const index1 = floor(random(effects.length));
  let index2 = floor(random(effects.length));
  while (index1 === index2) {
    index2 = floor(random(effects.length));
  }
  activeIndex1 = index1;
  activeIndex2 = index2;
  lastSwitchTime = millis();
  console.log(
    'Current Combination:',
    effects[activeIndex1].constructor.name,
    '+',
    effects[activeIndex2].constructor.name
  );
}

function keyPressed() {
  if (key === 'ArrowRight' || key === 'ArrowLeft') {
    pickTwoRandomEffects();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
