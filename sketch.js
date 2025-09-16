let R;

// let v1, v2, v3, v4;
// let room;
let monitor;

function preload() {
  // Register all models you want to use
  importSprites.define([
    { name: "monitor", type: "model", path: "assets/object/monitorIAT.obj", normalize: true }
  ]);

  // Actually load them
  importSprites.preloadAll();
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    R = new Renderer();
    // setupRoom();

    // Create a sprite instance
    monitorSprite = importSprites.create("monitor", {
        x: -width/2 + 50,   // move left (–X) + a margin
        y: -height/2 + 50,  // move up (–Y) + a margin
        z: 0,
        scale: 0.5,
        rx: PI,   // keep upright
        spinY: 1
    });
    R.add(monitorSprite, monitorSprite.layer);
}


  

function draw() {
    background(20);
    const dt = deltaTime / 1000;
    R.update(dt);
    R.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    R.dispatch("mousePressed");
    console.log("clicked! : ", mouseX, mouseY);
}
function keyPressed() {
    R.dispatch("keyPressed");
}

function mouseReleased() {
    R.dispatch("mouseReleased");
}

function setupRoom() {
    // v1 = new EventView();
    // v2 = new TimerView();
    // v3 = new MoveView();
    // v4 = new View(238, 130, 238, "Room 4");

    // room = new ViewManager();
    // room.addView(v1);
    // room.addView(v2);
    // room.addView(v3);
    // room.addView(v4);
    // R.add(room);
}