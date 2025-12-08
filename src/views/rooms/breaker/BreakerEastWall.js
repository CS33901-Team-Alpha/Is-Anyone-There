class EastWall extends View {
  constructor() {
    super(0, 0, 0, '');
    this.background = SM.get("southWallBreaker");
    this.background.setSize(16, 9);
    
    // Life Support Keypad Panel
    this.keypadPanel = {
      x: 7.5,
      y: 3,
      width: 3,
      height: 2.5,
      highlight: new HighlightEvent(7.5, 3, 3, 2.5)
    };
    
    // Load the keypad graphic
    this.keypadGraphic = SM.get("FullKeypad");
    if (this.keypadGraphic) {
      this.keypadGraphic = this.keypadGraphic.clone();
      this.keypadGraphic.setPos(this.keypadPanel.x, this.keypadPanel.y);
      this.keypadGraphic.setSize(this.keypadPanel.width, this.keypadPanel.height);
    }

    this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85, {holdFadeoutFor: 4});

    this.slidingDoor = new StandaloneSlidingDoor(12, 1.5, 1, () => {}, true, 2, null, 3, 0, () => GS.is("Life Support Access Granted"));

    this.slidingDoor.setRoom(this);

    this.showingPad = false;
  }

  mousePressed(p) {
    const m = p || VM.mouse();

    if (this.slidingDoor.mousePressed(m)) {return true;} // stop propagation
    
    // Check if clicked on keypad panel
    if (m.x >= this.keypadPanel.x && 
        m.x <= this.keypadPanel.x + this.keypadPanel.width &&
        m.y >= this.keypadPanel.y && 
        m.y <= this.keypadPanel.y + this.keypadPanel.height) {
      
      this.showingPad = true;
      // Show the life support keypad
      showLifeSupportKeypad(() => {
        // Callback when keypad is closed - return to this view
        console.log("Life Support Keypad closed");
      });
      
      return true; // Consume the click

    }
    
    return false;
  }

  update(dt) {
    this.slidingDoor.update(dt);
    this.textNotificationHandler.update(dt);
  }

  draw() {
    const u = VM.u();
    const v = VM.v();
    
    push();
    if(this.showingPad) {
      this.slidingDoor.draw();
    }
    
    // The keypad graphic is now handled by the renderer
    // Just draw the label below the keypad
    fill(200);
    textAlign(CENTER, TOP);
    textFont(terminusFont);
    textSize(0.12 * v);
    text("Click to Access", 
         (this.keypadPanel.x + this.keypadPanel.width/2) * u, 
         (this.keypadPanel.y + this.keypadPanel.height + 0.1) * v);
    
    pop();
  }

  onEnter() {
    R.add(this.background);
    if (this.keypadGraphic) {
      R.add(this.keypadGraphic);
    }
    R.add(this.keypadPanel.highlight);
    
    this.slidingDoor.onEnter();
  }

  onExit() {
    R.remove(this.background);
    if (this.keypadGraphic) {
      R.remove(this.keypadGraphic);
    }
    R.remove(this.keypadPanel.highlight);
    this.slidingDoor.onExit();
    this.textNotificationHandler.cleanup(); 
  }
}
