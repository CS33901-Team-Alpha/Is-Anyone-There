class PuzzleClueView extends View {
  constructor() {
    super();

    this.background = SM.get("MetalWall");
    this.background.setSize(16, 9);
  }

  draw() {
    this.background?.draw();
  }
}