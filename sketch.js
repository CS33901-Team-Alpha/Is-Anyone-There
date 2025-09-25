let R;

let fcView, otherView;
let room;
// just for temporary development debugging
let backgroundFC;

let startScreen; 
let showStartScreen = true; 

let gameFont; // could be changed, just adding to make startScreen look better

function preload() { 
    gameFont = loadFont('assets/font/PressStart2P-Regular.ttf')
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    R = new Renderer();

     // for start screen 
    startScreen = new StartScreen(() => {
        showStartScreen = false; 
        setupRoom();

        textFont('sans-serif') // resetting font for the game itself 
    });


    
    R.add(new ScreenTimer(), 99);
}

function draw() {
    background(20);
    const dt = deltaTime / 1000;

    if(showStartScreen){
        startScreen.update(dt);
        startScreen.draw(); 
    } else {
        R.update(dt);
        R.draw()
    }



}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
      if(showStartScreen) {
        startScreen.mousePressed();
    } else { 
    R.dispatch("mousePressed")
    }
    console.log("clicked! : ", mouseX, mouseY);
}
function keyPressed() {
    if(!showStartScreen){
    R.dispatch("keyPressed");
    }
}

// function mousePressed() {
//     if(showStartScreen) {
//         startScreen.mousePressed();
//     } else { 
//     R.dispatch("mousePressed")
//     }
// }
function mouseReleased() {
    if(!showStartScreen){
    R.dispatch("mouseReleased");
    }
}

function setupRoom() {
    fcView = new FileCabinetView(backgroundFC);
    v1 = new ComputerView();

    room = new ViewManager();
    room.addView(v1);
    room.addView(fcView);
    R.add(room);
}