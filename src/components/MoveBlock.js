class MoveBlock {
  /** x and y are the initial positions,
   * for now the size is just fixed to be a square.
   * 
   * movements work by defining a dragDx and dragDy (computed to difference in current position, to where
   * mouse is moving to). dragDx and dragDy are used in update to move the actual position of block (this.x
   * and this.y). And draw uses the new positions this.x and this.y to render the moved block.
   */
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.drag = false;
    this.dragDx = 0;
    this.dragDy = 0;

    this.color = [random(255), random(255), random(255)];

    this.angle = 0; //new variable for rotating the block
  }

  rotate(dir) { //rotates the block based on the inputted direction
    if (!this.drag) return; //if a block is not being dragged don't rotate it

    this.angle = (this.angle + dir * 45 + 360) % 360; //updates the angle of rotation
  }

  isMouseInBounds(mx, my) {
    const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
    return (
      m.x >= this.x &&
      m.x <= this.x + this.size &&
      m.y >= this.y &&
      m.y <= this.y + this.size
    );
  }

  update(dt) {
    if (!this.drag) return;

    const m = VM.mouse();

    // constatly update real coordinates of block
    this.x = m.x - this.dragDx;
    this.y = m.y - this.dragDy;

    this.angle = (this.angle + 45 * dt) % 360;
  }

  draw() {
    /*
    const u = VM.u();
    const v = VM.v();

    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    rect(this.x * u, this.y * v, this.size * u, this.size * v, 8);
    */

    //updated the draw function to account for rotation

    const u = VM.u();
    const v = VM.v();

    push();

    
    translate((this.x + this.size/2) * u, (this.y + this.size/2) * v);

    
    rotate(radians(this.angle));

    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    rect(
      -(this.size/2) * u,
      -(this.size/2) * v,
      this.size * u,
      this.size * v,
      8
    );

    pop();
  }

  mousePressed(p) {
    if (this.isMouseInBounds(p?.x, p?.y)) {
      const m = VM.mouse();
      this.drag = true;

      // change in positions on drag
      this.dragDx = m.x - this.x;
      this.dragDy = m.y - this.y;
    }
  }

  mouseReleased() {
    this.drag = false;
  }

}
