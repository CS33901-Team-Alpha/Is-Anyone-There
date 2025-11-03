class ReactorStartupView extends View {
    constructor() { 
        super(); 

        this.background = SM.get("MetalWall"); 
        this.background.setSize(16, 9); 
        this.textHandler = new TextNotificationHandler(0.5, 1); 

        // reactor simon-says color zones
        this.colors = [
            { name: 'red', x: 8,  y: 2.5, col: color(255, 0, 0) },
            { name: 'blue', x: 11, y: 4.5, col: color(0, 128, 255) },
            { name: 'green', x: 8,  y: 6.5, col: color(0, 255, 100) },
            { name: 'yellow', x: 5, y: 4.5, col: color(255, 255, 0) },
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

    }

    // cleans up leftover text notifications 
    onEnter() {
        this.textHandler.cleanup();
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
        this.onEnter(); 
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
        this.textHandler.addText(`Round ${this.round} initializing...`, 0.85);

        this.locked = true;
        this.activeColor = null;
        this.step = 0;

        // start flashing the color 
        this.flashNext();
    }

    flashNext() {
        if (this.step >= this.sequence.length) {
            // if the sequence is finished, allow for input
            this.locked = false;
            this.activeColor = null;
            this.step = 0;
            this.textHandler.addText("Your turn!", 1);
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
        this.textHandler.addText("REACTOR MELTDOWN ⚠", 2);
        this.meltdown = true;
        GS.set("Player Died");
    }

    checkSolved() {
        this.textHandler.addText(`Round ${this.round} complete!`, 0.5);
        this.round++;

        // all rounds complete 
        if (this.round > this.maxRounds) {
            this.textHandler.addText("Reactor has been started!", 2);
            GS.set("reactorStartupComplete");
            this.completed = true;
            this.locked = true;
            this.activeColor = 'green';
            setTimeout(() => (this.activeColor = null), 1000);
        } else {
            setTimeout(() => this.startSequence(), 1000); // start next round
        }
    }


    update(dt) {
        this.textHandler.update(dt);

        // // local meltdown countdown
        // if (this.timerRunning && !this.completed && !this.meltdown) {
        //     const now = millis();
        //     if (now - this.lastTime > 1000) {
        //         this.screenTimer--;
        //         this.lastTime = now;
        //         if (this.screenTimer <= 0) {
        //             this.triggerMeltdown();
        //             this.timerRunning = false;
        //         }
        //     }
        // }
    }

    mousePressed(p) {
        if (this.meltdown) return;

        if (!this.started) {
            this.started = true;
            this.timerRunning = false;
            this.startSequence();
            return; // don't register this first click as input
        }

        if (this.locked || this.completed) return;

        const u = width / 16, v = height / 9;
        for (const zone of this.colors) {
            const d = dist(mouseX / u, mouseY / v, zone.x, zone.y);
            if (d < 1.2) {
                this.handleInput(zone.name);
                break;
            }
        }
    }

    draw() {
        if (this.background) this.background.draw();
        else background(10); // fallback bg 

        // make the room darker 
        fill(0, 150);
        rect(0, 0, width, height);


        const u = width / 16, v = height / 9;

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

        // // for the timer bar
        // push();
        // const barW = 10 * u, barH = 0.4 * v, barX = 3 * u, barY = 8 * v;
        // fill(60);
        // rect(barX, barY, barW, barH, 5);
        // const ratio = constrain(this.screenTimer / 30, 0, 1);
        // fill(lerpColor(color('#00FF00'), color('#FF0000'), 1 - ratio));
        // rect(barX, barY, barW * ratio, barH, 5);

        // textAlign(CENTER, CENTER);
        // textSize(16);
        // fill(255);
        // text(`Time Remaining: ${this.screenTimer}s`, barX + barW / 2, barY + barH / 2);
        // pop();

        // // flashes red when the timer is <= 5 seconds
        // if (!this.completed && this.screenTimer <= 5 && frameCount % 30 < 15) { 
        //     // flashes every half second
        //     push();
        //     fill(255, 0, 0, 80); // semi-transparent red
        //     rect(0, 0, width, height);
        //     pop();
        // }
    }
}