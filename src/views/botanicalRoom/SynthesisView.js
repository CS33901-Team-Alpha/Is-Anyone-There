class BioLabUI {
    /**
     * Crafting logic, slot counts and stuff like that is mostly hard coded for now.
     */

    constructor() {
        // craft button coordinates and bounds
        this.craftX = 10.5;
        this.craftY = 4.5;
        this.craftW = 2.5;
        this.craftH = 1;

        this.slotSize = 2;

        this.hoveringAction = false;

        // target item names for each slot, along with their images names
        this.targetItems = {'Inferon Alpha': SM.get('inferonAlphaProtein'),
             'Testosterone': SM.get('testosteroneMolecule'), 
             'Ascorbic Acid': SM.get('ascorbicAcidMolecule')};
        
        // names of items player has collected
        this.heldItemNames = [];

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);
    }

    // check if we have all 3 ingredients that are in target items
    validateIngredients(){
        for(const key of Object.keys(this.targetItems)){
            let haveIngredient = false;
            for(let i = 0; i < this.heldItemNames.length; i++){
                if(key == this.heldItemNames[i]){
                    haveIngredient = true;
                }
            }
            if(!haveIngredient) {return false}
        }

        return true;
    }

    update(dt) {
        this.textNotificationHandler.update(dt);

        const m = VM.mouse();

        // check if mouse is inside the button
        if(this.isMouseInBounds(m.x, m.y, this.craftX, this.craftY, this.craftW, this.craftH)){
            this.hoveringAction = true;
        }
        else{
            this.hoveringAction = false;
        }
    }

    draw(){
        const u = VM.u();
        const v = VM.v();

        push()

        // background
        fill(40, 40, 60, 200);
        stroke(100);
        strokeWeight(4);
        rect(1.5 * u, 1 * v, 13 * u, 7 * v);

        // title
        fill(200);
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(0.7 * v);
        text("Biological Laboratory", 8 * u, 1.8 * v);
        
        // description text
        fill(20, 255, 20);
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(0.3 * v);
        text("Biochemical synthesis initialized. System prepared to receive reagents.", 8 * u, 2.5 * v);

        // slot 1
        fill(140, 140, 140);
        stroke(100);
        strokeWeight(2);
        rect(2 * u, 4 * v, this.slotSize * u, this.slotSize * v);

        // see if held items include the target item for this slot 
        if(this.heldItemNames.includes(Object.keys(this.targetItems)[0])){
            // get the sprite and show it
            let sprite = this.targetItems[Object.keys(this.targetItems)[0]]
            sprite.setPos(2, 4)
            sprite.setSize(this.slotSize, this.slotSize);
            sprite.draw()
        }
        else{
            fill(20, 100, 20);
            textFont(terminusFont);
            textSize(1.5 * v);
            text("?", (2+1) * u, (4+1) * v);
        }

        // slot 2
        fill(140, 140, 140);
        stroke(100);
        strokeWeight(2);
        rect(4.5 * u, 4 * v, this.slotSize * u, this.slotSize * v);

        if(this.heldItemNames.includes(Object.keys(this.targetItems)[1])){
            let sprite = this.targetItems[Object.keys(this.targetItems)[1]]
            sprite.setPos(4.5, 4)
            sprite.setSize(this.slotSize, this.slotSize);
            sprite.draw()
        }
        else{
            fill(20, 100, 20);
            textFont(terminusFont);
            textSize(1.5 * v);
            text("?", (4.5+1) * u, (4+1) * v);
        }

        // slot 3
        fill(140, 140, 140);
        stroke(100);
        strokeWeight(2);
        rect(7 * u, 4 * v, this.slotSize * u, this.slotSize * v);

        if(this.heldItemNames.includes(Object.keys(this.targetItems)[2])){
            let sprite = this.targetItems[Object.keys(this.targetItems)[2]]
            sprite.setPos(7, 4)
            sprite.setSize(this.slotSize, this.slotSize);
            sprite.draw()
        }
        else{
            fill(20, 100, 20);
            textFont(terminusFont);
            textSize(1.5 * v);
            text("?", (7+1) * u, (4+1) * v);
        }

        // craft button
        if(this.hoveringAction){ fill(40, 150, 40, 170); }
        else{ fill(40, 200, 40, 170); }
        stroke(100);
        strokeWeight(2);
        rect(this.craftX * u, this.craftY * v, this.craftW * u, this.craftH * v);

        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(0.3 * v);
        text("Synthesize", (this.craftX+this.craftW/2) * u, (this.craftY+this.craftH/2) * v);

        pop()
    }

    onEnter() {
        // check collected items to replace question marks in synthesis view
        let items = IM.getAllItems()
        for(let i = 0; i < items.length; i++){
            this.heldItemNames.push(items[i].getName())
        }
    }
    onExit() {
        this.heldItemNames = []
        this.textNotificationHandler.cleanup()
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y, this.craftX, this.craftY, this.craftW, this.craftH)) {
            console.log('click synthesize')

            if(this.validateIngredients()){ // if we have all ingredients in the slcts
                GS.unset('BotanicalQuarantine')
                this.textNotificationHandler.addText("You have synthesized and applied the cure.")
                AI.addText('>_  AIRBORNE CONTAMINANTS NO LONGER PRESENT... \n>_  NO TRACE OF CONTAMINANTS ON SHIP... \n>_  PROCEDURE: DISABLE QUARANTINE PROTOCOL');

                AM.fadeOut('contagionAlarm', 3000)

                R.remove(secondaryTimer)
            }
            else{
                this.textNotificationHandler.addText("The biolab could not be turned on.")
            }
        }
    }

    isMouseInBounds(mx, my, x, y, w, h) {
        const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();

        return (
            m.x >= x &&
            m.x <= x + w &&
            m.y >= y &&
            m.y <= y + h
        );
    }
}

class SynthesisView extends View {
    constructor() {
        super();
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);
        
        this.bioLabUI = new BioLabUI()
    }

    update(dt){

    }

    onEnter() {
        R.add(this.background);
        R.add(this.bioLabUI, 10)
        this.bioLabUI.onEnter()
    }
    
    onExit() {
        R.remove(this.background);
        R.remove(this.bioLabUI)
        this.bioLabUI.onExit()

        this.textNotificationHandler.cleanup();
    }   
}