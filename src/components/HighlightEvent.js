class HighlightEvent {
    constructor(x, y, width, height, r, g, b, onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.r = r;
        this.g = g;
        this.b = b;
        this.onClick = onClick;
    }

    isMouseInBounds(mx, my) {
        const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
        return (
            m.x >= this.x &&
            m.x <= this.x + this.width &&
            m.y >= this.y &&
            m.y <= this.y + this.height
        );
  }

    draw() {
        const m = VM.mouse();
        const u = VM.u();
        const v = VM.v();
        
        if (this.isMouseInBounds(m.x, m.y)) {
            push();
            stroke(this.r, this.g, this.b);
            fill(0, 0, 0, 0);
            strokeWeight(5);
            rect(this.x * u, this.y * v, this.width * u, this.height * v);
            pop();
        }
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
        }
  }
}