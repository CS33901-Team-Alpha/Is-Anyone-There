class ReactorStartupView extends View {
    constructor() { 
        super(); 

        this.background = SM.get("westWallReactor"); 
        this.background.setSize(16, 9); 
        this.textHandler = new TextNotificationHandler(0.5, 1); 

        // reactor simon-says color zones
        this.colors = [
            { name: 'red', x: 8,  y: 3.25, col: color(255, 0, 0) },
            { name: 'blue', x: 10.75, y: 5, col: color(0, 128, 255) },
            { name: 'green', x: 8,  y: 6.75, col: color(0, 255, 100) },
            { name: 'yellow', x: 5.25, y: 5, col: color(255, 255, 0) },
        ];

        // game logic
        this.sequence = [];
        this.playerInput = [];
        this.currentIndex = 0;
        this.locked = true; 
        this.step = 0;
        this.flashDuration = 0.6;
        this.activeColor = null;
        this.meltdown = false;
        this.completed = false;

        // progress 
        this.started = false; 
        this.round = 1;
        this.maxRounds = 5; 

        // for starting text 
        this.showStartText = false;

         this.closeBtn = new Button(14, 1.1, 0.8, (self) => {
            this.activeInterface = "ScreenView";
            R.add(this.highlight);
            R.remove(this.closeBtn);
        });

        // clickable highlight
            this.highlight = new HighlightEvent(8.25, 3.7, 2.9, 2.7, 255,255,255,() =>{
            R.remove(this.highlight);
            R.add(this.closeBtn);
            this.activeInterface = "PuzzleView";
        });

        this.locked = false;

        this.activeInterface = "ScreenView";
    }

    // cleans up leftover text notifications 
    onEnter() {
        this.textHandler.cleanup()
        R.add(this.highlight);
    }

    onExit() {
        this.activeInterface = "ScreenView";
        this.textHandler.cleanup()
        R.remove(this.highlight);
    }

    resetState() {
        this.sequence = [];
        this.playerInput = [];
        this.currentIndex = 0;
        this.locked = true;
        this.step = 0;
        this.activeColor = null;
        this.meltdown = false;
        this.completed = false;
    }

    startSequence(length = 4) {
        this.textHandler.cleanup();
        this.resetState();
        this.sequenceLength = length; 

        // build random color sequence
        for (let i = 0; i < this.sequenceLength; i++) {
            const zone = random(this.colors);
            this.sequence.push(zone.name);
        }

        // speeds up the round progress 
        this.flashDuration = max(0.1, 0.4 - (this.round - 1) * 0.12);
        console.log(`Flash Duration: ${this.flashDuration.toFixed(2)}s`);

        this.timerRunning = true;
        //this.textHandler.addText(`Round ${this.round} initializing...`, 0.85);

        this.locked = true;
        this.activeColor = null;
        this.step = 0;

        // start flashing the color 
        setTimeout(() => { this.flashNext() }, 750);
    }

    flashNext() {
        if (this.step >= this.sequence.length) {
            // if the sequence is finished, allow for input
            this.locked = false;
            this.activeColor = null;
            this.step = 0;
            //this.textHandler.addText("Your turn!", 1);
            return;
        }

        const colorName = this.sequence[this.step];
        this.activeColor = colorName;
        this.warningFlash = this.flashDuration;

        // the delay bet. flashes decreases 
        const interFlashDelay = max(100, 200 - (this.round - 1) * 20);
        console.log(`Flashing color: ${colorName} (step ${this.step + 1}/${this.sequence.length})`);
        console.log(`Inter-Flash Delay: ${interFlashDelay}ms`);

        setTimeout(() => {
            this.activeColor = null;
            this.step++;
            setTimeout(() => this.flashNext(), interFlashDelay);
        }, this.flashDuration * 1000);
    }

    handleInput(colorName) {
        if (this.locked || this.meltdown || this.completed) return;

        this.playerInput.push(colorName);

        const expected = this.sequence[this.playerInput.length - 1];
        if (colorName !== expected) {
            this.triggerMeltdown();
            return;
        }

        // flash player’s input briefly
        this.activeColor = colorName;
        setTimeout(() => (this.activeColor = null), 200);

        // all correct?
        if (this.playerInput.length === this.sequence.length) {
            this.checkSolved();
        }
    }

    triggerMeltdown() {
        AI.addText('>_  MALFUNCTION DETECTED \n>_  Severity: CRITICAL \n>_  REACTOR MELTDOWN BEGUN!!');
        GS.setString("Nuclear Reactors are very dangerous,\nbe careful around them from now on");
        setTimeout(() => {
            this.meltdown = true;
            GS.set("Player Died");
        }, 5000);  
    }

    checkSolved() {
        //this.textHandler.addText(`Round ${this.round} complete!`, 0.5);
        this.round++;

        // all rounds complete 
        if (this.round > this.maxRounds) {
            AI.addText('>_  NUCLEAR REACTOR STARTUP COMPLETE \n>_  CONTINUE PROCEDURE TO PREVENT MELTDOWN \n>_  STANDING BY...');
            GS.set("reactorStartupComplete");
            this.completed = true;
            this.locked = true;
            setTimeout(() => (this.activeColor = null), 1000);
        } else {
            setTimeout(() => this.startSequence(), 1000); // start next round
        }
    }


    update(dt) {
        this.textHandler.update(dt);
    }

    mousePressed(p) {
        if (this.meltdown) return;

        if(this.activeInterface == "PuzzleView") {
            if (this.locked || this.completed) return;

            const u = VM.u();
            const v = VM.v();
            for (const zone of this.colors) {
                const d = dist(mouseX / u, mouseY / v, zone.x, zone.y);
                if (d < 1.2) {
                    if (!this.started) {
                    this.started = true;
                        if(!GS.is('reactorStabilized')) {
                            GS.set("reactorStartupInitialized");
                            secondaryTimer = new ScreenTimer(() => { }, {time: 120000, timerName: 'reactor'})
                            R.add(secondaryTimer, 1)
                        }
                        this.timerRunning = false;
                        this.startSequence();
                        AI.addText('>_  NUCLEAR REACTOR STARTUP INITIATED \n>_  COMPLETE STARTUP PROCEDURE TO PREVENT MELTDOWN \n>_  STANDING BY...');
                        return; // don't register this first click as input
                    }
                    this.handleInput(zone.name);
                    break;
                }
            }
        }
    }

    draw() {
        if (this.background) this.background.draw();
        else background(10); // fallback bg 
        const u = VM.u();
        const v = VM.v();

        if(this.activeInterface == "PuzzleView") {

            // make the room darker 
            fill(0, 0, 0, 180); // Red, Green, Blue
            rect(1*u, 1*v, 14*u, 7*v);

            push();
            fill(40);
            rect(1*u,1*v,14*u,1*v,10,10,0,0);
            fill('#ffbe5cff');
            textAlign(LEFT,CENTER);
            textSize(20);
            text('REACTOR STARTUP CONTROLS', 5 * u, 1.5 * v);
            pop();

            // the color circles 
            push();
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(14);
            for (const zone of this.colors) {
                const active = this.activeColor === zone.name;
                const pulse = active ? 1.2 : 1.0;
                fill(active ? lerpColor(zone.col, color(255), 0.4) : zone.col);
                ellipse(zone.x * u, zone.y * v, 1.8 * u * pulse, 1.8 * v * pulse);
                fill(0);
                text(zone.name.toUpperCase(), zone.x * u, zone.y * v);
            }

            pop();
        }
        
    }
}