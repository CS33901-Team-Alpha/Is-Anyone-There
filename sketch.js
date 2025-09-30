let cnv;
let R;
let SM = new SpriteManager(); // Sprite Manager
let GS = new GameState();

let ended = false;

// Interface state tracking
let activeInterface = null; // tracks if Terminal, Pinpad, or other interface is active

// Views and game elements
let startScreen;
let room;

// Assets
let gameFont;
let terminusFont;
let startScreenMusic;
let henryAudio;
let henryImage;
let screenTimer;

function fit16x9() {
  const k = Math.min(windowWidth / 16, windowHeight / 9);
  const W = Math.floor(16 * k);
  const H = Math.floor(9 * k);

  if (!cnv) {
    cnv = createCanvas(W, H);
  } else {
    resizeCanvas(W, H);
  }

  // Center canvas
  const x = Math.floor((windowWidth - W) / 2);
  const y = Math.floor((windowHeight - H) / 2);
  cnv.position(x, y);
}

function preload() {
  loadSprites();

  gameFont     = loadFont('assets/font/PressStart2P-Regular.ttf');
  terminusFont = loadFont('assets/font/terminus.ttf');

  // Load start screen music
  startScreenMusic = loadSound('assets/Is_Anybody_There.mp3');
  
  // Load henry password sequence assets
  henryAudio = loadSound('assets/secrets/henry/connectionTerminated.mp3');
  henryImage = loadImage('assets/secrets/henry/connectionTerminated.jpg');
}

function setup() {
  fit16x9();
  VM.updateUnits(); // compute VM.U / VM.V now that width/height exist

  R = new Renderer();

  startScreen = new StartScreenView(() => {
    // Stop music when starting game
    if (startScreenMusic && startScreenMusic.isPlaying()) {
      startScreenMusic.stop();
    }
    R.selfRemove(startScreen);

    screenTimer = new ScreenTimer(() => {

    });
    R.add(screenTimer, 1);
    // Switch to game views
    textFont('sans-serif');
    setupRoom();
  });

  // High z so it draws on top until removed
  R.add(startScreen, 999);
}

function draw() {
  // Keep VM in sync each frame (handles window resizes, etc.)
  VM.updateUnits();
  VM.updateMouseFromP5();

  background(20);

  const dt = deltaTime / 1000;
  if(!ended) {
    endScreen = new EndScreenView(GS.getSolved()); //update endscreen state
  }

  if(GS.getSolved() || GS.getTimer()) {
    ended = true;
    R.add(endScreen, 999);
  }
  R.update(dt);
  R.draw();
}

function windowResized() {
  fit16x9();
  VM.updateUnits();
}

function mousePressed() {
  // Dispatch mouse in 16:9 unit space
  const m = VM.mouse();
  if (!VM.insideUnits(m)) return;
  // console.log(m.x, m.y);
  if (R) R.dispatch('mousePressed', m);
}

function mouseReleased() {
  if (R) R.dispatch('mouseReleased');
}

function keyPressed() {
  if (R) R.dispatch('keyPressed');
}

function setupRoom() {
  // Create the view instances
  let computerView = new ComputerView();        // North wall (pcWall.webp) - starting view
  let boxesView = new BoxesView();              // East wall (boxesWall.webp) - right from start
  let billboardView = new BillboardView();      // South wall (billBoardWall.webp) - left from start  
  let fcView = new FileCabinetView();           // West wall (cabinetWall.webp) - behind start

  room = new ViewManager();
  // Add views in navigation order: North -> East -> South -> West
  room.addView(computerView);    // 0: North (start here) - pcWall
  room.addView(boxesView);       // 1: East (right arrow) - boxesWall  
  room.addView(billboardView);   // 2: South (continue right) - billBoardWall
  room.addView(fcView);          // 3: West (continue right, left from start) - cabinetWall

  R.add(room);
}
