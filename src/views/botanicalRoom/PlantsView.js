/** TEMPORARY VIEW FOR TESTING THE INSPECT MECHANIC */

class PlantObject{
    /**
     * inpsectDescriptor may be:
     *  - an InspectComponent instance (used as a prototype), or
     *  - a plain object: { title, description, imageName, actionName, options }
     */
    constructor(x, y, spriteName, inpsectDescriptor, scale=0.5){
        this.x = x;
        this.y = y;

        this.testPlant = SM.get(spriteName);
        if (this.testPlant) {
            this.testPlant.setPos(x, y);
            this.testPlant.setScale(scale);
        }

        // try to get sprite width/height in 16:9 units; fall back to defaults
        let wh = [1, 1];
        if (this.testPlant && typeof this.testPlant.getWH === 'function') {
            try { wh = this.testPlant.getWH() || wh; } catch(e) {}
        } else if (this.testPlant) {
            wh = [this.testPlant.w ?? 1, this.testPlant.h ?? 1];
        }
        this.width = wh[0] || 1;
        this.height = wh[1] || 1;

        // Accept either an InspectComponent prototype or a plain descriptor object
        if (inpsectDescriptor instanceof InspectComponent) {
            this.inspectProto = inpsectDescriptor;
            this.inspectData = null;
        } else {
            this.inspectProto = null;
            this.inspectData = inpsectDescriptor || {};
        }

        // Make plants reusable by default
        this.singleUse = false;
        this.pickedCount = 0;
    }

    isMouseInBounds(mx, my) {
        const m = (mx !== undefined && my !== undefined) ? { x: mx, y: my } : VM.mouse();
        // simple top-left based bounds (matches older behavior)
        return (
            m.x >= this.x &&
            m.x <= this.x + this.width &&
            m.y >= this.y &&
            m.y <= this.y + this.height
        );
    }

    mousePressed(p) {
        const m = p ?? VM.mouse();
        if (this.isMouseInBounds(m.x, m.y)) {
            // Build a fresh InspectComponent instance for this click to avoid shared-state issues.
            let title, description, imageName, actionName, options;
            if (this.inspectProto) {
                title = this.inspectProto.title ?? "Plant";
                description = this.inspectProto.description ?? "";
                imageName = this.inspectProto.imageName ?? "";
                actionName = this.inspectProto.actionName ?? "Collect";
                options = {}; // don't copy callbacks from proto
            } else {
                title = this.inspectData.title ?? "Plant";
                description = this.inspectData.description ?? "";
                imageName = this.inspectData.imageName ?? "";
                actionName = this.inspectData.actionName ?? "Collect";
                options = this.inspectData.options ?? {};
            }

            const inst = new InspectComponent(
                title,
                description,
                imageName,
                actionName,
                () => {
                    // Collect action: add item to inventory using this plant as the source
                    const data = {
                        name: title,
                        spriteName: imageName || "placeholderMoleculeIcon",
                        description: description || ""
                    };

                    let added = false;
                    if (IM && typeof IM.addItemFromSource === 'function') {
                        added = IM.addItemFromSource(data, this);
                    } else if (IM && typeof IM.addItem === 'function') {
                        // ensure source is attached even if caller used InventoryItem directly elsewhere
                        added = IM.addItem(data, { source: this });
                    }

                    if (added) {
                        this.onPicked(data);
                        R.remove(inst);
                    } else {
                        IM?.showFeedback?.("Cannot collect sample.");
                    }
                },
                Object.assign({ backgroundColor: [28,197,145,100] }, options)
            );

            R.add(inst, 1000);
            inst.onEnter?.();

            return true;
        }
        return false;
    }

    // Called when inventory picks up a sample from this plant.
    onPicked(item) {
        this.pickedCount = (this.pickedCount || 0) + 1;
        // Only hide for single-use plants
        if (this.singleUse === true && this.testPlant) {
            R.remove(this.testPlant);
        }
    }

    // Called when an inventory item originating from this plant is dropped back to the world.
    onDroppedToWorld(item, p) {
        // For reusable plants do nothing; for single-use, restore sprite
        if (this.singleUse === true && this.testPlant) {
            R.add(this.testPlant, 10);
        }
    }

    // Called when an inventory item is explicitly returned / restored.
    onReturn(item, p) {
        this.onDroppedToWorld(item, p);
    }

    onEnter(){
        if (this.testPlant) R.add(this.testPlant, 10);
    }

    onExit(){
        if (this.testPlant) R.remove(this.testPlant);
        // no persistent inspection instance to remove (we create new each click)
    }
}

class PlantsView extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("MetalWall");
        if (this.background && typeof this.background.setSize === 'function') this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        // Example plant descriptors (each descriptor can be customized)
        const plantA = {
            title: 'Erythroxylum coca',
            description: 'Carrier agent for blood-brain barrier penetration',
            imageName: 'placeholderMolecule',
            actionName: 'Collect',
            options: { backgroundColor: [200, 50, 50, 100] }
        };

        const plantB = {
            title: 'Inferon Alpha Protein',
            description: "A recombinant soluble version of the host receptor that blocks contagion entry.",
            imageName: 'inferonAlphaProtein',
            actionName: 'Collect'
        };

        // plant instances (reusable by default)
        this.plants = [
            new PlantObject(4, 6, 'placeholderPlant', plantA),
            new PlantObject(8, 6, 'placeholderPlant3', plantB),
        ];
    }

    onEnter() {
        // add background to renderer
        if (this.background) R.add(this.background, 0);

        // ensure each plant and its sprite are registered with renderer
        for (let i = 0; i < this.plants.length; i++) {
            const p = this.plants[i];
            p.onEnter?.();
            if (p.testPlant) {
                R.add(p.testPlant, 10);
            } else {
                console.warn(`PlantsView: plant sprite missing for plant index ${i}. Check sprite key used when creating PlantObject.`);
            }
        }
        console.log(`PlantsView.onEnter: registered ${this.plants.length} plants`);
    }

    // forward mouse presses to plants so InspectComponent opens reliably
    mousePressed(m) {
        for (let i = 0; i < this.plants.length; i++) {
            if (this.plants[i].mousePressed(m)) return true;
        }
        return false;
    }

    onExit() {
        R.remove(this.background, 1);

        for (let i = 0; i < this.plants.length; i++) {
            if (this.plants[i].testPlant) R.remove(this.plants[i].testPlant);
            this.plants[i].onExit();
        }

        if (this.alarmOverlay) R.remove(this.alarmOverlay);
    }
}