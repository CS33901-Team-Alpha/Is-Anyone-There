class TextInput {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w= w;
        this.h = h;

        this.text = "test";
        this.isActive = false;

        this.textColor = 0;
        this.borderColor = 0;
        this.hoverColor = [255, 255, 0];
        this.backgroundColor = 255;
    }

    isMouseInBounds(mx, my) {
        const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
        return (
            m.x >= this.x &&
            m.x <= this.x + this.w &&
            m.y >= this.y &&
            m.y <= this.y + this.h
        );
    }

    mousePressed() {
        if (this.isMouseInBounds() === true) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
    }

    keyPressed() {
        const typedKey = key;
        if (this.isActive === false) return;

        if (keyCode === BACKSPACE) {
            this.text = this.text.slice(0, -1);
        }
        if (keyCode === ENTER || keyCode === RETURN) {
            this.text = "";
        }
        else if (key.length === 1){
            this.text += typedKey;
        }
    }

    update(dt) {}

    draw() {
        const u = VM.u();
        const v = VM.v();
        const m = VM.mouse();

        const border = this.isMouseInBounds(m.x, m.y) ? this.hoverColor : this.borderColor;

        fill(this.backgroundColor);
        stroke(border);
        strokeWeight(2);
        rect(this.x * u, this.y * v, this.w * u, this.h * v, 0.5 * u);

        noStroke();
        fill(this.textColor);
        textAlign(LEFT, CENTER);
        textSize(0.5 * v);
        text(this.text, (this.x + 0.2) * u , (this.y + this.h / 2) * v);
    }
}