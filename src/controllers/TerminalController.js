class TerminalController {
    constructor(model, view){
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
        const state = this.model.getState();
        this.view.render(state);
    }

    _registerCommands() {
        this.registerCommand("help", () => {
        this.print("Available commands:");
        this.print(Object.keys(this.commands).join(", "));
        });

        this.registerCommand("clear", () => {
        this.history = [];
        this.print("(screen cleared)");
        });

        this.registerCommand("win", () => {
        this.print("FORCING MISSION SUCCESS...");
        this.forceEndGame();
        });

        this.registerCommand("lose", () => {
        this.print("FORCING MISSION FAILURE...");
        GS.set("Player Died");
        });

        this.registerCommand("*henry", () => {
        this.print("CONNECTION: HENRY CHANNEL OPEN");

        const henrySequence = new HenryPasswordSequence();
        R.add(henrySequence, 100); 

        
        try {
            if (
            typeof henrySequence.startAudio === "function"
            ) {
            henrySequence.startAudio();
            }
        } catch (_) {
        }

        this.close();
        });

        this.registerCommand("*lab", () => {
        this.print("ACCESS: LAB SECURITY OVERRIDE ACCEPTED");

        if (typeof GS !== "undefined" && GS.set) {
            GS.set("Life Support Access Granted");
        }

        this.close();
        });

        this.registerCommand("*root", () => {
        this.print("PRIVILEGE ESCALATION: ROOT ACCESS GRANTED");

        if (typeof GS !== "undefined" && GS.set) {
            GS.set("Life Support Access Granted");
            GS.set("Pin Solved");
            GS.set("Wires Solved");
            GS.set("regulateOxygenPuzzleSolved");
            GS.set("regulateTempPuzzleSolved");
            GS.set("Root Access Granted");
            GS.set('fixedElectricalComponent')
        }
        });

        this.registerCommand("compass", () => {
        this.print("This is a test");
        });

        this.registerCommand("unlock-map", () => {
            GS.set("Minimap Unlocked");
            this.print("Map Unlocked");
        });
    }
}