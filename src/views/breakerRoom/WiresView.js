import { View } from './ViewManager.js';
import { WiresModel } from './WiresModel.js';
import { TextNotificationHandler } from './TextNotificationHandler.js'; 
import { StandaloneSlidingDoor } from './StandaloneSlidingDoor.js';
import { AM } from './AudioManager.js';
import { GS } from './GameState.js';
import { R } from './Renderer.js';


export class WiresView extends View {
  constructor() {
  super();
  this.model = new WiresModel();
  // Background sprite for the view
  this.background = SM.get("westWallBreaker"); // Load background sprite
  this.background.setSize(16, 9);        // Match canvas size

  // Screen shake effect parameters
  this.shakeTime = 0;
  this.shakeMagnitude = 0.1;

  // Position the main notification popup just below the grid
  const gridBottomY = this.model.origin.y + this.model.gridSize * this.model.cellSize;
  this.textNotif = new TextNotificationHandler(this.model.origin.x + 0.5, gridBottomY + 0.5, {
    zind: 999,
    fadeoutRate: 0.02,
    holdFadeoutFor: 2.5
  });
  // Bonus notification (e.g. "+30s") near top right
  this.bonusNotif = new TextNotificationHandler(14.5, 0.5, { zind: 999,  fadeoutRate: 0.02, holdFadeoutFor: 2.5 });
  this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85, {holdFadeoutFor: 4});
  this.slidingDoor = new StandaloneSlidingDoor(12, 1.2, 1, () => {}, true, 2, null, 2, 0, () => GS.is("Wires Solved"));
  this.slidingDoor.setRoom(this);
}

_getCellAtMouse(m) {
  // Convert mouse coordinates to grid-relative units
  const mx = (m.x - this.model.origin.x) / this.model.cellSize;
  const my = (m.y - this.model.origin.y) / this.model.cellSize;
  // Snap to nearest grid cell
  const x = Math.floor(mx);
  const y = Math.floor(my);
  // Return the cell if it's within bounds
  if (x >= 0 && x < this.model.gridSize && y >= 0 && y < this.model.gridSize) {
    return this.model.grid[y][x];
  }
  // Otherwise, return null (outside grid)
  return null;
}



mousePressed(m) {
  // Get the grid cell under the mouse
  if (this.slidingDoor.mousePressed(m)) {return true;} // stop propagation
  const cell = this._getCellAtMouse(m);
  this.model.startDrag(cell);
}

mouseDragged(m) {
  const cell = this._getCellAtMouse(m);
  this.model.updateDrag(cell);
}

mouseReleased() {
  const status = this.model.endDrag();

  if(status.pathValid){
    AM.play(wireConnect);
  }
  if(status.puzzleComplete){
    AM.play("allWires");
    GS.set("Wire Solved");
    this.shakeTime = 10;
    this.textNotif.addText("Cryogenic Chamber Room Unlocked");
    window.activeInterface = null;
  } else if(status.allPathsValid){
      this.flashEmptyCells = true;
  }
}


update(dt) {
  // Update notification animations
  this.textNotif.update(dt);
  this.bonusNotif.update(dt);
  this.slidingDoor.update(dt);
  this.textNotificationHandler.update(dt);
}

draw() {
  // Draw background
  if (this.background) {
    this.background.draw(); // Render the sprite
  } else {
    background(20); // Fallback if sprite is missing
  }

  // Apply screen shake offsets if active
  let shakeOffsetX = 0, shakeOffsetY = 0;
  if (this.shakeTime > 0) {
    shakeOffsetX = (Math.random() - 0.5) * this.shakeMagnitude;
    shakeOffsetY = (Math.random() - 0.5) * this.shakeMagnitude;
    this.shakeTime -= 1;
  }

  const { origin, gridSize, cellSize, grid, paths, colors } = this.model;
  // Draw grid cells
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = grid[y][x];
      const px = VM.U * (origin.x + x * cellSize + shakeOffsetX);
      const py = VM.V * (origin.y + y * cellSize + shakeOffsetY);
      const sizeU = VM.U * cellSize;
      const sizeV = VM.V * cellSize;

      // Draw grid cell background and border
      push();
      stroke(230);         // Light grey border
      strokeWeight(2);     // Border thickness
      fill(40);            // Dark grey cell fill
      rect(px, py, sizeU, sizeV);
      pop();

      // Draw endpoint if present
      if (cell.img) {
        fill(cell.img);    // Use color name as fill
        push();
        stroke(255);       // White border around endpoint
        strokeWeight(4);
        ellipse(px + sizeU / 2, py + sizeV / 2, sizeU * 0.6);
        pop();
      }
    }
  }

  // Draw wire paths for each color
  for (const color in paths) {
    const path = paths[color];
    push();
    stroke(color);         // Wire color
    strokeWeight(10);      // Wire thickness
    noFill();
    beginShape();
    for (const pt of path) {
      const cx = VM.U * (origin.x + pt.x * cellSize + cellSize / 2);
      const cy = VM.V * (origin.y + pt.y * cellSize + cellSize / 2);
      vertex(cx, cy);
    }
    endShape();
    pop();
  }

  // Compute which wires are currently valid
  const solvedColors = this.colors.filter(color => this.model._validatePath(color, this.paths[color]));

  // Draw progress tracker bar
  const barX = VM.U * 8;
  const barY = VM.V * 0.6;

  textAlign(CENTER);
  textSize(16);
  stroke(255);
  strokeWeight(2);
  fill('Black');
  text(`Wires Connected: ${solvedColors.length} / ${colors.length}`, barX, barY);

  // Draw color dots for each wire status
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    const isSolved = solvedColors.includes(color);
    push();
    fill(isSolved ? color : 'gray'); // Show color if solved, gray if not
    stroke(255);
    strokeWeight(1);
    ellipse(barX - 60 + i * 40, barY + 20, 20);
    pop();
  }

  // Flash uncovered cells if all wires are valid but puzzle isn't complete
  const allValid = this.model.colors.every(color => this.model._validatePath(color, this.model.paths[color]));
  const puzzleComplete = this.model.puzzleSolved;

  if (allValid && !puzzleComplete) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isCovered = Object.values(paths).some(path =>
          path.some(pt => pt.x === x && pt.y === y)
        );

        // Highlight empty cells with a soft white flash
        if (!isCovered) {
          const px = VM.U * (origin.x + x * cellSize);
          const py = VM.V * (origin.y + y * cellSize);
          fill(255, 255, 255, 80); // semi-transparent white
          noStroke();
          rect(px, py, VM.U * cellSize, VM.V * cellSize);
        }
      }
    }
  }

  this.slidingDoor.draw();
  this.textNotif.draw();
  this.bonusNotif.draw();
  this.textNotificationHandler.draw();
}



onEnter() {
  // Register this view with the renderer
  AM.stop("startGame")
  if(!AM.isLooping("technoLoop")){
      AM.stop("cryoLoop")
      AM.loop('technoLoop')
    }
  R.add(this);
  this.slidingDoor.onEnter();
}

onExit() {
  // Clean up notifications and remove view from renderer
  this.textNotif.cleanup();
  this.bonusNotif.cleanup();
  R.remove(this);
  this.slidingDoor.onExit();
  this.textNotificationHandler.cleanup(); 
}


}
