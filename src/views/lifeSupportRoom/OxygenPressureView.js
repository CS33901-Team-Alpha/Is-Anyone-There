class OxygenPressureView extends View {
  constructor() {
    super();

    this.background = SM.get("MetalWall");
    this.background.setSize(16, 9);

    this.startingPressures = [0.2, 0.4, 0.5, 0.2];
    this.bars = [
      { label: "A", pressure: 0.2, x: 2,  y: 4, width: 1, height: 3 },
      { label: "B", pressure: 0.4, x: 5,  y: 4, width: 1, height: 3 },
      { label: "C", pressure: 0.5, x: 8,  y: 4, width: 1, height: 3 },
      { label: "D", pressure: 0.2, x: 11, y: 4, width: 1, height: 3 },
    ];

    this.influenceMatrix = [
      [ +0.2,  0.0, +0.1,  0.0 ],
      [  0.0, +0.1, -0.1, +0.1 ],
      [  0.0, +0.1,  0.0, +0.2 ],
      [  0.0, +0.2, +0.1,  0.0 ],
    ];

    this.targetPressure = 1.0;
    this.solved = false;

    this.buttons = [];
    const buttonY = 7;
    const buttonSize = 1.2;

    for (let i = 0; i < 4; i++) {
      const buttonX = 2 + i * 3;
      const button = new Button(
        buttonX,
        buttonY,
        buttonSize,
        () => this.changePressure(i)
      );
      this.buttons.push(button);
    }

    this.resetButton = new Button(13, 6, 1.5, () => this.resetPuzzle());
  }

  resetPuzzle() {
    for (let i = 0; i < this.bars.length; i++) {
      this.bars[i].pressure = this.startingPressures[i];
    }
    this.solved = false;
  }

  changePressure(index) {
    if (this.turnTimer < this.turnCooldown || this.solved) return;

    const influence = this.influenceMatrix[index];

    const valid = this.bars.every((bar, i) => {
      const next = bar.pressure + influence[i];
      return next >= 0 && next <= 1;
    });

    if (!valid) return; 

    for (let i = 0; i < this.bars.length; i++) {
      const delta = influence[i];
      const bar = this.bars[i];
      bar.pressure = Math.min(1, Math.max(0, bar.pressure + delta));
    }

    if (this.checkWin()) {
      this.solved = true;
      this.onSolved();
    }
  }

  checkWin() {
    console.log("Checking for win");
    return this.bars.every(b => (b.pressure > this.targetPressure - 0.00001));
  }

  onSolved() {
    console.log("Oxygen puzzle solved");
  }

  update(dt) {
    this.turnTimer += dt;
    for (const b of this.buttons) b.update(dt);
    this.resetButton.update(dt);
  }

  draw() {
    this.background?.draw();

    const solved = this.solved;

    for (const bar of this.bars) {
      const u = VM.u();
      const v = VM.v();

      stroke(solved ? "green" : "red");
      strokeWeight(2);
      fill(0, 100, 255); // blue fill

      rect(bar.x * u, bar.y * v, bar.width * u, bar.height * v);

      fill(0, 150, 255);
      noStroke();
      rect(
        bar.x * u,
        (bar.y + bar.height * (1 - bar.pressure)) * v,
        bar.width * u,
        bar.height * bar.pressure * v
      );

      fill("white");
      textAlign(CENTER, CENTER);
      textSize(0.5 * u);
      text(bar.label, (bar.x + 0.5) * u, (bar.y + bar.height + 0.5) * v);
    }

    for (const button of this.buttons) button.draw();

    this.resetButton.draw();
    fill("black");
    textAlign(CENTER, CENTER);
    textSize(0.6 * VM.U);
    text("Reset", (13 + 0.75) * VM.U, (6 + 0.6) * VM.V);
  }

  mousePressed(p) {
    for (const button of this.buttons) button.mousePressed(p);
    this.resetButton.mousePressed(p);
  }
}