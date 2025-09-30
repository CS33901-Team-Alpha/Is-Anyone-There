class Terminal {
  constructor(onExit = () => {}) {
    this.onExit = onExit;
    this.input = "";
    this.history = [];
    this.maxLines = 8;    // how many lines to show in the modal

    // Mark interface as active
    window.activeInterface = 'Terminal';

    this._closeBtn = new Button(13.3, 1.1, 0.6, (self) => {
      R.selfRemove(self);
      R.remove(this);
      window.activeInterface = null; // Clear active interface flag
      this.onExit();
    });
    R.add(this._closeBtn, 11);
  }

  draw() {
    const u = VM.u(), v = VM.v();

    push();
    // Draw the terminal background using the screen.webp image
    let screenSprite = SM.get("screen");
    if (screenSprite && screenSprite.src) {
        image(screenSprite.src, 2 * u, 1 * v, 12 * u, 7 * v);
    } else {
        // fallback: draw a black background if image not loaded
        fill(0); // Black background
        stroke(128); // Gray border instead of green
        strokeWeight(2);
        rect(2 * u, 1 * v, 12 * u, 7 * v, 10);
    }

    // Terminal header bar
    noStroke();
    fill(60); // Slightly lighter gray for header
    rect(2 * u, 1 * v, 12 * u, 0.8 * v, 10);
    
    // Terminal header text with green glow
    fill(0, 255, 0, 150); // Bright green with transparency for glow effect
    textAlign(LEFT, CENTER);
    textSize(0.45 * v);
    // Draw text multiple times for glow effect
    textFont(terminusFont);
    text("Terminal", (2.3) * u + 1, (1.4) * v + 1); // Offset for glow
    fill(0, 255, 0); // Bright green
    text("Terminal", (2.3) * u, (1.4) * v);

    const left = 2.3 * u;
    const top = (1.9) * v;
    const lh = 0.6 * v;

    // Add scan lines effect
    stroke(0, 0, 0, 30);
    strokeWeight(1);
    for (let i = 0; i < 7 * v; i += 4) {
        line(2 * u, (1 * v) + i, 14 * u, (1 * v) + i);
    }
    noStroke();

    const start = Math.max(0, this.history.length - this.maxLines);
    let y = top;
    textAlign(LEFT, TOP);
    textSize(0.4 * v); // Slightly smaller for retro look

    for (let i = start; i < this.history.length; i++) {
        // Draw text with glow effect
        fill(0, 255, 0, 100); // Glow
        text("> " + this.history[i], left + 1, y + 1);
        fill(0, 255, 0); // Main text
        text("> " + this.history[i], left, y);
        y += lh;
    }

    // Blinking Cursor with glow
    const cursor = frameCount % 60 < 30 ? "_" : " ";
    fill(0, 255, 0, 100); // Glow
    text("> " + this.input + cursor, left + 1, y + 1);
    fill(0, 255, 0); // Main text
    text("> " + this.input + cursor, left, y);

    pop();
  }

  update(dt) {}

  keyPressed() {
    // Arrow keys exit the terminal
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      R.selfRemove(this._closeBtn);
      R.remove(this);
      window.activeInterface = null; // Clear active interface flag
      this.onExit();
      return;
    }

    // Submit
    if (keyCode === ENTER || keyCode === RETURN) {
      //check if it starts with * and look through the list of passwords to see if it matches, case sensitive. if it does, run that command. else, check it for the list of regular commands, and if it matches, run it.
      // Check if it's a password command before adding to history
      if (this.input.startsWith('*')) {
        // Try to check password
        if (typeof checkPassword === 'function' && checkPassword(this.input)) {
          // Password was correct, close terminal and execute sequence
          R.selfRemove(this._closeBtn);
          R.remove(this);
          window.activeInterface = null;
          this.onExit();
          return;
        } else {
          // Invalid password, show error
          this.history.push(this.input);
          this.history.push("Invalid password");
        }
      } else {
        // Regular command, just add to history for now
        this.history.push(this.input);
      }
      
      // keep history bounded
      if (this.history.length > 200) this.history.shift();
      this.input = "";
      return;
    }

    // Backspace
    if (keyCode === BACKSPACE) {
      this.input = this.input.slice(0, -1);
      return;
    }

    // Accept only ASCII
    if (typeof key === "string" && /^[\x20-\x7E]$/.test(key)) {
      this.input += key;
    }
  }

  // Clean up if you ever remove it externally
  onRemove() {
    R.remove(this._closeBtn);
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
                                GS.Solved();
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
            return;
        }

        if (this.isProcessing) return; // Prevent input during processing
        
        if (keyCode === BACKSPACE) {
            this.label = this.label.slice(0, -1);
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
        }
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
                R.add(new Terminal(() => {
                    // Add a small delay before re-enabling highlights to prevent immediate re-triggering
                    setTimeout(() => {
                        R.add(this.terminalHighlight);
                        R.add(this.pinpadHighlight);
                    }, 100);
                }));
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