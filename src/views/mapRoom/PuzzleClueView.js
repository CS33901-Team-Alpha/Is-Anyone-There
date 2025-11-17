class PuzzleClueView extends View {
  constructor(string) {
    super();

    this.background = SM.get(string);
    this.background.setSize(16, 9);
  }

  draw() {
    this.background?.draw();
  }
}