let cnv;
let R;
let SM = new SpriteManager(); // Sprite Manager
let GS = new GameState();
let WORLD;

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

  // insert checkers here
  GS.checkFor("ended", () => { return GS.is("pin entered") || GS.is("timeout"); })
  
  startScreen = new StartScreenView(() => {
    if (startScreenMusic && startScreenMusic.isPlaying()) startScreenMusic.stop();
    R.selfRemove(startScreen);

    screenTimer = new ScreenTimer(() => { });
    R.add(screenTimer, 1);

    setupWorld(); // ⬅️ new
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
    endScreen = new EndScreenView(GS.is("pin entered")); //update endscreen state
  }

  if(GS.is("ended")) {
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

// Debug function to check and reset interface state
function debugInterface() {
  console.log("=== Interface Debug Info ===");
  console.log("window.activeInterface:", window.activeInterface);
  console.log("global activeInterface:", activeInterface);
  console.log("Renderer objects count:", R ? R.objects.length : "No renderer");
  return {
    windowActive: window.activeInterface,
    globalActive: activeInterface,
    rendererCount: R ? R.objects.length : 0
  };
}

// Function to force reset interface state
function resetInterface() {
  console.log("Forcing interface reset");
  window.activeInterface = null;
  activeInterface = null;
  console.log("Interface reset complete");
}


function setupWorld() {
  WORLD = new WorldManager();

  // --- Room A (start here) ---
  const computerView = new ComputerView(); // start view (index 0)
  const boxesView    = new BoxesView();
  const fcView       = new FileCabinetView();

  // Door in Room A -> Room B (index 1), land on view 0
  const sdViewA = new SlidingDoorView([{
    x:12, y:2.5, scale:0.8,
    targetRoom: 1,        // <-- ROOM B
    targetViewIndex: 0    // land on first plain color view
  }]);

  const roomA = new ViewManager();
  roomA.addView(computerView);  // index 0 (start)
  roomA.addView(boxesView);
  roomA.addView(fcView);
  roomA.addView(sdViewA);
  sdViewA.setRoom?.(roomA); //

  // --- Room B (plain colors + label) ---
  class PlainView extends View { constructor(r,g,b,label){ super(r,g,b,label); } }


  const redView = new SpaceWindowView();
  //const redView   = new PlainView(200, 40, 40,   'Room B - RED');
  const greenView = new PlainView(40, 160, 60,   'Room B - GREEN');
  const blueView  = new PlainView(50, 90, 200,   'Room B - BLUE');

  // Door in Room B -> back to Room A (index 0), land on computerView (view 0)
  const sdViewB = new SlidingDoorView([{
    x:12, y:2.5, scale:0.8,
    targetRoom: 2,        // <-- to room c
    targetViewIndex: 0
  }],SM.get("placeholderWall"));

  const roomB = new ViewManager();
  roomB.addView(redView);
  roomB.addView(greenView);
  roomB.addView(blueView);
  roomB.addView(sdViewB);
  sdViewB.setRoom?.(roomB); // ?. lets you safely call something that might be null or undefined without throwing an error


    // --- Room C (start here) ---
  const northWall = new NorthWall; // start view (index 0)
  const eastWall  = new EastWall();
  const breakerWall  = new BreakerBoxView([{
    x: 6,
    y: 3,
    onTransition: () => {
      // This is the function that launches the puzzle
      if (window.activeInterface) return;
      R.add(new WirePuzzle(() => {}));
    }
  }], SM.get("placeholderWall"));

  // Door in Room C -> Room A (index 0), land on view 0
  const sdViewC = new SlidingDoorView([{
    x:12, y:2.5, scale:0.8,
    targetRoom: 0,        // <-- ROOM A
    targetViewIndex: 0    // land on computerview
  }], SM.get("placeholderWall"));

  const roomC = new ViewManager();
  roomC.addView(northWall);  // index 0 (start)
  roomC.addView(eastWall);
  roomC.addView(breakerWall);
  roomC.addView(sdViewC);
  sdViewC.setRoom?.(roomC);

  // register rooms (A=0, B=1, C=2) and let WORLD receive key events
  WORLD.addRoom(roomA);   // index 0
  WORLD.addRoom(roomB);   // index 1
  WORLD.addRoom(roomC);
  R.add(WORLD, 1000);
}
