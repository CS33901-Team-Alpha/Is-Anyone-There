class WestWall extends View {
  constructor() {
    super(0, 0, 0, '');
    this.background = SM.get("westWallBreaker");
    this.background.setSize(16, 9);
  }

  update(dt) {}

  draw() {}

  onEnter() {
    AM.stop("startGame")
    if(!AM.isLooping("technoLoop")){
            AM.loop('technoLoop')
        }
    R.add(this.background);
  }

  onExit() {
    R.remove(this.background);
  }
}
