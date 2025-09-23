class BlankWall extends View {
    constructor(image) {
        super(255, 99, 71, "");
        this.backgroundimg_ = loadImage(image);
    }

    draw() {
        super.draw();
        background(this.backgroundimg_);
    }
}

class TimerView extends View {
    constructor() {
        super(255, 99, 71, "Room 2 - Timer");
        this.timer = new Timer(30000);
        this.timeLabel = 0;
    }
    draw(){
        super.draw();
        push();
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(50);
        text(this.timeLabel , width/2, height/4);

        textSize(20);
        text("Press Space To reset Timer" , width/2, height/2 + 40);
        pop();
    }

    update(dt) {
        this.timeLabel = this.timer.getSeconds();
    }

    keyPressed() {
        if(keyCode === 32) this.timer.reset();
    }
}

class EventView extends View {
    constructor() {
        super(58, 134, 255, "Room 1");
        this.text = "";
        this.bttn1 = new Button(width/2 - 100, height/1.5, 50, () => {
            this.text = "Event 1";
        });
        this.bttn2 = new Button(width/2, height/1.5, 50, () => {
            this.text = "Event 2";
        });
        this.bttn3 = new Button(width/2 + 100, height/1.5, 50, () => {
            this.text = "Event 3";
        });
    }

    draw(){
        super.draw();
        push();
        fill(0, 0, 0);
        textSize(50);
        text(this.text, width/2, height/4);

        textSize(20);
        textAlign(CENTER);
        text("Press Buttons To Show Events" , width/2, height/2 + 40);
        pop();
    }

    onEnter() {
        R.add(this.bttn1);
        R.add(this.bttn2);
        R.add(this.bttn3);
    }

    onExit() {
        R.remove(this.bttn1);
        R.remove(this.bttn2);
        R.remove(this.bttn3);
    }
}

class MoveView extends View {
    constructor() {
        super(60, 179, 113, "Room 3");
        this.block1 = new MoveBlock(width/1.5, height/1.5, 100);
        this.block2 = new MoveBlock(width/4, height/4, 100);
        this.block3 = new MoveBlock(width/4, height/1.5, 100);
        this.block4 = new MoveBlock(width/1.5, height/4, 100);
    }

    draw() {
        super.draw();
        push();
        textSize(20);
        textAlign(CENTER);
        text("Move the Boxes around!" , width/2, height/2 + 40);
        pop();
    }

    onEnter() {
        R.add(this.block1);
        R.add(this.block2);
        R.add(this.block3);
        R.add(this.block4);
    }

    onExit() {
        R.remove(this.block1);
        R.remove(this.block2);
        R.remove(this.block3);
        R.remove(this.block4);
    }
}