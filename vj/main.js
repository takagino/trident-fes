let mic,
  fft,
  isMicActive = false,
  img,
  song,
  myFont;

const USE_MIC = false;
const FFT_SIZE = 1024;
const CUT_LOW_FREQ = 24;

let effects = [];
let activeIndex1 = 0,
  activeIndex2 = 1;
let lastSwitchTime = 0;
const SWITCH_INTERVAL = 10000;

function preload() {
  img = loadImage(
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  );
  myFont = loadFont('assets/RobotoMono-Regular.ttf');

  if (!USE_MIC) {
    song = loadSound('assets/bgm.mp3');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);
  fft = new p5.FFT(0.9, FFT_SIZE);

  if (USE_MIC) {
    mic = new p5.AudioIn();
    fft.setInput(mic);
  } else {
    fft.setInput();
  }

  // effects.push(new EffectBars());
  //effects.push(new EffectCircles());
  //effects.push(new EffectWaveformCircular());
  //effects.push(new EffectParticles());
  //effects.push(new EffectTunnel());
  //effects.push(new EffectKaleidoscope());
  //effects.push(new EffectMatrix());
  //effects.push(new EffectBlob());
  //effects.push(new EffectImageGrid());
  effects.push(new EffectLissajous());
  // effects.push(new EffectSunburst());
  // effects.push(new EffectEqualizerGrid());
  // effects.push(new EffectDancers());
  // effects.push(new EffectRadialShape());
  // effects.push(new EffectMoscowSchool());
  //effects.push(new EffectRotatingCircles());
  // effects.push(new EffectBouncers());
  effects.push(new EffectSwarm());

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

  effects[activeIndex1].draw(spectrum);
  effects[activeIndex2].draw(spectrum);
}

function mousePressed() {
  if (!isMicActive) {
    getAudioContext()
      .resume()
      .then(() => {
        console.log('AudioContext resumed!');
        if (USE_MIC) {
          mic.start();
          console.log('Microphone started!');
        } else {
          song.loop();
          console.log('MP3 playback started!');
        }
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
