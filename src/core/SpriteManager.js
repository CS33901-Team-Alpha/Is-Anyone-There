let fileCabinet;

function loadSprites() {
    /**
     * Preload your sprites as images in this function, to use them in your code, use global SM
     * object's SM.get('name').
     */

    SM.add("FileCabinet", loadImage('assets/object/fileCabinet.webp'));
    SM.add("NorthWall", loadImage('assets/background/pcWall.webp')); 
    SM.add("EastWall", loadImage('assets/background/boxesWall.webp')); 
    SM.add("SouthWall", loadImage('assets/background/billBoardWall.webp'));
    SM.add("WestWall", loadImage('assets/background/cabinetWall.webp'));
    SM.add("pinpad", loadImage('assets/object/keypad.webp'));
    SM.add("FullKeypad", loadImage('assets/object/FullKeypad.webp'));

    SM.add("FileCabinet1", loadImage('assets/object/fileCabinet.webp'));
    SM.add("FileCabinet2", loadImage('assets/object/fileCabinet.webp'));
    SM.add("FileCabinet3", loadImage('assets/object/fileCabinet.webp'));
    SM.add("FileCabinet4", loadImage('assets/object/fileCabinet.webp'));

    SM.add("secondNumber", loadImage('assets/object/secondNumber.png'));
    SM.add("screen", loadImage('assets/object/screen.webp'));

    SM.add("SlidingDoor1", loadImage('assets/object/SlidingDoor1.svg'));
    SM.add("SlidingDoor2", loadImage('assets/object/SlidingDoor2.svg'));
    SM.add("SlidingDoor3", loadImage('assets/object/SlidingDoor3.svg'));
    SM.add("SlidingDoor4", loadImage('assets/object/SlidingDoor4.svg'));
    SM.add("connectionTerminated", loadImage('assets/secrets/henry/connectionTerminated.jpg'));

    // Cryo Chamber Assets
    SM.add("placeholderWall", loadImage('assets/placeholders/placeholderWall.png'))
    SM.add("placeholderWindow", loadImage('assets/placeholders/spaceWindow.png'))
    SM.add("MetalWall", loadImage('assets/placeholders/MetalWall.png'));
    
    // New Cryo Chamber sprites (distinct for each chamber)
    SM.add("emptyCryo1", loadImage('assets/object/emptyCryo.webp'));
    SM.add("emptyCryo2", loadImage('assets/object/emptyCryo.webp'));
    SM.add("emptyCryo3", loadImage('assets/object/emptyCryo.webp'));
    SM.add("emptyCryo4", loadImage('assets/object/emptyCryo.webp'));
    SM.add("fullCryo1", loadImage('assets/object/fullCryo.webp'));
    SM.add("fullCryo2", loadImage('assets/object/fullCryo.webp'));
    SM.add("fullCryo3", loadImage('assets/object/fullCryo.webp'));
    SM.add("fullCryo4", loadImage('assets/object/fullCryo.webp'));
    
    // breaker room
    SM.add("closedRepair", loadImage('assets/object/CabinetClosed.png'));
    SM.add("openRepair", loadImage('assets/object/CabinetOpen.png'));
    SM.add("rustyLock", loadImage('assets/object/Padlock.png'));
    SM.add("voltimeter", loadImage('assets/placeholders/breaker/voltimeter.png'));
    SM.add("electricalTape", loadImage('assets/placeholders/breaker/electricaltape.png'));

    SM.add("componentHolder", loadImage('assets/object/BreakerBox.png'));
    SM.add("cpu1", loadImage('assets/object/BlueCPU.png'));
    SM.add("cpu2", loadImage('assets/object/RedCPU.png'));
    SM.add("cpu3", loadImage('assets/object/GreenCPU.png'));
    SM.add("cpu4", loadImage('assets/object/GrayCPU.png'));
    SM.add("northWallBreaker", loadImage('assets/background/electric.png'))
    SM.add("southWallBreaker", loadImage('assets/background/lifeSupport.webp'))
    SM.add("eastWallBreaker", loadImage('assets/background/warning.webp'))
    SM.add("westWallBreaker", loadImage('assets/background/blankWall.png'))
}



class SpriteManager {
    constructor() {
        this.sprites = new Map();
    }

    add(name, img) {
        const sprite = new Sprite(img);
        this.sprites.set(name, sprite);
    }

    get(name) {
        return this.sprites.get(name);
    }
}

class Sprite {
    constructor(src, x = 0, y = 0, scale = 1) {
        this.src = src;
        this.x = x;
        this.y = y;
        this.scale = scale / 100;
        this.customSize = null;
        this.rotation = 0; // in radians
    }

    clone() {
        const copy = new Sprite(this.src);
        copy.x = this.x;
        copy.y = this.y;
        copy.scale = this.scale;       // keep normalized scale (0..1)
        copy.customSize = this.customSize ? { ...this.customSize } : null;
        return copy;
    }


    setScale(scale) {
        this.scale = scale / 100;
        this.customSize = null;
    }

    setSize(w, h) {
        this.customSize = { w, h};
    }

    setPos(x, y) {
        this.x = x;
        this.y = y; 
    }

    setRotation(r){
        this.rotation = r;
    }

    getNativeSize() {
        return [this.src.width, this.src.height];
    }

    getVirtualSize() {
        const u = VM.u();
        const v = VM.v();
        const dpr = pixelDensity(); // or window.devicePixelRatio
        return [
            (this.src.width / dpr) * this.scale / u,
            (this.src.height / dpr) * this.scale / v
        ];
    }

    // temporary because idk what getvirtualsize returns
    // should give us the w and h in virtual units (0-16, and 0-9)
    getWH(){
        let w, h
        if (this.customSize) {
            w = this.customSize.w;
            h = this.customSize.h;
        } else {
            w = this.src.width * this.scale;
            h = this.src.height * this.scale;
        }

        return [w, h]
    }

    draw() {
        const u = VM.u();
        const v = VM.v();

        let w, h
        if (this.customSize) {
            w = this.customSize.w * u;
            h = this.customSize.h * v;
        } else {
            w = this.src.width * this.scale * u;
            h = this.src.height * this.scale * v;
        }

        push();
        
        if(this.rotation != 0){
            translate(this.x*u, this.y*v) // change origin for rotation to be around current sprite
            rotate(this.rotation)
            translate(-(this.x*u), -(this.y*v)) // change origin back for drawing
        }
        image(this.src, this.x * u, this.y * v, w, h )
        pop();
    }

    update(dt) {

    }
}