/**
 * This file contains a bunch of views that are examples on how to do things, 
 * they are NOT in the demos or the actual game (we were using them only for testing).
 * 
 * If you want to understand how views work, see FileCabinetView.js, ComputerView.js (both fully documented)
 * and also DOCUMENTATION.md for explanations and common errors.
 */

class TimerView extends View {
  constructor() {
    super(255, 99, 71, 'Room 2 - Timer');
    this.timer = new Timer(30000);
    this.timeLabel = 0;
  }

  update(dt) {
    this.timeLabel = this.timer.getSeconds();
  }

  draw() {
    super.draw();

    const u = VM.u();
    const v = VM.v();

    push();
    fill(0);
    textAlign(CENTER, CENTER);

    textSize(1.0 * v);
    text(this.timeLabel, 8 * u, 2.25 * v);

    textSize(0.4 * v);
    text('Press Space To reset Timer', 8 * u, 4.0 * v);
    pop();
  }

  keyPressed() {
    if (keyCode === 32) this.timer.reset();
  }
}

class EventView extends View {
  constructor() {
    super(58, 134, 255, 'Room 1');

    // Buttons in units
    this.bttn1 = new Button(8 - 1.8, 5.5, 0.8, () => { this.text = 'Event 1'; });
    this.bttn2 = new Button(8 - 0.4, 5.5, 0.8, () => { this.text = 'Event 2'; });
    this.bttn3 = new Button(8 + 1.0, 5.5, 0.8, () => { this.text = 'Event 3'; });

    this.text = '';
  }

  draw() {
    super.draw();

    const u = VM.u();
    const v = VM.v();

    push();
    fill(0);
    textSize(2.0 * v);
    textAlign(CENTER, CENTER);
    text(this.text, 8 * u, 2.25 * v);

    textSize(0.9 * v);
    text('Press Buttons To Show Events', 8 * u, 4.0 * v);
    pop();
  }

  onEnter() {
    R.add(this.bttn1);
    R.add(this.bttn2);
    R.add(this.bttn3);
  }

  onExit() {
    R.remove(this.bttn1);
    R.remove(this.bttn2);
    R.remove(this.bttn3);
  }
}

class MoveView extends View {
  constructor() {
    super(60, 179, 113, 'Room 3');

    // MoveBlocks in units
    this.block1 = new MoveBlock(10.5, 6.0, 1.2);
    this.block2 = new MoveBlock(4.0, 2.2, 1.2);
    this.block3 = new MoveBlock(4.0, 6.0, 1.2);
    this.block4 = new MoveBlock(10.5, 2.2, 1.2);
  }

  draw() {
    super.draw();

    const u = VM.u();
    const v = VM.v();

    push();
    textSize(0.2 * v);
    textAlign(CENTER, CENTER);
    text('Move the Boxes around!', 8 * u, 4.8 * v);
    pop();
  }

  onEnter() {
    R.add(this.block1);
    R.add(this.block2);
    R.add(this.block3);
    R.add(this.block4);
  }

  onExit() {
    R.remove(this.block1);
    R.remove(this.block2);
    R.remove(this.block3);
    R.remove(this.block4);
  }
}

class BillboardView extends View {
  constructor() {
    super(0, 0, 0, '');
    this.background = SM.get("SouthWall");
    this.background.setSize(16, 9);
  }

  update(dt) {}

  draw() {}

  onEnter() {
    R.add(this.background);
  }

  onExit() {
    R.remove(this.background);
  }
}

class BoxesView extends View {
  constructor() {
    super(0, 0, 0, '');
    this.background = SM.get("EastWall");
    this.background.setSize(16, 9);
  }

  update(dt) {}

  draw() {}

  onEnter() {
    R.add(this.background);
  }

  onExit() {
    R.remove(this.background);
  }
}
