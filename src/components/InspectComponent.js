/**
 * General class that we can use to make a pop up UI that dispalys some kind of information and offers an action.
 */

class InspectComponent{
    /**
     * To use: create and store an instance of this on the "inspectable" object's constructor.
     * On click do, add your instance of inspectComponent to R, then call onEnter for inspectComponent.
     * 
     * Default behavior is clicking outside the inspect window closes it.
     * 
     * TODO: make positions of everything flexible, for now things are kind of just manually placed. My idea was to make everything configurable through options={}
     * 
     * TODO: make some sort of automatically calculating positioning for text based on the dimensions of box
     * 
     * @param {string} title 
     * @param {string} description 
     * @param {string} image 
     * @param {string} actionName 
     */
    constructor(title, description, imageName, actionName, actionCallback=()=>{}, options={}){
        this.title = title;
        this.description = description;
        this.imageName = imageName;
        this.actionName = actionName;
        this.actionCallback = actionCallback;

        // need for click bounds checking
        [this.x, this.y, this.width, this.height] = [4.5, 1, 7, 7]
        
        // extract options
        this.backgroundColor = options.backgroundColor ?? [40, 40, 60, 200] // rgba
        this.holderColor = options.holderColor ?? [40, 80, 60, 220] // rgba
        this.actionButtonColor = options.actionButtonColor ?? [40, 80, 145, 240] // rgba
        this.actionButtonHoverColor = options.actionButtonColor ?? [15, 50, 100, 240] // rgba
        this.baseZIndex = options.baseZIndex ?? 9999; // so it can be displayed on top of other things in room
        
        // we also need to set the action button x, y, w and h for bounds checking
        [this.xA, this.yA, this.widthA, this.heightA] = [6.3, 6.8, 3.4, 0.8]
        this.hoveringAction = false; // if we are hovering over action

        this.actionTriggered = false;

        // inspection image
        this.slotSize = 3;
        this.imageSprite = SM.get(this.imageName);
        this.imageSprite.setPos(6.5, 2.35);
        this.imageSprite.setSize(this.slotSize, this.slotSize)
    }

    draw(){
        const u = VM.u(), v = VM.v();

        push();
        
        // color window
        let color = this.backgroundColor
        fill(color[0], color[1], color[2], color[3]);
        stroke(100);
        strokeWeight(4);
        rect(this.x * u, this.y * v, this.width * u, this.height * v);

        // title text
        fill(255, 255, 255)
        stroke(0)
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(0.6 * v);
        text(this.title, 8 * u, 1.6 * v);

        // slot for the molecule
        color = this.holderColor
        fill(color[0], color[1], color[2], color[3]);
        stroke(50);
        strokeWeight(4);
        rect(6.5 * u, 2.35 * v, this.slotSize * u, this.slotSize * v);

        // description text
        fill(220, 220, 220)
        stroke(0)
        textFont(terminusFont);
        textSize(0.17 * v);
        text(this.description, 5.75 * u, 6 * v, u*4.5); // set max width so it wraps

        // action button background and text
        color = this.hoveringAction ? this.actionButtonHoverColor : this.actionButtonColor 
        fill(color[0], color[1], color[2], color[3]);
        stroke(50);
        strokeWeight(4);
        rect(this.xA * u, this.yA * v, this.widthA * u, this.heightA * v);

        // action text
        fill(255, 255, 255)
        stroke(0)
        textFont(terminusFont);
        textAlign(CENTER, CENTER);
        textSize(0.25 * v);
        text(this.actionName, 8 * u, 7.2 * v);

        pop();
    }

    update(dt){
        const m = VM.mouse();

        // check if mouse is inside the action button
        if(this.isMouseInAction(m.x, m.y)){
            this.hoveringAction = true;
        }
        else{
            this.hoveringAction = false;
        }
    }

    onEnter(){
        R.add(this.imageSprite, this.baseZIndex+1)

        // reset positioning on load because I plan on reusing the sprites
        this.imageSprite.setPos(6.5, 2.35);
        this.imageSprite.setSize(this.slotSize, this.slotSize)
    }

    onExit(){
        R.selfRemove(this)
        R.remove(this.imageSprite)
    }

    // if mouse is within bounds of action button
    isMouseInAction(mx, my){
        return mx >= this.xA && mx <= this.xA + this.widthA && my >= this.yA && my <= this.yA + this.heightA
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
        const m = VM.mouse();

        // is mouse NOT in bounds
        if (!this.isMouseInBounds(p?.x, p?.y)) {
            this.onExit()
        }
        else if (this.isMouseInAction(m.x, m.y)) {
            if (!this.actionTriggered) {
                this.actionCallback();
                this.actionTriggered = true;
            }
        }

    }
}