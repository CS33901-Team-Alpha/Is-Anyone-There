class Button {
    constructor(x, y, size, onClick = () => {}){
        this.x = x;
        this.y = y;
        this.size = size;
        this.onClick = onClick;

        this.baseColor = color(200);
        this.hoverColor = color(150);
    }

    isMouseInBounds(){
        return (
            mouseX >= this.x && mouseX <= this.x + this.size &&
            mouseY >= this.y && mouseY <= this.y + this.size
        );
    }

    update(dt){

    }

    draw(){
        let color = this.isMouseInBounds() ? this.hoverColor : this.baseColor;
        push();
        noStroke()
        fill(color);
        rect(this.x, this.y, this.size, this.size, 8);
        pop();
    }

    mousePressed() {
        if (this.isMouseInBounds()) {
            this.onClick(this)
        };
    }
}

class ConditionalButton {
    constructor(x, y, size, onClick = () => {}, bool, c1, c2, c3, bool2){
        this.x = x;
        this.y = y;
        this.size = size;
        this.onClick = onClick;

        this.baseColor = color(c1, c2, c3);
        this.hoverColor = color(c1*0.8, c2*0.8, c3*0.8);

        this.CanDraw_ = bool;
        this.makeInvis_ = bool2;
    }

    CanDraw() {
        this.CanDraw_ = true;
    }

    NotDraw() {
        this.CanDraw_ = false;
    }

    isMouseInBounds(){
        return (
            mouseX >= this.x && mouseX <= this.x + this.size &&
            mouseY >= this.y && mouseY <= this.y + this.size
        );
    }

    update(dt){

    }

    draw(){
        if(this.CanDraw_ && !this.makeInvis_) {
            let color = this.isMouseInBounds() ? this.hoverColor : this.baseColor;
            push();
            noStroke()
            fill(color);
            rect(this.x, this.y, this.size, this.size, 8);
            pop();
        }
    }

    mousePressed() {
        if (this.isMouseInBounds() && this.CanDraw_) {
            this.onClick(this)
        };
    }
}

