export class PinpadController {
  /**
   * @param {Pinpad} model 
   * @param {ComputerView} view 
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.enabled = true;
  }

  /**
   * Convert screen → world → pin-grid → call pinpad.push(x,y)
   * @param {{x:number,y:number}} m   p5 mouse coords normalized 0–1
   */
  mousePressed(m) {
    if (!this.enabled) return;

    const worldX = m.x * 16;
    const worldY = m.y * 9;

    const pin = this.view.hitTest(worldX, worldY);

    if (pin) {
      this.model.push({ x: pin.x, y: pin.y });
    }
  }
}