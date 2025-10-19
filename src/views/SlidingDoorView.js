const doorWidth = 2.5;
const doorHeight = 6; 

const doorClickWidth = 2.5; 
const doorClickHeight = 6;

const frameDuration = 0.1; 

class SlidingDoor {
    constructor(x, y, scale, onClick = () => { }, cfg = {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.onClick = onClick;
        this.locked = cfg.lockedCondition?.() === false ? false : cfg.locked ?? true;
        this.lockedCondition = cfg.lockedCondition ?? (() => false);

        this.autoCloseDelay = cfg.autoCloseDelay ?? 2; // seconds
        this.autoCloseTimer = 0; // countdown once open

        // clickable highlight
        this.highlight = new HighlightEvent(this.x, this.y, doorWidth, doorHeight);

        this.targetView = cfg.targetView ?? null;       
        this.targetRoom = cfg.targetRoom ?? null;       
        this.targetViewIndex = cfg.targetViewIndex ?? 0;

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
        const m = p || VM.mouse();
        const hit = (
            m.x >= this.x && m.x <= this.x + doorClickWidth &&
            m.y >= this.y && m.y <= this.y + doorClickHeight &&
            !this.animating
        );
        if (!hit) return false;

        const textNotificationHandler = this._room?.textNotificationHandler; 

        if (WORLD.previous === this.targetRoom) {
            this.locked = false;
        }   

        const canOpen = this.lockedCondition(); 

        if(!canOpen){
            if(textNotificationHandler) textNotificationHandler.addText("It seems as though you need to complete something to open the door..");
                this.locked = true; 
                return true; 
        }

        if(canOpen){
            if(textNotificationHandler) textNotificationHandler.addText("Door unlocked!");
            this.locked = false; 
        }


        this.toggle();

        // always schedule jump after the open animation delay
        setTimeout(() => {
            if (this.targetView) {
                if (this._room && typeof this._room.gotoView === 'function') {
                    this._room.gotoView(this.targetView);
                }
            } else if (this.targetRoom != null && typeof WORLD?.gotoRoom === 'function') {
                WORLD.gotoRoom(this.targetRoom, this.targetViewIndex);
            }
        }, 450);

        return true; // consume the click
    }

    // switching between open and closed 
    toggle() {
        this.isOpen = !this.isOpen;
        this.animating = true; // starting animation
        this.animationTimer = 0; // reset timer 

        if(this.isOpen){
            this.autoCloseTimer = this.autoCloseDelay; 
        }
    }

    update(dt) {
        if(this.animating){
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

        if (this.isOpen && !this.animating) {
            this.autoCloseTimer -= dt;
            if (this.autoCloseTimer <= 0) {
                this.toggle(); // automatically start closing
            }
        }
    }

    setRoom(vm) { 
        this._room = vm; 
    }

    draw() {
        this.frames[this.currentFrame].draw();
    }

    onEnter() {
        R.add(this);
        R.add(this.highlight);


    }

    onExit() {
        R.remove(this);
        R.remove(this.highlight); 

    }
}

class StandaloneSlidingDoor {
    constructor(x, y, scale, onClick = () => { }, l = true, 
                ad = 2, tv = null, tr = null, tvi = 0, lockedCondition = () => false) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.onClick = onClick;
        this.locked = l; 
        this.lockedCondition = lockedCondition;

        this.autoCloseDelay = ad; // seconds
        this.autoCloseTimer = 0; // countdown once open

        // clickable highlight
        this.highlight = new HighlightEvent(this.x, this.y, doorWidth, doorHeight);

        this.targetView = tv;       
        this.targetRoom = tr;       
        this.targetViewIndex = tvi;

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
        const m = p || VM.mouse();
        const hit = (
            m.x >= this.x && m.x <= this.x + doorClickWidth &&
            m.y >= this.y && m.y <= this.y + doorClickHeight &&
            !this.animating
        );
        if (!hit) return false;

        const textNotificationHandler = this._room?.textNotificationHandler; 

        if (WORLD.previous === this.targetRoom) {
            this.locked = false;
        }   

        const canOpen = this.lockedCondition(); 

        if(!canOpen){
            if(textNotificationHandler) textNotificationHandler.addText("It seems as though you need to complete something to open the door..");
                this.locked = true; 
                return true; 
        }

        if(canOpen){
            if(textNotificationHandler) textNotificationHandler.addText("Door unlocked!");
            this.locked = false; 
        }


        this.toggle();

        // always schedule jump after the open animation delay
        setTimeout(() => {
            if (this.targetView) {
                if (this._room && typeof this._room.gotoView === 'function') {
                    this._room.gotoView(this.targetView);
                }
            } else if (this.targetRoom != null && typeof WORLD?.gotoRoom === 'function') {
                WORLD.gotoRoom(this.targetRoom, this.targetViewIndex);
            }
        }, 450);

        return true; // consume the click
    }

    // switching between open and closed 
    toggle() {
        this.isOpen = !this.isOpen;
        this.animating = true; // starting animation
        this.animationTimer = 0; // reset timer 

        if(this.isOpen){
            this.autoCloseTimer = this.autoCloseDelay; 
        }
    }

    update(dt) {
        if(this.animating){
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

        if (this.isOpen && !this.animating) {
            this.autoCloseTimer -= dt;
            if (this.autoCloseTimer <= 0) {
                this.toggle(); // automatically start closing
            }
        }
    }

    setRoom(vm) { 
        this._room = vm; 
    }

    draw() {
        this.frames[this.currentFrame].draw();
    }

    onEnter() {
        R.add(this);
        R.add(this.highlight);


    }

    onExit() {
        R.remove(this);
        R.remove(this.highlight); 

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

        this.textNotificationHandler = new TextNotificationHandler(0.5, 1);

        // FIX: pass the entire config as cfg
        this.door = slidingDoors.map(config => new SlidingDoor(
            config.x,
            config.y,
            config.scale,
            config.onClick ?? (() => { }),
            config
        ));

        }

    update(dt) {
        this.textNotificationHandler.update(dt); 
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
        this.textNotificationHandler.cleanup(); 
    }

    mousePressed(p) {
        for (const door of this.door) {
            if (door.mousePressed(p)) return true; // stop propagation
        }
        return false;
    }

    setRoom(vm) {
        this.door.forEach(d => d.setRoom(this));
    }
}

