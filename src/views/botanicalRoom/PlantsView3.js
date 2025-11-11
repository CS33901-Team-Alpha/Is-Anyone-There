class PlantsView3 extends SlidingDoorView {
    constructor(slidingDoors = []) {
        super(slidingDoors, SM.get("eastWallBotanical"));

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85, {holdFadeoutFor: 3});

        this.plants = [new PlantObject(4.5, 4.8, 'placeholderPlant2', new InspectComponent(
            'Testosterone',
            'The Testosthra Vine is a feral bioengineered creeper that secretes andro-sap, a resinous fluid chemically similar to human testosterone.',
            'testosteroneMolecule',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Testosterone', 'testosteroneMoleculeIcon'));
            },
            { backgroundColor: [200, 50, 50, 100] }
            )),
            new PlantObject(1.5, 4.8, 'placeholderPlant4', new InspectComponent(
            'Potassium Superoxide',
            'This unnamed plant has traces of Potassium Superoxide. Perhaps this molecule\'s property to react with CO2 to produce oxygen could be useful.',
            'potassiumSuperoxideMolecule',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Potassium Superoxide', 'potassiumSuperoxideMoleculeIcon'));
            },
            { backgroundColor: [200, 50, 50, 100] }))
        ]


        this.setRoom(this)
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

    }

    onExit() {
        super.onExit();
        for(let i = 0; i < this.plants.length; i++){
            R.remove(this.plants[i])
            this.plants[i].onExit()
        }

        this.textNotificationHandler.cleanup();
    }
}