class OxygenPressureView extends View {
  constructor() {
    super();

    this.background = SM.get("northWallSupport");
    this.background.setSize(16, 9);

    this.influenceMatrixLayouts = [
      [
        [ +0.2,  0.0, +0.1,  0.0 ],  // KEY: AAACCCDCA
        [  0.0, +0.1, -0.1, +0.1 ],
        [  0.0, +0.1,  0.0, +0.2 ],
        [  0.0, +0.2, +0.1,  0.0 ],
      ],
      [
        [ +0.1, +0.3,  0.0, +0.2 ],  // KEY: ADCBBA
        [ +0.2,  0.0, +0.2, +0.1 ],
        [  0.0, +0.1,  0.0, +0.3 ],
        [ +0.1, +0.3, +0.1,  0.0 ],
      ], 
      [
        [ +0.2, +0.1, +0.2,  0.0 ],  // KEY: DCCBA
        [  0.0, +0.1, +0.2, +0.2 ],
        [ +0.1, +0.3, +0.2, +0.1 ],
        [ +0.3,  0.0, +0.1, +0.3 ],
      ],
      [
        [ +0.3, +0.1, +0.1, +0.3 ],  // KEY: BDDAC
        [  0.0, +0.3, +0.1, +0.3 ],
        [ +0.5, +0.4, +0.3, +0.2 ],
        [ +0.1,  0.0, +0.2,  0.0 ],
      ],
      [
        [ +0.2, +0.1,  0.0, +0.1 ],  // KEY: DDACBBBC
        [ +0.1, +0.1, +0.1, +0.2 ],
        [ +0.1, +0.1, +0.1,  0.0 ],
        [  0.0, +0.1, +0.2, +0.1 ],
      ],
    ];

    this.pressureLayouts = [
        [0.2, 0.4, 0.5, 0.2],
        [0.3, 0.0, 0.5, 0.1],
        [0.3, 0.2, 0.1, 0.3],
        [0.0, 0.2, 0.1, 0.2],
        [0.3, 0.2, 0.1, 0.1]
    ];

    this.seed = int(random(0,5))
    this.influenceMatrix = this.influenceMatrixLayouts[this.seed];
    this.startingPressures = this.pressureLayouts[this.seed];

    this.bars = [
      { pressure: this.startingPressures[0], x: 2,  y: 2, width: 1, height: 3 },
      { pressure: this.startingPressures[1], x: 5,  y: 2, width: 1, height: 3 },
      { pressure: this.startingPressures[2], x: 8,  y: 2, width: 1, height: 3 },
      { pressure: this.startingPressures[3], x: 11, y: 2, width: 1, height: 3 },
    ];

    this.targetPressure = 1.0;
    this.solved = false;

    this.buttons = [];
    const buttonY = 5.5;
    const buttonSize = 1;

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

    this.resetButton = new Button(13, 4, 1.5, () => this.resetPuzzle());

    this.screenTimer = screenTimer

    this.closeBtn = new Button(14, 1.2, 0.8, (self) => {
      this.activeInterface = "ScreenView";
      R.add(this.highlight);
      R.add(this.screenSprite);
      R.remove(this.closeBtn);
    });

    // clickable highlight
    this.highlight = new HighlightEvent(6, 2.5, 4.4, 2.8, 255,255,255,() =>{
      R.remove(this.highlight);
      R.remove(this.screenSprite);
      R.add(this.closeBtn);
      this.activeInterface = "PuzzleView";
    });

    this.screenSprite = SM.get("OxygenScreen");
    this.screenSprite.setPos(5.1, 2);
    this.screenSprite.setScale(0.5);

    this.locked = false;

    this.activeInterface = "ScreenView";
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
    AI.addText('>_  ACTION RECOGNIZED... \n>_  OXYGEN SUPPORT SYSTEM STABILIZING... \n>_  SYSTEM REMAINS CRITICAL - MANUAL ACTIONS REQUIRED');
    GS.set("regulateOxygenPuzzleSolved");
    this.screenTimer.addTime(30)
  }

  update(dt) {
    this.turnTimer += dt;
    for (const b of this.buttons) b.update(dt);
    this.resetButton.update(dt);
  }

  draw() {
    const u = VM.u();
    const v = VM.v();

    this.background?.draw();

    if(this.activeInterface == "PuzzleView") {
      const solved = this.solved;

      fill(0, 0, 0, 180); // Red, Green, Blue
      rect(1*u, 1*v, 14*u, 6.25*v);

      for (const bar of this.bars) {
        push();
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

      if(!GS.is("regulateOxygenPuzzleSolved")) {
        this.resetButton.draw();
        fill("black");
        textAlign(CENTER, CENTER);
        textSize(0.2 * VM.U);
        text("Reset", (13 + 0.75) * VM.U, (4 + 0.75) * VM.V);
      }
      pop();
    }
    else if(this.activeInterface == "ScreenView") {

    }
  }

  mousePressed(p) {
    if(this.activeInterface == "PuzzleView") {
      for (const button of this.buttons) button.mousePressed(p);
      this.resetButton.mousePressed(p);
    }
    else {
      this.highlight.mousePressed(p);
    }
  }

  onEnter() {
    R.add(this.highlight);
    R.add(this.screenSprite);
    console.log("seed: " + this.seed);
    console.log("matrix: " + this.influenceMatrix);
    console.log("starting pressures: " + this.startingPressures)
  }

  onExit() {
    this.activeInterface = "ScreenView";
    R.remove(this.highlight);
    R.remove(this.screenSprite);
  }
}