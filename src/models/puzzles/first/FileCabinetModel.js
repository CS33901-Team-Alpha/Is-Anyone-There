export class FileCabinetModel {
    constructor(id, x, y, width = 1.93, height = 2.3){
        this.id = id; 
        this.x = x; 
        this.y = y; 
        this.width = width; 
        this.height = height; 
        this.locked = true; // controller can set this to false 
    }

    containsPoint(mx, my){
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
        this.number = Math.trunc(Math.random() * 5) + 1; 
        this.active = false; // so that controller can use this later
    }
}