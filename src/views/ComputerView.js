class Terminal {
  constructor(onExit = () => {}, onFullCleanup = () => {}) {
    this.onExit = onExit;
    this.onFullCleanup = onFullCleanup;
    this.input = "";
    this.history = [];
    this.maxLines = 8;

    // claim input focus
    window.activeInterface = "Terminal";

    // spawn close button
    this._closeBtn = new Button(13.3, 1.1, 0.6, () => {
      this.close();
    });
    R.add(this._closeBtn, 11);

    // command registry
    this.commands = {};
    this._registerCommands();
  }

  close() {
    if (typeof this.onExit === "function") {
      this.onExit();
    }

    R.selfRemove(this._closeBtn);
    R.remove(this);

    window.activeInterface = null;
  }

  // force end for "win"
  forceEndGame() {
    if (typeof this.onFullCleanup === "function") {
      this.onFullCleanup();
    }

    // remove terminal
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

  static resetInterface() {
    console.log("Resetting terminal interface state");
    window.activeInterface = null;
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

  print(text) {
    this.history.push(text);
    if (this.history.length > 200) {
      this.history.shift();
    }
  }

  _echoInput() {
    this.print(this.input);
  }

  keyPressed() {
    if (window.activeInterface !== "Terminal") {
      return false;
    }

    // arrow keys = normal close
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      this.close();
      return true;
    }

    // ENTER submits
    if (keyCode === ENTER || keyCode === RETURN) {
      this._handleSubmit();
      return true;
    }

    // BACKSPACE edits
    if (keyCode === BACKSPACE) {
      this.input = this.input.slice(0, -1);
      return true;
    }

    // printable ASCII only
    if (typeof key === "string" && /^[\x20-\x7E]$/.test(key)) {
      this.input += key;
      return true;
    }

    return false;
  }

  _handleSubmit() {
    // push the typed text (like a real terminal)
    this._echoInput();

    // run that string as a command
    this.runCommand(this.input);

    // clear input field
    this.input = "";
  }

  update(dt) {}

  draw() {
    const u = VM.u();
    const v = VM.v();

    push();

    // monitor background / frame
    const screenSprite = SM.get("screen");
    if (screenSprite && screenSprite.src) {
      image(screenSprite.src, 2 * u, 1 * v, 12 * u, 7 * v);
    } else {
      fill(0);
      stroke(128);
      strokeWeight(2);
      rect(2 * u, 1 * v, 12 * u, 7 * v, 10);
    }

    // header bar
    noStroke();
    fill(60);
    rect(2 * u, 1 * v, 12 * u, 0.8 * v, 10);

    // header text w/ glow
    textAlign(LEFT, CENTER);
    textFont(terminusFont);
    textSize(0.45 * v);

    fill(0, 255, 0, 150);
    text("Terminal", 2.3 * u + 1, 1.4 * v + 1);

    fill(0, 255, 0);
    text("Terminal", 2.3 * u, 1.4 * v);

    // scanlines
    stroke(0, 0, 0, 30);
    strokeWeight(1);
    for (let i = 0; i < 7 * v; i += 4) {
      line(2 * u, 1 * v + i, 14 * u, 1 * v + i);
    }
    noStroke();

    // terminal log
    const left = 2.3 * u;
    const top = 1.9 * v;
    const lineH = 0.6 * v;

    textAlign(LEFT, TOP);
    textFont(terminusFont);
    textSize(0.4 * v);

    const startIndex = Math.max(0, this.history.length - this.maxLines);
    let y = top;

    for (let i = startIndex; i < this.history.length; i++) {
      const lineText = "> " + this.history[i];

      // glow
      fill(0, 255, 0, 100);
      text(lineText, left + 1, y + 1);

      // body
      fill(0, 255, 0);
      text(lineText, left, y);

      y += lineH;
    }

    // input row + blinking cursor
    const cursor = frameCount % 60 < 30 ? "_" : " ";
    const inputLine = "> " + this.input + cursor;

    fill(0, 255, 0, 100);
    text(inputLine, left + 1, y + 1);

    fill(0, 255, 0);
    text(inputLine, left, y);

    pop();
  }
}

class PinButton extends Button {
    constructor(x, y, size, val, onClick = () => {}) {
        super(x, y, size, onClick);
        this.x = x;
        this.y = y;
        this.size = size;
        this.val = val;
    }

    draw() {
        //super.draw();
        const u = VM.u();
        const v = VM.v();
        
        push();
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(this.size * 0.6 * v);
        const cx = (this.x + this.size / 2) * u;
        const cy = (this.y + this.size / 2) * v;
        text(String(this.val), cx, cy);
        pop();
    }
}

class Pinpad {
    constructor( onExit = () => {}) {
        this.code = [];
        this.onExit = onExit;
        this.label = "";
        this.pass = '749'; // based on RGB pattern of clues
        this.isProcessing = false;
        this.feedbackColor = null; // null, 'green', or 'red'
        
        // Mark interface as active
        window.activeInterface = 'Pinpad';
        
        this._exitBtn = new Button(11.2, 1.4, 0.6, (self) => {
            // Clean up pinpad interface first
            R.selfRemove(self);
            this.pinButtons.forEach((obj) => {
                R.remove(obj);
            });
            R.remove(this);
            
            // Clear active interface flag and call onExit callback
            window.activeInterface = null;
            this.onExit();
        });
        R.add(this._exitBtn, 15); // Higher z-index to render on top

        this.pinButtons = [];

        // digits 1–9
        for (let i = 0; i < 9; ++i) {
            const col = i % 3;                 // 0,1,2
            const row = Math.floor(i / 3);     // 0,1,2
            const val = i + 1;

            const btn = new PinButton(
                5.85 + col * 1.75, 
                3.4 + row * 1.5, 
                0.9, 
                val,
                () => {
                    if (this.isProcessing) return; // Prevent spamming

                    // play sound
                    AM.play('buttonBeep')

                    this.label += val;
                    if (this.label.length === 3) {
                        this.isProcessing = true;
                        const isCorrect = this.label === this.pass;
                        this.feedbackColor = isCorrect ? 'green' : 'red';
                        console.log(isCorrect ? "Correct Pin!" : "Incorrect Pin!");
                        setTimeout(() => {
                            this.label = '';
                            this.feedbackColor = null;
                            this.isProcessing = false;
                            if(isCorrect) {
                                GS.set("Pin Solved");

                                AM.play('successPinpad')
                            }
                            else{
                                AM.play('failurePinpad')
                            }
                        }, 500);
                    }
                }
            );

            this.pinButtons.push(btn);
            R.add(btn, 10);
        }

    }

    draw() {
        const u = VM.u();
        const v = VM.v();

        push();
        let pinPadBig = SM.get("pinpad");
        if (pinPadBig && pinPadBig.src) {
            image(pinPadBig.src, 5 * u, 1.4 * v, 6 * u, 7 * v);
        } else {
        }
        
        // Set text color based on feedback
        if (this.feedbackColor === 'green') {
            fill(0, 255, 0); // Green for correct
        } else if (this.feedbackColor === 'red') {
            fill(255, 0, 0); // Red for incorrect
        } else {
            fill(255, 255, 255); // White for normal
        }
        
        textAlign(LEFT);
        textSize(1 * v);
        textFont(terminusFont);
        text(this.label, 5.8 * u, 2.1 * v);

        pop();
    }

    update(dt) {

    }

    keyPressed() {
        // Ensure this pinpad is the active interface
        if (window.activeInterface !== 'Pinpad') {
            return false; // Don't handle the event
        }

        // Arrow keys exit the pinpad
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
            // Clean up pinpad interface first
            R.selfRemove(this._exitBtn);
            this.pinButtons.forEach((obj) => {
                R.remove(obj);
            });
            R.remove(this);
            
            // Clear active interface flag and call onExit callback
            window.activeInterface = null;
            this.onExit();
            return true; // Event handled
        }

        if (this.isProcessing) return false; // Prevent input during processing
        
        if (keyCode === BACKSPACE) {
            this.label = this.label.slice(0, -1);
            return true; // Event handled
        } else if (this.label.length < 3 && /^[0-9]$/.test(key)) {
            this.label += key;
            if (this.label.length === 3) {
                this.isProcessing = true;
                const isCorrect = this.label === this.pass;
                this.feedbackColor = isCorrect ? 'green' : 'red';
                console.log(isCorrect ? "Correct Pin!" : "Incorrect Pin!");
                setTimeout(() => {
                    this.label = '';
                    this.feedbackColor = null;
                    this.isProcessing = false;
                }, 500);
            }
            return true; // Event handled
        }

        return false; // Event not handled
    }

}

class ComputerView extends View {
    constructor() {
        super();
        
        this.background = SM.get("NorthWall");
        // Fills the screen
        this.background.setSize(16, 9);
    
        this.pinpad = SM.get("pinpad");
        this.pinpad.setScale(0.5);
        this.pinpad.setPos(12.5, 6);

        this.terminalHighlight = new HighlightEvent(
            2.33, 0.25, 10.1, 6.6, 255, 255, 0,
            (self) => {
                // Don't open terminal if another interface is active
                if (window.activeInterface) {
                    return;
                }
                
                R.selfRemove(self);
                R.remove(this.pinpadHighlight);
                R.add(new Terminal(
                    () => {
                        setTimeout(() => {
                            R.add(this.terminalHighlight);
                            R.add(this.pinpadHighlight);
                        }, 100);
                    },
                    () => {
                        R.remove(this.terminalHighlight);
                        R.remove(this.pinpadHighlight);
                        R.remove(this.pinpad);
                    }
                ));
            }
        );


        this.pinpadHighlight = new HighlightEvent(12.5, 6, 1.3, 1.85, 255, 255, 0, (self) => {
            // Don't open pinpad if another interface is active
            if (window.activeInterface) {
                return;
            }
            
            console.log("Pinpad");
            R.selfRemove(self);
            R.remove(this.terminalHighlight);

            R.add(new Pinpad(() => {
                // Add a small delay before re-enabling highlights to prevent immediate re-triggering
                setTimeout(() => {
                    R.add(this.terminalHighlight);
                    R.add(this.pinpadHighlight);
                }, 100);
            }));
            
        });
    }

    onEnter() {
        
        if (!AM.isLooping("startGame")) {
            AM.stopAll()
            AM.loop("startGame");      
        }
        R.add(this.background);
        R.add(this.pinpad);
        R.add(this.terminalHighlight);
        R.add(this.pinpadHighlight);
    }

    onExit() {
        R.remove(this.background);
        R.remove(this.pinpad);
        this.pinpad.label = ''; // reset pinpad input on exit
        R.remove(this.terminalHighlight);
        R.remove(this.pinpadHighlight);
    }
}
