import { FileCabinetView, OpenCabinetUIView } from '../views/firstRoom/FileCabinetView.js';
import { FileCabinetModel, OpenCabinetModel } from '../models/puzzles/first/FileCabinetModel.js';
import { Button } from '../components/Button.js';
import { TextNotificationHandler } from "../components/TextNotification.js";


export class FileCabinetController {
    constructor(secretId = 2) {
        this.background = null;
        this.scale = 0.3;
        this.secretId = secretId;

        this.cabinetModels = [];
        this.cabinetViews = [];

        this.uiModel = new OpenCabinetModel();
        this.uiView = new OpenCabinetUIView(this.uiModel);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);
    }

    initSprites() {
        this.background = SM.get("WestWall");
        if (this.background) this.background.setSize(16, 9);

        for (let i = 0; i < 4; i++) {
            const isSecret = (i === this.secretId);
            const model = new FileCabinetModel(
                i,
                1.5 + 3 * i,
                5.7,
                this.scale,
                `FileCabinet`,
                isSecret
            );
            this.cabinetModels.push(model);
            const view = new FileCabinetView(model);
            view.init();         
            this.cabinetViews.push(view);
        }

        this.uiView.init();
    }

    draw() {
        this.cabinetViews.forEach(v => v.draw());
        this.uiView.draw();
    }

    update(dt) {
        this.textNotificationHandler.update(dt);
    }

    mousePressed(p) {
        this.cabinetModels.forEach((m, i) => {
            if (m.containsPoint(p.x, p.y)) {
                if (m.isSecret) {
                    this.textNotificationHandler.addText('You opened a mysterious file cabinet.');
                    this.uiModel.show();
                    this.uiView.onAdd();
                    R.add(this.uiView, 10);
                    AM.play('drawerOpen');
                } else {
                    this.textNotificationHandler.addText('This file cabinet appears to be locked...');
                    AM.play('drawerLocked');
                }
            }
        });
    }

    onEnter() {
        if (this.background) R.add(this.background);
        this.cabinetViews.forEach(v => v.onEnter());
        if (this.uiModel.visible) this.uiView.onAdd();
    }

    onExit() {
        if (this.background) R.remove(this.background);
        this.cabinetViews.forEach(v => v.onExit());
        this.uiView.onRemove();
        R.remove(this.uiView);
        this.textNotificationHandler.cleanup();
    }
}