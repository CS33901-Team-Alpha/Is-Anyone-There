let fileCabinet;

function loadSprites() {
    /**
     * Preload your sprites as images in this function, to use them in your code, use global SM
     * object's SM.get('name').
     */

    SM.add("FileCabinet", loadImage('assets/object/fileCabinet.webp'));
    SM.add("NorthWall", loadImage('assets/background/pcWall.webp')); 

    SM.add("EastWall1", loadImage('assets/background/boxesWall1.png')); 
    SM.add("EastWall2", loadImage('assets/background/boxesWall2.png')); 
    SM.add("EastWall3", loadImage('assets/background/boxesWall3.png')); 
    SM.add("EastWall4", loadImage('assets/background/boxesWall4.png')); 
    SM.add("EastWall5", loadImage('assets/background/boxesWall5.png')); 
    SM.add("EastWall6", loadImage('assets/background/boxesWall6.png')); 
    SM.add("EastWall7", loadImage('assets/background/boxesWall7.png')); 
    SM.add("EastWall8", loadImage('assets/background/boxesWall8.png')); 
    SM.add("EastWall9", loadImage('assets/background/boxesWall9.webp')); 

    SM.add("SouthWall1", loadImage('assets/background/billBoardWall1.png'));
    SM.add("SouthWall2", loadImage('assets/background/billBoardWall2.png'));
    SM.add("SouthWall3", loadImage('assets/background/billBoardWall3.png'));
    SM.add("SouthWall4", loadImage('assets/background/billBoardWall4.png'));
    SM.add("SouthWall5", loadImage('assets/background/billBoardWall5.png'));
    SM.add("SouthWall6", loadImage('assets/background/billBoardWall6.png'));
    SM.add("SouthWall7", loadImage('assets/background/billBoardWall7.webp'));
    SM.add("SouthWall8", loadImage('assets/background/billBoardWall8.png'));
    SM.add("SouthWall9", loadImage('assets/background/billBoardWall9.png'));

    SM.add("WestWall", loadImage('assets/background/cabinetWall.webp'));
    SM.add("pinpad", loadImage('assets/object/keypad.webp'));
    SM.add("FullKeypad", loadImage('assets/object/FullKeypad.webp'));

    SM.add("FileCabinet1", loadImage('assets/object/fileCabinet.webp'));
    SM.add("FileCabinet2", loadImage('assets/object/fileCabinet.webp'));
    SM.add("FileCabinet3", loadImage('assets/object/fileCabinet.webp'));
    SM.add("FileCabinet4", loadImage('assets/object/fileCabinet.webp'));

    SM.add("secondNumber1", loadImage('assets/object/pinpadGreen1.png'));
    SM.add("secondNumber2", loadImage('assets/object/pinpadGreen2.png'));
    SM.add("secondNumber3", loadImage('assets/object/pinpadGreen3.png'));
    SM.add("secondNumber4", loadImage('assets/object/pinpadGreen4.png'));
    SM.add("secondNumber5", loadImage('assets/object/pinpadGreen5.png'));
    SM.add("secondNumber6", loadImage('assets/object/pinpadGreen6.png'));
    SM.add("secondNumber7", loadImage('assets/object/pinpadGreen7.png'));
    SM.add("secondNumber8", loadImage('assets/object/pinpadGreen8.png'));
    SM.add("secondNumber9", loadImage('assets/object/pinpadGreen9.png'));
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

    SM.add("CryoPad", loadImage('assets/object/CryoPadScreen.png'))

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

    //Map Room
    SM.add("MapUnsolved", loadImage('assets/object/MapPuzzleUnsolved.png'))
    SM.add("MapSolved", loadImage('assets/object/MapPuzzleSolved.png'))

    SM.add("northWallMap", loadImage('assets/background/map1.png'))
    SM.add("southWallMap", loadImage('assets/background/map3.png'))
    SM.add("eastWallMap", loadImage('assets/background/map2.png'))
    SM.add("westWallMap", loadImage('assets/background/map4.png'))

    SM.add("minimap0", loadImage('assets/object/minimap0.png'))
    SM.add("minimap1", loadImage('assets/object/minimap1.png'))
    SM.add("minimap2", loadImage('assets/object/minimap2.png'))
    SM.add("minimap3", loadImage('assets/object/minimap3.png'))
    SM.add("minimap4", loadImage('assets/object/minimap4.png'))
    SM.add("minimap5", loadImage('assets/object/minimap5.png'))
    SM.add("minimap6", loadImage('assets/object/minimap6.png'))
    SM.add("minimap7", loadImage('assets/object/minimap7.png'))

    //Engine Room
    SM.add("BlueButtonOn", loadImage('assets/object/BlueButtonOn.png'))
    SM.add("BlueButtonOff", loadImage('assets/object/BlueButtonOff.png'))
    SM.add("BlueSwitchOn", loadImage('assets/object/BlueSwitchOn.png'))
    SM.add("BlueSwitchOff", loadImage('assets/object/BlueSwitchOff.png'))
    SM.add("GreenOn", loadImage('assets/object/GreenOn.png'))
    SM.add("GreenOff", loadImage('assets/object/GreenOff.png'))
    SM.add("OrangeOn", loadImage('assets/object/OrangeOn.png'))
    SM.add("OrangeOff", loadImage('assets/object/OrangeOff.png'))
    SM.add("PinkOn", loadImage('assets/object/PinkOn.png'))
    SM.add("PinkOff", loadImage('assets/object/PinkOff.png'))
    SM.add("PurpleOn", loadImage('assets/object/PurpleOn.png'))
    SM.add("PurpleOff", loadImage('assets/object/PurpleOff.png'))
    SM.add("RedOn", loadImage('assets/object/RedOn.png'))
    SM.add("RedOff", loadImage('assets/object/RedOff.png'))
    SM.add("YellowOn", loadImage('assets/object/YellowOn.png'))
    SM.add("YellowOff", loadImage('assets/object/YellowOff.png'))

    SM.add("SmallGear", loadImage('assets/object/SmallGear.png'))
    SM.add("MediumGear", loadImage('assets/object/MediumGear.png'))
    SM.add("LargeGear", loadImage('assets/object/LargeGear.png'))

    SM.add("EngineRoom1", loadImage('assets/background/EngineEntrance.png'))
    SM.add("EngineRoom2", loadImage('assets/background/GearboxView.png'))
    SM.add("EngineRoom3", loadImage('assets/background/EngineView.png'))
    SM.add("EngineRoom4", loadImage('assets/background/SequenceView.png'))
    
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