export class NuclearRodModel {
    constructor(x = 0, y = 0, maxTrail = 20){
        this.x = x; 
        this.y = y; 
        this.radius = 0.3; 
        this.dragging = false; 
        this.completed = false; 
        this.mistakes = 0; 
        this.zapped = false; 
        this.trail = []; 
        this.maxTrail = maxTrail;
    }


    reset(x, y){
        this.x = x; 
        this.y = y; 
        this.radius = 0.3; 
        this.dragging = false; 
        this.completed = false; 
        this.mistakes = 0; 
        this.zapped = false; 
        this.trail = []; 
    }

    moveTo(x, y){
        this.x = x; 
        this.y = y;
        this.trail.push({x, y});
        if(this.trail.length > this.maxTrail){
            this.trail.shift(); 
        }
    }

    mistakeCounter(){
        this.mistakes++; 
        this.zapped = true; 
    }
}



export class OperationRodModel {
    constructor(roundCount = 3, allowedError = 0.2, meltdownThreshold = 3){
        this.allowedError = allowedError;
        this.meltdownThreshold = meltdownThreshold;
        this.currentRound = 0; 
        this.canZap = true; 
        this.finished = false; 
        this.rod = null; 
        this.currentCheck = 0; 

        this.rounds = []; 

        for(let i = 0; i < roundCount; i++){
            const start = {x : 2, y: Math.random() * (8 - 5) + 5};
            const target = {x : 14, y: Math.random() * (5.5 - 2.5) + 2.5};
            const path = this.generatePath(start, target, 4 + i);
            this.rounds.push({start, target, path});
        }
    }

    generatePath(start, target, checkpoints = 5){
        const path = [start];
        const dx = (target.x - start.x) / checkpoints;
        const dy = (target.y - start.y) / checkpoints; 

        for(let i = 1; i < checkpoints; i++){
            const prev = path[i - 1];
            let nextX = start.x + dx * i;
            let nextY = start.y + dy * i;

            // makes it so that the path isn't just straight 
            const wiggle = Math.sin(i * Math.random() * (1.5 - 0.6) + 0.6) * Math.random() * (1.8 - 1) + 1;
            const jitterX = Math.random() * (0.7 - (-0.7)) + (-0.7);
            nextY += wiggle; 
            nextX += jitterX; 
            path.push({x : Math.min(14, Math.max(2, nextX)), y : Math.min(6.5, Math.max(2, nextY))});
        }

        path.push(target); 
        return path;    
    } 

    initRound() {
        const round = this.rounds[this.currentRound];
        if (!this.rod) {
            this.rod = new NuclearRodModel(round.start.x, round.start.y);
        } else {
            Object.assign(this.rod, {
                x: round.start.x,
                y: round.start.y,
                completed: false,
                trail: [],
                zapped: false,
                dragging: false,
                mistakes: 0
            });
        }
        this.target = round.target;
        this.path = round.path;
        this.currentCheck = 0;
        this.finished = false;
    }

    checkCollision() {
        const rod = this.rod;
        const x = rod.x, y = rod.y;
        const maxDist = this.allowedError;

        let touchingWire = false;
        let checkpointReached = false;
        let meltdownTriggered = false;
        let solved = false;
        
        // set touchingWire = true if within distance
        if (this.currentCheck < this.path.length) {
            const cp = this.path[this.currentCheck];
            const dToCheck = dist(x,y,cp.x,cp.y);
            if (dToCheck < maxDist * 0.7) {
                this.currentCheck++;
                checkpointReached = true;
                if (this.currentCheck >= this.path.length) {
                    solved = true;
                }
            }
        }

        if (!touchingWire && this.canZap) {
            rod.mistakes++;
            this.canZap = false;
            if (rod.mistakes > this.meltdownThreshold) {
                meltdownTriggered = true;
            }
        }

        // this is so the controller can take these results
        return { touchingWire, checkpointReached, meltdownTriggered, solved };
    }



    checkSolved() {
        this.rod.completed = true;
        this.finished = true;
        this.currentRound++;
        return this.currentRound >= this.rounds.length;
    }


    triggerMeltdown() {
        this.rod.mistakes = 0;
        this.canZap = true;
        this.finished = false;
        return true; // meltdown happened
    }
}