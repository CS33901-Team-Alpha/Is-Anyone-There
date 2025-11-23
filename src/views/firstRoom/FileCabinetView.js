import { Button } from '../../components/Button.js';
import { TextNotificationHandler } from '../../components/TextNotification.js';
import { Renderer } from '../../core/Renderer.js';





export class FileCabinetView {
    constructor(model) {
        this.model = model;
        this.sprite = null;
        this.highlight = null;
        this.spriteName = `FileCabinet${this.model.id + 1}`;
    }

    init() {
        this.sprite = SM.get(this.spriteName);
        if (this.sprite) {
            this.sprite.setPos(this.model.x, this.model.y);
            this.sprite.setScale(this.model.scale);
        } else {
            console.warn(`FileCabinetView: sprite '${this.spriteName}' not found`);
        }

        this.highlight = new TextNotificationHandler(
            this.model.x,
            this.model.y,
            this.model.width,
            this.model.height
        );
    }

    draw() { } // sprites handled by renderer

    onEnter() {
        if (this.sprite) R.add(this.sprite, 9);
        R.add(this.highlight);
    }
    onExit() {
        if (this.sprite) R.remove(this.sprite);
        R.remove(this.highlight);
    }
}

export class OpenCabinetUIView {
    constructor(model) {
        this.model = model;
        this._closeBtn = new Button(11.5, 2.4, 0.6, (self) => {
            R.selfRemove(self);
            R.remove(this);
            this.model.hide();
            AM.play('drawerClose');
        });

        this.numberImage = null;
        this.spriteName = 'secondNumber';
    }

    init() {
        this.sprite = SM.get(this.spriteName); 
        if (!this.sprite) console.warn('sprite', this.spriteName, 'not found');
    }

    draw() {
        if (!this.model.visible) return;
        const u = VM.u(), v = VM.v();
        push();
        fill(169, 169, 169);
        stroke(255);
        strokeWeight(2);
        rect(3.5 * u, 2.2 * v, 9 * u, 4.6666 * v, 10);
        pop();
    }

    onAdd() {
        if (!this.model.visible) return;
        R.add(this._closeBtn, 11);
        if (this.numberImage) R.add(this.numberImage, 15);
    }
    onRemove() {
        R.remove(this._closeBtn);
        if (this.numberImage) R.remove(this.numberImage);
    }
}

