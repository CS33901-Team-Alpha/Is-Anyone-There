class NorthWall extends View {
  constructor() {
    super(0, 0, 0, '');
    this.background = SM.get("northWallBreaker");
    this.background.setSize(16, 9);
  }

  update(dt) {}

  draw() {}

  onEnter() {
    R.add(this.background);
  }

  onExit() {
    R.remove(this.background);
  }
}