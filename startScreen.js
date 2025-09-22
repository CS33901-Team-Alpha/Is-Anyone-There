class StartScreen { 
    constructor(startNow) {
        this.title = "Is Anyone There?"; 
        this.instruction = "Click to Begin!";
        this.onStart = startNow; 

        // for the button
        this.btnX = windowWidth / 2 - 75; 
        this.btnY = windowHeight / 2 + 120;
        this.btnW = 150; 
        this.btnH = 60;     
        this.label = "Start!"; 

        // shooting star variables
        this.fromX = 0; 
        this.fromY = 0; 
        this.toX = 0; 
        this.toY = 0; 
        this.step = 3; // tracker of shooting star

        // making all the stars
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: random(windowWidth),
                y: random(windowHeight),
                size: random(1, 3),
                alpha: random(100, 255) // the brightness 
            });
        }
    }

    drawStarField() {
        for (let star of this.stars) {
            star.alpha += random(-5,5);
            stroke(255, star.alpha); // white, transparent
            strokeWeight(star.size);
            point(star.x, star.y);
        }
    }

    drawShootingStar() {
        if (this.step >= 2.5) {
            // make a new star after the last one ends
            this.fromX = random(windowWidth);
            this.fromY = random(windowHeight / 2);
            this.toX = random(this.fromX + 50, windowWidth);
            this.toY = random(this.fromY + 20, windowHeight / 2);
            this.step = 0;
        }

        // path of shooting star + its animation
        if (this.step < 2.5) {
            let nextStep = this.step + 0.02;

            // faint trail
            strokeWeight(3);
            stroke(0, 20, 80, 30);
            line(this.fromX, this.fromY, this.toX, this.toY);

            // bright moving part
            strokeWeight(2);
            if (this.step < 1) {
                stroke(255, (1 - this.step) * 200);
                line(
                    lerp(this.fromX, this.toX, this.step),
                    lerp(this.fromY, this.toY, this.step),
                    lerp(this.fromX, this.toX, nextStep),
                    lerp(this.fromY, this.toY, nextStep)
                );
            }

            this.step = nextStep; // go to the next step -> continue animation
        }
    }

    // made this function to not conflict with existing Button class 
    drawButton() {
        push();

        // checking if mouse is over button
        if (
            mouseX >= this.btnX && mouseX <= this.btnX + this.btnW &&
            mouseY >= this.btnY && mouseY <= this.btnY + this.btnH
        ) {
            fill(100, 150, 255, 200); // hover fill
            stroke(150, 200, 255, 150); // glowing outline
            strokeWeight(4);
        } else {
            fill(50, 100, 200, 200); // normal fill
            noStroke();
        }

        rect(this.btnX, this.btnY, this.btnW, this.btnH, 12);

        // button label
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(22);
        textFont(gameFont);
        text(this.label, this.btnX + this.btnW / 2 + 3, this.btnY + this.btnH / 2);
        pop();
    }

    draw() {
        background(0, 20, 80, 25); // fading space background

        this.drawStarField();
        this.drawShootingStar();

        // title
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        textFont(gameFont);
        text(this.title, windowWidth / 2, windowHeight / 2 - 50);

        // instruction
        fill(255);
        textSize(24);
        text(this.instruction, windowWidth / 2, windowHeight / 2 + 20);

        this.drawButton();
    }

    mousePressed() {
        if (
            mouseX >= this.btnX && mouseX <= this.btnX + this.btnW &&
            mouseY >= this.btnY && mouseY <= this.btnY + this.btnH
        ) {
            if (this.onStart) this.onStart();
        }
    }

    update(dt) {
        // nothing needed
    }
}
