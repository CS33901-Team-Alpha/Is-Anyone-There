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
        this.width = 9.3
        this.height = 6.1

        this.background = SM.get(img);
        this.background.setPos(this.x, this.y);
        this.background.setScale(this.scale);

        this.onClick = onClick;

        // this.highlight = new HighlightEvent(this.x, this.y, this.width, this.height);

        // for window, temporary
        this.borderSize = 0.2;
    }

    draw(){
        const u = VM.u();
        const v = VM.v();

        push()
        fill(0,0,0)
        noStroke();
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
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);
        
        // min and max delay (in seconds) for the next random message to popup
        this.minDelay = 7;
        this.maxDelay = 12;

        this.timer = 0;
        this.countDown = this.getRandomSeconds();

        this.sentences = [
            // 'You quietly stare into the emptiness of space, then ask yourself: "Is anyone there?"',
            'You quietly stare into the emptiness of space.',
            'You ask yourself: "Is anyone there?"',
            'You feel the weight of your actions on your back.',
            'For the first time in years, you breathe.',
            'The silence begins to eat into your consciousness.',
            'You sense something lurking beyond your field of vision.',
            'An overwhelming sense of dread brings you to your knees.'
        ]

        this.textNotif = new TextNotificationHandler(0.5, 0.85, {zind: 20, fadeoutRate: 0.02, holdFadeoutFor: 3.5});

        // this.wind = new SpaceWindow(5, 1.5, 0.4, 'placeholderWindow', (obj) => {
        //     console.log('window clicked')
        //     this.textNotif.addText('You quietly stare into the emptiness of space, then ask yourself: "Is anyone there?"')
        // })
        
        this.wind = new SpaceWindow(3, 1, 0.6, 'placeholderWindow', (obj) => {})

        this.firstMessageSent = false;
    }

    // get a random time in seconds
    getRandomSeconds(){
        return Math.random() * (this.maxDelay-this.minDelay) + this.minDelay;
    }

    update(dt){
        this.textNotif.update(dt)

        this.timer += dt; // count seconds

        //console.log(`${this.timer} - ${this.countDown}`)
        if(this.timer > this.countDown){
            this.timer = 0;
            this.countDown = this.getRandomSeconds();

            this.textNotif.addText(this.sentences[Math.floor(Math.random() * this.sentences.length)])

            if(this.firstMessageSent == false) {
                this.firstMessageSent = true;
                
                AM.setVolume('creepyBackground', 0.1)
                AM.play('creepyBackground')
            }
        }
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

        // stop playing background sounds
        AM.fadeOut('creepyBackground', 2000)

        // reset first time message so sound plays on first message
        this.firstMessageSent = false;
    }
}