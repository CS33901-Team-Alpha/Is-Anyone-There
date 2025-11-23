import { TerminalModel } from '../models/TerminalModel.js';
import { TerminalView } from '../views/firstRoom/TerminalView.js';

export class TerminalController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this._registerCommands();
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

    _registerCommands() {
        this.model.registerCommand("help", () => {
            this.model.print("Available commands: help, clear");
        });
        this.model.registerCommand("clear", () => {
            this.model.history = [];
        });
    }
}