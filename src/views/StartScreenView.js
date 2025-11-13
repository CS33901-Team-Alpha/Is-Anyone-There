class StartScreenView extends View {
  constructor(onStart) {
    super(0, 0, 0, '');
    this.onStart = onStart;

    // Start Button in 16:9 units (centered horizontally)
    this.btnW = 2.8;
    this.btnH = 0.9;
    this.btnX = 8 - this.btnW / 2;
    this.btnY = 5.8;

    // How-To Button in 16:9 units (centered horizontally)
    this.HTbtnW = 4;
    this.HTbtnH = 0.9;
    this.HTbtnX = 8 - this.HTbtnW / 2;
    this.HTbtnY = 7;

    this.title = 'Is Anyone There?';
    this.instruction = 'Click anywhere to start music!';
    this.musicStarted = false;

    // Star field in units
    this.stars = Array.from({ length: 200 }, () => ({
      x: random(16),
      y: random(9),
      r: random(0.02, 0.06),
      a: random(120, 255)
    }));

    // Shooting star in units
    this.fromX = 0;
    this.fromY = 0;
    this.toX = 0;
    this.toY = 0;
    this.step = 3;

    this.clickedHowTo = false;
  }

  drawStarField() {
    const u = VM.u();
    const v = VM.v();

    for (const s of this.stars) {
      s.a += random(-5, 5);
      stroke(255, s.a);
      strokeWeight(s.r * u);
      point(s.x * u, s.y * v);
    }
  }

  drawShootingStar() {
    const u = VM.u();
    const v = VM.v();

    if (this.step >= 2.5) {
      this.fromX = random(16);
      this.fromY = random(4.5);
      this.toX = random(this.fromX + 0.5, 16);
      this.toY = random(this.fromY + 0.2, 4.5);
      this.step = 0;
    }

    if (this.step < 2.5) {
      const n = this.step + 0.02;

      stroke(0, 20, 80, 30);
      strokeWeight(0.03 * u);
      line(this.fromX * u, this.fromY * v, this.toX * u, this.toY * v);

      if (this.step < 1) {
        stroke(255, (1 - this.step) * 200);
        strokeWeight(0.02 * u);

        const ax = lerp(this.fromX, this.toX, this.step);
        const ay = lerp(this.fromY, this.toY, this.step);
        const bx = lerp(this.fromX, this.toX, n);
        const by = lerp(this.fromY, this.toY, n);

        line(ax * u, ay * v, bx * u, by * v);
      }

      this.step = n;
    }
  }

  drawHowTo() {
    const u = VM.u();
    const v = VM.v();

    const m = VM.mouse();
    const hover =
      m.x >= this.HTbtnX &&
      m.x <= this.HTbtnX + this.HTbtnW &&
      m.y >= this.HTbtnY &&
      m.y <= this.HTbtnY + this.HTbtnH;

    if (hover && !this.clickedHowTo) {
      fill(100, 150, 255, 200);
      stroke(150, 200, 255, 150);
      strokeWeight(0.08 * u);
    } else {
      fill(50, 100, 200, 200);
      noStroke();
    }

    rect(this.HTbtnX * u, this.HTbtnY * v, this.HTbtnW * u, this.HTbtnH * v, 0.5 * u);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(gameFont);
    textSize(0.25 * v);
    const cx = (this.HTbtnX + this.HTbtnW / 2) * u;
    const cy = (this.HTbtnY + this.HTbtnH / 2) * v;
    text('How To Play', Math.round(cx), Math.round(cy));
  }

  drawButton() {
    const u = VM.u();
    const v = VM.v();

    const m = VM.mouse();
    const hover =
      m.x >= this.btnX &&
      m.x <= this.btnX + this.btnW &&
      m.y >= this.btnY &&
      m.y <= this.btnY + this.btnH;

    if (hover && !this.clickedHowTo) {
      fill(100, 150, 255, 200);
      stroke(150, 200, 255, 150);
      strokeWeight(0.08 * u);
    } else {
      fill(50, 100, 200, 200);
      noStroke();
    }

    rect(this.btnX * u, this.btnY * v, this.btnW * u, this.btnH * v, 0.5 * u);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(gameFont);
    textSize(0.25 * v);
    const cx = (this.btnX + this.btnW / 2) * u;
    const cy = (this.btnY + this.btnH / 2) * v;
    text('Start!', Math.round(cx), Math.round(cy));
  }

  draw() {
    background(0, 20, 80, 25);

    const u = VM.u();
    const v = VM.v();

    this.drawStarField();
    this.drawShootingStar();

    fill(255);
    textAlign(CENTER, CENTER);
    textFont(gameFont);

    textSize(0.8 * v);
    text(this.title, 8 * u, 3.7 * v);

    textSize(0.3 * v);
    text(this.instruction, 8 * u, 4.6 * v);

    this.drawButton();
    this.drawHowTo();

    if(this.clickedHowTo) {
      // background / frame
      const screenSprite = SM.get("screen");
      if (screenSprite && screenSprite.src) {
        image(screenSprite.src, 1.5 * u, 0.75 * v, 13 * u, 7.5 * v);
        fill(0,0,0,200);
        stroke(100, 150, 255, 200);
        strokeWeight(5);
        rect(1.5*u, 0.75*v, 13*u, 7.5*v);
      } else {
        fill(0);
        stroke(128);
        strokeWeight(2);
        rect(1.5 * u, 1 * v, 13 * u, 7 * v, 10);
      }

      // text w/ glow
      strokeWeight(1);
      stroke(255,255,255);
      textAlign(LEFT, CENTER);
      textFont(gameFont);
      textSize(0.45 * v);

       fill(100, 150, 255);
      text("How To Play : ESC to exit", 2.5 * u + 1, 1.5 * v + 1);

      fill(100, 150, 255);
      text("How To Play : ESC to exit", 2.5 * u, 1.5 * v);
    
      textSize(0.3 * v);
      fill(100, 150, 255);
      text("Welcome to \"Is Anyone There?\"!",  3.5* u, 2.5 * v);

      textSize(0.25 * v);
      fill(100, 150, 255);
      text("This is a point-and-click style adventure game. \nYou have woken up on your spaceship, with no \nmemory of what is going on. The ship's computer \nassistant informs you that the ship is in \ncritical condition, and you alone must fix it! \nExplore, gather information, solve puzzles to \nfix systems, and do so before time runs out in \norder to survive and win!",  2* u, 4.5 * v);
      text("Use left and right arrow keys to change view \norientation, click on items you find to interact \nwith them. Items that highlight when you hover \nover them can be interacted with, but not all \ninteractable items have highlights on them... \nso look carefully, and have fun!",  2* u, 7 * v);
    }
  }

  mousePressed(p) {
    const starthit =
      p.x >= this.btnX &&
      p.x <= this.btnX + this.btnW &&
      p.y >= this.btnY &&
      p.y <= this.btnY + this.btnH;

    const howtohit =
      p.x >= this.HTbtnX &&
      p.x <= this.HTbtnX + this.HTbtnW &&
      p.y >= this.HTbtnY &&
      p.y <= this.HTbtnY + this.HTbtnH;

    if (starthit && this.onStart && !this.clickedHowTo) {
      this.onStart();
    }
    else if (howtohit && this.onStart && !this.clickedHowTo) {
      this.clickedHowTo = true;
    } else if (!starthit && !howtohit && !this.clickedHowTo && !this.musicStarted) {
      // Start music on any click on the start screen (not just the button)
      if (startScreenMusic && !startScreenMusic.isPlaying()) {
        startScreenMusic.setLoop(true);
        startScreenMusic.play();
        this.musicStarted = true;
        this.instruction = 'Click Start to Begin!';
      }
    }
  }

  keyPressed() {
    if (keyCode === ESCAPE && this.clickedHowTo) {
      this.clickedHowTo = false;
    }
  }
}

class EndScreenView extends View {
  constructor(Solved) {
    super(0, 0, 0, '');
    
    //Boolean that holds the state when screen appears
    this.solved = Solved;

    this.title = 'Game Over';
    this.textColor = this.solved ? 'green' : 'red';
    this.instruction = this.solved ? 'You Have Won!' : 'Sorry, you Died...';

    // Button in 16:9 units (centered horizontally)
    this.btnW = 2.8;
    this.btnH = 0.9;
    this.btnX = 8 - this.btnW / 2;
    this.btnY = 6.5;

    // Star field in units
    this.stars = Array.from({ length: 200 }, () => ({
      x: random(16),
      y: random(9),
      r: random(0.02, 0.06),
      a: random(120, 255)
    }));

    // Shooting star in units
    this.fromX = 0;
    this.fromY = 0;
    this.toX = 0;
    this.toY = 0;
    this.step = 3;
  }

  drawStarField() {
    const u = VM.u();
    const v = VM.v();

    for (const s of this.stars) {
      s.a += random(-5, 5);
      stroke(255, s.a);
      strokeWeight(s.r * u);
      point(s.x * u, s.y * v);
    }
  }

  drawShootingStar() {
    const u = VM.u();
    const v = VM.v();

    if (this.step >= 2.5) {
      this.fromX = random(16);
      this.fromY = random(4.5);
      this.toX = random(this.fromX + 0.5, 16);
      this.toY = random(this.fromY + 0.2, 4.5);
      this.step = 0;
    }

    if (this.step < 2.5) {
      const n = this.step + 0.02;

      stroke(0, 20, 80, 30);
      strokeWeight(0.03 * u);
      line(this.fromX * u, this.fromY * v, this.toX * u, this.toY * v);

      if (this.step < 1) {
        stroke(255, (1 - this.step) * 200);
        strokeWeight(0.02 * u);

        const ax = lerp(this.fromX, this.toX, this.step);
        const ay = lerp(this.fromY, this.toY, this.step);
        const bx = lerp(this.fromX, this.toX, n);
        const by = lerp(this.fromY, this.toY, n);

        line(ax * u, ay * v, bx * u, by * v);
      }

      this.step = n;
    }
  }

  drawButton() {
    const u = VM.u();
    const v = VM.v();

    const m = VM.mouse();
    const hover =
      m.x >= this.btnX &&
      m.x <= this.btnX + this.btnW &&
      m.y >= this.btnY &&
      m.y <= this.btnY + this.btnH;

    if (hover) {
      fill(100, 150, 255, 200);
      stroke(150, 200, 255, 150);
      strokeWeight(0.08 * u);
    } else {
      fill(50, 100, 200, 200);
      noStroke();
    }

    rect(this.btnX * u, this.btnY * v, this.btnW * u, this.btnH * v, 0.5 * u);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(gameFont);
    textSize(0.25 * v);
    const cx = (this.btnX + this.btnW / 2) * u;
    const cy = (this.btnY + this.btnH / 2) * v;
    text('Restart', Math.round(cx), Math.round(cy));
  }

  draw() {
    background(0, 0, 0);

    const u = VM.u();
    const v = VM.v();

    this.drawStarField();
    this.drawShootingStar();

    if (this.textColor === 'green') {
      fill(0, 255, 0); // Green for Solved
    } else if (this.textColor === 'red') {
      fill(255, 0, 0); // Red for not Solved
    }
    textAlign(CENTER, CENTER);
    textFont(gameFont);

    textSize(0.8 * v);
    text(this.title, 8 * u, 3.7 * v);

    textSize(0.3 * v);
    text(this.instruction, 8 * u, 4.6 * v);

    textSize(0.2 * v);
    text(GS.getString(), 8 * u, 5.35 * v);

    this.drawButton();

  }

  mousePressed(p) {
    const starthit =
      p.x >= this.btnX &&
      p.x <= this.btnX + this.btnW &&
      p.y >= this.btnY &&
      p.y <= this.btnY + this.btnH;

    if (starthit) {
      this.restartGame();
    }
  }

  restartGame() {
    // Clear any active interfaces
    window.activeInterface = null;

    //get the curent death count
    let currentDeaths = GS.getDeaths();

    //if the game is not solved then incriment the deaths
    if(!this.solved){
      currentDeaths++;
    }

    const newGame = new GameState();
    newGame.deaths = currentDeaths;

    //conert current game state object to string
    const newGameString = JSON.stringify(newGame); 
    //save game state string in local storage with unique key
    localStorage.setItem('currentGameState', newGameString);
    console.log(`New game ready to start. Total deaths: ${newGame.deaths}`);

    const finalStateString = JSON.stringify(GS);
    localStorage.setItem('completedGame', finalStateString);
    console.log("Final score has been saved!");
  
    location.reload();
  }
}
