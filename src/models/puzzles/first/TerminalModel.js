class TerminalModel {
    constructor(){
        this.input = ""; 
        this.history = []; 
        this.maxLines = 8;
        this.commands = {}; 
        
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

export default TerminalModel;