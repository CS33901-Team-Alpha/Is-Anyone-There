class PlantObject{
    constructor(x, y, spriteName, inspect, scale=0.5){
        this.x = x;
        this.y = y;

        this.plant = SM.get(spriteName);
        this.plant.setPos(x, y);
        this.plant.setScale(scale);
        
        [this.width, this.height] = this.plant.getWH()

        this.inspectComponent = inspect
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
        if (this.isMouseInBounds(p?.x, p?.y) && !GS.is("BotanicalComponentOpen")) {
            GS.set("BotanicalComponentOpen")
            R.add(this.inspectComponent, 20)
            this.inspectComponent.onEnter()
        }
        else {
            GS.unset("BotanicalComponentOpen")
            R.remove(this.inspectComponent)
            this.inspectComponent.onExit()
        }
    }

    onEnter(){
        R.add(this.plant, 10);
    }

    onExit(){
        R.remove(this.plant);
        R.remove(this.inspectComponent)
        this.inspectComponent.onExit()
    }
}
