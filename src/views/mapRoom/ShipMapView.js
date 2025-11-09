class ShipMapView extends View {
  constructor() {
    super();

    this.background = SM.get("MetalWall");
    this.background.setSize(16, 9);

    this.rooms = {
      "Engine Room":      {col: 0, row: 1, connections:   ["Nuclear Reactor"]},
      "Botanical Room":   {col: 1, row: 0, connections:   ["Nuclear Reactor", "Cryochamber"]},
      "Nuclear Reactor":  {col: 1, row: 1, connections:   ["Engine Room", "Botanical Room", "Breaker Box Room"]},
      "Life Support":     {col: 1, row: 2, connections:   ["Breaker Box Room", "Monitor Room"]},
      "Cryochamber":      {col: 2, row: 0, connections:   ["Botanical Room", "Breaker Box Room"]},
      "Breaker Box Room": {col: 2, row: 1, connections:   ["Nuclear Reactor", "Cryochamber", "Terminal Room", "Life Support"]},
      "Monitor Room":     {col: 2, row: 2, connections:   ["Life Support", "Map Room"]},
      "Terminal Room":    {col: 3, row: 0.5, connections: ["Breaker Box Room", "Navigation"]},
      "Map Room":         {col: 3, row: 1.5, connections: ["Monitor Room", "Navigation"]},
      "Navigation":       {col: 4, row: 1, connections:   ["Terminal Room", "Map Room"]}
    };

    const allPositions = []; // to keep track of used positions
    for (let row = 0; row <= 2; row++) { // 3 rows
      for (let col = 0; col <= 4; col++) { // 5 columns
        allPositions.push({ col, row }); // add position to list
      }
    }

    const shuffled = shuffle(allPositions); // shuffle positions
    const roomNames = [ // list of room names
      "Engine Room", "Botanical Room", "Nuclear Reactor", "Life Support",
      "Cryochamber", "Breaker Box Room", "Monitor Room", "Terminal Room",
      "Map Room", "Navigation"
    ];

    this.roomsRandomized = {}; // to hold randomized room positions
    for (let i = 0; i < roomNames.length; i++) { // assign positions to rooms
      const name = roomNames[i]; // get room name
      const pos = shuffled[i]; // get shuffled position
      this.roomsRandomized[name] = { // assign position to room
        col: pos.col,
        row: pos.row,
        connections: this.rooms[name].connections, // keep original connections
        solved: false
      };
    }

    this.coordinates = {};
    this.normalCoordinates = {};
    this.draggingRoom = null;
    this.normalized = false;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array; // return shuffled array
  }

  onEnter() {
    this.assignCoordinates();
  }

  assignCoordinates() {
    const u = VM.u();
    const v = VM.v();

    const columns = 5;
    const rows = 3;
    const columnSpacing = 2.75 * u;
    const rowSpacing = 2.25 * v;

    // origin points for drawing
    const startX = (16 * u - (columns - 1) * columnSpacing) / 2;
    const startY = (9 * v - (rows - 1) * rowSpacing) / 2;

    // assigns coordinates to rooms based on spacing and origin point.
    for (const [name, pos] of Object.entries(this.roomsRandomized)) {
      const x = startX + pos.col * columnSpacing;
      const y = startY + pos.row * rowSpacing;
      this.coordinates[name] = { x, y };
    }

    for (const [name, pos] of Object.entries(this.rooms)) { // normal positions for win condition
      const x = startX + pos.col * columnSpacing;
      const y = startY + pos.row * rowSpacing;
      this.normalCoordinates[name] = { x, y };
    }
  }

  drawRooms(x, y, name, u, v) {
    const w = 2 * u;
    const h = 1.4 * v;
    this.checkWinCondition();

    if (this.roomsRandomized[name].solved) 
    {
      push();
      fill(20, 20, 20, 240); // normal color for solved rooms
      stroke(0, 255, 255);
      strokeWeight(2);
      rectMode(CENTER);
      rect(x, y, w, h, 6);
      noStroke();
      fill(0, 255, 255);
      textAlign(CENTER, CENTER);
      textSize(0.35 * v);
      textFont(terminusFont);
      text(name, x, y, w * 0.9, h * 0.9);
      pop();
    } 
    else 
    {
      push();
      fill(255, 0, 0); // red color for unsolved rooms
      stroke(100, 100, 100);
      strokeWeight(1);
      rectMode(CENTER);
      rect(x, y, w, h, 6);
      noStroke();
      fill(0, 255, 255);
      textAlign(CENTER, CENTER);
      textSize(0.35 * v);
      textFont(terminusFont);
      text(name, x, y, w * 0.9, h * 0.9);
      pop();
    }
  }

  drawConnections(u, v) {
    stroke(0, 180, 255);
    strokeWeight(2);
    noFill();

    for (const [name, data] of Object.entries(this.rooms)) {
      const start = this.coordinates[name];

      for (const conn of data.connections) {
        // makes sure to only draw lines once by skipping entries that are not in alphabetical order
        if (name >= conn) continue;

        const end = this.coordinates[conn];

        const xLength = end.x - start.x;
        const yLength = end.y - start.y;

        // used for special cases where the default doesn't work
        let customMidX = null;
        let customMidY = null;

        // sets coordinates for Breaker Box and Life Support special case
        if (name === "Breaker Box Room" && conn === "Life Support") {

          customMidY = (this.coordinates["Breaker Box Room"].y + this.coordinates["Monitor Room"].y) / 2;
          customMidX = (this.coordinates["Nuclear Reactor"].x + this.coordinates["Life Support"].x) / 2;
        }

        // draws lines between connected rooms
        beginShape();
        vertex(start.x, start.y);

        // special case for Breaker Box and Life Support connection
        if (customMidX !== null && customMidY !== null) {
          vertex(start.x, customMidY);
          vertex(customMidX, customMidY);
          vertex(customMidX, end.y);
        } 
        // default case for drawing lines
        else {
          if (Math.abs(xLength) > Math.abs(yLength)) {
            const midX = start.x + xLength / 2;
            vertex(midX, start.y);
            vertex(midX, end.y);
          } 
          else {
            const midY = start.y + yLength / 2;
            vertex(start.x, midY);
            vertex(end.x, midY);
          }
        }

        vertex(end.x, end.y);
        endShape();
      }
    }
  }

  draw() {
    this.background?.draw();

    const u = VM.u();
    const v = VM.v();

    push();

    this.drawConnections(u, v);

    for (const [name, pos] of Object.entries(this.coordinates)) {
      this.drawRooms(pos.x, pos.y, name, u, v);
    }

    pop();
  }

  mousePressed(m) {
    if (this.normalized) return;
    // Check if any room was clicked
    for (const [name, pos] of Object.entries(this.coordinates)) {
    const u = VM.u();
    const v = VM.v();
    const w = 2 * u; // Room dimensions
    const h = 1.4 * v; // ... dimensions
    const px = m.x * width / 16; // Convert to pixel coordinates
    const py = m.y * height / 9; // ... pixel coordinates


    const inX = px >= pos.x - w / 2 && px <= pos.x + w / 2; // within x bounds
    const inY = py >= pos.y - h / 2 && py <= pos.y + h / 2; // ... y bounds

    if (inX && inY) { // Room was clicked
      this.draggingRoom = name;
      return;
    }
  }
  }

  mouseDragged(m) {
    if (this.normalized) return;
    if (!this.draggingRoom) return;

    this.coordinates[this.draggingRoom] = {
      x: m.x * width / 16,
      y: m.y * height / 9
    };
  }

  checkWinCondition() {
    let allSolved = true;

    for (const [name, pos] of Object.entries(this.roomsRandomized)) { // check each room
      const currentPos = this.coordinates[name]; // current position
      const targetPos = this.normalCoordinates[name]; // target position

      const dx = Math.abs(currentPos.x - targetPos.x); // distance in x
      const dy = Math.abs(currentPos.y - targetPos.y); // distance in y

      const withinBounds = dx <= 1 * VM.u() && dy <= 1 * VM.v(); // check if within bounds
      this.roomsRandomized[name].solved = withinBounds; // mark as solved if within bounds

      if (!withinBounds) { // if any room is not solved
        allSolved = false;
      }
    }

    if (allSolved && !this.normalized) {
      this.winConditionMet();
    }

    return allSolved; // return overall status
  }

  winConditionMet() {
    if (this.normalized) return true;

    //move all the rooms back to their normal positions
    for (const [name, pos] of Object.entries(this.normalCoordinates)) {
      this.coordinates[name] = {
        x: pos.x,
        y: pos.y
      };
    }

    screenTimer.addTime(30);
    this.normalized = true;
    return true;
  }
}

// RUN COMMAND "COMPASS"
// 296 4188367 "4185300"