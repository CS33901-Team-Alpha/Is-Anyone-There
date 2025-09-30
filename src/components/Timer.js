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
    constructor(onEnd = () => {}) {
        this.timer = new Timer(120000);   
        this.label = '';
        this.onEnd = onEnd;
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
                GS.TimerDone();
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
        let y = 10;

        rectMode(CORNER);
        fill(0);
        stroke(150);
        strokeWeight(2);
        rect(x, y, tw, th, 8);

        noStroke();
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = color(255, 0, 0);
        fill(255, 0, 0);
        //text(this.label, width / 2, 60);

        text(this.label, x + tw / 2, y + th / 2);
        drawingContext.shadowBlur = 0;
        pop();
    }
}