export class ReactorController {
    constructor(model, view){
        this.model = model; 
        this.view = view; 
    }

    startSequence(length = 4){
        this.model.resetState(); 
        this.model.startSequence(length);

        this.model.locked = true; 
        this.model.step = 0; 
        this.flashNext(); 
    }

    flashNext(){
        if(this.model.step >= this.model.sequence.length){
            this.model.locked = false; 
            this.model.activeColor = null; 
            this.model.step = 0; 
            return; 
        }

        const colorName = this.model.sequence[this.model.step];
        this.model.activeColor = colorName; 

        const interFlashDelay = max(100, 200 - (this.model.round - 1) * 20);
        setTimeout(() => {
            this.model.activeColor = null;
            this.model.step++;
            setTimeout(() => this.flashNext(), interFlashDelay);
        }, this.model.flashDuration * 1000);
    }


    handleClick(mouseX, mouseY) {
        const u = VM.u();
        const v = VM.v();

        for (const zone of this.view.colorsInfo) {
            const d = dist(mouseX / u, mouseY / v, zone.x, zone.y);
            if (d < 1.2) {
                const result = this.model.handlePlayerInput(zone.name);
                if (result === 'meltdown') this.triggerMeltdown();
                else if (result === 'roundComplete') this.startSequence();
                break;
            }
        }
    }

    triggerMeltdown() {
        AI.addText('>_  MALFUNCTION DETECTED \n>_  Severity: CRITICAL \n>_  REACTOR MELTDOWN BEGUN!!');
        GS.setString("Nuclear Reactors are very dangerous,\nbe careful around them from now on");
        setTimeout(() => {
            this.model.meltdown = true;
            GS.set("Player Died");
        }, 5000);
    }
};