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
        fill(102, 102, 82, 200)
        rect(this.x*u-10, this.y*v-10, w+20, h+20, 8)

        // ---
        fill(222, 222, 222, this.alpha)
        text(this.content, this.x*u, this.y*v)
        pop()
    }

    // setters and getters
    setAlpha(alpha){ this.alpha = alpha }
    getAlpha(){ return this.alpha }
    setY(newY){ this.y = newY}
    getY(){ return this.y}
}

export class TextNotificationHandler {
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
     * @param {{zind: Number, fadeoutRate: Number, holdFadeoutFor: Number}} options - options 
     */
    // - old usage: new TextNotificationHandler(x, y, options)
    // - new usage: new TextNotificationHandler(x, y, w=null, h=null, renderer=null)
    constructor(x, y, w = null, h = null, renderer = null) {
        // support old calling form where third arg is an options object
        let options = {};
        if (w && typeof w === "object") {
            options = w;
            w = options.w ?? null;
            h = options.h ?? null;
            renderer = options.renderer ?? renderer;
        }

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // use provided renderer or fall back to global window.R if available
        this.R = renderer || (typeof window !== "undefined" ? window.R : null);

        // defaults for options
        this.z_index = options.zind ?? 100;
        this.fadeoutRate = options.fadeoutRate ?? 0.03;
        this.holdFadeoutFor = options.holdFadeoutFor ?? 1; // seconds to hold before fading

        this.size = 20;
        this.alphaCutoff = 5;
        this.textContainer = [];
    }

    update(dt){
        for (let i = 0; i < this.textContainer.length; i++) {
            this.textContainer[i][1] += dt;
            const textObj = this.textContainer[i][0];

            if (this.textContainer[i][1] > this.holdFadeoutFor) {
                textObj.setAlpha(textObj.getAlpha() * (1 - this.fadeoutRate));

                if (textObj.getAlpha() < this.alphaCutoff) {
                    if (this.R) this.R.remove(textObj);
                    else if (typeof window !== 'undefined' && window.R) window.R.remove(textObj);
                    this.textContainer.splice(i, 1);
                    i--;
                }
            }
        }
    }

    // add text at position specified at constructor
    addText(text){
        const textCount = this.textContainer.length;
        for (let i = 0; i < textCount; i++) {
            const textObj = this.textContainer[i][0];
            textObj.setY(this.y + (i + 1) * 0.6);
        }

        this.textContainer.unshift([new DisplayText(this.x, this.y, text, this.size), 0]);
        const dtObj = this.textContainer[0][0];
        if (this.R) this.R.add(dtObj, this.z_index);
        else if (typeof window !== 'undefined' && window.R) window.R.add(dtObj, this.z_index);

    }

    // call this in onExit in your view.
    cleanup(){
        for (let i = 0; i < this.textContainer.length; i++) {
            const t = this.textContainer[i][0];
            if (this.R) this.R.remove(t);
            else if (typeof window !== 'undefined' && window.R) window.R.remove(t);
        }
        this.textContainer = [];
    }

}