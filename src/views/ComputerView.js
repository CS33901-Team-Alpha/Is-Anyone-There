// views/ComputerView.js
import { TerminalController } from '../controllers/TerminalController.js';
import { PinpadController } from '../controllers/PinpadController.js';

export class ComputerView extends View {
  constructor() {
    super();

    this.background = SM.get("NorthWall");
    this.background.setSize(16, 9);

    this.pinpad = SM.get("pinpad");
    this.pinpad.setScale(0.5);
    this.pinpad.setPos(12.5, 6);

    this.pass = GS.getPassword();

    // Highlights - when triggered they add controllers to renderer
    this.terminalHighlight = new HighlightEvent(
      2.33, 0.25, 10.1, 6.6, 255, 255, 255,
      (self) => {
        if (window.activeInterface) return;

        R.selfRemove(self);
        R.remove(this.pinpadHighlight);

        // create controller (which adds its own close button)
        const tc = new TerminalController(
          () => {
            setTimeout(() => {
              R.add(this.terminalHighlight);
              R.add(this.pinpadHighlight);
            }, 100);
          },
          () => {
            R.remove(this.terminalHighlight);
            R.remove(this.pinpadHighlight);
            R.remove(this.pinpad);
          }
        );

        R.add(tc);
      }
    );

    this.pinpadHighlight = new HighlightEvent(
      12.5, 6, 1.3, 1.85, 255, 255, 255,
      (self) => {
        if (window.activeInterface) return;

        R.selfRemove(self);
        R.remove(this.terminalHighlight);

        const pc = new PinpadController(this.pass, () => {
          setTimeout(() => {
            R.add(this.terminalHighlight);
            R.add(this.pinpadHighlight);
          }, 100);
        });
        R.add(pc);
      }
    );
  }

  onEnter() {
    if (!AM.isLooping("startGame")) {
      AM.stopAll();
      AM.loop("startGame");
    }
    R.add(this.background);
    R.add(this.pinpad);
    R.add(this.terminalHighlight);
    R.add(this.pinpadHighlight);
  }

  onExit() {
    R.remove(this.background);
    R.remove(this.pinpad);
    this.pinpad.label = ''; // reset pinpad input on exit (no-op: kept for parity)
    R.remove(this.terminalHighlight);
    R.remove(this.pinpadHighlight);
  }
}