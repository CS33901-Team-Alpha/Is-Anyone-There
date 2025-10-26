class CryoChamber {
    constructor(x, y, scale, img, onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        // for hitbox, I just manually guessed, we need a good method to calculate these
        this.width = 2.25
        this.height = 5

        this.background = SM.get(img);
        this.background.setPos(this.x, this.y);
        this.background.setScale(this.scale);

        this.onClick = onClick;

        this.borderSize = 0.01;

        this.highlight = new HighlightEvent(this.x, this.y, this.width, this.height);
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

     mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
        }
    }

    draw(){
        const u = VM.u();
        const v = VM.v();

        push()
        noFill();
        noStroke();
        rect((this.x-this.borderSize) * u, (this.y-this.borderSize) * v,
         (this.width+this.borderSize*2) * u, (this.height+this.borderSize*2)*v)
        pop()
    }

    onEnter() {
        R.add(this.background, 9);
        R.add(this.highlight)
    }
    onExit() {
        R.remove(this.background);
        R.remove(this.highlight)
    }
}

class CryoView extends View{ 
    /**
     * Walls with Cryo Chambers showing how many deaths have occured
     */
    constructor(num) {
        super(0,0,0,'');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        this.chambers = [];
        
        for(let i = 1; i <= 4; ++i) {
            let index = i + (4*num);
            let newChamber;
            if(index <= GS.getDeaths()) {
                newChamber = new CryoChamber(0.5+(4*(i-1)), 3.6, 0.9, `emptyCryo${i}`, (obj) => {
                    this.textNotificationHandler.addText('This Cryo Chamber does not appear to have a person inside of it anymore....')
                });
            }
            else {
                newChamber = new CryoChamber(0.5+(4*(i-1)), 3.6, 1.8, `fullCryo${i}`, (obj) => {
                    this.textNotificationHandler.addText('A Standard Cryo Chamber, with a person deep in Cryo Sleep')
                });
            }
            this.chambers.push(newChamber);
        }
    }

    draw() {

    }

    update(dt){
        // pass time to fading logic for text notifications
        this.textNotificationHandler.update(dt)
    }

    onEnter() {
        R.add(this.background);

         for(let i = 0; i < 4; i++){
            R.add(this.chambers[i])
        }
        // call onenters
        for(let i = 0; i < 4; i++){
            this.chambers[i].onEnter()
        }
    }

    onExit() {
        R.remove(this.background);

        // remove all the cabinets too
        for(let i = 0; i < 4; i++){
            R.remove(this.chambers[i])
        }

        // remove highlights and sprite for filecabinet objects
        for(let i = 0; i < 4; i++){
            this.chambers[i].onExit()
        }

        this.textNotificationHandler.cleanup()
    }
}