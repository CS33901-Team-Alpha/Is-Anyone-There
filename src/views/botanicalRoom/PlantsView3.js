class PlantsView3 extends SlidingDoorView {
    constructor(slidingDoors = []) {
        super(slidingDoors, SM.get("MetalWall"));

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85, {holdFadeoutFor: 3});

        this.plants = [new PlantObject(8, 6, 'placeholderPlant2', new InspectComponent(
            'Erythroxylum coca',
            'Erythroxylum coca contains trace alkaloids including C17H21NO4 (Cocaine). Handle with care—its properties may be repurposed...',
            'placeholderMolecule2',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Erythroxylum coca', 'placeholderMoleculeIcon2'));
            },
            { backgroundColor: [200, 50, 50, 100] }
            )),
            new PlantObject(1, 6, 'placeholderPlant4', new InspectComponent(
            'Ascorbic Acid',
            'In the post-collapse biolabs of the Outer Belt, ascorbic acid became the cornerstone of emergency field medicine.',
            'ascorbicAcidMolecule',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Ascorbic Acid', 'ascorbicAcidMoleculeIcon'));
            },
            { backgroundColor: [200, 50, 50, 100] }))
        ]


        this.setRoom(this)
        this.alarmOverlay = new AlarmOverlay(() => GS.is('BotanicalQuarantine'));
    }

    update(dt) {
        super.update(dt)
        this.textNotificationHandler.update(dt);
    }

    draw() {
        super.draw()
        // Optional: add custom drawing logic here
    }

    onEnter() {
        super.onEnter();
        for(let i = 0; i < this.plants.length; i++){
            R.add(this.plants[i], 10)
            this.plants[i].onEnter();
        }

        R.add(this.alarmOverlay, 100)
    }

    onExit() {
        super.onExit();
        for(let i = 0; i < this.plants.length; i++){
            R.remove(this.plants[i])
            this.plants[i].onExit()
        }

        R.remove(this.alarmOverlay)
    }
}