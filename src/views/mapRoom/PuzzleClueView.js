/**
 * I (JOAO) AM USING THIS VIEW AS TEMPORARY BLANK FILLER WALLS FOR SHIP ROOM
 */

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