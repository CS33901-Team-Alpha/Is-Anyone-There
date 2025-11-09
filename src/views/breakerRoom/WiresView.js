class WiresView extends View 
{
  constructor(gridSize = 5, cellSize = 1) {
  super();

  // Background sprite for the view
  this.background = SM.get("westWallBreaker"); // Load background sprite
  this.background.setSize(16, 9);        // Match canvas size

  // Define wire colors used in the puzzle
  this.colors = ['red', 'blue', 'green', 'yellow'];

  // Grid configuration
  this.gridSize = gridSize;
  this.cellSize = cellSize;

  // Calculate origin to center the grid on a 16x9 canvas
  this.origin = {
    x: (16 - this.gridSize * this.cellSize) / 6,
    y: (9 - this.gridSize * this.cellSize) / 2
  };

  // Track which wires have been successfully connected
  this.solvedColors = new Set();

  // Grid data structure: 2D array of cells
  this.grid = [];

  // Paths for each wire color: array of {x, y} points
  this.paths = {};

  // Currently dragged wire color
  this.draggingColor = null;


  this.layouts = [
    [
      { x: 0, y: 0, color: 'red' },
      { x: 1, y: 4, color: 'red' },
      { x: 2, y: 2, color: 'blue' },
      { x: 4, y: 0, color: 'blue' },
      { x: 1, y: 0, color: 'green' },
      { x: 1, y: 3, color: 'green' },
      { x: 4, y: 1, color: 'yellow' },
      { x: 4, y: 4, color: 'yellow' }
    ],
    [
      { x: 0, y: 0, color: 'red' },
      { x: 4, y: 2, color: 'red' },
      { x: 3, y: 1, color: 'blue' },
      { x: 0, y: 2, color: 'blue' },
      { x: 1, y: 2, color: 'green' },
      { x: 3, y: 3, color: 'green' },
      { x: 0, y: 3, color: 'yellow' },
      { x: 4, y: 3, color: 'yellow' }
    ],
    [
      { x: 3, y: 1, color: 'red' },
      { x: 2, y: 3, color: 'red' },
      { x: 2, y: 4, color: 'blue' },
      { x: 0, y: 0, color: 'blue' },
      { x: 2, y: 2, color: 'green' },
      { x: 1, y: 4, color: 'green' },
      { x: 2, y: 1, color: 'yellow' },
      { x: 0, y: 4, color: 'yellow' }
    ],
    [
      { x: 2, y: 1, color: 'red' },
      { x: 4, y: 1, color: 'red' },
      { x: 3, y: 3, color: 'blue' },
      { x: 4, y: 0, color: 'blue' },
      { x: 2, y: 0, color: 'green' },
      { x: 0, y: 4, color: 'green' },
      { x: 1, y: 1, color: 'yellow' },
      { x: 1, y: 4, color: 'yellow' }
    ],
    [
      { x: 1, y: 1, color: 'red' },
      { x: 2, y: 4, color: 'red' },
      { x: 1, y: 2, color: 'blue' },
      { x: 3, y: 4, color: 'blue' },
      { x: 0, y: 0, color: 'green' },
      { x: 4, y: 1, color: 'green' },
      { x: 2, y: 2, color: 'yellow' },
      { x: 4, y: 4, color: 'yellow' }
    ]
  ];



  // Endpoint definitions: where wires start and end
  this.endpoints = [];

  // Screen shake effect parameters
  this.shakeTime = 0;
  this.shakeMagnitude = 0.1;

  // Flashing effect for incomplete grid
  this.flashEmptyCells = false;
  this.flashTimer = 0;

  // Initialize empty paths for each wire color
  for (const color of this.colors) {
    this.paths[color] = [];
  }

  // Position the main notification popup just below the grid
  const gridBottomY = this.origin.y + this.gridSize * this.cellSize;
  this.textNotif = new TextNotificationHandler(this.origin.x + 0.5, gridBottomY + 0.5, {
    zind: 999,
    fadeoutRate: 0.02,
    holdFadeoutFor: 2.5
  });

  // Bonus notification (e.g. "+30s") near top right
  this.bonusNotif = new TextNotificationHandler(14.5, 0.5, {
    zind: 999,
    fadeoutRate: 0.02,
    holdFadeoutFor: 2.5
  });

  // Initialize grid cells and place endpoints
  this._initGrid();
  this._placeEndpoints();

  this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85, {holdFadeoutFor: 4});

  this.slidingDoor = new StandaloneSlidingDoor(12, 1.2, 1, () => {}, true, 2, null, 2, 0, () => GS.is("Wires Solved"));

  this.slidingDoor.setRoom(this);
}

_initGrid() {
  // Create a 2D grid of empty cells
  for (let y = 0; y < this.gridSize; y++) {
    this.grid[y] = [];

    for (let x = 0; x < this.gridSize; x++) {
      this.grid[y][x] = {
        x, y,
        img: null // Will hold endpoint color if assigned
      };
    }
  }
}

_placeEndpoints() {
  // Manually define endpoint positions and colors
  // this.endpoints = [
  //   { x: 0, y: 0, color: 'red' },
  //   { x: 1, y: 4, color: 'red' },
  //   { x: 2, y: 2, color: 'blue' },
  //   { x: 4, y: 0, color: 'blue' },
  //   { x: 1, y: 0, color: 'green' },
  //   { x: 1, y: 3, color: 'green' },
  //   { x: 4, y: 1, color: 'yellow' },
  //   { x: 4, y: 4, color: 'yellow' }
  // ];

// for (let i = 0; i < this.colors.length; i++) {
//   for (let j = 0; j < 2; j++) {
//     let setX, setY;
//     let validPoint = false;

//     while (!validPoint) {
//       setX = int(random(0, 5));
//       setY = int(random(0, 5));

//       if (this.endpoints.length === 0) {
//         this.endpoints.push({ x: setX, y: setY, color: this.colors[i] });
//         break;
//       }

//       validPoint = true;
//       for (const ep of this.endpoints) {
//         if (setX === ep.x && setY === ep.y) {
//           validPoint = false;
//           break;
//         }
//       }

//       if (validPoint) {
//         this.endpoints.push({ x: setX, y: setY, color: this.colors[i] });
//       }
//     }
//   }
// }
  this.endpoints = this.layouts[int(random(0,5))];

  console.log(this.endpoints);

  // Assign endpoint colors to grid cells and reset paths
  for (const ep of this.endpoints) {
    this.grid[ep.y][ep.x].img = ep.color;
    this.paths[ep.color] = [];
  }
}


draw() {
    // Draw background
    if (this.background) {
    this.background.draw(); // Render the sprite
    } else {
    background(20); // Fallback if sprite is missing
    }


  // Apply screen shake offsets if active
  let shakeOffsetX = 0;
  let shakeOffsetY = 0;
  if (this.shakeTime > 0) {
    shakeOffsetX = (Math.random() - 0.5) * this.shakeMagnitude;
    shakeOffsetY = (Math.random() - 0.5) * this.shakeMagnitude;
    this.shakeTime -= 1;
  }

  // Draw grid cells
  for (let y = 0; y < this.gridSize; y++) {
    for (let x = 0; x < this.gridSize; x++) {
      const cell = this.grid[y][x];
      const px = VM.U * (this.origin.x + x * this.cellSize + shakeOffsetX);
      const py = VM.V * (this.origin.y + y * this.cellSize + shakeOffsetY);
      const sizeU = VM.U * this.cellSize;
      const sizeV = VM.V * this.cellSize;

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
  for (const color in this.paths) {
    const path = this.paths[color];
    push();
    stroke(color);         // Wire color
    strokeWeight(10);      // Wire thickness
    noFill();
    beginShape();
    for (const pt of path) {
      const cx = VM.U * (this.origin.x + pt.x * this.cellSize + this.cellSize / 2);
      const cy = VM.V * (this.origin.y + pt.y * this.cellSize + this.cellSize / 2);
      vertex(cx, cy);
    }
    endShape();
    pop();
  }

  // Compute which wires are currently valid
  const solvedColors = this.colors.filter(color => this._validatePath(color, this.paths[color]));

  // Draw progress tracker bar
  const barX = VM.U * 8;
  const barY = VM.V * 0.6;

  textAlign(CENTER);
  textSize(16);
  stroke(255);
  strokeWeight(2);
  fill('Black');
  text(`Wires Connected: ${solvedColors.length} / ${this.colors.length}`, barX, barY);

  // Draw color dots for each wire status
  for (let i = 0; i < this.colors.length; i++) {
    const color = this.colors[i];
    const isSolved = solvedColors.includes(color);
    push();
    fill(isSolved ? color : 'gray'); // Show color if solved, gray if not
    stroke(255);
    strokeWeight(1);
    ellipse(barX - 60 + i * 40, barY + 20, 20);
    pop();
  }

  // Flash uncovered cells if all wires are valid but puzzle isn't complete
  const allValid = this.colors.every(color => this._validatePath(color, this.paths[color]));
  const puzzleComplete = this._checkWinCondition();

  if (allValid && !puzzleComplete) {
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const isCovered = Object.values(this.paths).some(path =>
          path.some(pt => pt.x === x && pt.y === y)
        );

        // Highlight empty cells with a soft white flash
        if (!isCovered) {
          const px = VM.U * (this.origin.x + x * this.cellSize);
          const py = VM.V * (this.origin.y + y * this.cellSize);
          fill(255, 255, 255, 80); // semi-transparent white
          noStroke();
          rect(px, py, VM.U * this.cellSize, VM.V * this.cellSize);
        }
      }
    }
  }

  this.slidingDoor.draw();
}

mousePressed(m) {
  // Get the grid cell under the mouse

  if (this.slidingDoor.mousePressed(m)) {return true;} // stop propagation

  const cell = this._getCellAtMouse(m);
  if (!cell) return;

  // Check if the cell is an endpoint
  const ep = this.endpoints.find(e => e.x === cell.x && e.y === cell.y);

  // If it's a valid endpoint, begin dragging a wire of that color
  if (ep) {
    this.draggingColor = ep.color;
    this.paths[ep.color] = [{ x: cell.x, y: cell.y }]; // start path with this cell
  }
}

mouseDragged(m) {
  // If no wire is being dragged, exit
  if (!this.draggingColor) return;

  // Get the cell under the mouse
  const cell = this._getCellAtMouse(m);
  if (!cell) return;

  const path = this.paths[this.draggingColor];
  const last = path[path.length - 1];

  // Only proceed if the cell is different from the last one
  if (last.x !== cell.x || last.y !== cell.y) {
    const dx = Math.abs(cell.x - last.x);
    const dy = Math.abs(cell.y - last.y);

    // Only allow cardinal moves (no diagonals)
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {

      // Check if we're backtracking to a previous cell
      const index = path.findIndex(pt => pt.x === cell.x && pt.y === cell.y);

      if (index !== -1) {
        // If so, trim the path to that point
        path.splice(index + 1);
      } else {
        // Remove overlaps from other paths
        for (const otherColor in this.paths) {
          if (otherColor === this.draggingColor) continue;

          const otherPath = this.paths[otherColor];
          const overlapIndex = otherPath.findIndex(pt => pt.x === cell.x && pt.y === cell.y);

          if (overlapIndex !== -1) {
            otherPath.splice(overlapIndex); // truncate overlapping path
          }
        }

        // Add the new cell to the path
        path.push({ x: cell.x, y: cell.y });
      }
    }
  }
}

mouseReleased() {
  let valid = false;

  // If a wire was being dragged, validate its path
  if (this.draggingColor) {
    const path = this.paths[this.draggingColor];
    valid = this._validatePath(this.draggingColor, path);

    if (!valid) {
      // If invalid, clear the path
      this.paths[this.draggingColor] = [];
    } else {
        // If valid, mark this color as solved
        AM.play("wireConnect");
      this.solvedColors.add(this.draggingColor);
    }
  }

  // Reset dragging state
  this.draggingColor = null;

  // Check if the puzzle is fully solved
  if (this._checkWinCondition()) {
    AM.play("allWires");
    this._onPuzzleComplete();
  } else {
    // If all wires are valid but grid isn't fully covered, trigger flashing
    const allValid = this.colors.every(color => this._validatePath(color, this.paths[color]));
    if (allValid) {
      this.flashEmptyCells = true;
      this.flashTimer = 10; // flash for 10 frames
    }
  }
}

_getCellAtMouse(m) {
  // Convert mouse coordinates to grid-relative units
  const mx = (m.x - this.origin.x) / this.cellSize;
  const my = (m.y - this.origin.y) / this.cellSize;

  // Snap to nearest grid cell
  const x = Math.floor(mx);
  const y = Math.floor(my);

  // Return the cell if it's within bounds
  if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
    return this.grid[y][x];
  }

  // Otherwise, return null (outside grid)
  return null;
}

_validatePath(color, path) {
  // Path must have at least two points
  if (path.length < 2) return false;

  const start = path[0];
  const end = path[path.length - 1];

  // Check if path starts and ends on valid endpoints
  const startMatch = this.endpoints.some(e => e.color === color && e.x === start.x && e.y === start.y);
  const endMatch   = this.endpoints.some(e => e.color === color && e.x === end.x && e.y === end.y);
  if (!startMatch || !endMatch) return false;

  const visited = new Set();

  for (const pt of path) {
    const key = `${pt.x},${pt.y}`;

    // Reject if path revisits a cell
    if (visited.has(key)) return false;
    visited.add(key);

    // Reject if path overlaps with another color's path
    for (const otherColor in this.paths) {
      if (otherColor === color) continue;
      for (const otherPt of this.paths[otherColor]) {
        if (otherPt.x === pt.x && otherPt.y === pt.y) return false;
      }
    }
  }

  // Path is valid
  return true;
}


_checkWinCondition() {
  // Validate all color paths
  for (const color of this.colors) {
    const path = this.paths[color];
    if (!path || path.length < 2) return false;
    if (!this._validatePath(color, path)) return false;
  }

  // Ensure every grid cell is covered by some path
  for (let y = 0; y < this.gridSize; y++) {
    for (let x = 0; x < this.gridSize; x++) {
      const isCovered = Object.values(this.paths).some(path =>
        path.some(pt => pt.x === x && pt.y === y)
      );
      if (!isCovered) return false;
    }
  }

  // Puzzle is fully solved
  return true;
}

_onPuzzleComplete() {
  // Prevent duplicate triggers
  if (this.puzzleSolved) return;

  this.puzzleSolved = true;

  // Mark all colors as solved
  for (const color of this.colors) {
    this.solvedColors.add(color);
  }

  // Add bonus time to global screen timer
  //if (screenTimer && typeof screenTimer.addTime === 'function') {
    //screenTimer.addTime(30); // +30 seconds
  //}

  // Show bonus notification
  //this.bonusNotif.addText("+30s");

  //Update Game State
  GS.set("Wires Solved");

  // Trigger screen shake effect
  this.shakeTime = 10;

  // Show puzzle completion message
  this.textNotif.addText("Cryogenic Chamber Room Unlocked");

  // Exit interface mode
  window.activeInterface = null;
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

update(dt) {
  // Update notification animations
  this.textNotif.update(dt);
  this.bonusNotif.update(dt);
  this.slidingDoor.update(dt);
  this.textNotificationHandler.update(dt);
}

}
