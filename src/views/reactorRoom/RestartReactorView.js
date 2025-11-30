class RestartReactorView extends View {
  constructor() {
    super();

    this.background = SM.get("eastWallReactor");
    this.background.setSize(16, 9);

    this.sequenceLength = 3;
    this.sequence = [];
    this.sequenceColors = [];
    this.currentIndex = 0;
    this.locked = false;
    this.timer = 0;
    this.waitingForNext = false;
    this.puzzleComplete = false;
    this.stabilizedMessageSent = false;
    this.i = 0

    this.textNotificationHandler = new TextNotificationHandler(0.5, 1);

    this.arrows = ['W', 'S', 'A', 'D'];
    //this.arrows = ['W', 'S', 'A', 'D'];

    this.closeBtn = new Button(14, 1.2, 0.8, (self) => {
      this.activeInterface = "ScreenView";
        R.add(this.highlight);
      R.remove(this.closeBtn);
      R.add(this.slidingDoor)
    });

    // clickable highlight
    this.highlight = new HighlightEvent(4.4, 2.35, 4.4, 2.8, 255,255,255,() =>{
      if(GS.is("reactorStartupComplete") && GS.is("operationRodComplete")) {
        R.remove(this.highlight);
        R.add(this.closeBtn);
        this.generateSequence();
        this.activeInterface = "PuzzleView";
        R.remove(this.slidingDoor)
      }
      else {
        this.textNotificationHandler.addText("It seems as though you need to do something before opening this panel...")
      }
    });

    this.locked = false;

    this.activeInterface = "ScreenView";

    this.slidingDoor = new StandaloneSlidingDoor(10, 2.7, 1, () => {}, true, 2, null, 5, 0, () => {
      return true;
    });

    this.slidingDoor.setRoom(this);
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
      
      if(!AM.isPlaying("goodArrow") && !this.puzzleComplete){
          AM.stopAll();
          AM.play("goodArrow");
      }
      
      this.sequenceColors[this.currentIndex] = 'green';
      this.currentIndex++;
      if (this.currentIndex >= this.sequence.length) {
        this.waitingForNext = true;
        this.timer = 0;
      }
    }
    else {
      AM.stop("goodArrow");
      AM.play("badArrow");
      this.sequenceColors[this.currentIndex] = 'red';
      this.locked = true;
      this.timer = 0;
      AI.addText('>_  MALFUNCTION DETECTED \n>_  Severity: CRITICAL \n>_  REACTOR MELTDOWN BEGUN!!');
       this.meltdown = true;
      secondaryTimer.setFinished();
    }
  }

  // converts WASD keys to arrows
  mapKeyToArrow(key) {
    switch (key.toLowerCase()) {
      case 'w': return 'W';
      case 's': return 'S';
      case 'a': return 'A';
      case 'd': return 'D';
      default: return null;
    }
  }

  update(dt) {
    this.textNotificationHandler.update(dt);

    this.slidingDoor.update(dt);

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
          GS.set('restartReactorComplete')

          // CHECK IF ALL 3 PUZZLES HAVE BEEN BEATEN
          if(GS.is('restartReactorComplete') && GS.is('reactorStartupComplete') && GS.is('operationRodComplete')){
            R.remove(secondaryTimer)
            GS.set('reactorStabilized')
          }
        } 
        
        else {
          this.generateSequence();
        }
      }
    }
  }

  onEnter() {
    R.add(this.highlight);
    this.slidingDoor.onEnter();

    if (GS.is("reactorStartupComplete") && GS.is("operationRodComplete") && GS.is("restartReactorComplete")) {
        if (secondaryTimer) {
            secondaryTimer.setFinished();
            R.remove(secondaryTimer);
            secondaryTimer = null;
        }
    }
  }

  onExit() {
      this.activeInterface = "ScreenView";
      this.textNotificationHandler.cleanup();
      R.remove(this.highlight);
      this.slidingDoor.onExit();
  }

  mousePressed(m) {
    if (this.slidingDoor.mousePressed(m)) {return true;} // stop propagation
  }

  draw() {
    this.background?.draw();

    const u = VM.u();
    const v = VM.v();

    if(this.activeInterface == "PuzzleView") {

      push();

      // make the screen darker 
      fill(0, 0, 0, 180); // Red, Green, Blue
      rect(0.5*u, 0.5*v, 15*u, 8*v);

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
      if (GS.is('restartReactorComplete')) {
        AM.stop("goodArrow");
        while(this.i < 1){
          AM.play("reactorRestart");
          ++this.i;
        }

        if(!this.stabilizedMessageSent) {
          AI.addText('>_  NUCLEAR REACTOR RESTART SEQUENCE COMPLETED \n>_  PROCEDURE FINALIZING... \n>_  REACTOR RESUMING NORMAL OPERATION');
          this.stabilizedMessageSent = true;
        }
        
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
}
