class SynthesisView extends View {
    constructor() {
        super(0, 0, 0, '');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

    }

    
    draw() {
        const u = VM.u(), v = VM.v();
        push();
        
        // Draw keypad panel overlay
        fill(40, 40, 60, 200);
        stroke(100);
        strokeWeight(4);
        rect(1.5 * u, 1 * v, 13 * u, 7 * v);
        
        // Draw title
        fill(200);
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(0.4 * v);
        text("LIFE SUPPORT ACCESS", 8 * u, 1.8 * v);
        
        // Draw input display area
        fill(20, 20, 30);
        stroke(150);
        strokeWeight(2);
        rect(2 * u, 2.5 * v, 8 * u, 0.8 * v);
        
        pop();
    }
    
    onEnter() {
        R.add(this.background);

    }

    onExit() {
        R.remove(this.background);
    }
}