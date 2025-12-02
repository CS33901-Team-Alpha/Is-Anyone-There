import { TerminalModel } from '../models/TerminalModel.js';
import { TerminalView } from '../views/firstRoom/TerminalView.js';

export class TerminalController {
    constructor(onExit = () => {}, onFullCleanup = () => {}) {
        this.onExit = onExit;
        this.onFullCleanup = onFullCleanup;

        this.model = new TerminalModel();
        this.view = new TerminalView();
        this._registerCommands();

        window.activeInterface = "Terminal";

        this._closeBtn = new Button(13.3, 1.1, 0.6, () => {
            this.close();
        });
        R.add(this._closeBtn, 11);
    }

    close() {
        if (typeof this.onExit === "function") {
            this.onExit();
        }

        R.selfRemove(this._closeBtn);
        R.remove(this);

        window.activeInterface = null;
    }

    forceEndGame() {
        if (typeof this.onFullCleanup === "function") {
            this.onFullCleanup();
        }

        R.selfRemove(this._closeBtn);
        R.remove(this);

        window.activeInterface = null;

        if (typeof GS !== "undefined" && GS.set) {
            GS.set("Game Complete");
            GS.set("Ended");
        }

        if (typeof WORLD !== "undefined" && WORLD.gotoRoom) {
            WORLD.gotoRoom(3, 0);
        }
    }

    onRemove() {
        window.activeInterface = null;
        R.remove(this._closeBtn);
    }
 
    registerCommand(name, fn) {
        this.model.registerCommand(name, fn);
    }

    runCommand(line) {
        this.model.runCommand(line);
    }

    print(text) {
        this.model.print(text);
    }

    _echoInput() {
        this.model.print(this.model.input);
    }

    _handleSubmit() {
        this._echoInput();
        this.model.runCommand(this.model.input);
        this.model.input = "";
    }

    keyPressed() {
        if (keyCode === ENTER || keyCode === RETURN) {
            this.model.print(this.model.input);
            this.model.runCommand(this.model.input);
            this.model.input = "";
        } else if (keyCode === BACKSPACE) {
            this.model.input = this.model.input.slice(0, -1);
        } else if (typeof key === "string" && /^[\x20-\x7E]$/.test(key)) {
            this.model.input += key;
        }
    }

    draw() {
        this.view.render(this.model.getState());
    }
}