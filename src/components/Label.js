// Bare Bones Label Class
class Label {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
  }

  setText(newText) {
    this.text = newText;
  }

  draw() {
    textSize(24);
    fill(220);
    text(this.text, this.x, this.y);
  }
}

class CountdownLabel extends Label {
    constructor(x, y, time, onEnd = () => {}) {
        super(x, y, time);
        this.timer = new Timer(time * 1000);
        this.stopped = false;
        this.onEnd = onEnd;
    }

    update(dt){
        if(!this.stopped && !this.timer.isFinished()) {
            super.setText(this.timer.getSeconds());
        } else {
            this.onEnd(this);
        }
    }

    stop() {
        this.stopped = true;
    }
}