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
        push()
        noStroke()
        textSize(this.size)
        textAlign(LEFT, TOP)
        
        // --- temporary bit for visibility - NOT PART OF ACTUAL DISPLAYTEXT CLASS
        let w = textWidth(this.content);
        let h = textAscent() + textDescent();
        fill(0, 204, 102, 170)
        rect(this.x-10, this.y-10, w+20, h+20, 8)

        // ---
        fill(0, 0, 0, this.alpha)
        text(this.content, this.x, this.y)
        pop()
    }

    // getters
    setAlpha(alpha){ this.alpha = alpha }
    getAlpha(){ return this.alpha }
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
     * @param {Number} fadeoutRate - how fast the text will fade, must be in range (0,1), lower => slower
     */
    constructor(x, y, fadeoutRate=0.03){
        this.x = x;
        this.y = y;
        this.fadeoutRate = fadeoutRate

        this.size = 30; // just have it as constant so it's uniform across all views

        this.text = null
        this.timer = 0
        this.fadeoutLocket = true
        this.holdFadeout = true;
    }

    update(dt){
        if(this.text != null){ // only start updates and timers if the text has been set 

            // holds the fadeout effect for 1 second
            if(this.holdFadeout){
                this.timer += dt

                if(this.timer > 1){
                    this.holdFadeout = false
                }
            }
            
            /* Fadeout logic, expoentially decay alpha value for text. If alpha gets too low (30 for now), make text disappear (looks smoother this way) */
            if(!this.holdFadeout){
                this.text.setAlpha(this.text.getAlpha()*(1-this.fadeoutRate)) // new_alpha = old_alpha * (1-fadeout_rate)

                if(this.text.getAlpha() < 30){
                    this.cleanup()
                    this.holdFadeout = true
                }
            }
        }
    }

    // add text at position specified at constructor
    addText(text){
        if(this.text == null){
            this.text = new DisplayText(this.x, this.y, text, this.size)
            R.add(this.text, 100)
        }
        /* If we tried to addText again (so if a user clicks what caused the notification), then it will reset timers so the notification
        stays for a bit longer.
         */
        else{
            this.timer = 0
            this.holdFadeout = true
            this.text.setAlpha(255)
        }
    }

    // call this in onExit in your view.
    cleanup(){
        R.remove(this.text)
        this.text = null
    }

}