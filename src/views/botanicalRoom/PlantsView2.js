class PlantsView2 extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);
    }

    onEnter() {
        R.add(this.background);
    }

    onExit() {
        R.remove(this.background);

        this.textNotificationHandler.cleanup();
    }
}