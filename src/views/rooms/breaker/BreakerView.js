const breakerBoxWidth = 1;
const breakerBoxHeight = 2; 

const breakerClickWidth = 1; 
const breakerClickHeight = 2;
class BreakerBox{
    constructor(x, y, onTransition = null) {
        this.x = x;
        this.y = y;
        this.onTransition = onTransition;
        this.highlight = new HighlightEvent(this.x, this.y, breakerBoxWidth, breakerBoxHeight);
}

    mousePressed(p) {
        // kind of combined isMouseInBounds with mousePressed
        const m = p || VM.mouse();
        if (m.x >= this.x  && m.x <= this.x + breakerClickWidth &&
            m.y >= this.y  && m.y <= this.y + breakerClickHeight) {
                if (typeof this.onTransition === 'function') {
                    this.onTransition();
                } 
        }
    }

    update(dt){}

  draw() {
    this.background.draw();
    
    // You can also draw a static, non-interactive sprite for the breaker box here
    const u = VM.u();
    const v = VM.v();
    fill(150);
    stroke(220);
    strokeWeight(4);
    rect(6 * u, 3 * v, 2 * u, 3 * v); // Draws a placeholder rectangle
  }

  onEnter() {
    R.add(this);
    R.add(this.breakerBoxHighlight);
    console.log("BreakerBoxHighlight has been added to the renderer:", this.breakerBoxHighlight);
  }

  onExit() {
    R.remove(this);
    R.remove(this.background);
    R.remove(this.breakerBoxHighlight);
  }
}