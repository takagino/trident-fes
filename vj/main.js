const USE_MIC = false; // Or true

let mic,
  fft,
  isMicActive = false,
  img,
  song,
  myFont;
let images = [];
let currentImage;
const FFT_SIZE = 1024;
const CUT_LOW_FREQ = 24;

let effects = [];
let activeIndex1 = 0,
  activeIndex2 = 1;
let lastSwitchTime = 0;
let colorManager;
const SWITCH_INTERVAL = 10000;

let palette1 = { name: 'default', colors: [] };
let palette2 = { name: 'default', colors: [] };

function preload() {
  const NUM_IMAGES = 3;
  for (let i = 0; i < NUM_IMAGES; i++) {
    images.push(loadImage('assets/image_' + i + '.jpg'));
  }
  myFont = loadFont('assets/RobotoMono-Regular.ttf');
  if (!USE_MIC) {
    song = loadSound('assets/bgm.mp3');
  }
  colorManager = new ColorManager();
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

  effects.push(new EffectBars());
  effects.push(new EffectBlob());
  effects.push(new EffectBouncers());
  effects.push(new EffectCellularGrowth());
  effects.push(new EffectCircles());
  effects.push(new EffectDancers());
  effects.push(new EffectEqualizerGrid());
  effects.push(new EffectEyesGrid());
  effects.push(new EffectFlowField());
  effects.push(new EffectGeometricNoise());
  effects.push(new EffectGridMovers());
  effects.push(new EffectHappyPlace());
  effects.push(new EffectIcosahedron());
  effects.push(new EffectImageTiles());
  effects.push(new EffectKaleidoscope());
  effects.push(new EffectLineTrails());
  effects.push(new EffectLissajous());
  effects.push(new EffectMatrix());
  effects.push(new EffectNoiseRibbons());
  effects.push(new EffectProceduralFlower());
  effects.push(new EffectPulseCluster());
  effects.push(new EffectRecursiveSplit());
  effects.push(new EffectRotatingCircles());
  effects.push(new EffectSunburst());
  effects.push(new EffectSwarm());
  effects.push(new EffectTunnel());
  effects.push(new EffectVaseForm());
  effects.push(new EffectWaveformCircular());

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

  if (effects[activeIndex1]) {
    effects[activeIndex1].draw(spectrum, palette1.colors);
  }
  if (effects[activeIndex2]) {
    effects[activeIndex2].draw(spectrum, palette2.colors);
  }
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
          if (song && song.isLoaded()) {
            song.loop();
            console.log('MP3 playback started!');
          } else {
            console.error('MP3 not loaded yet!');
          }
        }
        isMicActive = true;
        lastSwitchTime = millis();
      });
  }
}

function pickTwoRandomEffects() {
  if (effects.length === 0) return;

  const index1 = floor(random(effects.length));
  let index2 = floor(random(effects.length));
  while (effects.length > 1 && index1 === index2) {
    index2 = floor(random(effects.length));
  }
  activeIndex1 = index1;
  activeIndex2 = index2;
  lastSwitchTime = millis();

  palette1 = colorManager.getRandomPalette();
  palette2 = colorManager.getRandomPalette();
  while (
    colorManager.colorSchemes.length > 1 &&
    palette1.name === palette2.name
  ) {
    palette2 = colorManager.getRandomPalette();
  }

  if (images.length > 0) {
    currentImage = random(images);
  }

  console.log(
    'Current Combination:',
    effects[activeIndex1] ? effects[activeIndex1].constructor.name : 'None',
    ' (Palette:',
    palette1.name,
    ') +',
    effects[activeIndex2] ? effects[activeIndex2].constructor.name : 'None',
    ' (Palette:',
    palette2.name,
    ')'
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
