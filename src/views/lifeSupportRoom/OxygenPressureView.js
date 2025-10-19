class OxygenPressureView extends View {
  constructor() {
    super();

    this.background = SM.get("MetalWall");
    this.background.setSize(16, 9);

    this.keys = ['a', 's', 'd', 'f'];
    this.activeIndex = 0; // Which bar the valve is pointing to

    this.bars = this.keys.map((key, i) => ({
      key,
      pressure: 1.0, // Full pressure
      x: 2 + i * 3,
      y: 4,
      width: 1,
      height: 3
    }));

    this.valve = {
      x: this.bars[this.activeIndex].x + 0.5,
      y: this.bars[this.activeIndex].y - 1,
      angle: 0 // Angle to visually point to the bar
    };

    this.depletionRate = 0.005;
    this.recoveryRate = 0.01;
  }

    handleKey(key) {
    console.log("OxygenPressureView received key:", key);

    const idx = this.keys.indexOf(key.toLowerCase());
    if (idx !== -1) {
        this.activeIndex = idx;
        this.valve.x = this.bars[idx].x + 0.5;
        this.valve.angle = idx * (Math.PI / 2);
        return true;
    }

    return false;
    }


    keyPressed(key) {
    return this.handleKey(key);
    }

  update() {
    for (let i = 0; i < this.bars.length; i++) {
      const bar = this.bars[i];
      if (i === this.activeIndex) {
        bar.pressure = Math.min(1.0, bar.pressure + this.recoveryRate);
      } else {
        bar.pressure = Math.max(0.0, bar.pressure - this.depletionRate);
      }
    }
  }

  draw() {
    this.background?.draw();

    // Draw bars
    for (const bar of this.bars) {
      fill("gray");
      stroke("black");
      rect(bar.x * VM.U, bar.y * VM.V, bar.width * VM.U, bar.height * VM.V);


      fill("lime");
      noStroke();
      rect(bar.x * VM.U, (bar.y + bar.height * (1 - bar.pressure)) * VM.V, bar.width * VM.U, bar.height * bar.pressure * VM.V);


      fill("yellow");
      textSize(0.6 * VM.U); // scale font size to canvas units
      textAlign(CENTER, CENTER);
      text(`Active: ${this.keys[this.activeIndex]}`, 8 * VM.U, 8.5 * VM.V);

    }

    // Draw valve
    fill("silver");
    stroke("black");
    ellipse(this.valve.x * VM.U, this.valve.y * VM.V, 0.3 * VM.U, 0.3 * VM.V);


    // Draw valve pointer line
    stroke("red");
    strokeWeight(0.1 * VM.U);
    line(
    this.valve.x * VM.U,
    this.valve.y * VM.V,
    (this.bars[this.activeIndex].x + 0.5) * VM.U,
    this.bars[this.activeIndex].y * VM.V
    );

    // Display active key
    fill("yellow");
    textSize(0.6 * VM.U);
    textAlign(CENTER, CENTER);
    text(`Active: ${this.keys[this.activeIndex]}`, 8 * VM.U, 8.5 * VM.V);

  }
}