//no p5 dependancies

export class WiresModel{

  constructor(gridSize = 5, cellSize = 1) {

    //state and data
  this.colors = ['red', 'blue', 'green', 'yellow'];
  this.gridSize = gridSize;
  this.cellSize = cellSize;
  this.origin = {
    x: (16 - this.gridSize * this.cellSize) / 6,
    y: (9 - this.gridSize * this.cellSize) / 2
  };

  this.solvedColors = new Set();
  this.grid = [];
  this.paths = {};
  this.draggingColor = null;
  this.endpoints = [];

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

  this.flashEmptyCells = false;
  this.flashTimer = 0;

   for (const color of this.colors) {
     this.paths[color] = [];
    }

    this._initGrid();
    this._placeEndpoints();
  }

  _initGrid() {
    // Create a 2D grid of empty cells
    for (let y = 0; y < this.gridSize; y++) {
      this.grid[y] = [];

      for (let x = 0; x < this.gridSize; x++) {
        this.grid[y][x] = { x, y, img: null }; // Will hold endpoint color if assigned
      }
    }
  }

  _placeEndpoints() {
    this.endpoints = this.layouts[int(random(0,5))];

    // Assign endpoint colors to grid cells and reset paths
    for (const ep of this.endpoints) {
      this.grid[ep.y][ep.x].img = ep.color;
      this.paths[ep.color] = [];
    }
  }


  startDrag(cell){
    if (!cell) return;
      const ep = this.endpoints.find(e => e.x === cell.x && e.y === cell.y);
      if (ep) {
        this.draggingColor = ep.color;
        this.paths[ep.color] = [{ x: cell.x, y: cell.y }];
    }
  }

  updateDrag(cell){
    if (!this.draggingColor || !cell) return;

      const path = this.paths[this.draggingColor];
      const last = path[path.length - 1];
      if (last.x === cell.x && last.y === cell.y) return;
      const dx = Math.abs(cell.x - last.x);
      const dy = Math.abs(cell.y - last.y);
          if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            const index = path.findIndex(pt => pt.x === cell.x && pt.y === cell.y);
              if (index !== -1) {
                path.splice(index + 1);
              } else {
                for (const otherColor in this.paths) {
                    if (otherColor === this.draggingColor) continue;
                    const otherPath = this.paths[otherColor];
                    const overlapIndex = otherPath.findIndex(pt => pt.x === cell.x && pt.y === cell.y);
                    if (overlapIndex !== -1) {
                        otherPath.splice(overlapIndex);
                    }
                }
                path.push({ x: cell.x, y: cell.y });
            }
        }

  }


  endDrag() {
    if (!this.draggingColor) return { pathValid: false };

    const color = this.draggingColor;
    const path = this.paths[color];
    const pathValid = this._validatePath(color, path);

    if (!pathValid) {
        this.paths[color] = [];
    } else {
        this.solvedColors.add(color);
    }
        
    this.draggingColor = null;
        
    const puzzleComplete = this._checkWinCondition();
    if (puzzleComplete) {
        this._onPuzzleComplete();
    }
        
    const allValid = this.colors.every(c => this._validatePath(c, this.paths[c]));
        
    // Return a status so the View can react
    return {
        pathValid: pathValid,
        puzzleComplete: puzzleComplete,
        allPathsValid: allValid
    };
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
    if (this.puzzleSolved) return;
    this.puzzleSolved = true;
    for (const color of this.colors) {
        this.solvedColors.add(color);
    }
  }
}
