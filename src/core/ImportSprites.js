class Sprite2D {
  constructor(src, x = 0, y = 0, options = {}) {
    this.x = x;
    this.y = y;

    this.scale = options.scale ?? 1;
    this.rotation = options.rotation ?? 0;
    this.visible = true;

    this.img = null;        // p5.Image
    this.ready = false;

    this.wUnits = options.width ?? null;   // width in units (if null, use native px)
    this.hUnits = options.height ?? null;  // height in units (if null, use native px)

    const onReady = (img) => {
      this.img = img;
      this.ready = true;
    };

    if (typeof src === 'object' && typeof src.width === 'number') {
      onReady(src);
    } else if (typeof src === 'string') {
      loadImage(src, onReady, err => console.error('Sprite2D load failed:', src, err));
    } else {
      console.error('Sprite2D: src must be a path string or a p5.Image');
    }
  }

  update(dt) {}

  draw() {
    if (!this.visible || !this.ready || !this.img) return;

    const u = VM.u();
    const v = VM.v();

    const wpx = (this.wUnits != null) ? this.wUnits * u : this.img.width;
    const hpx = (this.hUnits != null) ? this.hUnits * v : this.img.height;

    push();
    translate(this.x * u, this.y * v);
    rotate(this.rotation);
    scale(this.scale);
    image(this.img, 0, 0, wpx, hpx);
    pop();
  }
}

window.Sprite2D = Sprite2D;
