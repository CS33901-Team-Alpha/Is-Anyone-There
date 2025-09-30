class View {
  // Very Temporary Constructor later will be probably replaced with sprites and other stuff
  constructor(r=0, g=0, b=0, name="") {
    this.r = r;
    this.g = g;
    this.b = b;
    this.name = name;
  }

  draw() {
    // Fill whole canvas; canvas itself is already 16:9
    noStroke();
    fill(this.r, this.g, this.b);
    rect(0, 0, width, height);

    // Optional label centered using 16:9 units
    const u = width / 16, v = height / 9;
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(0.5 * v);
    text(this.name, 8 * u, 4.5 * v);
  }

  onEnter() {}
  onExit() {}
}

class ViewManager {
  constructor() {
    this.Views = [];
    this._currentView = 0;
  }

  addView(obj) {
    if (this.Views.length === 0) {
      R.add(obj);
      obj.onEnter();
    }
    this.Views.push(obj);
  }

  keyPressed() {
    // Don't handle arrow keys if an interface is active
    if (window.activeInterface) {
      return;
    }

    const current = this.Views[this._currentView];
    if (keyCode === LEFT_ARROW) {
      R.remove(current);
      current.onExit();
      this._currentView--;
      if (this._currentView < 0) this._currentView = this.Views.length - 1;
      const next = R.add(this.Views[this._currentView]);
      next.onEnter();
    } else if (keyCode === RIGHT_ARROW) {
      R.remove(current);
      current.onExit();
      this._currentView = (this._currentView + 1) % this.Views.length;
      const next = R.add(this.Views[this._currentView]);
      next.onEnter();
    }
  }
}

class GameState {
  constructor() {
    this.timerUp = false;
    this.solved = false;
  }

  TimerDone() {
    this.timerUp = true;
  }

  getTimer() {
    return this.timerUp;
  }

  Solved() {
    this.solved = true;
  }

  getSolved() {
    return this.solved;
  }

  isEnded() {
    return this.solved || this.timerUp;
  }
}
