import { Button } from '../../components/Button.js';
import { TextNotificationHandler } from '../../components/TextNotification.js';
import { Renderer } from '../../core/Renderer.js';

export class FileCabinetView {
    constructor() {
        this.sprite = null;
        this.highlight = null;
    }

    /**
     * @param {Object} config - { spriteName, x, y, scale, width, height }
     */
    init(config) {
        const { spriteName, x, y, scale, width, height } = config;

        this.sprite = SM.get(spriteName);
        if (this.sprite) {
            this.sprite.setPos(x, y);
            this.sprite.setScale(scale);
        } else {
            console.warn(`FileCabinetView: sprite '${spriteName}' not found`);
        }

        this.highlight = new TextNotificationHandler(x, y, width, height);
    }

    draw() { } // handled by Renderer

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
    constructor() {
        this._closeBtn = new Button(11.5, 2.4, 0.6, (self) => {
            R.selfRemove(self);
            R.remove(this);
            AM.play('drawerClose');
        });
        this.sprite = null;
    }

    /**
     * @param {Object} config - { spriteName, visible }
     */
    init(config) {
        const { spriteName } = config;
        this.sprite = SM.get(spriteName); 
        if (!this.sprite) console.warn('sprite', spriteName, 'not found');
    }

    draw(config) {
        if (!config.visible) return;

        const u = VM.u(), v = VM.v();
        push();
        fill(169, 169, 169);
        stroke(255);
        strokeWeight(2);
        rect(3.5 * u, 2.2 * v, 9 * u, 4.6666 * v, 10);
        pop();
    }

    onAdd(config) {
        if (!config.visible) return;
        R.add(this._closeBtn, 11);
        if (this.sprite) R.add(this.sprite, 15);
    }

    onRemove() {
        R.remove(this._closeBtn);
        if (this.sprite) R.remove(this.sprite);
    }
}
