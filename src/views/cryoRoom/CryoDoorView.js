class CryoDoorComponent {
    constructor(x, y, scale, img,  onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        // for hitbox, I just manually guessed, we need a good method to calculate these
        this.width = 7.05
        this.height = 7.05

        this.background = SM.get(img);
        this.background.setPos(this.x, this.y);
        this.background.setScale(this.scale);

        this.onClick = onClick;

        this.highlight = new HighlightEvent(this.x, this.y, this.width, this.height);

        // for window, temporary
        this.borderSize = 0.1;
    }

    draw(){
        const u = VM.u();
        const v = VM.v();

        push()
        noFill();
        rect((this.x-this.borderSize) * u, (this.y-this.borderSize) * v,
         (this.width+this.borderSize*2) * u, (this.height+this.borderSize*2)*v)
        pop()
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

    onEnter() {
        R.add(this.background, 10)
        R.add(this.highlight)
    }
    onExit() {
        R.remove(this.background);
        R.remove(this.highlight)
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
        }
    }
}

class CryoDoorView extends View{ 
    /**
     * Wall with door to exit cryo room
     */
    constructor(num) {
        super(0,0,0,'');
        this.background = SM.get("blankCryo");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        this.door = new CryoDoorComponent(4, 1, 1, 'SlidingDoor3', (obj) => {
            this.textNotificationHandler.addText('Leaving Cryo Room...');
        });
    }

    draw() {

    }

    onEnter() {
        R.add(this.background);
        R.add(this.door)

        //call onenter
        this.door.onEnter()
    }

    onExit() {
        R.remove(this.background);
        R.remove(this.door);

        // call onexits
        this.door.onExit()
    }
        
}