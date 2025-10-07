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
    this.Views.push(obj);
  }

  onEnter() {
    const v = this.Views[this._currentView];
    if (v) { R.add(v); v.onEnter?.(); }
  }

  onExit() {
    const v = this.Views[this._currentView];
    if (v) { R.remove(v); v.onExit?.(); }
  }

  keyPressed() {
    if (window.activeInterface) return false; // Don't handle when interface is active

    const current = this.Views[this._currentView];
    if (keyCode === LEFT_ARROW) {
      R.remove(current); current.onExit?.();
      this._currentView = (this._currentView - 1 + this.Views.length) % this.Views.length;
      const next = this.Views[this._currentView]; R.add(next); next.onEnter?.();
      return true; // Event handled
    } else if (keyCode === RIGHT_ARROW) {
      R.remove(current); current.onExit?.();
      this._currentView = (this._currentView + 1) % this.Views.length;
      const next = this.Views[this._currentView]; R.add(next); next.onEnter?.();
      return true; // Event handled
    }
    
    return false; // Event not handled
  }

  gotoView(viewInstance){
    const current = this.Views[this._currentView];
    R.remove(current); current.onExit?.();

    const index = this.Views.indexOf(viewInstance);
    if(index === -1){ console.warn("this view is not in viewmanager!"); return; }

    this._currentView = index;
    const next = this.Views[this._currentView]; R.add(next); next.onEnter?.();
  }

  gotoIndex(i) {
    if (i < 0 || i >= this.Views.length) return;
    const current = this.Views[this._currentView];
    R.remove(current); current.onExit?.();
    this._currentView = i;
    const next = this.Views[this._currentView]; R.add(next); next.onEnter?.();
  }
}

/*
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
*/