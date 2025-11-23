import { Button } from '../../components/Button.js';

export class FileCabinetView {
    constructor(model) {
        this.model = model;
        this.sprite = SM.get(model.spriteName);

        if (this.sprite) {
            this.sprite.setPos(model.x, model.y);
            this.sprite.setScale(model.scale);
        } else {
            console.warn(`FileCabinetView: sprite '${model.spriteName}' not found`);
        }

        this.highlight = new TextNotificationHandler(
            model.x,
            model.y,
            model.width,
            model.height
        );
    }

    draw() {
        // sprites handled by renderer
    }

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

        const spriteName = `secondNumber`;
        this.numberImage = SM.get(spriteName) || SM.get('secondNumber');

        if (this.numberImage) {
            this.numberImage.setPos(6.5, 3);
            this.numberImage.setScale(0.75);
        } else {
            console.warn(
                `OpenCabinetUIView: neither '${spriteName}' nor 'secondNumber' found`
            );
        }
    }

    draw() {
        if (!this.model.visible) return;

        const u = VM.u(),
            v = VM.v();

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