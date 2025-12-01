import { Button } from '../../components/Button.js';
import { TextNotificationHandler } from "../../components/TextNotification.js";
import { Renderer } from '../../core/Renderer.js';



export class FileCabinetView {
    constructor(model, renderer) {
        this.model = model;

        const base = SM.get(model.spriteName);
        if(!base){
            console.warn(`FileCabinetView : sprite '${model.spriteName}' not found!!`);
            return; 
        }

        this.sprite = base.clone(); 
        this.sprite.setScale(model.scale)
        this.sprite.setPos(model.x, model.y); 


        // pass renderer into the TextNotificationHandler so it doesn't use global R
        this.R = renderer;
        this.highlight = new TextNotificationHandler(
            model.x,
            model.y,
            model.width,
            model.height,
            this.R
        );
    }

    draw() {
        if (this.sprite) this.sprite.draw();
    }

    onEnter() {
        if (this.sprite && this.R) this.R.add(this.sprite, 9);
        if (this.R) this.R.add(this.highlight);
    }

    onExit() {
        if (this.sprite && this.R) this.R.remove(this.sprite);
        if (this.R) this.R.remove(this.highlight);
    }
}

export class OpenCabinetUIView {
    constructor(model, renderer, controller = null) {
        this.model = model;

        this.R = renderer;
        this._controller = controller;
        this._closeBtn = new Button(11.5, 2.4, 0.6, (self) => {
           this._controller.closeUI(); 
        });

        const spriteName = `secondNumber`;
        const baseImg = SM.get(spriteName) || SM.get('secondNumber');
        if (baseImg) {
            this.numberImage = baseImg.clone();
            this.numberImage.setPos(6.5, 3);
            this.numberImage.setScale(4);
        } else {
            console.warn(
                `OpenCabinetUIView: neither '${spriteName}' nor 'secondNumber' found`
            );
            this.numberImage = null;
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
        if (this.R) this.R.add(this._closeBtn, 11);
        if (this.numberImage && this.R) this.R.add(this.numberImage, 15);
    }

    onRemove() {
        if (this.R) this.R.remove(this._closeBtn);
        if (this.numberImage && this.R) this.R.remove(this.numberImage);
    }
}