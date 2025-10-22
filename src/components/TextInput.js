class TextInput {
    constructor(x, y, w, h, onSubmit = () => {}) {
        this.x = x;
        this.y = y;
        this.w= w;
        this.h = h;
        this.onSubmit = onSubmit;

        this.text = "";
        this.isActive = false;

        this.textColor = 0;
        this.borderColor = 0;
        this.hoverColor = [255, 255, 0];
        this.backgroundColor = 255;

        this.textCursorVisible = true;
        this.textCursorTimer = 0;
        this.textCursorBlinkSpeed = 0.5;
    }

    // checks to see if the mouse is within the bounds of the textbox
    isMouseInBounds(mx, my) {
        const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
        return (
            m.x >= this.x &&
            m.x <= this.x + this.w &&
            m.y >= this.y &&
            m.y <= this.y + this.h
        );
    }

    // If mouse is clicked inside the textbox it becomes active
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
        const u = VM.u();

        if (this.isActive === false) return;

        // removes the last character in the string
        if (keyCode === BACKSPACE) {
            this.text = this.text.slice(0, -1);
            return;
        }
        // returns the text input and clears it
        if (keyCode === ENTER || keyCode === RETURN) {
            this.onSubmit(this.text.trim());
            this.text = "";
            return;
        }

        if (key.length === 1){
            const totalTextWidth = textWidth(this.text + typedKey);
            const maxTextWidth = (this.w - 0.3) * u;

            // checks the length of the text to keep it from leaving the textbox
            if (totalTextWidth < maxTextWidth) {
                // adds the character to the string
                this.text += typedKey;
            }
        }
    }

    update(dt) {
        if (this.isActive) {
            //updates the text cursor timer
            this.textCursorTimer += dt;

            // toggles the the cursor visibile or not based on the timer
            if (this.textCursorTimer >= this.textCursorBlinkSpeed) {
                this.textCursorVisible = !this.textCursorVisible;
                this.textCursorTimer = 0;
            }
        }
        // sets cursor off if the text box is no longer active
        else {
            this.textCursorVisible = false;
            this.textCursorTimer = 0;
        }
    }

    draw() {
        const u = VM.u();
        const v = VM.v();
        const m = VM.mouse();

        // changes the border color if the mouse is over the text box or not
        const border = this.isMouseInBounds(m.x, m.y) ? this.hoverColor : this.borderColor;

        // draws the text box
        fill(this.backgroundColor);
        stroke(border);
        strokeWeight(2);
        rect(this.x * u, this.y * v, this.w * u, this.h * v, 0.5 * u);

        // draws the text
        noStroke();
        fill(this.textColor);
        textAlign(LEFT, CENTER);
        textSize(0.5 * v);
        const textX = (this.x + 0.2) * u;
        const textY = (this.y + this.h / 2) * v
        text(this.text, textX, textY);

        // draws the blinking text cursor
        if (this.isActive && this.textCursorVisible) {
            const textPixelWidth = textWidth(this.text);
            const cursorX = textX + textPixelWidth + 2;
            const cursorY1 = textY - 0.3 * v;
            const cursorY2 = textY + 0.3 * v;

            stroke(this.textColor);
            strokeWeight(2);
            line(cursorX, cursorY1, cursorX, cursorY2);
        }
    }
}