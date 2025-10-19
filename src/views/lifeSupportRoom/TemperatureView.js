class ThermalNode {
    constructor(label, temp = 50, x = 0, y = 0) {
        this.label = label;
        this.temp = temp;
        this.min = 0; // lowest temp
        this.max = 100; // highest temp 
        this.x = x;
        this.y = y;
        this.radius = 0.5; // radius for clickable area 

        // variables for dragging 
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;

        // flash animation for when the temp. changes 
        this.flashTimer = 0;
        this.flashColor = null;

        // warning for if the user gets too close to 
        // temps that may kill them 
        this.warnedHot = false;
        this.warnedCold = false;
        this.revealed = false; // target revealed flag -> they got the right temp. 
    }

    // set new position for node -> for dragging 
    setPosition(x, y) { this.x = x; this.y = y; }

    // check if the mouse click is within the node's range 
    contains(px, py, u, v) {
        const dx = px / u - this.x;
        const dy = py / v - this.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }

    // adjusting the temperature based off of the value
    // higher temps. = warmer colors, lower = cooler colors 
    adjust(delta) {
        this.temp += delta;
        this.temp = Math.min(this.max, Math.max(this.min, this.temp)); // has to be bet. 0 - 100
        // if the delta (the change in temp) is more than 0, the temperature is higher..
        // use warmer colors, otherwise, use cooler colors for decreasing. 
        this.flashColor = delta > 0 ? color(255, 100, 50) : color(100, 150, 255);
        this.flashTimer = 0.4;
    }

    // just updating the animation timer 
    update(dt) {
        if (this.flashTimer > 0) {
            this.flashTimer -= dt; 
            if (this.flashTimer < 0) this.flashTimer = 0;
        }
    }

    // mapping the y position to a temp. value 
    updateTempFromPosition(minY, maxY) {
        this.y = Math.min(maxY, Math.max(minY, this.y)); // limit the movement to the slider
        this.temp = this.min + (this.max - this.min) * ((this.y - minY) / (maxY - minY));
    }

    // temp. has reached extreme limit (either 0 or 100)
    isOverflow() {
        return this.temp <= this.min || this.temp >= this.max;
    }

    // drawing the node 
    draw(u, v) {
        push();
        const cx = this.x * u;
        const cy = this.y * v;

        // detect hover 
        const hovered = dist(mouseX / u, mouseY / v, this.x, this.y) < this.radius;

        // color of node goes between red and blue depending on temp. 
        const base = lerpColor(color('#00BFFF'), color('#FF4500'), this.temp / 100);

        // color when hovered over 
        let fillCol = hovered ? color(255, 255, 0) : base;

        // flashing animation overlay 
        if (this.flashColor) fillCol = lerpColor(base, this.flashColor, this.flashTimer * 2.5);

        // draw the circle 
        fill(fillCol);
        noStroke();
        ellipse(cx, cy, this.radius * u * 2, this.radius * v * 2);

        // label and current temp 
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(`${this.label}: ${Math.round(this.temp)}°`, cx, cy - 1.5 * v);
        pop();
    }
}

class TemperaturePuzzleView extends View {
    constructor() {
        super(0, 0, 0, 'Calibrate Temperatures');

        // 3 temperatures for the user to interact with 
        this.nodes = {
            A: new ThermalNode("A", 50, 4, 4),
            B: new ThermalNode("B", 50, 5.5, 4),
            C: new ThermalNode("C", 50, 7, 4)
        };
        
        this.background = SM.get("MetalWall");
        
        // target temperatures 
        this.target = { A: 2, B: 93, C: 60 };

        // slider's vertical limits 
        this.minY = 3;
        this.maxY = 5;

        this.textHandler = new TextNotificationHandler(0.5, 1);
        this.screenTimer = null; // use to increase time if puzzle is solved 

    }

    // checking if the puzzle is solved 
    checkSolved() {
        return Object.keys(this.target).every(
            k => Math.round(this.nodes[k].temp) === this.target[k]
        );
    }

    // checking if the node has hit the min. or max. temp. 
    checkOverflow() {
        return Object.values(this.nodes).some(n => n.isOverflow());
    }

    handleTempWarnings() {
        for (const node of Object.values(this.nodes)) {
            // cold warning
            if (node.temp <= 10 && node.temp > node.min && !node.warnedCold) {
                this.textHandler.addText(`Warning: ${node.label} getting too cold!`, color('#00BFFF'));
                node.warnedCold = true;
            } else if (node.temp > 10) node.warnedCold = false;

            // hot warning
            if (node.temp >= 90 && node.temp < node.max && !node.warnedHot) {
                this.textHandler.addText(`Warning: ${node.label} overheating!`, color('#FF4500'));
                node.warnedHot = true;
            } else if (node.temp < 90) node.warnedHot = false;

            // reveal correct temperature 
            const targetTemp = this.target[node.label];
            if (Math.round(node.temp) === targetTemp && !node.revealed) {
                this.textHandler.addText(`${node.label} is at the correct temperature: ${targetTemp}°!`, color('#00FF00'));
                node.revealed = true;
            } else if (Math.round(node.temp) !== targetTemp) node.revealed = false;
        }
    }

    update(dt) {
        // update the flash timers 
        for (const node of Object.values(this.nodes)) node.update(dt);
        this.handleTempWarnings(); // check for warnings 
        this.textHandler.update(dt);
    }

    draw() {
        if (this.background) this.background.draw();
        else background(20);

        const u = width / 16, v = height / 9;

        // === PANEL BACKGROUND === 
        push();
        fill(25);
        stroke(120);
        strokeWeight(3);
        rect(2 * u, 1 * v, 7 * u, 5 * v, 5);
        pop();

        // === HEADER STRIP   === 
        push();
        fill(40);
        rect(2 * u, 1 * v, 7 * u, 0.8 * v, 10, 10, 0, 0);
        fill('#6eb3caff');
        textAlign(CENTER, CENTER);
        textSize(14);
        text('CALIBRATION PANEL', 5.5 * u, 1.4 * v);
        pop();

        // draw the nodes 
        for (const node of Object.values(this.nodes)) node.draw(u, v);

        // drawing the sliders 
        for (const node of Object.values(this.nodes)) {
            const cx = node.x * u;
            const topY = this.minY * v;
            const botY = this.maxY * v;
            push();
            stroke(80);
            strokeWeight(6);
            line(cx, topY, cx, botY);
            pop();
        }
    }

    // if node is clicked, begin dragging
    mousePressed(p) {
        const u = width / 16, v = height / 9;
        for (const node of Object.values(this.nodes)) {
            if (node.contains(mouseX, mouseY, u, v)) {
                node.dragging = true;
                node.offsetX = node.x - mouseX / u;
                node.offsetY = node.y - mouseY / v;
            }
        }
    }

    // when dragged, move node and update temperature 
    mouseDragged(p) {
        const u = width / 16, v = height / 9;
        for (const node of Object.values(this.nodes)) {
            if (node.dragging) {
                node.setPosition(node.x, mouseY / v + node.offsetY);
                node.updateTempFromPosition(this.minY, this.maxY);
            }
        }
    }

    // stop dragging and check for if puzzle was solved or failed 
    mouseReleased(p) {
        for (const node of Object.values(this.nodes)) node.dragging = false;

        if (this.checkOverflow()) {
            console.log("OVERLOAD! You died!");
            GS.set("Player Died");
        } else if (this.checkSolved()) {
            console.log("Puzzle solved! Door unlocked!");
            this.textHandler.addText("Puzzle solved! Door unlocked!");
            GS.set("regulateTempPuzzleSolved");
            if (this.screenTimer) {
                this.screenTimer.addTime(30); // add 30 seconds
            }
        }
    }
}