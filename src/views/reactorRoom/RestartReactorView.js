class RestartReactorView extends View {
  constructor() {
    super();

    this.background = SM.get("MetalWall");
    this.background.setSize(16, 9);

    this.sequenceLength = 3;
    this.sequence = [];
    this.sequenceColors = [];
    this.currentIndex = 0;
    this.locked = false;
    this.timer = 0;
    this.waitingForNext = false;
    this.puzzleComplete = false;

    this.arrows = ['↑', '↓', '←', '→'];
    this.generateSequence();
  }

  // generate a random sequence of arrows
  generateSequence() {
    this.sequence = [];
    this.sequenceColors = [];
    for (let i = 0; i < this.sequenceLength; i++) {
      const arrow = random(this.arrows);
      this.sequence.push(arrow);
      this.sequenceColors.push('white');
    }
    this.currentIndex = 0;
    this.locked = false;
    this.waitingForNext = false;
    this.timer = 0;
  }

  keyPressed() {
    // player input is locked inbetween the puzzle resetting
    if (this.locked || this.waitingForNext) return;

    const arrowInput = this.mapKeyToArrow(key);

    // checks if only WASD was used
    if (!arrowInput) return;

    const currentArrow = this.sequence[this.currentIndex];

    // checks if the input was correct
    if (arrowInput === currentArrow) {
      this.sequenceColors[this.currentIndex] = 'green';
      this.currentIndex++;
      if (this.currentIndex >= this.sequence.length) {
        this.waitingForNext = true;
        this.timer = 0;
      }
    }
    else {
      this.sequenceColors[this.currentIndex] = 'red';
      this.locked = true;
      this.timer = 0;
    }
  }

  // converts WASD keys to arrows
  mapKeyToArrow(key) {
    switch (key.toLowerCase()) {
      case 'w': return '↑';
      case 's': return '↓';
      case 'a': return '←';
      case 'd': return '→';
      default: return null;
    }
  }

  update(dt) {
    // lock player inputs if sequence was messed up
    if (this.locked) {
      this.timer += dt;

      // resets the sequence
      if (this.timer >= 2) {
        this.sequenceLength = 3;
        this.generateSequence();
      }
    } 

    // add a slight delay between each new sequence and generate a new one
    else if (this.waitingForNext) {
      this.timer += dt;
      if (this.timer >= 0.5) {
        this.sequenceLength += 2;

        // if longest sequence is complete, don't generate new sequence
        if (this.sequenceLength > 11) {
          this.sequenceLength = 11;
          this.waitingForNext = false;
          this.puzzleComplete = true;
          this.locked = true;
        } 
        
        else {
          this.generateSequence();
        }
      }
    }
  }

  draw() {
    this.background?.draw();

    const u = VM.u();
    const v = VM.v();

    push();

    const termX = 3.5 * u;
    const termY = 1.5 * v;
    const termW = 9 * u;
    const termH = 6 * v;

    // draw terminal
    fill(10, 10, 10, 230);
    stroke(0, 255, 0);
    strokeWeight(3);
    rect(termX, termY, termW, termH, 8);

    // terminal header
    noStroke();
    fill(0, 255, 0, 30);
    rect(termX, termY, termW, 0.8 * v, 8);
    fill(0, 255, 0);
    textAlign(LEFT, CENTER);
    textFont(terminusFont);
    textSize(0.45 * v);
    text("REACTOR CONTROL", termX + 0.5 * u, termY + 0.4 * v);

    // completion message
    if (this.puzzleComplete) {
      fill(0, 255, 0);
      textAlign(CENTER, CENTER);
      textSize(0.8 * v);
      text("REACTOR RESTARTED", termX + termW / 2, termY + termH / 2);
      pop();
      return;
    }

    const totalArrows = this.sequence.length;
    const centerX = termX + termW / 2;
    const centerY = termY + termH / 2;
    const arrowSize = constrain(1.2 * v - totalArrows * 0.05 * v, 0.5 * v, 1.2 * v);
    const totalWidth = totalArrows * arrowSize + (totalArrows - 1);

    textAlign(CENTER, CENTER);
    textSize(arrowSize);
    textFont(terminusFont);

    // draw arrows
    for (let i = 0; i < totalArrows; i++) {
      const x = centerX - totalWidth / 2 + i * (arrowSize);
      const y = centerY;
      const arrow = this.sequence[i];

      // arrow colors
      let color = this.sequenceColors[i];
      if (color === 'green') fill(0, 255, 0);
      else if (color === 'red') fill(255, 0, 0);
      else fill(255);

      text(arrow, x, y);
    }

    pop();
  }
}