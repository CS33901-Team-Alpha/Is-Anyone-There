class NorthWall extends View {
  constructor() {
    super(0, 0, 0, '');
    this.background = SM.get("northWallBreaker");
    this.background.setSize(16, 9);
  }

  update(dt) {}

  draw() {}

  onEnter() {
 
  }

  onExit() {
    R.remove(this.background);
  }
}
