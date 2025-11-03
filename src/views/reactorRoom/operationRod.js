class NuclearRod {
    constructor(x = 0, y = 0, label){
        this.label = label; 
        this.x = x; 
        this.y = y; 
        this.radius = 0.3; 
        this.dragging = false; 
        this.completed = false; 
        this.mistakes = 0; 
        this.zapped = false; 
        this.trail = []; 
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
        const rodColor = this.completed ? '#00FF88' : '#AAAAFF'; // when completed, changes color

        for(const pos of this.trail){
            fill(red(rodColor), green(rodColor), blue(rodColor), 100); // semi-transparent trail
            noStroke();
            ellipse(pos.x * u, pos.y * v, this.radius*u*0.8, this.radius*v*0.8);
        }

        fill(rodColor); 
        noStroke(); 
        ellipse(this.x * u, this.y * v, this.radius * u * 1.5, this.radius * v * 1.5);

        pop(); 
    }
}; 


class OperationReactorPuzzleView extends View {
    constructor(){ 
        super(0, 0, 0, 'Reactor Rod Operation');
        this.background = SM.get("MetalWall");

        // Define 3 rounds with their start, target, and path
        this.rounds = [
            { 
                start: {x:2, y:7}, 
                target: {x:12, y:2}, 
                path: [
                    {x:2, y:7}, {x:4, y:6.5}, {x:6, y:5.5}, {x:8, y:5}, {x:10, y:4}, {x:12, y:2}
                ]
            },
            { 
                start: {x:2, y:6}, 
                target: {x:13, y:3}, 
                path: [
                    {x:2, y:6}, {x:5, y:5.5}, {x:7, y:4.5}, {x:10, y:3.5}, {x:13, y:3}
                ]
            },
            { 
                start: {x:2.5, y:7}, 
                target: {x:14, y:2}, 
                path: [
                    {x:2.5, y:7}, {x:6, y:7}, {x:9, y:5.5}, {x:12, y:3.5}, {x:14, y:2}
                ]
            }
        ];

        this.currentRound = 0;
        this.allowedError = 0.2;
        this.meltdownThreshold = 3;
        this.canZap = true;
        this.textHandler = new TextNotificationHandler(0.5, 1);

        this.showStartText = true; 
        this.initRound(); 
    }

    onEnter() {
        this.showStartText = true; 
    }

    initRound() {
        this.onEnter(); 

        const round = this.rounds[this.currentRound];

        if(!this.rod){
        this.rod = new NuclearRod(round.start.x, round.start.y);
        } else { 
            this.rod.x = round.start.x; 
            this.rod.y = round.start.y;
            this.rod.completed = false;
            this.rod.trail = []; 
            this.rod.zapped = false; 
        }
        this.target = round.target;
        this.path = round.path;
        this.currentCheck = 0;
        this.finished = false;

    }

    checkSolved(){

        if(this.currentRound === this.rounds.length - 1){
            
            this.textHandler.addText("Reactor stabilized!", 0.85)
        }
        this.rod.completed = true;
        AM.play("reactorFix");
        GS.set('operationRodComplete')
        this.finished = true;

        // Move to next round after short delay
        setTimeout(() => {
            this.currentRound++;
            if(this.currentRound < this.rounds.length){
                this.initRound();
            } else {
                this.textHandler.addText("All 3 rounds completed!", 2);
                GS.set("operationRodPuzzleAllSolved");
            }
        }, 1200);
    }

    triggerMeltdown(){
        AM.play("reactorExplosion");
        this.textHandler.addText("REACTOR MELTDOWN!!", 2);
        GS.set("Player Died");

        // reset rod for retry
        setTimeout(() => {
            const round = this.rounds[this.currentRound];
            this.rod.x = round.start.x;
            this.rod.y = round.start.y;
            this.rod.mistakes = 0;
            this.canZap = true;
            this.finished = false;
        }, 1200);
    }

    checkCollision() {
        const rod = this.rod;
        const x = rod.x;
        const y = rod.y;
        const maxDist = this.allowedError;

        let touchingWire = false;

        for (let i = 0; i < this.path.length - 1; i++) {
            const a = this.path[i];
            const b = this.path[i + 1];
            const ABx = b.x - a.x;
            const ABy = b.y - a.y;
            const APx = x - a.x;
            const APy = y - a.y;

            const ab2 = ABx*ABx + ABy*ABy;
            let t = (APx*ABx + APy*ABy)/ab2;
            t = constrain(t,0,1);
            const closestX = a.x + ABx*t;
            const closestY = a.y + ABy*t;
            const d = dist(x,y,closestX,closestY);

            if(d < maxDist){
                touchingWire = true;
                break;
            }
        }

        const current = this.currentCheck;

        if(current < this.path.length){
            const cp = this.path[current];
            const dToCheck = dist(x,y,cp.x,cp.y);
            if(dToCheck < maxDist * 0.7){
                this.currentCheck++;
                AM.play("checkpoint");
                this.textHandler.addText(`Checkpoint ${this.currentCheck}/${this.path.length}`, 1.2);

                // if final checkpoint, complete the puzzle
                if (this.currentCheck >= this.path.length) {
                    this.checkSolved();
                    return;
                }
            }
        }

        if(!touchingWire && this.canZap){
            rod.mistakes++;
            this.canZap = false;
            AM.play("reactorZap");
            this.textHandler.addText("ZAP!", 0.8);

            if (rod.mistakes > this.meltdownThreshold) {
                this.triggerMeltdown();
            }
            setTimeout(() => { this.canZap = true; }, 500);
        }
    }

    mousePressed(){
        const u = width/16, v = height/9;

        if(this.showStartText){
            this.textHandler.addText(`Round ${this.currentRound + 1} Start!`, 1);
            this.initRound(); 
            this.showStartText = false;
            return; 
        }
        if(this.rod.contains(mouseX, mouseY,u,v)){
            this.rod.dragging = true;
        }
    }

    mouseReleased(){
        this.rod.dragging = false;
    }

    mouseDragged(){
        const u = width/16, v = height/9;
        if(this.rod.dragging){
            this.rod.x = mouseX / u;
            this.rod.y = mouseY / v;
            this.checkCollision();
        }

        this.rod.trail.push({x:this.rod.x, y:this.rod.y});
        if(this.rod.trail.length > 20) this.rod.trail.shift();
    }

    update(dt){
        this.textHandler.update(dt);
    }

    draw(){
        if(this.background) this.background.draw();
        else background(20);

        const u = width/16, v = height/9;

        // panel
        push();
        fill(25);
        stroke(120);
        strokeWeight(3);
        rect(2*u,1*v,12*u,7*v,5);
        pop();

        // header
        push();
        fill(40);
        rect(2*u,1*v,12*u,0.8*v,10,10,0,0);
        fill('#ffbe5cff');
        textAlign(LEFT,CENTER);
        textSize(14);
        text('REACTOR ROD OPERATION PANEL', 4.5 * u, 1.4 * v);
        pop();

        // path lines
        push();
        stroke('#00FFFF');
        strokeWeight(4);
        noFill();
        beginShape();
        for(const p of this.path) vertex(p.x*u, p.y*v);
        endShape();
        pop();

        // checkpoints
        for(let i=0;i<this.path.length;i++){
            const cp = this.path[i];
            const isCurrent = i===this.currentCheck;
            push();
            fill(isCurrent ? '#FFCC00' : '#555');
            noStroke();
            ellipse(cp.x*u, cp.y*v, 0.4*u*1.2);
            pop();
        }

        // rod
        this.rod.draw(u,v);

        // draw zap sparks if triggered
        if(this.rod.zapped){
            push();
            stroke('#FFFF00');
            strokeWeight(2);
            for(let i=0; i<8; i++){
                line(
                    this.rod.x*u, 
                    this.rod.y*v, 
                    this.rod.x*u + random(-20,20), 
                    this.rod.y*v + random(-20,20)
                );
            }
            pop();

            // reset the flag so it only shows for one frame
            this.rod.zapped = false;
        }


        // meltdown bar
        const barX = 2.75*u, barY = 7.8*v, barW = 10*u, barH = 0.4*v;
        push();
        fill(60);
        rect(barX,barY,barW,barH,3);
        const dangerRatio = this.rod.mistakes/this.meltdownThreshold;
        fill(lerpColor(color('#00FF00'),color('#FF0000'),dangerRatio));
        rect(barX,barY,barW*dangerRatio,barH,3);
        pop();
    }
}
