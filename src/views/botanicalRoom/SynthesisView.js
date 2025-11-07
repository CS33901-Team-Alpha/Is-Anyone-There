class SynthesisView extends View {
    constructor() {
        super(0, 0, 0, '');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.alarmOverlay = new AlarmOverlay(() => GS.is('BotanicalQuarantine'));
    }

    
    draw() {
        const u = VM.u(), v = VM.v();
        push();
        pop();
    }
    
    onEnter() {
        R.add(this.background);
        R.add(this.alarmOverlay, 100)

    }

    onExit() {
        R.remove(this.background);
        R.add(this.alarmOverlay)
    }
}