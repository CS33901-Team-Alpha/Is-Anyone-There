// controllers/FileCabinetController.js
import { FileCabinetModel, OpenCabinetModel } 
  from "../models/puzzles/first/FileCabinetModel.js";

class FileCabinetController {
    constructor(){
        this.cabinets = [];
        this.views = [];
        this.secretId = Math.trunc(Math.random() * 4); // which cabinet is unlocked
        this.openCabinetModel = new OpenCabinetModel();
        this.openCabinetView = new OpenCabinetUIView();

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        this.scale = 0.3;
        for(let i = 0; i < 4; i++){
            const model = new FileCabinetModel(i, 1.5 + 3*i, 5.7);
            if(i === this.secretId) model.locked = false;
            this.cabinets.push(model);

            const view = new FileCabinetView(i, model.x, model.y, this.scale, `FileCabinet${i+1}`);
            view.onClick((id) => this.onCabinetClick(id));
            this.views.push(view);
        }

        this.openCabinetView.onExit(() => {
            this.openCabinetModel.active = false;
        });
    }

    onCabinetClick(id){
        const model = this.cabinets[id];
        if(model.locked){
            this.textNotificationHandler.addText('This file cabinet appears to be locked...');
            AM.play('drawerLocked');
        } else {
            this.textNotificationHandler.addText('You opened a mysterious file cabinet.');
            this.openCabinetModel.active = true;
            this.openCabinetView.onAdd(this.openCabinetModel.number);
            R.add(this.openCabinetView, 10);
            AM.play('drawerOpen');
        }
    }

    update(dt){
        this.textNotificationHandler.update(dt);
    }

    onEnter(){
        // add background and cabinet views
        this.views.forEach(v => v.onEnter());
    }

    onExit(){
        this.views.forEach(v => v.onExit());
        if(this.openCabinetModel.active){
            this.openCabinetView.onRemove();
            R.remove(this.openCabinetView);
        }
        this.textNotificationHandler.cleanup();
    }
}
