class GearView extends View {
  constructor() {
    super();

    this.background = SM.get("EngineRoom2");
    this.background.setSize(16, 9);

    //spawn in gears (represented as blocks)
    
    this.blocks = [
        new GearBlock(3, 1, 1.0, "SmallGear"),
        new GearBlock(1, 2.5, 2.0, "MediumGear"),
        new GearBlock(4, 2.5, 2.0, "MediumGear"),
        new GearBlock(1, 5, 3.0, "LargeGear")
    ];
    
    //creates random rotations for the gear sockets
    this.sockets = [
        { name: "SmallGear", x: 7.5, y: 5, angle: random(0, 360), size: 1.0, rotationSpeed: 30 },
        { name: "MediumGear", x: 12, y: 2, angle: random(0, 360), size: 2.0, rotationSpeed: 20 },
        { name: "MediumGear", x: 8, y: 2, angle: random(0, 360), size: 2.0, rotationSpeed: 20 },
        { name: "LargeGear", x: 10, y: 5, angle: random(0, 360), size: 3.0, rotationSpeed: 10 }
    ];
    
    //tolerance for the socketing
    this.snapTolerance = 10;
    this.posTolerance = 0.5;

    this.allSolved = false;

    this.closeBtn = new Button(14, 1, 0.8, (self) => {
      this.activeInterface = "ScreenView";
      R.add(this.highlight);
      R.remove(this.closeBtn);
    });

    // clickable highlight
    this.highlight = new HighlightEvent(5.4, 2.45, 4.7, 3.7, 255,255,255,() =>{
      this.activeInterface = "PuzzleView";
      R.remove(this.highlight);
      R.add(this.closeBtn);
    });

    this.locked = false;

    this.activeInterface = "ScreenView";
  }

  
  update(dt) {
    for (const b of this.blocks){
        b.update(dt);
        //updates position and checks if the gears are in position
        this.checkSnap(b);
    } 

    for (const s of this.sockets) {
        s.angle = (s.angle + s.rotationSpeed * dt) % 360; //rotate the sockets
    }

    if (this.allSocketsFilled()) {
        //checks if all of the sockets are filled
        console.log("All gears inserted");
        GS.set("Engine Gears Fixed");
    }
  }
  
  draw() {
    this.background?.draw();

    const u = VM.u(), v = VM.v();

    if(this.activeInterface == "PuzzleView") {
      stroke(0,0,0)
      strokeWeight(0.4*u);
      fill(255,255,255, 100); // Red, Green, Blue
      rect(0.5* u, 0.5*v, 15*u, 8*v);

      push();
      fill(0,0,0);
      
      strokeWeight(0.03*u);
      
      for (const s of this.sockets) {
        push();
        //places the socket at location
        translate((s.x + s.size/2) * u, (s.y + s.size/2) * v);
        // rotate by the random socket angle
        rotate(radians(s.angle));
        // draw rectangle outline at the position
        rect(-(s.size/20) * u, -(s.size/20) * v, s.size/10 * u, s.size/10 * v);
        pop();
      }
      pop();

      for (const b of this.blocks) b.draw(); //draws the 3 gears
    }
  }

  mousePressed(p) {
    if(this.activeInterface == "PuzzleView") {
      for (const b of this.blocks) b.mousePressed(p); //used for drag funtionality
    }
  }

  mouseReleased(p) {
    if(this.activeInterface == "PuzzleView") {
      for (const b of this.blocks) b.mouseReleased(p);
    }
  }

  checkSnap(block) {
    const index = this.blocks.indexOf(block); //matches gear index with socket
    const s = this.sockets[index];

    //gets all of the position and rotational information to compare with
    const dx = Math.abs(block.x - s.x); //gets x pos difference
    const dy = Math.abs(block.y - s.y); //gets y pos difference
    const da = Math.abs((block.angle - s.angle + 360) % 90); //gets angle difference
    const ds = Math.abs(block.size - s.size); //gets size difference

    //compares position and angle difference with tolerance
    if (dx < this.posTolerance && dy < this.posTolerance && (da < this.snapTolerance || da > 90 - this.snapTolerance) && ds < 0.01) {
      if(!block.solved){
        AM.play("gearClick")
      }
      block.solved = true;
      block.x = s.x;
      block.y = s.y;
      block.angle = s.angle;
      block.size = s.size;
    }

}

counter = 0

    allSocketsFilled() { //loops through all of the sockets to see if they are filled
    for (let i = 0; i < this.blocks.length; i++) {
        const block = this.blocks[i];
        const socket = this.sockets[i];

        //gets all of the position and rotational information to compare with
        const dx = Math.abs(block.x - socket.x); //gets x pos difference
        const dy = Math.abs(block.y - socket.y); //gets y pos difference
        const da = Math.abs((block.angle - socket.angle) % 360); //gets angle difference
        const ds = Math.abs(block.size - socket.size); //gets size difference

        //compares position and angle difference with tolerance
        if (dx >= this.posTolerance || dy >= this.posTolerance || 
            (da >= this.snapTolerance && da <= 360 - this.snapTolerance) || 
            ds >= 0.01) {
            return false; //if one is out of place returns false
        }
    }
    if(!this.allSolved){
      AM.play("gearComplete")
      AI.addText('>_  MAIN ENGINE STATUS UPDATING... \n>_  GEAR MAINTENANCE RECOGNIZED \n>_  ENGINE STATUS: READY TO THROTTLE');
      this.allSolved = true;
    }     
    return true;
    }

    onEnter() {
      R.add(this.highlight);
      R.add(this.PadSprite);
    }

    onExit() {
      R.remove(this.highlight);
      R.remove(this.PadSprite);
      this.activeInterface = "ScreenView";
    }
}
