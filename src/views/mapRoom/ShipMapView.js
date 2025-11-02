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

    this.coordinates = {};
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

    // assigns coordinates to rooms based on spacing and origin point
    for (const [name, pos] of Object.entries(this.rooms)) {
      const x = startX + pos.col * columnSpacing;
      const y = startY + pos.row * rowSpacing;
      this.coordinates[name] = { x, y };
    }
  }

  drawRooms(x, y, name, u, v) {
    const w = 2 * u;
    const h = 1.4 * v;

    fill(20, 20, 20, 240);
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
  }

  drawConnections(u, v) {
    stroke(0, 180, 255);
    strokeWeight(2);
    noFill();

    for (const [name, data] of Object.entries(this.rooms)) {
      const start = this.coordinates[name];

      for (const conn of data.connections) {
        // makes sure to only draw lines once by skipping entries that are not in alphabetical order
        // example: "Breaker Box Room" >= "Life Support" == false -- gets drawn
        //          "Life Support" >= "Breaker Box Room" == true  -- doesn't get drawn
        if (name >= conn) continue;

        const end = this.coordinates[conn];

        const xLength = end.x - start.x;
        const yLength = end.y - start.y;

        // used for special cases where the defualt doesn't work
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
        // defualt case for drawing lines
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

    this.assignCoordinates();

    push();

    this.drawConnections(u, v);

    for (const [name, pos] of Object.entries(this.coordinates)) {
      this.drawRooms(pos.x, pos.y, name, u, v);
    }

    pop();
  }
}

// RUN COMMAND "COMPASS"
// 296 4188367 "4185300"