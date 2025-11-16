/**
 * This is supposed to be a colored overlay to indicate to the player that they are dying of radiation. 
 * The main functionality is, rendering this colored overlay (initially, alpha = 0, so invisible), then
 * gradually making it stronger until this.stopAt value, then maintaining it there.
 * 
 * TODO: merge with DarkeningOverlay into a "Colored Overlay" component, I just kept them separate in case functionality gets too different
 */
class RadiationOverlay{
    constructor(){
        this.strength = 0;
        this.radiationRate = 5;
        this.stopAt = 70; // what alpha value to freeze at  
        this.timer = 0;
    }

    update(dt){
        this.timer += dt;

        if((this.timer > 0.05) && (this.strength < this.stopAt)){ 
            this.timer = 0;
            this.strength += this.radiationRate;
        }
    }

    draw(){
        const u = VM.u(), v = VM.v();

        push();
        fill(0,161,230, this.strength);
        stroke(0)
        rect(0 * u, 0 * v, 16 * u, 9 * v);

        pop();
    }
}