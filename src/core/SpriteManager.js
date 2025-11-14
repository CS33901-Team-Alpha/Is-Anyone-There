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

    SM.add("blankCryo", loadImage('assets/background/CryoBlank.png'));
    SM.add("cryoLeft1", loadImage('assets/background/Cryoleft1.png'));
    SM.add("cryoLeft2", loadImage('assets/background/Cryoleft2.png'));
    SM.add("cryoRight1", loadImage('assets/background/Cryoright1.png'));
    SM.add("cryoRight2", loadImage('assets/background/Cryoright2.png'));
    
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

    //Life Support Room
    SM.add("StatusSign", loadImage('assets/object/SupportStatusSign.png'));
    SM.add("TemperatureSign", loadImage('assets/object/TempSign.png'));
    SM.add("OxygenSign", loadImage('assets/object/OxygenSign.png'));
    SM.add("ElectricalSign", loadImage('assets/object/ElectricalSign.png'));
    SM.add("RedLight1", loadImage('assets/object/RedStatusLight.png'));
    SM.add("RedLight2", loadImage('assets/object/RedStatusLight2.png'));
    SM.add("RedLight3", loadImage('assets/object/RedStatusLight3.png'));
    SM.add("GreenLight1", loadImage('assets/object/GreenStatusLight.png'))
    SM.add("GreenLight2", loadImage('assets/object/GreenStatusLight2.png'))
    SM.add("GreenLight3", loadImage('assets/object/GreenStatusLight3.png'))
    SM.add("OffLight1", loadImage('assets/object/offStatusLight.png'))
    SM.add("OffLight2", loadImage('assets/object/offStatusLight2.png'))
    SM.add("OffLight3", loadImage('assets/object/offStatusLight3.png'))
    SM.add("OffLight4", loadImage('assets/object/offStatusLight4.png'))
    SM.add("OffLight5", loadImage('assets/object/offStatusLight5.png'))
    SM.add("OffLight6", loadImage('assets/object/offStatusLight6.png'))
    SM.add("OxygenScreen", loadImage('assets/object/OxygenScreen.png'))
    SM.add("TemperatureScreen", loadImage('assets/object/TemperatureScreen.png'))
    SM.add("smokeGif", loadImage('assets/object/smokeAnimation.gif'))

    SM.add("northWallSupport", loadImage('assets/background/OxygenView.png'))
    SM.add("southWallSupport", loadImage('assets/background/SupportDoorView.png'))
    SM.add("eastWallSupport", loadImage('assets/background/TemperatureView.png'))
    SM.add("westWallSupport", loadImage('assets/background/StatusView.png'))

    //Reactor Assets
    SM.add("ReactorControlBox", loadImage('assets/object/ControlBox.png'))
    SM.add("ReactorRodsScreen", loadImage('assets/object/RodScreen.png'))
    SM.add("ReactorSequenceScreen", loadImage('assets/object/SequenceScreen.png'))

    SM.add("northWallReactor", loadImage('assets/background/ReactorWall.png'))
    SM.add("southWallReactor", loadImage('assets/background/ReactorEntranceWall.png'))
    SM.add("eastWallReactor", loadImage('assets/background/SequenceWall.png'))
    SM.add("westWallReactor", loadImage('assets/background/StartupWall.png'))
    
    // botanical assets
    SM.add("placeholderPlant", loadImage('assets/object/anthurium.png'))
    SM.add("placeholderPlant2", loadImage('assets/object/monstera.png'))
    SM.add("placeholderPlant3", loadImage('assets/object/mushroom.png'))
    SM.add("placeholderPlant4", loadImage('assets/object/Orchid.png'))
    SM.add("placeholderPlant5", loadImage('assets/object/outdoor.png'))
    SM.add("placeholderPlant6", loadImage('assets/object/pink.png'))
    SM.add("placeholderPlant7", loadImage('assets/object/tiger.png'))

    SM.add("northWallBotanical", loadImage('assets/background/botanical3.png'))
    SM.add("southWallBotanical", loadImage('assets/background/botanical2.png'))
    SM.add("eastWallBotanical", loadImage('assets/background/botanical1.png'))
    SM.add("westWallBotanical", loadImage('assets/background/botanical4.png'))
    

    SM.add("potassiumSuperoxideMolecule", loadImage('assets/placeholders/botanical/potassiumSuperoxide.png'))
    SM.add("potassiumSuperoxideMoleculeIcon", loadImage('assets/placeholders/botanical/potassiumSuperoxideIcon.png'))

    SM.add("testosteroneMolecule", loadImage('assets/placeholders/botanical/testosterone.png'))
    SM.add("testosteroneMoleculeIcon", loadImage('assets/placeholders/botanical/testosteroneIcon.png'))

    SM.add("inferonAlphaProtein", loadImage('assets/placeholders/botanical/inferonAlphaProtein.png'))
    SM.add("inferonAlphaProteinIcon", loadImage('assets/placeholders/botanical/inferonAlphaProteinIcon.png'))
    
    SM.add("ascorbicAcidMolecule", loadImage('assets/placeholders/botanical/ascorbicAcid.png'))
    SM.add("ascorbicAcidMoleculeIcon", loadImage('assets/placeholders/botanical/ascorbicAcidIcon.png'))
    
    SM.add("acidReceptorProtein", loadImage('assets/placeholders/botanical/acidReceptor.png'))
    SM.add("acidReceptorProteinIcon", loadImage('assets/placeholders/botanical/acidReceptorIcon.png'))
    
    SM.add("sorbitolMolecule", loadImage('assets/placeholders/botanical/sorbitol.png'))
    SM.add("sorbitolMoleculeIcon", loadImage('assets/placeholders/botanical/sorbitolIcon.png'))
    
    SM.add("ammoniaMolecule", loadImage('assets/placeholders/botanical/ammonia.png'))
    SM.add("ammoniaMoleculeIcon", loadImage('assets/placeholders/botanical/ammoniaIcon.png'))
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

    /** sets y offset for shake animations for everything single sprite. Probably not very optimized because it sets it for EVERY sprite regardless of if they are
     * on screen
      */
    yOffsetAll(offset){
        for (const [name, sprite] of this.sprites) {
            sprite.setYOffset(offset);
        }
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
        this.yOffset = 0; // in uv units
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
    
    setYOffset(offset){
        this.yOffset = offset;
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

        image(this.src, this.x * u, (this.y+this.yOffset)* v, w, h )
        pop();
    }

    update(dt) {

    }
}