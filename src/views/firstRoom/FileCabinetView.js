class FileCabinetView {
    constructor(id, x, y, scale, img) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.background = SM.get(img);
        this.background.setPos(this.x, this.y);
        this.background.setScale(this.scale);

        this.width = 1.93;
        this.height = 2.3;

        this.highlight = new HighlightEvent(this.x, this.y, this.width, this.height);

        this.onClickCallback = () => { };
    }
    // for controller 
    onClick(callback) {
        this.onClickCallback = callback;
    }

    isMouseInBounds(mx, my) {
        return (
            m.x >= this.x &&
            m.x <= this.x + this.width &&
            m.y >= this.y &&
            m.y <= this.y + this.height
        );
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClickCallback(this.id);
        }
    }

    onEnter() {
        R.add(this.background, 9);
        R.add(this.highlight);
    }

    onExit() {
        R.remove(this.background);
        R.remove(this.highlight);
    }
}

class OpenCabinetUIView {
    constructor() {
        this.numberImage = null;
        this._closeBtn = null;
        this.onExitCallback = () => { };
    }

    onClick(number) {
        const nameMap = {
            1: "firstNumber",
            2: "secondNumber",
            3: "thirdNumber",
            4: "fourthNumber",
            5: "fifthNumber",
            6: "sixthNumber",
            7: "seventhNumber",
            8: "eighthNumber",
            9: "ninthNumber"
        };

        this.numberImage = SM.get(nameMap[number]);
        this.numberImage.setPos(7, 3.4);
        this.numberImage.setScale(4);
        R.add(this.numberImage, 15);

        // close button removes itself and calls cleanup onRemove
        this._closeBtn = new Button(11.5, 2.4, 0.6, (self) => {
        this.onRemove()
        this.onExitCallback();
        AM.play('drawerClose')
        });
        R.add(this._closeBtn, 11);
    }

    onRemove(){
        if(this.numberImage) R.remove(this.numberImage);
        if(this._closeBtn) R.remove(this._closeBtn);
    }

    onExit(callback){
        this.onExitCallback = callback;
    }

    draw(){
        const u = VM.u(), v = VM.v();
        push();
        fill(169,169,169);
        stroke(255);
        strokeWeight(2);
        rect(3.5 * u, 2.2 * v, 9 * u, 4.6666 * v, 10);
        pop();
    }
}