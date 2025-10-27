class NuclearRod {
    constructor(x = 0, y = 0, label){
        this.label = label; 
        this.x = x; 
        this.y = y; 
        this.radius = 0.2; 
        this.dragging = false; 
        this.completed = false; 
        this.mistakes = 0; 
    }

    // check if the mouse click is within the node's range 
    contains(px, py, u, v) {
        const dx = px / u - this.x;
        const dy = py / v - this.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }

    // 
    draw(u,v){
        push(); 
        fill(this.completed ? '#00FF88' : '#AAAAFF'); // when completed, changes color
        noStroke(); 
        ellipse(this.x * u, this.y * v, this.radius * u * 1.5, this.radius * v * 1.5);
        pop(); 
    }
}; 


class OperationReactorPuzzleView extends View {
    constructor(){ 
        super(0, 0, 0, 'Reactor Rod Operation');
        this.background = SM.get("MetalWall");
        this.rod = new NuclearRod(2, 7); // starting point for rod 
        this.target = {x : 12, y : 2}; // final target

        // path for the checkpoints
        this.path = [
            {x: 2, y: 7}, {x: 4, y: 6.5},
            {x: 6, y: 5.5}, {x: 8, y: 5},
            {x: 10, y: 4}, {x: 12, y: 2}
        ];
        this.allowedError = .2; // how far from the path is safe
        this.meltdownThreshold = 5;
        this.textHandler = new TextNotificationHandler(0.5, 1);
        this.currentCheck = 0; // current checkpoint player is on
        this.finished = false; 
        this.canZap = true; // cooldown for zap

    }

    checkCollision() {
        const rod = this.rod;
        const x = rod.x;
        const y = rod.y;
        const maxDist = this.allowedError; // radius allowed away from path

        let touchingWire = false;

        for (let i = 0; i < this.path.length - 1; i++) {
            const a = this.path[i];
            const b = this.path[i + 1];

            // calc. closest point on (a,b) to the rod's (x,y)
            const ABx = b.x - a.x;
            const ABy = b.y - a.y;
            const APx = x - a.x;
            const APy = y - a.y;

            const ab2 = ABx * ABx + ABy * ABy;
            let t = (APx * ABx + APy * ABy) / ab2;
            t = constrain(t, 0, 1); // bet. 0 and 1 

            const closestX = a.x + ABx * t;
            const closestY = a.y + ABy * t;
            const d = dist(x, y, closestX, closestY);

            if (d < maxDist) {
                touchingWire = true;
                break;
            }
        }

        // if the player has reached the next checkpoint 
        const current = this.currentCheck;
        if (current < this.path.length) {
            const cp = this.path[current];
            const dToCheck = dist(x, y, cp.x, cp.y);

            // trigger when the rod is close enough to a checkpoint
            if (dToCheck < maxDist * 0.7) {
                this.currentCheck++;
                this.textHandler.addText(`Checkpoint ${this.currentCheck}/${this.path.length}`, 1.2);

                // if final checkpoint, complete the puzzle
                if (this.currentCheck >= this.path.length) {
                    this.checkSolved();
                    return;
                }
            }
        }

        if (!touchingWire && this.canZap) {
            rod.mistakes++;
            this.canZap = false; 
            this.textHandler.addText("ZAP!", 0.8);

            if (rod.mistakes > this.meltdownThreshold) {
                this.triggerMeltdown();
            }
            setTimeout(() => {
                this.canZap = true;
            }, 800); // wait 0.8s before next possible zap
        }
    }



    triggerMeltdown(){
        this.textHandler.addText("REACTOR MELTDOWN!!", 2);
        GS.set("Player Died");
        this.finished = true; 
        this.rod.completed = false; 
    }

    checkSolved(){
        this.textHandler.addText("Reactor stabilized!", 2);
        GS.set("operationRodPuzzleSolved");
        this.canZap = false; 
        this.rod.completed = true; 
        this.finished = true; 
    }

    mouseReleased(p){
        this.rod.dragging = false;
    }

    mousePressed(p){
        const u = width / 16, v = height / 9; 
        if(this.rod.contains(mouseX, mouseY, u, v)){
            this.rod.dragging = true; 
        }
    }

    mouseDragged(p){
        const u = width / 16, v = height / 9; 
        if(this.rod.dragging){
            this.rod.x = mouseX / u; 
            this.rod.y = mouseY / v; 
            this.checkCollision(); 
        }
    }

    update(dt) {
        this.textHandler.update(dt);
    }

    draw() {
        if (this.background) this.background.draw();
        else background(20);

        const u = width / 16, v = height / 9;

        // panel
        push();
        fill(25);
        stroke(120);
        strokeWeight(3);
        rect(2 * u, 1 * v, 12 * u, 7 * v, 5);
        pop();

        // header
        push();
        fill(40);
        rect(2 * u, 1 * v, 12 * u, 0.8 * v, 10, 10, 0, 0);
        fill('#ffbe5cff');
        textAlign(LEFT, CENTER);
        textSize(14);
        text('REACTOR ROD OPERATION PANEL', 6 * u, 1.4 * v);
        pop();

        // lines for path
        push();
        stroke('#00FFFF');
        strokeWeight(4);
        noFill();
        beginShape();
        for (const p of this.path) vertex(p.x * u, p.y * v);
        endShape();
        pop();

        // the checkpoints (circles along path)
        for (let i = 0; i < this.path.length; i++) {
            const cp = this.path[i];
            const isCurrent = i === this.currentCheck;
            push();
            fill(isCurrent ? '#FFCC00' : '#555');
            noStroke();
            ellipse(cp.x * u, cp.y * v, 0.4 * u * 1.2);
            pop();
        }

        // rod (aka circle being dragged )
        this.rod.draw(u, v);

        // meltdown bar
        const barX = 2.75 * u, barY = 7.8 * v, barW = 10 * u, barH = 0.4 * v;
        push();
        fill(60);
        rect(barX, barY, barW, barH, 5);
        const dangerRatio = this.rod.mistakes / this.meltdownThreshold;
        // as more mistakes happen, the color will go from green to red
        fill(lerpColor(color('#00FF00'), color('#FF0000'), dangerRatio)); 
        rect(barX, barY, barW * dangerRatio, barH, 5);
        pop();
    }

}; 