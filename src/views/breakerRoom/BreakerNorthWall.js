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
    AM.stop("startGame")
    if(!AM.isLooping("technoLoop")){
            AM.loop('technoLoop')
        }
  }

  onExit() {
    R.remove(this.background);
  }
}
