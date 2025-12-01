export class FileCabinetModel {
    constructor(id, x, y, width = 1.93, height = 2.3, spriteName = "FileCabinet", isSecret = false){
        this.id = id; 
        this.x = x; 
        this.y = y; 
        this.width = width; 
        this.height = height; 
        this.spriteName = spriteName;
        this.isSecret = isSecret;
        this.scale = 1; 
        this.locked = true; // controller can set this to false 
    }

    containsPoint(mx, my){
    const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
    return (
            m.x >= this.x &&
            m.x <= this.x + this.width &&
            m.y >= this.y &&
            m.y <= this.y + this.height
        );
    }
}

export class OpenCabinetModel {
    constructor(){
        this.number = Math.trunc(Math.random() * 4); 
        this.visible = false; // whether cabinet UI is visible
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }
}