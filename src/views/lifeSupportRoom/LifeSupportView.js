class LifeSupportView extends View {
  constructor() {
    super();

    this.background = SM.get("MetalWall");
    this.background.setSize(16, 9);

    this.puzzles = [
      { label: "Wires Puzzle", flag: "Wires Solved" },
      { label: "Oxygen Pressure", flag: "Oxygen Stabilized" },
      { label: "Temperature Pipes", flag: "Temperature Stabilized" }
    ];
  }

  draw() {
    push();
    this.background?.draw();

    fill("white");
    textSize(0.7 * VM.U);
    textAlign(CENTER, CENTER);
    text("Life Support Status", 8 * VM.U, 1.2 * VM.V);

    for (let i = 0; i < this.puzzles.length; i++) {
      const puzzle = this.puzzles[i];
      const y = 3 + i * 1.5;

      const solved = GS.is(puzzle.flag);
      const statusText = solved ? "Completed" : "Incomplete";
      const statusColor = solved ? "lime" : "red";

      fill("white");
      textSize(0.5 * VM.U);
      textAlign(LEFT, CENTER);
      text(puzzle.label, 4 * VM.U, y * VM.V);

      fill(statusColor);
      textAlign(RIGHT, CENTER);
      text(statusText, 12 * VM.U, y * VM.V);
    }

    const allSolved = this.puzzles.every(p => GS.is(p.flag));
    fill(allSolved ? "cyan" : "orange");
    textSize(0.6 * VM.U);
    textAlign(CENTER, CENTER);
    text(
      allSolved ? "Life Support Stable" : "Critical Systems Incomplete",
      8 * VM.U,
      8.5 * VM.V
    );

    pop();
  }
}