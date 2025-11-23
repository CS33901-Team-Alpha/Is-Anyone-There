import { loadSprites, SM } from "./src/core/SpriteManager.js";
import { Renderer } from "./src/core/Renderer.js";

import { TerminalModel } from './src/models/TerminalModel.js';
import { TerminalView } from './src/views/firstRoom/TerminalView.js';
import { TerminalController } from './src/controllers/TerminalController.js';

import { FileCabinetController } from './src/controllers/FileCabinetController.js';

let cnv;
let R;
let terminalMVC;
let fileCabinetMVC;

// ------------------------
// Canvas setup
// ------------------------
function fit16x9() {
    const k = Math.min(windowWidth / 16, windowHeight / 9);
    const W = 16 * k;
    const H = 9 * k;

    if (!cnv) cnv = createCanvas(W, H);
    else resizeCanvas(W, H);

    cnv.position((windowWidth - W) / 2, (windowHeight - H) / 2);
}

// ------------------------
// p5.js preload
// ------------------------
function preload() {
    console.log("Preloading sprites...");
    loadFirstRoomSprites(); // loads first room sprites
    loadSprites();          // loads general sprites
}

// ------------------------
// p5.js setup
// ------------------------
window.setup = function () {
    fit16x9();
    VM.updateUnits();
    canvas.oncontextmenu = () => false; // Disable browser right-click menu

    R = new Renderer();

    // Terminal MVC
    terminalMVC = {
        model: new TerminalModel(),
        view: new TerminalView(),
        ctrl: null,
        draw() {
            if (this.ctrl) this.ctrl.draw();
        },
        keyPressed() {
            if (this.ctrl) this.ctrl.keyPressed();
        }
    };
    terminalMVC.ctrl = new TerminalController(terminalMVC.model, terminalMVC.view);
    R.add(terminalMVC, 1000);

    // // File Cabinet MVC
    // fileCabinetMVC = new FileCabinetController();
    // fileCabinetMVC.initSprites();
    // fileCabinetMVC.onEnter();
    // R.add(fileCabinetMVC, 900);

};

// ------------------------
// p5.js draw
// ------------------------
window.draw = function () {
    VM.updateUnits();
    VM.updateMouseFromP5();
    background(20);

    if (R) {
        R.update(deltaTime / 1000);
        R.draw();
    }
};

// ------------------------
// Input events
// ------------------------
window.keyPressed = () => {
    if (terminalMVC && terminalMVC.keyPressed) terminalMVC.keyPressed();
};

window.mousePressed = () => {
    if (fileCabinetMVC) fileCabinetMVC.mousePressed(VM.mouse());
};

window.windowResized = function () {
    fit16x9();
    VM.updateUnits();
};
