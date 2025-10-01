class SpaceWindow{
    /*
    Make some kind of border so this actually looks like a plausable window.
    It needs to have some kind of depth effect to not look like an image pasted on the wall.
    */
    constructor(x, y, scale, img,  onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        // for hitbox, I just manually guessed, we need a good method to calculate these
        this.width = 6.13
        this.height = 4.1

        this.background = SM.get(img);
        this.background.setPos(this.x, this.y);
        this.background.setScale(this.scale);

        this.onClick = onClick;

        // this.highlight = new HighlightEvent(this.x, this.y, this.width, this.height);

        // for window, temporary
        this.borderSize = 0.15;
    }

    draw(){
        const u = VM.u();
        const v = VM.v();

        push()
        fill(0,0,0)
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
        R.add(this.background, 15)
        // R.add(this.highlight)
    }
    onExit() {
        R.remove(this.background);
        // R.remove(this.highlight)
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

        this.textNotif = new TextNotificationHandler(0.5, 0.85, {zind: 20, fadeoutRate: 0.02, holdFadeoutFor: 2});

        this.wind = new SpaceWindow(5, 1.5, 0.4, 'placeholderWindow', (obj) => {
            console.log('window clicked')
            this.textNotif.addText('You quietly stare into the emptiness of space, then ask yourself: "Is anyone there?"')
        })
    }

    update(dt){
        this.textNotif.update(dt)
    }

    draw() {

    }

    onEnter() {
        R.add(this.background);
        R.add(this.wind, 15)

        // call onenters
        this.wind.onEnter()
    }

    onExit() {
        R.remove(this.background);
        R.remove(this.wind)

        // call onexits
        this.wind.onExit()

        // required clean up for notification handler
        this.textNotif.cleanup()
    }
}