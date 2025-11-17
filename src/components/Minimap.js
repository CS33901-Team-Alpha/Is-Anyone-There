class MinimapOverlay {
  constructor(world) {
    this.world = world;

    this.unlockFlag = "Minimap Unlocked";

    this.visible = false;

    this.sizeUnits = 3;
    this.xUnits = 12.4;
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

    const currentIndex = this.world.current;
    const roomName = `minimap${currentIndex}`;

    push();

    noStroke();
    var miniMapSprite = SM.get(roomName);
    if (miniMapSprite && miniMapSprite.src) {
      image(miniMapSprite.src, (x+0.1), (y+0.1), (size-0.2), (size-0.2));
    }

    stroke(0, 0, 0);
    strokeWeight(0.15 * u);
    noFill();
    rect(x, y, size, size, 0.2*u);

    pop();
  }
}
