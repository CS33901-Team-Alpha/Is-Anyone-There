class SpaceWindow{
    /*
    Make some kind of border so this actually looks like a plausable window.
    It needs to have some kind of depth effect to not look like an image pasted on the wall.
    */
    constructor(x, y, scale, img,  onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.background = SM.get(img);
        this.background.setPos(this.x, this.y);
        this.background.setScale(this.scale);

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

    onEnter() {
        R.add(this.background, 3333)
    }
    onExit() {
        R.remove(this.background);
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
        }
    }
}

class SpaceWindowView extends View{
    /**
     * Plan for this one is to literally just be a wall that has a big window so you can see into space. 
     * Maybe we could add an interaction or easter egg if you stare long enough?
     */
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("placeholderWall");
        this.background.setSize(16, 9);

        this.wind = new SpaceWindow(5, 1.5, 0.4, 'placeholderWindow')
    }

    update(dt){
    }

    draw() {

    }

    onEnter() {
        R.add(this.background);
        R.add(this.wind)

        // call onenters
        this.wind.onEnter()
    }

    onExit() {
        R.remove(this.background);
        R.remove(this.wind)

        // call onexits
        this.wind.onExit()
    }
}