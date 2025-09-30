const doorWidth = 2.5;
const doorHeight = 6; 

const doorClickWidth = 2.5; 
const doorClickHeight = 6;

const frameDuration = 0.1; 

class SlidingDoor {
    constructor(x, y, scale, onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.onClick = onClick;


        // loading frames of sliding door
        this.frames = [
            // clone just makes sure each sliding 
            // door gets their own individual frame
            SM.get("SlidingDoor1").clone(),
            SM.get("SlidingDoor2").clone(),
            SM.get("SlidingDoor3").clone(),
            SM.get("SlidingDoor4").clone()
        ];

        this.frames.forEach(f => {
            if (!f) throw new Error("SlidingDoor frame missing!");
            f.setPos(this.x, this.y);
            f.setScale(this.scale);
            f.setSize(doorWidth, doorHeight)
        });

        this.currentFrame = 0; // what frame we're drawing, default (0) means it's closed
        this.isOpen = false; // door is closed
        this.animating = false; 
        this.animationTimer = 0; 
        this.frameDuration = frameDuration; // 0.1s per frame
    }

    mousePressed(p) {
        // kind of combined isMouseInBounds with mousePressed
        const m = p || VM.mouse();
        if (m.x >= this.x  && m.x <= this.x + doorClickWidth &&
            m.y >= this.y  && m.y <= this.y + doorClickHeight &&
            !this.animating
        ) {
            this.toggle();
            this.onClick(this);
        }
    }

    // switching between open and closed 
    toggle() {
        this.isOpen = !this.isOpen;
        this.animating = true; // starting animation
        this.animationTimer = 0; // reset timer 
    }

    update(dt) {
        if (!this.animating) return; // do nothing if no animation

        this.animationTimer += dt; // counting how much time has passed since last frame change
        if (this.animationTimer >= this.frameDuration) {
            this.animationTimer = 0; // reset for next frame 
            if (this.isOpen) {
                // move to the next frame 
                this.currentFrame++;
                if (this.currentFrame >= this.frames.length - 1) {
                    this.currentFrame = this.frames.length - 1;
                    this.animating = false;
                }
            } else { // means the door is closing, move to prev. frame 
                this.currentFrame--;
                if (this.currentFrame == 0) {
                    this.animating = false;
                }
            }
        }
    }

    draw() {
        this.frames[this.currentFrame].draw();
    }

    onEnter() {
        R.add(this);

    }

    onExit() {
        R.remove(this);
    }
}

class SlidingDoorView extends View {
    // added the backgroundAsset so it can be flexible
    // if someone in the future wants a different background 
    constructor(slidingDoors = [], backgroundAsset = null) {
        super(0, 0, 0, '');
        
        // if someone wants a new background, insert it.. 
        // on default will use southWall
        this.background = backgroundAsset ?? SM.get("SouthWall");
        this.background.setSize(16, 9); 

        this.door = slidingDoors.map(config => new SlidingDoor(
            config.x,
            config.y, 
            config.scale, 
            config.onClick ?? (() => {})
        ));
        }

    update(dt) {
        this.door.forEach(door=> door.update(dt));
    }

    draw() {
        this.background.draw();
        this.door.forEach(door => door.draw());
    }

    onEnter() {
        R.add(this); 
        this.door.forEach(door => door.onEnter());
    }

    onExit() {
        R.remove(this);
        this.door.forEach(door => door.onExit());
    }

    mousePressed(p) {
        this.door.forEach(door => door.mousePressed(p));
    }
}

