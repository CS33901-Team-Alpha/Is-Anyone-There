/**
 * VM (Virtual Metrics)
 * 16:9 unit helpers shared by all views/UI.
 * - Units: 16 wide (x), 9 tall (y)
 * - VM.U / VM.V = pixels per unit (computed from p5 width/height)
 * - Do NOT import anything; this attaches VM to window.
 */

(function attachVM(global) {
  const VM = {
    // pixels-per-unit (updated after canvas size changes)
    U: 0,
    V: 0,

    // Recompute U/V from the current p5 canvas size.
    updateUnits() {
      if (typeof width !== "number" || typeof height !== "number") {
        this.U = 0;
        this.V = 0;
        return;
      }
      this.U = width / 16;
      this.V = height / 9;
    },

    // Convenience getters (keeps older code working).
    u() { return this.U; },
    v() { return this.V; },

    // Convert 16:9 units <-> screen pixels.
    toScreen(x, y) {
      return { x: x * this.U, y: y * this.V };
    },
    toVirtual(px, py) {
      return { x: px / this.U, y: py / this.V };
    },

    // Mouse in 16:9 units (updated each frame from p5 mouseX/Y).
    _mouse: { x: 0, y: 0 },
    mouse() { return this._mouse; },

    updateMouseFromP5() {
      if (typeof mouseX !== "number" || this.U === 0 || this.V === 0) return;
      this._mouse = this.toVirtual(mouseX, mouseY);
    },

    // Utility: is a point (in 16:9 units) inside the canvas area?
    insideUnits(p) {
      return p && p.x >= 0 && p.y >= 0 && p.x <= 16 && p.y <= 9;
    }
  };

  global.VM = VM;
})(window);
