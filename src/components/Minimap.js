class MinimapOverlay {
  constructor(world) {
    this.world = world;

    this.unlockFlag = "Minimap Unlocked";

    this.visible = false;

    this.sizeUnits = 3;
    this.xUnits = 0.6;
    this.yUnits = 0.6;
  }

  toggle() {
    if (!GS.is(this.unlockFlag)) return;
    this.visible = !this.visible;
  }

  update(dt) {}

  draw() {
    if (!GS.is(this.unlockFlag)) return;
    if (!this.visible) return;

    const u = VM.u(), v = VM.v();

    const size = this.sizeUnits * u;
    const x = this.xUnits * u;
    const y = this.yUnits * v;

    const currentIndex = this.world.current ?? 0;
    const room = this.world.rooms?.[currentIndex];
    const roomName = room?.name || `Room #${currentIndex}`;

    push();

    stroke(255, 255, 255);
    strokeWeight(5);
    fill(0, 0, 0);
    rect(x, y, size, size, 8);

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(0.25 * v);
    text(roomName, x + size / 2, y + size / 2);

    pop();
  }
}
