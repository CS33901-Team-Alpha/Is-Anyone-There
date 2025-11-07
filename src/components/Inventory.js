class InventoryItem {
    constructor(name, spriteName) {
        this.name = name;
        this.spriteName = spriteName;
        this.sprite = SM.get(spriteName);
    }

    getSprite() {
        return this.sprite;
    }
}

class InventoryManager {
    constructor(baseZIndex = 900) {
        this.items = []
    }

    addItem(item){
        this.items.push(item)
        console.log('heres my cock')
        console.log(this.items)
    }

    update(dt){

    }

    draw(){

    }
}