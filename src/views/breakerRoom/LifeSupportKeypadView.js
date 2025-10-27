class TextButton {
    constructor(x, y, size, text, onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = text;
        this.onClick = onClick;
        
        this.baseColor = color(80, 100, 120);
        this.hoverColor = color(100, 120, 140);
        this.textColor = color(255);
    }
    
    isMouseInBounds(mx, my) {
        const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
        return (
            m.x >= this.x &&
            m.x <= this.x + this.size &&
            m.y >= this.y &&
            m.y <= this.y + this.size
        );
    }
    
    update(dt) {}
    
    draw() {
        const u = VM.u();
        const v = VM.v();
        
        const c = this.isMouseInBounds() ? this.hoverColor : this.baseColor;
        
        push();
        // Draw button background
        stroke(150);
        strokeWeight(2);
        fill(c);
        rect(this.x * u, this.y * v, this.size * u, this.size * v, 0.1 * u);
        
        // Draw text
        fill(this.textColor);
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(0.2 * v);
        text(this.text, 
             (this.x + this.size/2) * u, 
             (this.y + this.size/2) * v);
        pop();
    }
    
    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
            return true;
        }
        return false;
    }
}

class LifeSupportKeypad {
    constructor(onExit = () => {}) {
        this.input = "";
        this.onExit = onExit;
        this.password = "LIFE"; // The required password
        this.isProcessing = false;
        this.feedbackColor = null; // null, 'green', or 'red'
        this.feedbackMessage = "";
        this.maxLength = 12; // Maximum input length
        
        // Mark interface as active
        window.activeInterface = 'LifeSupportKeypad';
        
        // Create exit button
        this._exitBtn = new Button(13.5, 1, 0.8, (self) => {
            this.cleanup();
        });
        R.add(this._exitBtn, 15);
        
        // Add background image
        this.background = SM.get("southWallBreaker");
        if (this.background) {
            this.background = this.background.clone();
            this.background.setPos(0, 0);
            this.background.setSize(16, 9);
            R.add(this.background, 5);
        }
        
        // Create letter buttons
        this.letterButtons = [];
        this.createLetterButtons();
        
        // Create control buttons
        this.createControlButtons();
    }

    createLetterButtons() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const buttonSize = 0.6;
        const spacing = 0.7;
        const startX = 2;
        const startY = 4;
        
        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            const col = i % 8; // 8 letters per row
            const row = Math.floor(i / 8);
            
            const x = startX + col * spacing;
            const y = startY + row * spacing;
            
            const btn = new TextButton(x, y, buttonSize, letter, () => {
                if (this.isProcessing) return;
                
                if (this.input.length < this.maxLength) {
                    this.input += letter;
                    this.feedbackMessage = "";
                    this.feedbackColor = null;
                    
                    // Play button sound if available
                    if (AM && AM.play) {
                        AM.play('buttonBeep');
                    }
                }
            });
            
            this.letterButtons.push(btn);
            R.add(btn, 12);
        }
    }
    
    createControlButtons() {
        // Clear button
        this.clearBtn = new TextButton(11, 4, 1, "CLEAR", () => {
            if (this.isProcessing) return;
            this.input = "";
            this.feedbackMessage = "";
            this.feedbackColor = null;
            
            if (AM && AM.play) {
                AM.play('buttonBeep');
            }
        });
        R.add(this.clearBtn, 12);
        
        // Backspace button
        this.backspaceBtn = new TextButton(11, 5, 1, "BACK", () => {
            if (this.isProcessing) return;
            this.input = this.input.slice(0, -1);
            this.feedbackMessage = "";
            this.feedbackColor = null;
            
            if (AM && AM.play) {
                AM.play('buttonBeep');
            }
        });
        R.add(this.backspaceBtn, 12);
        
        // Enter button
        this.enterBtn = new TextButton(11, 6, 1, "ENTER", () => {
            if (this.isProcessing) return;
            this.submitPassword();
        });
        R.add(this.enterBtn, 12);
    }

    cleanup() {
        // Clean up interface
        R.selfRemove(this._exitBtn);
        if (this.background) {
            R.remove(this.background);
        }
        
        // Remove letter buttons
        this.letterButtons.forEach(btn => R.remove(btn));
        
        // Remove control buttons
        R.remove(this.clearBtn);
        R.remove(this.backspaceBtn);
        R.remove(this.enterBtn);
        
        R.remove(this);
        
        // Clear active interface flag and call onExit callback
        window.activeInterface = null;
        this.onExit();
    }

    draw() {
        const u = VM.u();
        const v = VM.v();

        push();
        
        // Draw keypad panel overlay
        fill(40, 40, 60, 200);
        stroke(100);
        strokeWeight(4);
        rect(1.5 * u, 1 * v, 13 * u, 7 * v);
        
        // Draw title
        fill(200);
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(0.4 * v);
        text("LIFE SUPPORT ACCESS", 8 * u, 1.8 * v);
        
        // Draw input display area
        fill(20, 20, 30);
        stroke(150);
        strokeWeight(2);
        rect(2 * u, 2.5 * v, 8 * u, 0.8 * v);
        
        // Set text color based on feedback
        if (this.feedbackColor === 'green') {
            fill(0, 255, 0); // Green for correct
        } else if (this.feedbackColor === 'red') {
            fill(255, 0, 0); // Red for incorrect
        } else {
            fill(255, 255, 255); // White for normal
        }
        
        // Draw input text
        textAlign(LEFT, CENTER);
        textSize(0.3 * v);
        textFont(terminusFont);
        
        // Display actual letters instead of asterisks for better usability
        text(this.input, 2.2 * u, 2.9 * v);
        
        // Draw cursor
        if (!this.isProcessing && frameCount % 60 < 30) { // Blinking cursor
            const cursorX = 2.2 * u + textWidth(this.input);
            stroke(255);
            line(cursorX, 2.6 * v, cursorX, 3.2 * v);
        }
        
        // Draw feedback message
        if (this.feedbackMessage) {
            fill(this.feedbackColor === 'green' ? color(0, 255, 0) : 
                 this.feedbackColor === 'red' ? color(255, 0, 0) : color(255));
            textAlign(CENTER, CENTER);
            textSize(0.25 * v);
            text(this.feedbackMessage, 8 * u, 7.5 * v);
        }
        
        pop();
    }

    update(dt) {
        // Handle feedback timeout
        if (this.isProcessing) {
            // Feedback will be cleared by the timeout
        }
    }

    keyPressed() {
        // Ensure this keypad is the active interface
        if (window.activeInterface !== 'LifeSupportKeypad') {
            return false;
        }

        // ESC key exits the keypad
        if (keyCode === ESCAPE) {
            this.cleanup();
            return true;
        }
        
        // All other input is handled by buttons
        return true;
    }

    submitPassword() {
        if (this.input.length === 0) {
            this.showFeedback("Enter a password", "red");
            return;
        }

        this.isProcessing = true;
        
        if (this.input === this.password) {
            this.showFeedback("ACCESS GRANTED", "green");
            
            // Play success sound
            if (AM && AM.play) {
                AM.play('successPinpad');
            }
            
            // Set game state to indicate life support access
            if (GS && GS.set) {
                GS.set("Life Support Access Granted");
            }
            
            // Transition to life support room after delay
            setTimeout(() => {
                this.cleanup();
                if (WORLD && WORLD.gotoRoom) {
                    WORLD.gotoRoom(3, 0); // Room D is index 3
                }
            }, 1500);
            
        } else {
            this.showFeedback("ACCESS DENIED", "red");
            
            // Play failure sound
            if (AM && AM.play) {
                AM.play('failurePinpad');
            }
            
            setTimeout(() => {
                this.input = "";
                this.feedbackMessage = "";
                this.feedbackColor = null;
                this.isProcessing = false;
            }, 1500);
        }
    }

    showFeedback(message, color) {
        this.feedbackMessage = message;
        this.feedbackColor = color;
    }
}

// Factory function to create and show the keypad
function showLifeSupportKeypad(onExit = () => {}) {
    const keypad = new LifeSupportKeypad(onExit);
    R.add(keypad, 30); // High z-index to render on top
    return keypad;
}