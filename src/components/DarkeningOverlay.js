class DarkeningOverlay{
    /**
     * 
     * @param {Number} totalTime is how long in miliseconds to fade over
     */
    constructor(totalTime){
        this.blackness = 0; // alpha channel value of the overlay
        this.blacknessRate = 5; // how fast to make black
        this.timer = 0;

        this.totalTime = 7000;

        // this formula is basically gives us how often to increase blackness based on the blackness rate and total time to fadeout over.
        // divide by 1000 because update's dt returns in seconds
        this.timeToDarken = (this.totalTime/(255/this.blacknessRate))/1000;
    }

    update(dt){
        this.timer += dt;

        if(this.timer > this.timeToDarken){ // every this.timeToDarken seconds make it a little darker
            this.timer = 0;
            this.blackness += this.blacknessRate;
        }
    }

    draw(){
        const u = VM.u(), v = VM.v();

        push();
        fill(0,0,0, this.blackness);
        stroke(0)
        rect(0 * u, 0 * v, 16 * u, 9 * v);

        pop();
    }
}