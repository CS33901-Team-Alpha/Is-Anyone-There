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
}

class ScreenTimer {
    /**
     * For options object: 
     *  - options.time sets initial timer time
     *  - options.timerName name of timer (NOTE: 'overall' is reserved for the timer that ends game)
     *          - Also NOTE: any timer that is not called overall will be placed below the overall
     */
    constructor(onEnd = () => {}, options = {}) {
        this.timer = new Timer(!options.time ? 240000 : options.time);   
        this.label = '';
        this.onEnd = onEnd;

        this.yOffset = options.yOffset;

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
            setTimeout(() => {
                this.label = '0:00';
                if(this.timerName == 'overall'){
                    GS.set("Timer Up");
                }
                else{
                    GS.set("Timer Up") // change to custom timeout ending?
                }
                this.onEnd();
            }, 500);
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

    addTime(seconds) {
        this.timer.duration += seconds * 1000; // convert seconds to milliseconds
    }

}