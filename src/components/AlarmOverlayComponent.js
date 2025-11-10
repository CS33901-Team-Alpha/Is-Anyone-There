class AlarmOverlay{
    /**
     * 
     * @param {function} alarmCondition callback that returns true if alarm overlay should be active
     */
    constructor(alarmCondition = () => true){
        this.alarmCondition = alarmCondition;
        
        // yes there are a lot of variables... but it works.

        this.redStrength = 0; // alpha channel value of the overlay
        this.increasing = true; // starts off increasing alpha
        this.redStrengthCap = 70;
        this.holdFor = 1.5; // how long to hold before starts the alarm cycle again
        this.timer = this.holdFor; // first loop we want it to start immediately, then this gets reset to 0
        this.cycleActive = false;
    }

    update(dt){
        if(!this.alarmCondition()){
            R.selfRemove(this)
            return;
        }

        this.timer += dt;

        if(this.timer > this.holdFor){
            this.cycleActive = true;
            this.timer = 0;
        }

        if(this.timer > 0.05 && this.cycleActive){ // update color every 50ish ms
            this.timer = 0;

            if(this.increasing){
                this.redStrength += 4;
            }
            else{
                this.redStrength -= 4;
            }

            if(this.redStrength <= 0){
                this.redStrength = 0;
                this.increasing = true;
                this.cycleActive = false;
            }
            else if(this.redStrength >= this.redStrengthCap){
                this.redStrength = this.redStrengthCap;
                this.increasing = false;
            }
        }
    }

    draw(){
        if(!this.alarmCondition()) return;
        const u = VM.u(), v = VM.v();

        push();
        fill(250,0,0, this.redStrength);
        stroke(0)
        rect(0 * u, 0 * v, 16 * u, 9 * v);

        pop();
    }
}