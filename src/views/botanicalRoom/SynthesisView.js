class SynthesisView extends View {
    constructor() {
        super(0, 0, 0, '');
        this.background = SM.get("MetalWall");
        if (this.background && typeof this.background.setSize === 'function') this.background.setSize(16, 9);

        // Hint lines to display
        this.hintLines = [
            "Puzzle Hint:",
            "Ascorbic Acid + Erythoxylum Coca → Cytoprotection Agent",
            "Cytoprotection Agent + Inferon Alpha Protein → Neuroshield Complex"
        ];
    }

    onEnter() {
        if (this.background) R.add(this.background, 0);
    }

    draw() {
        if (this.background) {
            this.background.draw();
        } else {
            push();
            background(30);
            pop();
        }

        const u = VM.u(), v = VM.v();
        push();
        // hint panel background
        fill(0, 0, 0, 160);
        stroke(255, 200);
        rect(0.5 * u, 0.5 * v, 15 * u, 2 * v, 6);

        // hint text
        noStroke();
        fill(230);
        textFont(terminusFont);
        textSize(0.26 * v);
        textAlign(LEFT, TOP);
        for (let i = 0; i < this.hintLines.length; i++) {
            text(this.hintLines[i], (0.7) * u, (0.6 + i * 0.45) * v);
        }
        pop();
    }

    onExit() {
        if (this.background) R.remove(this.background);
    }
}