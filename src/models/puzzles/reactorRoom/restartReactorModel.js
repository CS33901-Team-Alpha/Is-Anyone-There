class RestartReactorModel {
  constructor() {
    this.sequenceLength = 3;
    this.sequence = [];
    this.sequenceColors = [];
    this.currentIndex = 0;

    this.locked = false;
    this.waitingForNext = false;
    this.timer = 0;

    this.puzzleComplete = false;

    this.arrows = ['↑', '↓', '←', '→'];
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

  handleInput(rawKey) {
    // player input is locked inbetween the puzzle resetting
    if (this.locked || this.waitingForNext) return;

    const arrowInput = this.mapKeyToArrow(rawKey);

    // checks if only WASD was used
    if (!arrowInput) return;

    const expected = this.sequence[this.currentIndex];

    // checks if the input was correct
    if (arrowInput === expected) {
      this.sequenceColors[this.currentIndex] = "green";
      this.currentIndex++;

      if (this.currentIndex >= this.sequence.length) {
        this.waitingForNext = true;
        this.timer = 0;
      }

    }
    else{
        this.sequenceColors[this.currentIndex] = "red";
        this.locked = true;
        this.timer = 0;
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
      return;
    }

    // add a slight delay between each new sequence and generate a new one
    if (this.waitingForNext) {
      this.timer += dt;
      if (this.timer >= 0.5) {
        this.sequenceLength += 2;

        // if longest sequence is complete, don't generate new sequence
        if (this.sequenceLength > 11) {
          this.sequenceLength = 11;
          this.waitingForNext = false;
          this.puzzleComplete = true;
        } else {
          this.generateSequence();
        }
      }
    }
  }
}