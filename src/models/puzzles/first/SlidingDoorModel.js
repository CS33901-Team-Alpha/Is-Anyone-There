export class SlidingDoorModel {
    /**
     * 
     * @param {Object{ locked: boolean, ... }} cfg 
     */
    constructor(cfg = { locked: true, lockedCondition: (() => false), autoCloseDelay: 2, frameDuration: 0.1 }) {
        this.locked = cfg.locked ?? true;
        this.lockedCondition = cfg.lockedCondition ?? (() => false);

        this.currentFrame = 0;
        this.isOpen = false;
        this.animating = false;
        this.animationTimer = 0;

        this.autoCloseDelay = cfg.autoCloseDelay ?? 2;
        this.autoCloseTimer = 0;

        this.frameDuration = cfg.frameDuration ?? 0.1;
    }

    toggle() {
        if(!this.isOpen && (this.locked || this.lockedCondition())){
            return;
        }
        this.isOpen = !this.isOpen;
        this.animating = true;
        this.animationTimer = 0;

        if (this.isOpen) {
            this.autoCloseTimer = this.autoCloseDelay;
        }
    }
}
