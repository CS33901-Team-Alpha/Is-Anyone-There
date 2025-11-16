class GearView extends View {
  constructor() {
    super();

    this.background = SM.get("MetalWall");
    this.background.setSize(16, 9);

    //spawn in gears (represented as blocks)
    
    this.blocks = [
        new MoveBlock(random(0, 5), random(0, 5), 1.2),
        new MoveBlock(random(0, 5), random(0, 5), 1.0),
        new MoveBlock(random(0, 5), random(0, 5), 2.0)
    ];
    
    //creates random rotations for the gear sockets
    this.sockets = [
        { x: 3, y: 4, angle: random(0, 360), size: 1.2, rotationSpeed: random(-30, 30) },
        { x: 7, y: 2, angle: random(0, 360), size: 1.0, rotationSpeed: random(-30, 30) },
        { x: 9, y: 5, angle: random(0, 360), size: 2.0, rotationSpeed: random(-30, 30) }
    ];
    
    //tolerance for the socketing
    this.snapTolerance = 10;
    this.posTolerance = 0.5;

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
    }
  }
  
  draw() {
    this.background?.draw();

    
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    
    const u = VM.u(), v = VM.v();
    /*
    for (const s of this.sockets) {
      rect(s.x * u, s.y * v, s.size * u, s.size * v);
    }
      */
    
   for (const s of this.sockets) {
        push();
        //places the socket at location
        translate((s.x + s.size/2) * u, (s.y + s.size/2) * v);
        // rotate by the random socket angle
        rotate(radians(s.angle));
        // draw rectangle outline at the position
        rect(-(s.size/2) * u, -(s.size/2) * v, s.size * u, s.size * v);
        pop();
    }
    pop();

    for (const b of this.blocks) b.draw(); //draws the 3 gears
  }

  mousePressed(p) {
    for (const b of this.blocks) b.mousePressed(p); //used for drag funtionality
  }

  mouseReleased(p) {
    for (const b of this.blocks) b.mouseReleased(p);
  }

  checkSnap(block) {
    const index = this.blocks.indexOf(block); //matches gear index with socket
    const s = this.sockets[index];

    //gets all of the position and rotational information to compare with
    const dx = Math.abs(block.x - s.x); //gets x pos difference
    const dy = Math.abs(block.y - s.y); //gets y pos difference
    const da = Math.abs((block.angle - s.angle + 360) % 360); //gets angle difference
    const ds = Math.abs(block.size - s.size); //gets size difference

    //compares position and angle difference with tolerance
    if (dx < this.posTolerance && dy < this.posTolerance && (da < this.snapTolerance || da > 360 - this.snapTolerance) && ds < 0.01) {
      block.x = s.x;
      block.y = s.y;
      block.angle = s.angle;
      block.size = s.size;
    }

}

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
        return true;
    }
}