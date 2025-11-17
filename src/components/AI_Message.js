class AiText{
    /*
    General class for displaying simple, non-clickable text on the screen.

    For now aligns x,y to be upper left corner of text
    */
    constructor(x, y, content, size){
        this.x = x
        this.y = y
        this.content = content
        this.size = size
        this.currentCharacter = 0
    }

    draw(){
        const u = VM.u();
        const v = VM.v();

        // --- temporary bit for visibility - NOT PART OF ACTUAL DISPLAYTEXT CLASS
        push();
        let w = textWidth(this.content);
        let h = textAscent() + textDescent();
        fill(80, 80, 80, 210)
        let screenSprite = SM.get("screen");
        rect(0.2 * u, 6.7 * v, 14.6 * u, 8.3 * v, 10);
        if (screenSprite && screenSprite.src) {
            image(screenSprite.src, 0.5 * u, 7 * v, 14 * u, 8 * v);
        }
        pop();

        push()
        fill(255, 192, 0)
        noStroke()
        textFont(terminusFont);
        textSize(this.size*(u/100))
        textAlign(LEFT, TOP)

        let currentString = this.content.substring(0, this.currentCharacter);
        text(currentString, this.x*u, this.y*v);
        //text(this.content, this.x*u, this.y*v);
        pop()

        this.currentCharacter += random(1,1.5);
    }

    // setters and getters
    setY(newY){ this.y = newY}
    getY(){ return this.y}
}

class AiMessageHandler {
    /**
     * Class for handling fading notifications.
     * 
     * Can handle any number of text notifications on screen, maintains timers to fade each indiviudally.
     * 
     * Also for now, the view that uses this class must call TextNotificationHandler.update(dt) in its update.
     * 
     * cleanup() must be called in the onExit of the view to remove all notifications.
     * 
     * @param {Number} x - x coordinate to place text
     * @param {Number} y - y coordinate to place text
     * @param {{zind: Number, existFor: Number}} options - options 
     */
    constructor(x, y, options={}){
        this.x = x;
        this.y = y;

        this.z_index = options.zind ?? 100;
        this.existFor = options.existFor ?? 5; // how many seconds to hold fadeout for

        this.size = 40; // just have it as constant so it's uniform across all views

        // each element is an array where index: 0 is the text object, 1 is the timer for that object's fading mechanics
        // will look something like [[textObject1, 0.3],[textObject2, 0.93],[textObject3, 3.1],...]
        this.textContainer = []
    }

    update(dt){
        // NOTE: if game starts lagging with text notifications this may be the culprit...
        //for(let i = 0; i < this.textContainer.length; i++){
        if(this.textContainer.length > 0) {
            this.textContainer[0][1] += dt
            const textObj = this.textContainer[0][0]
            if(!GS.is("Showing AI Message")) {
                R.add(textObj, this.z_index);
                GS.set("Showing AI Message");
            }

            /* Erase after amount of time*/
            if(this.textContainer[0][1] > this.existFor){
                R.remove(textObj)
                this.textContainer.splice(0, 1) // delete from array
                GS.unset("Showing AI Message");
            }
        }
    }

    setExistFor(value){
        this.existFor = value;
    }

    // add text at position specified at constructor
    addText(text){
        // add to front at Top, create queue structure
        this.textContainer.push([new AiText(this.x, this.y, text, this.size), 0])
        /*if(!this.firstadded) {
            R.add(this.textContainer[this.textContainer.length-1][0], this.z_index);
            this.firstadded = true;
        }*/
    }

    // call this in onExit in your view.
    cleanup(){
        for(let i = 0; i < this.textContainer.length; i++){
            R.remove(this.textContainer[i][0])
        }
        this.textContainer = [] // wipe array
    }
}