class PlantsView3 extends View {
    constructor() {
        super(0, 0, 0, '');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        this.plant = new PlantObject(8, 6, 'placeholderPlant2', new InspectComponent(
            'Erythroxylum coca',
            'Erythroxylum coca contains trace alkaloids including C17H21NO4 (Cocaine). Handle with care—its properties may be repurposed...',
            'placeholderMolecule2',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Erythroxylum coca', 'placeholderMoleculeIcon2'));
            },
            { backgroundColor: [200, 50, 50, 100] }
        ));
    }

    update(dt) {
        this.textNotificationHandler.update(dt);
    }

    draw() {
        // Optional: add custom drawing logic here
    }

    onEnter() {
        R.add(this.background, 1);
        R.add(this.plant, 10);
        this.plant.onEnter();
    }

    onExit() {
        R.remove(this.background, 1);
        R.remove(this.plant);
        this.plant.onExit();
    }
}