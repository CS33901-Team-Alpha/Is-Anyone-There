import { FileCabinetView, OpenCabinetUIView } from '../views/firstRoom/FileCabinetView.js';
import { FileCabinetModel, OpenCabinetModel } from '../models/puzzles/first/FileCabinetModel.js';
import { TextNotificationHandler } from "../components/TextNotification.js";
import { Renderer } from '../core/Renderer.js';


export class FileCabinetController {
    constructor(renderer, textNotificationHandler) {
        this.background = null;
        this.scale = 0.3;

        // assign renderer early so views can receive it during construction
        this.R = renderer;

        this.cabinetModels = [];
        this.cabinetViews = [];

        this.uiModel = new OpenCabinetModel();
        // give the uiView a reference back to this controller
        this.uiView = new OpenCabinetUIView(this.uiModel, this.R, this);
        this.secretId = this.uiModel.number;

        // pass renderer into TextNotificationHandler so it does not depend on global R
        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85, null, null, this.R);

        // track whether UI view is currently added
        this.uiOpen = false;
    }

    // called by the UI view's close button (or other places) to fully dismiss the UI
    closeUI() {
        if (!this.uiOpen && !this.uiModel.visible) {
            // already closed
            try { this.uiModel.hide(); } catch (e) {}
            return;
        }
        // hide model state
        try { this.uiModel.hide(); } catch (e) {}
        // remove UI children (buttons/images)
        try { this.uiView.onRemove(); } catch (e) {}
        // ensure any known child objects are removed from renderer
        try {
            if (this.uiView && this.uiView._closeBtn && this.R) this.R.remove(this.uiView._closeBtn);
            if (this.uiView && this.uiView.numberImage && this.R) this.R.remove(this.uiView.numberImage);
        } catch (e) {}
        // remove ui view itself from renderer
        try { if (this.R) this.R.remove(this.uiView); } catch (e) {}
        this.uiOpen = false;
    }

    initSprites() {

        this.background = SM.get("WestWall");
        if (this.background) this.background.setSize(16, 9);

        this.cabinetModels = []; 
        this.cabinetViews = []; 
        for (let i = 0; i < 4; i++) {
            const isSecret = (i === this.secretId);            
            const model = new FileCabinetModel(
                i,
                1 + i * 3.5,
                5.5,
                1.5,
                2,                
                `FileCabinet${i + 1}`,
                isSecret
            );
            model.scale = this.scale;
            this.cabinetModels.push(model);
            const view = new FileCabinetView(model, this.R);
            this.cabinetViews.push(view);
        }
    }

    draw() {
        // handled by renderer 
    }

    update(dt) {
        this.textNotificationHandler.update(dt);
    }

    mousePressed(p) {
        // If UI modal is open, handle clicks to dismiss it (modal area in OpenCabinetUIView)
        // Modal virtual coordinates (matches OpenCabinetUIView.draw): x=3.5..3.5+9, y=2.2..2.2+4.6666
        if (this.uiOpen && this.uiModel && this.uiModel.visible) {
            const mx = p.x, my = p.y;
            const modalX = 3.5, modalY = 2.2, modalW = 9, modalH = 4.6666;
            if (mx >= modalX && mx <= modalX + modalW && my >= modalY && my <= modalY + modalH) {
                this.closeUI();
                return;
            }
        }
 
         this.cabinetModels.forEach((m, i) => {
             if (m.containsPoint(p.x, p.y)) {
                 if (m.isSecret) {
                     this.textNotificationHandler.addText('You opened a mysterious file cabinet.');
                     if (!this.uiOpen) {
                         this.uiModel.show();
                         this.uiView.onAdd();
                         if (this.R) this.R.add(this.uiView, 10);
                         this.uiOpen = true;
                     }
                     AM.play('drawerOpen');
                 } else {
                     this.textNotificationHandler.addText('This file cabinet appears to be locked...');
                     AM.play('drawerLocked');
                 }
             }
         });
     }

    onEnter() {
        this.initSprites(); 
        if (this.background) this.R.add(this.background);
        this.cabinetViews.forEach(v => {
            this.R.add(v, 9);
            v.onEnter();
        });
        if (this.uiModel.visible && !this.uiOpen) {
            this.uiView.onAdd();
            if (this.R) this.R.add(this.uiView, 10);
            this.uiOpen = true;
        }
    }

    onExit() {
        this.R.remove(this); 
        if (this.background) this.R.remove(this.background);
        this.cabinetViews.forEach(v => v.onExit());
        this.uiView.onRemove();
        this.R.remove(this.uiView);
        this.textNotificationHandler.cleanup();
    }
}