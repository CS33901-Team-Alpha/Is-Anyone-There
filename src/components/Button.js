class Button {
  constructor(x, y, size, onClick = () => {}) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.onClick = onClick;

    this.baseColor = color(200);
    this.hoverColor = color(150);
  }

  isMouseInBounds(mx, my) {
    const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
    return (
      m.x >= this.x &&
      m.x <= this.x + this.size &&
      m.y >= this.y &&
      m.y <= this.y + this.size
    );
  }

  update(dt) {}

  draw() {
    const u = VM.u();
    const v = VM.v();

    const c = this.isMouseInBounds() ? this.hoverColor : this.baseColor;

    noStroke();
    fill(c);
    rect(this.x * u, this.y * v, this.size * u, this.size * v, 0.5 * u);
  }

  mousePressed(p) {
    if (this.isMouseInBounds(p?.x, p?.y)) {
      this.onClick(this);
    }
  }
}

class ConditionalButton {
  constructor(x, y, size, onClick = () => {}, canDraw, c1, c2, c3, makeInvisible) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.onClick = onClick;

    this.baseColor = color(c1, c2, c3);
    this.hoverColor = color(c1 * 0.8, c2 * 0.8, c3 * 0.8);

    this.CanDraw_ = canDraw;
    this.makeInvis_ = makeInvisible;
  }

  CanDraw()  { this.CanDraw_ = true;  }
  NotDraw()  { this.CanDraw_ = false; }

  isMouseInBounds(mx, my) {
    const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
    return (
      m.x >= this.x &&
      m.x <= this.x + this.size &&
      m.y >= this.y &&
      m.y <= this.y + this.size
    );
  }

  update(dt) {}

  draw() {
    if (!this.CanDraw_ || this.makeInvis_) return;

    const u = VM.u();
    const v = VM.v();

    const c = this.isMouseInBounds() ? this.hoverColor : this.baseColor;

    noStroke();
    fill(c);
    rect(this.x * u, this.y * v, this.size * u, this.size * v, 0.5 * u);
  }

  mousePressed(p) {
    if (this.isMouseInBounds(p?.x, p?.y) && this.CanDraw_) {
      this.onClick(this);
    }
  }
}
