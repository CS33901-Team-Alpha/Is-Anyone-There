class InventoryItem {
    constructor(name, spriteName) {
        this.name = name;
        this.spriteName = spriteName;
        this.sprite = SM.get(spriteName);
    }

    getSprite() {
        return this.sprite;
    }

    setSpriteSize(w, h){
        this.sprite.setSize(w, h)
    }
    
    setSpritePos(x, y){
        this.sprite.setPos(x, y)
    }
}

class InventoryManager {
    constructor(baseZIndex = 900) {
        this.items = []
        this.baseZIndex = baseZIndex

        this.baseX = 14.5;
        this.baseY = 0;

        this.iconSize = 1; // w and h of the icon
        this.marginSize = 0.25;
    }

    addItem(item){
        this.items.push(item);
        this.items.at(-1).setSpriteSize(this.iconSize, this.iconSize);
        
        this.renderAllItems()
    }

    update(dt){

    }

    // draw(){
    //     const u = VM.u(), v = VM.v();
    //     push()

    //     // for(let i = 0; i < this.items.length; i++){
    //     //     itemSprite = this.items[i].getSprite()
    //     // }

    //     pop()
    // }

    // should be called whenever we remove the inventory from renderer
    cleanup(){
        for(let i = 0; i < this.items.length; i++){
            R.remove(this.items[i].getSprite())
        }
    }
    
    // adds all items into renderer
    // should be called to add them back to render if we leave the room and come back
    renderAllItems(){
        for(let i = 0; i < this.items.length; i++){
            let sprt = this.items[i].getSprite()
            sprt.setPos(this.baseX-this.iconSize*i-(this.marginSize)*i, this.baseY)

            R.add(sprt, this.baseZIndex)
        }
    }
}