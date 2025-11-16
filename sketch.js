//ref  |  search for pending refactoring
let cnv;
let R;
let SM = new SpriteManager(); // Sprite Manager
let AM; 
let GS;  //ref
let WORLD;  //ref
let AI = new AiMessageHandler(1, 7.3);
let IM = new InventoryManager();

// secondary timer storage variable, so we can delete it later from anywhere
// right now is created in WorldManager, when you first go into reactor
let secondaryTimer;

let endscreenShown = false; //ref | changing conditions might not need to be global because of GS
let ended = false; //ref -----^

// Interface state tracking
let activeInterface = null; // tracks if Terminal, Pinpad, or other interface is active

// Views and game elements
let startScreen;   //ref | global start screen, look into changing.

// Assets
let gameFont;
let terminusFont;
let startScreenMusic;
let henryAudio; //ref
let henryImage; //ref
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
  loadSprites(); // in SpriteManager.js and loads all images, 
  AM = new AudioManager();
  // may be able to load partially? if lag is an issue?
  startScreenMusic = loadSound('assets/Is_Anybody_There.mp3');  
  
  AM.add("titleScreen", loadSound('assets/Is_Anybody_There.mp3'));
    // cryo chamber
  AM.add("creepyBackground", loadSound('assets/sounds/creepy-background.mp3'));
    // first room
  AM.add("buttonBeep", loadSound('assets/sounds/buttonPressBeep.mp3'));
  AM.add("successPinpad", loadSound('assets/sounds/successPinpad.mp3'));
  AM.add("failurePinpad", loadSound('assets/sounds/pinpadFailure.mp3'));

  AM.add("drawerOpen", loadSound('assets/sounds/drawerOpen.mp3'));
  AM.add("drawerClose", loadSound('assets/sounds/drawerClose.mp3'));
  AM.add("drawerLocked", loadSound('assets/sounds/drawerLocked.mp3'));
  AM.add("door-lock", loadSound('assets/sounds/door-lock.mp3'));
  AM.add("doorOpen", loadSound('assets/sounds/doorOpen.mp3'));
  AM.add("technoLoop", loadSound('assets/sounds/technoLoop.mp3'));
  AM.add("startGame", loadSound('assets/sounds/startGame.mp3'));
  AM.add("cryoLoop", loadSound('assets/sounds/cryoLoop.mp3'));
    //sounds added recently
  AM.add("doorLock", loadSound('assets/sounds/doorLock.mp3'));
  AM.add("lockBreak", loadSound('assets/sounds/lockBreak.mp3'));
  AM.add("wireConnect", loadSound('assets/sounds/wireConnect.mp3'));
  AM.add("allWires", loadSound('assets/sounds/allWires.mp3'));
  AM.add("componentGood", loadSound('assets/sounds/componentGood.mp3'));
  AM.add("componentBad", loadSound('assets/sounds/componentBad.mp3'));
  AM.add("electricDeath", loadSound('assets/sounds/electricDeath.mp3'));
  AM.add("fixElectronic", loadSound('assets/sounds/fixElectronic.mp3'));
  AM.add("reactorZap", loadSound('assets/sounds/reactorZap.mp3'));
  AM.add("reactorExplosion", loadSound('assets/sounds/reactorExplosion.mp3'));
  AM.add("checkpoint", loadSound('assets/sounds/checkpoint.mp3'));
  AM.add("reactorFix", loadSound('assets/sounds/reactorFix.mp3'));
  AM.add("goodArrow", loadSound('assets/sounds/goodArrow.mp3'));
  AM.add("goodArrow2", loadSound('assets/sounds/goodArrow2.mp3'));
  AM.add("badArrow", loadSound('assets/sounds/badArrow.mp3'));
  AM.add("reactorRestart", loadSound('assets/sounds/reactorRestart.mp3'));
  AM.add("reactorBeep", loadSound('assets/sounds/reactorBeep.mp3'));
  AM.add("airPressure", loadSound('assets/sounds/airPressure.mp3'));
  AM.add("tempWarning", loadSound('assets/sounds/tempWarning.mp3'));
  AM.add("tempGood", loadSound('assets/sounds/tempGood.mp3'));
  AM.add("tempFixed", loadSound('assets/sounds/tempFixed.mp3'));
  //background sounds
  AM.add("reactorLoop", loadSound('assets/sounds/reactorLoop.mp3'));
  AM.add("mapLoop", loadSound('assets/sounds/mapLoop.mp3'));
  AM.add("lifeSupportLoop", loadSound('assets/sounds/lifeSupportLoop.mp3'));
  AM.add("ambientSpace", loadSound('assets/sounds/ambientSpace.mp3'));
    
    


  // botanical room
  AM.add("contagionAlarm", loadSound('assets/sounds/contagionAlarm.mp3'));

  gameFont     = loadFont('assets/font/PressStart2P-Regular.ttf');
  terminusFont = loadFont('assets/font/terminus.ttf');

  // Load start screen music
//ref | switch to audio manager
  
  // Load henry password sequence assets
  henryAudio = loadSound('assets/secrets/henry/connectionTerminated.mp3');
  henryImage = loadImage('assets/secrets/henry/connectionTerminated.jpg');
}

function setup() { //ref ? only ran once ever?
  fit16x9();
  userStartAudio(); 
  VM.updateUnits(); // compute VM.U / VM.V now that width/height exist
  canvas.oncontextmenu = () => false; // Disable browser right-click menu

  const savedState = localStorage.getItem('currentGameState');

  if(savedState){
    const savedData = JSON.parse(savedState);
    console.log(`saved state found...Current death count: ${savedData.deaths || 0}`);
    GS = new GameState(); //ref
    // Load the saved death count into the new GameState object
    GS.deaths = savedData.deaths || 0;
  } else {
    console.log("no state found, creating new state...");
    GS = new GameState(); //ref | basically do this no matter what.
  }

  // insert checkers here
  GS.checkFor("Ended", () => { return GS.is("Game Complete") || GS.is("Timer Up") || GS.is("Player Died"); })

  GS.setString("You Have Survived, the Spaceship is saved! Thank you for Playing!")

  R = new Renderer(); //ref

  startScreen = new StartScreenView(() => {
    if (startScreenMusic && startScreenMusic.isPlaying()) startScreenMusic.stop(); //ref | change to audio manager?
    R.selfRemove(startScreen);

    screenTimer = new ScreenTimer(() => { });
    R.add(screenTimer, 1);

    setupWorld(); // ⬅️ new

    GS.set("Game Started"); // for General Use
    GS.set("Show AI Startup"); // for AI Messages
  });  //ref | look into wrapping with end

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
    endScreen = new EndScreenView(GS.is("Game Complete")); //update endscreen state
  }

  if(GS.is("Ended")) {
    ended = true;
    /* -- Implement Tracking Deaths across restarts -- */
    //if(!GS.getSolved()) {
      //GS.incrementDeaths();
    //}

    if(!endscreenShown) {
      R.remove(screenTimer)
      R.remove(secondaryTimer)

      R.add(endScreen, 999);
      endscreenShown = true;
      AI.cleanup();
    }
  }

  if(GS.is("Show AI Startup")) {
    bootupAI();
  }
  
  IM.update(dt)
  R.update(dt);
  AI.update(dt);
  R.draw();
}

//block to handle initial AI startup Text
function bootupAI() {
  let string  = '>_  H.A.L. - Heuristically Programmed Algorithmic Computer v 3.2.1 \n>_  INITIATING SECURE BOOT PROTOCOL... \n>_  NETWORK CONNECTION: SECURE';
  AI.addText(string);
  string  = '>_  LOADING VESSEL CONDITION... \n>_  MULTIPLE SYSTEMS CRITICAL \n>_  FAILURE IMMINENT - FIX IMMEDIATELY';
  AI.addText(string);
  GS.unset("Show AI Startup");
} //ref | place somewhere else?

function windowResized() {
  fit16x9();
  VM.updateUnits();
}

function mousePressed() {
  // Dispatch mouse in 16:9 unit space
  const mouse = VM.mouse();
  if (!VM.insideUnits(mouse)) return;
  // console.log(m.x, m.y);
  if (R) R.dispatch('mousePressed', mouse);
}

function mouseDragged() {
  const mouse = VM.mouse();
  if (!VM.insideUnits(mouse)) return;
  R.dispatch('mouseDragged', mouse);
}

function mouseReleased() {
  const mouse = VM.mouse();
  if (!VM.insideUnits(mouse)) return;
  R.dispatch('mouseReleased', mouse);
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

  MINIMAP = new MinimapOverlay(WORLD);
  R.add(MINIMAP, 50);

  const startRoom = new ViewManager();
  const breakerRoom = new ViewManager();
  const cryoRoom = new ViewManager();
  const lifeSupportRoom = new ViewManager();
  const reactorRoom = new ViewManager();
  const botanicalRoom = new ViewManager();
  const mapRoom = new ViewManager();
  
  // --- Room A (Start Room | start here) ---
  const computerView = new ComputerView(); // start view (index 0)
  const boxesView    = new BoxesView([ // is a sliderdoorview derived class takes you to map room (6)
    {x:12, y:2.5, scale:0.8,
    targetRoom: 6,         // <-- map room
    targetViewIndex: 0,    // 
    lockedCondition : () => GS.is("Pin Solved")
    }
  ]);
  const fcView       = new FileCabinetView();

  // Door in start room -> breaker room (index 1), land on view 0
  const sdStartToBreaker = new SlidingDoorView([{
    x:12, y:2.5, scale:0.8,
    targetRoom: 1,         // <-- breaker room
    targetViewIndex: 0,    //
    lockedCondition : () => GS.is("Pin Solved")
  }]);

  
  startRoom.addView(computerView);  // index 0 (start)
  startRoom.addView(boxesView);
  startRoom.addView(fcView);
  startRoom.addView(sdStartToBreaker);
  sdStartToBreaker.setRoom?.(startRoom);
  
  // --- Room B (Breaker Room)

  const repairView = new RepairView();
  const wiresView = new WiresView();
  const LifeSupportDoorView = new EastWall();

  // Door in breaker room -> back to start room (index 1), land on doorView (view 4)
  const sdBreakerToStart = new SlidingDoorView([{
    x:6, y:1.5, scale:2,
    targetRoom: 0,        // <-- to start room
    targetViewIndex: 4,
    lockedCondition : () => true
  }],SM.get("northWallBreaker"));

  breakerRoom.addView(repairView);
  breakerRoom.addView(wiresView);
  breakerRoom.addView(sdBreakerToStart);
  breakerRoom.addView(LifeSupportDoorView);
  sdBreakerToStart.setRoom?.(breakerRoom);

  // --- Room C (Cryo Chamber Room) ---
  //class PlainView extends View { constructor(r,g,b,label){ super(r,g,b,label); } }

  const windowView = new SpaceWindowView();
  const cryoView1 = new CryoView(0);
  const cryoView2 = new CryoView(1);
  const cryoView3 = new CryoView(2);
  const cryoView4 = new CryoView(3); 

  // Door in Room C -> back to breaker room (index 1), land on wireView (view 1)
  const sdCryoToBreaker = new SlidingDoorView([{
    x:12, y:2, scale:1,
    targetRoom: 1,        // <-- to breaker room
    targetViewIndex: 1,
    lockedCondition : () => true
  }],SM.get("blankCryo"));

  cryoRoom.addView(cryoView1);
  cryoRoom.addView(cryoView2);
  cryoRoom.addView(windowView);
  cryoRoom.addView(cryoView3);
  cryoRoom.addView(cryoView4);
  cryoRoom.addView(sdCryoToBreaker);
  sdCryoToBreaker.setRoom?.(cryoRoom);

  // --- Room D (Life Support Room) ---
  const oxygenPressureView = new OxygenPressureView();
  const temperatureView    = new TemperaturePuzzleView();
  const lifeSupportView = new LifeSupportView();
  const sdLifeToBreaker = new SlidingDoorView([{
    x:2, y:1.5, scale:1,
    targetRoom: 1,        // back to breaker room
    targetViewIndex: 3,   // eastWallView is at index 2
    lockedCondition : () => true
  }],SM.get("southWallSupport"));

  lifeSupportRoom.addView(oxygenPressureView);
  lifeSupportRoom.addView(temperatureView);
  lifeSupportRoom.addView(sdLifeToBreaker);
  lifeSupportRoom.addView(lifeSupportView);
  sdLifeToBreaker.setRoom?.(lifeSupportRoom);
  
  // --- Room E (Reactor Room) ---
  const operationReactorView = new OperationReactorPuzzleView();
  const restartReactorView = new RestartReactorView();
  const reactorStartup = new ReactorStartupView();  
  const sdReactorToBreaker = new SlidingDoorView([{ // back to breaker
    x:12, y:2.2, scale:0.8,
    targetRoom: 1,         // <-- breaker room
    targetViewIndex: 0, 
    lockedCondition : () => true
  }], SM.get("southWallReactor"));

  reactorRoom.addView(reactorStartup);
  reactorRoom.addView(operationReactorView);
  reactorRoom.addView(restartReactorView);
  reactorRoom.addView(sdReactorToBreaker);
  //reactorRoom.addView(sdReactorToBotanical); -> removed door to botanical temporarily
  
  // --- Room F (Botanical Room) ---
  const plantsView = new PlantsView();
  const plantsView2 = new PlantsView2();
  // const sdBotanicalToReactor = new SlidingDoorView([{ // to nuclear
  //   x:12, y:2.5, scale:0.8,
  //   targetRoom: 4,         // <-- nuclear index
  //   targetViewIndex: 0, 
  //   lockedCondition : () => {true}
  // }], SM.get("MetalWall"));
  const sdBotanicalToReactor = new PlantsView3([{ // has door to nuclear
    x:12, y:2.8, scale:0.8,
    targetRoom: 4,         // <-- nuclear index
    targetViewIndex: 0, 
    lockedCondition : () => !GS.is('BotanicalQuarantine')
  }]);
  const synthesisView = new SynthesisView();

  botanicalRoom.addView(plantsView);
  botanicalRoom.addView(plantsView2);
  botanicalRoom.addView(sdBotanicalToReactor);
  botanicalRoom.addView(synthesisView);
  sdBotanicalToReactor.setRoom(botanicalRoom);

  // --- Room G (Map Room) ---
  const shipMapView = new ShipMapView();
  const mapFiller = new PuzzleClueView();
  const mapFiller2 = new PuzzleClueView();

  const sdMapToStart = new SlidingDoorView([{
    x:12, y:2.5, scale:0.8,
    targetRoom: 0,         // <-- start room
    targetViewIndex: 0,    //
    lockedCondition : () => true
  }], SM.get("MetalWall"));

  mapRoom.addView(shipMapView);
  mapRoom.addView(mapFiller);
  mapRoom.addView(sdMapToStart);
  mapRoom.addView(mapFiller2);

  // register rooms (A=0, B=1, C=2) and let WORLD receive key events
  WORLD.addRoom(startRoom);   // index 0
  WORLD.addRoom(breakerRoom);   // index 1
  WORLD.addRoom(cryoRoom);   // index 2
  WORLD.addRoom(lifeSupportRoom);   // index 3
  WORLD.addRoom(reactorRoom);   // index 4
  WORLD.addRoom(botanicalRoom);   // index 5
  WORLD.addRoom(mapRoom);   // index 6
  R.add(WORLD, 1000);
}
