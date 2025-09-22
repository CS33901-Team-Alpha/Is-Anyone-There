// ImportSprites.js
class Sprite2D {
  constructor(src, x = 0, y = 0, options = {}) {
    this.x = x;
    this.y = y;
    this.scale = options.scale ?? 1;
    this.rotation = options.rotation ?? 0;
    this.visible = true;

    this.img = null;      // p5.Image
    this.ready = false;
    this.width  = options.width  ?? null;
    this.height = options.height ?? null;

    const onReady = (img) => {
      this.img = img;                 // ensure it's a p5.Image
      if (!this.width)  this.width  = img.width;
      if (!this.height) this.height = img.height;
      this.ready = true;
    };

    // Accept either a p5.Image or a string path
    if (typeof src === "object" && typeof src.width === "number" && typeof src.height === "number") {
      // already a p5.Image (e.g., from preload/loadImage)
      onReady(src);
    } else if (typeof src === "string") {
      // load it as a p5.Image (no preload required)
      loadImage(src, onReady, err => console.error("Sprite2D load failed:", src, err));
    } else {
      console.error("Sprite2D: src must be a path string or a p5.Image");
    }
  }

  update(dt) {}

  draw() {
    // draw only when p5.Image is ready
    if (!this.visible || !this.ready || !this.img || !this.width || !this.height) return;

    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    scale(this.scale);
    //imageMode(CENTER);
    image(this.img, 0, 0, this.width, this.height);
    pop();
  }
}

// expose globally if you’re not using ES modules
window.Sprite2D = Sprite2D;