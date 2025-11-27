class Timer {
    constructor(duration) {
        this.duration = duration;
        this.start = millis();
    }

    reset() {
        this.start = millis();
    }

    getRemaining() {
        let elapsed = millis() - this.start;
        return max(0, this.duration - elapsed);
    }

    isFinished() {
        return this.getRemaining() === 0;
    }

    getSeconds() {
        return ceil(this.getRemaining() / 1000);
    }

    setFinished() {
        this.duration = millis() - this.start
    }
}

class ScreenTimer {
    /**
     * For options object: 
     *  - options.time sets initial timer time
     *  - options.timerName name of timer (NOTE: 'overall' is reserved for the timer that ends game)
     *          - Also NOTE: any timer that is not called overall will be placed below the overall
     */
    constructor(onEnd = () => {}, options = {}) {
        this.timer = new Timer(!options.time ? 180000 : options.time);   
        this.label = '';
        this.onEnd = onEnd;

        this.yOffset = options.yOffset;

        this.overlay = undefined;

        this.timerName = options.timerName;
        if(!this.timerName){
            this.timerName = 'overall';
        }
    }

    update(dt){
        if (!this.timer.isFinished()) {
            this.label = this.timer.getSeconds() + ' s';
            let secs = floor(this.timer.getRemaining() / 1000);
            let m = floor(secs / 60);
            let s = secs % 60;
            this.label = `${m}:${nf(s, 2)}`;       
        } else {
            // EFFECTS FOR CONTAGION TIMER RUNNING OUT
            // value of 10000 miliseconds is threshold for starting fadeout to black
            if((this.timerName == 'contagion' || this.timerName == 'overall') && (this.overlay == undefined)){ // less than 10 seconds
                this.overlay = new DarkeningOverlay(10000);
                let DeathAIString = this.timerName == 'contagion' ? ">_ ESTIMATED BOTANICAL CONTAGION INCUBATION FINISHED \n>_ HOST CONDITION: DEATH IMMINENT \n>_ CACHING NEW WAKE-UP PROCEDURE..." : ">_ SHIP HABITABILITY FALLING BELOW HUMAN STANDARDS \n>_ LOADING CLEAN-SLATE PROTOCOL... \n>_ CACHING NEW WAKE-UP PROCEDURE...";
                R.add(this.overlay, 99123)

                AI.addText(DeathAIString);

                GS.setString("Fatal diseases are probably better to avoid going forward");
                
                AM.fadeOut('contagionAlarm', 10000)
                setTimeout(() => { R.remove(this.overlay)}, 10600) // remove overlay (which will be all black) after time + 600 miliseconds since gameover screen only appears after 500ms
            }
            // EFFECTS FOR REACTOR TIMER RUNNING OUT
            else if((this.timerName == 'reactor') && (this.overlay == undefined)){
                this.overlay = new RadiationOverlay();
                R.add(this.overlay, 93211)
                AM.setVolume('radiation', 0.2)
                AM.loop('radiation')

                AI.setExistFor(4)
                AI.addText('>_ EXCESSIVE RADIATION DETECTED IN REACTOR ROOM')
                GS.setString("Nuclear engineering is incredibly dangerous and sensitive.\n Something to keep in mind...");

                setTimeout(() => { 
                    R.remove(this.overlay);
                    AM.fadeOut('radiation', 5000);
                }, 5600)
            }
            let EndDelay = this.timerName == 'reactor'? 5500 : 10500;
            setTimeout(() => {
                this.label = '0:00';
                if(this.timerName == 'overall'){
                    GS.setString("Looks like you have to speed up a little...")
                    GS.set("Timer Up");
                }
                else{
                    GS.set("Timer Up") // change to custom timeout ending?
                }
                this.onEnd();
            }, EndDelay);
        }
    }

    draw() {
        push();
        textSize(18);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);

        let pad = 10;
        let tw = textWidth(this.label) + pad * 2;
        let th = textAscent() + textDescent() + pad * 2;

        let x = 10;
        let y = this.timerName == 'overall' ? 10 : 10+th+10;

        rectMode(CORNER);
        fill(0);
        stroke(150);
        strokeWeight(2);
        rect(x, y, tw, th, 8);

        noStroke();
        drawingContext.shadowBlur = 20;
        
        if(this.timerName == 'overall'){
            drawingContext.shadowColor = color(255, 0, 0);
            fill(255, 0, 0);
        }
        else{
            drawingContext.shadowColor = color(0, 255, 0);
            fill(0, 255, 0)
        }

        text(this.label, x + tw / 2, y + th / 2);
        drawingContext.shadowBlur = 0;
        pop();
    }

    setFinished() {
        this.timer.setFinished();
    }

    addTime(seconds) {
        this.timer.duration += seconds * 1000; // convert seconds to milliseconds
    }

}