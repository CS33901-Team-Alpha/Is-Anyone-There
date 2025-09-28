class DisplayText{
    /*
    General class for displaying simple, non-clickable text on the screen.

    For now aligns x,y to be upper left corner of text
    */
    constructor(x, y, content, size){
        this.x = x
        this.y = y
        this.content = content
        this.size = size

        this.alpha = 255
    }

    draw(){
        const u = VM.u();
        const v = VM.v();

        push()
        noStroke()
        textSize(this.size*(u/100))
        textAlign(LEFT, TOP)
        
        // --- temporary bit for visibility - NOT PART OF ACTUAL DISPLAYTEXT CLASS
        let w = textWidth(this.content);
        let h = textAscent() + textDescent();
        fill(122, 122, 102, 50)
        rect(this.x*u-10, this.y*v-10, w+20, h+20, 8)

        // ---
        fill(0, 0, 0, this.alpha)
        text(this.content, this.x*u, this.y*v)
        pop()
    }

    // setters and getters
    setAlpha(alpha){ this.alpha = alpha }
    getAlpha(){ return this.alpha }
    setY(newY){ this.y = newY}
    getY(){ return this.y}
}

class TextNotificationHandler {
    /**
     * Class for handling fading notifications.
     * 
     * For now, only handles a single text message (plan to maybe do multiple).
     * 
     * Also for now, the view that uses this class must call TextNotificationHandler.update(dt) in its update.
     * 
     * cleanup() must be called in the onExit of the view to remove all notifications.
     * 
     * @param {Number} x - x coordinate to place text
     * @param {Number} y - y coordinate to place text
     * @param {Number} z_ind - z index
     * @param {Number} fadeoutRate - how fast the text will fade, must be in range (0,1), lower => slower
     */
    constructor(x, y, zind=100, fadeoutRate=0.03){
        this.x = x;
        this.y = y;
        this.z_index = zind;
        this.fadeoutRate = fadeoutRate

        this.size = 20; // just have it as constant so it's uniform across all views
        this.alphaCutoff = 5; // remove text notif when alpha less than this value

        this.holdFadeoutFor = 1; // how many seconds to hold fadeout for

        // each element is an array where index: 0 is the text object, 1 is the timer for that object's fading mechanics
        // will look something like [[textObject1, 0.3],[textObject2, 0.93],[textObject3, 3.1],...]
        this.textContainer = []
    }

    update(dt){
        // NOTE: if game starts lagging with text notifications this may be the culprit...
        for(let i = 0; i < this.textContainer.length; i++){
            this.textContainer[i][1] += dt
            const textObj = this.textContainer[i][0]

            /* Fadeout logic, expoentially decay alpha value for text. If alpha gets too low ( < this.alphaCutoff)), make text disappear (looks smoother this way) */
            if(this.textContainer[i][1] > this.holdFadeoutFor){
                textObj.setAlpha(textObj.getAlpha()*(1-this.fadeoutRate)) // new_alpha = old_alpha * (1-fadeout_rate)

                if(textObj.getAlpha() < this.alphaCutoff){
                    R.remove(textObj)
                    this.textContainer.splice(i, 1) // delete from array
                }
            }
        }
    }

    // add text at position specified at constructor
    addText(text){
        let textCount = this.textContainer.length

        // push others down
        for(let i = 0; i < textCount; i++){
            const textObj = this.textContainer[i][0]
            textObj.setY(this.y+(i+1)*0.6) // fixed offset for now. change later
        }

        // add to front at top
        this.textContainer.unshift([new DisplayText(this.x, this.y, text, this.size), 0])
        R.add(this.textContainer[0][0], this.zind)

    }

    // call this in onExit in your view.
    cleanup(){
        for(let i = 0; i < this.textContainer.length; i++){
            R.remove(this.textContainer[0][i])
        }
        this.textContainer = [] // wipe array
    }

}