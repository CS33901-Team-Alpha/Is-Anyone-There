class ShipMapView extends View {
  constructor() {
    super(0, 0, 0, 'Map Room Puzzle');
    this.background = SM.get("eastWallMap");
    this.background.setSize(16, 9);

    this.rooms = {
      "Engine Room":      {x: 3.66, y: 4.45},
      "Botanical Room":   {x: 6.9, y: 2.7},
      "Nuclear Reactor":  {x: 6.25, y: 4.45},
      "Life Support":     {x: 6.9, y: 6.1},
      "Cryochamber":      {x: 10.35, y: 2.3},
      "Breaker Box Room": {x: 9.1, y: 4.45},
      "Map Room":         {x: 10.4, y: 6.55},
      "Terminal Room":    {x: 12.25, y: 4.45},
    };

    let allPositions = [ // to keep track of all room positions(8)
      {x: 3.66, y: 4.45},
      {x: 6.9, y: 2.7}, 
      {x: 6.25, y: 4.45}, 
      {x: 6.9, y: 6.1}, 
      {x: 10.35, y: 2.3}, 
      {x: 9.1, y: 4.45}, 
      {x: 10.4, y: 6.55}, 
      {x: 12.25, y: 4.45}
    ]; 

    let roomNames = [ // list of room names
      "Engine Room", "Botanical Room", "Nuclear Reactor", "Life Support",
      "Cryochamber", "Breaker Box Room", "Map Room", "Terminal Room"
    ];
    
    //shuffle names
    for (let i = roomNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [roomNames[i], roomNames[j]] = [roomNames[j], roomNames[i]]; // swap elements
    }

    this.roomsRandomized = {}; // to hold randomized room positions
    for (let i = 0; i < roomNames.length; i++) { // assign positions to rooms
      var name = roomNames[i]; // get room name
      var pos = allPositions[i]; // get position
      this.roomsRandomized[name] = { // assign position to room
        x: pos.x,
        y: pos.y,
        solved: false,
        wasSolved: false
      };
    }

    this.draggingRoom = null;
    this.normalized = false;

    this.closeBtn = new Button(14, 0.5, 0.8, (self) => {
      this.activeInterface = "ScreenView";
      R.add(this.highlight);
      R.remove(this.closeBtn);
    });

    // clickable highlight
    this.highlight = new HighlightEvent(2.5, 0.6, 7.6, 4.3, 255,255,255,() =>{
      R.remove(this.highlight);
      R.add(this.closeBtn);
      this.activeInterface = "PuzzleView";
    });

    this.locked = false;

    this.activeInterface = "ScreenView";
  }

  shuffleNames(array) {
    
  }

  draw() {
    this.background?.draw();

    var u = VM.u();
    var v = VM.v();

    if(this.activeInterface == "PuzzleView") {

      if(this.normalized) {
        var MapSprite = SM.get("MapSolved");
      } else {
        var MapSprite = SM.get("MapUnsolved");
      }
      if (MapSprite && MapSprite.src) {
        fill(0,0,0,200);
        rect(1*u, 0.25*v, 14*u, 8.5*v);
        image(MapSprite.src, 1.25 * u, 0.5 * v, 13.5 * u, 8 * v);
      } else {
        fill(0);
        rect(1.5 * u, 1 * v, 13 * u, 7 * v, 10);
      }

      push();

      for (var [name, pos] of Object.entries(this.roomsRandomized)) {
        var w = 1.8 * u;
        var h = 1.15 * v;
        var x = pos.x * u;
        var y = pos.y * v;
        this.checkWinCondition();

        if (this.roomsRandomized[name].solved) 
        {
          if(!this.roomsRandomized[name].wasSolved){
            AM.play("mapInsert");
            this.roomsRandomized[name].wasSolved = true;
          }
          
          push();
          fill(20, 20, 20, 240); // normal color when solved
          stroke(100);
          strokeWeight(0.05*u);
          rectMode(CENTER);
          rect(x, y, w, h, 0.05*u);
          noStroke();
          fill(255, 255, 255);
          textAlign(CENTER, CENTER);
          textSize(0.3 * v);
          textFont(terminusFont);
          text(name, x, y, w * 0.9, h * 0.9);
          pop();
        } 
        else 
        {
          push();
          fill(255, 0, 0); // red color when unsolved
          stroke(100, 100, 100);
          strokeWeight(1);
          rectMode(CENTER);
          rect(x, y, w, h);
          noStroke();
          fill(0, 255, 255);
          textAlign(CENTER, CENTER);
          textSize(0.3 * v);
          textFont(terminusFont);
          text(name, x, y, w * 0.9, h * 0.9);
          pop();
        }
      }

      pop();
    }
  }

  checkWinCondition() {
    let allSolved = true;

    for (var [name, pos] of Object.entries(this.roomsRandomized)) { // check each room
      var currentPos = this.roomsRandomized[name]; // current position
      var targetPos = this.rooms[name]; // target position

      var dx = Math.abs((currentPos.x * VM.u()) - (targetPos.x * VM.u())); // distance in x
      var dy = Math.abs((currentPos.y * VM.v()) - (targetPos.y * VM.v())); // distance in y

      var withinBounds = dx <= (0.5 * VM.u()) && dy <= (0.5 * VM.v()); // check if within bounds
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
    AM.play("mapComplete");
    AI.addText('>_  SPACECRAFT LAYOUT GENERATING... \n>_  MAP H.U.D. FUNCTIONALITY RESTORED \n>_  PRESS \'M\' TO ACCESS MINIMAP');

    //move all the rooms back to their normal positions
    for (var [name, pos] of Object.entries(this.rooms)) {
      this.roomsRandomized[name] = {
        x: pos.x,
        y: pos.y
      };
    }

    this.normalized = true;

    GS.set("Minimap Unlocked");

    return true;
  }

  mousePressed(m) {
    if(this.activeInterface == "PuzzleView") {
      if (this.normalized) return;
      // Check if any room was clicked
      for (var [name, pos] of Object.entries(this.roomsRandomized)) {
        var u = VM.u();
        var v = VM.v();
        var w = 2 * u; // Room dimensions
        var h = 1.4 * v; // ... dimensions
        var x = pos.x * u;
        var y = pos.y * v;
        var mx = m.x * u; // Convert mouse to pixel coordinates
        var my = m.y * v; // ... pixel coordinates


        var inX = mx >= x - w / 2 && mx <= x + w / 2; // within x bounds
        var inY = my >= y - h / 2 && my <= y + h / 2; // ... y bounds

        if (inX && inY) { // Room was clicked
          AM.play("mapClick");
          this.draggingRoom = name;
          return;
        }
      }
    }
  }

  mouseDragged(m) {
    if(this.activeInterface == "PuzzleView") {
      if (this.normalized) return;
      if (!this.draggingRoom) return;

      this.roomsRandomized[this.draggingRoom] = {
        x: m.x,
        y: m.y
      };
    }
  }

  onEnter() {
    R.add(this.highlight);
    R.add(this.screenSprite);
  }

  onExit() {
    this.activeInterface = "ScreenView";
    R.remove(this.highlight);
    R.remove(this.screenSprite);
  }

}
