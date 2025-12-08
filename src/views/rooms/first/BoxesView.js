class BoxesView extends SlidingDoorView{
  constructor(slidingDoors = [], string) {
    const backgroundName = 'EastWall' + string;
    super(slidingDoors, SM.get(backgroundName));
  }

  update(dt) {
    super.update(dt)
  }

  draw() {
    super.draw()
  }

  onEnter() {
    super.onEnter();
  }

  onExit() {
    super.onExit();
  }
}
