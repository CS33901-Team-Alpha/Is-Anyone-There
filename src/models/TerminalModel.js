export class TerminalModel {
    constructor(){
        this.input = ""; 
        this.history = []; 
        this.maxLines = 8;
        this.commands = {}; 
        this._registerCommands();
    }

    getState() {
        return {
            input: this.input,
            history: [...this.history],
            maxLines: this.maxLines
        };
    }

    print(text) {
        this.history.push(text);
        if (this.history.length > 200) {
            this.history.shift();
        }
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
            if (this._onForceEndGame) this._onForceEndGame();
        });

        this.registerCommand("lose", () => {
            this.print("FORCING MISSION FAILURE...");
            if (typeof GS !== "undefined" && GS.set) {
                GS.set("Player Died");
            }
        });

        this.registerCommand("*henry", () => {
            this.print("CONNECTION: HENRY CHANNEL OPEN");

            const henrySequence = new HenryPasswordSequence();
            R.add(henrySequence, 100);

            try {
                if (typeof henrySequence.startAudio === "function") {
                henrySequence.startAudio();
                }
            } catch (_) {}
            if (this._onCloseRequested) this._onCloseRequested();
        });

        this.registerCommand("*lab", () => {
            this.print("ACCESS: LAB SECURITY OVERRIDE ACCEPTED");

            if (typeof GS !== "undefined" && GS.set) {
                GS.set("Life Support Access Granted");
            }

            if (this._onCloseRequested) this._onCloseRequested();
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
                GS.set("fixedElectricalComponent");
            }
            });

            this.registerCommand("unlock-map", () => {
            GS.set("Minimap Unlocked");
            this.print("Map Unlocked");
        });
    }

    registerCommand(name, fn) {
        // make commands case-insensitive
        this.commands[name.toLowerCase()] = fn;
    }

    runCommand(line) {
        // first word is the command
        const firstSpace = line.indexOf(" ");
        let cmdName, args;
        if (firstSpace === -1) {
        cmdName = line;
        args = "";
        } else {
        cmdName = line.slice(0, firstSpace);
        args = line.slice(firstSpace + 1);
        }

        cmdName = cmdName.toLowerCase();

        const handler = this.commands[cmdName];
        if (handler) {
            handler(args);
        } else {
            this.print(`Unknown command: ${cmdName} (type "help")`);
        }
    }
}