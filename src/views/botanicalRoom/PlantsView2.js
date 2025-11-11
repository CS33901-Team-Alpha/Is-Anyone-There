class PlantsView2 extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("southWallBotanical");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        this.plants = [new PlantObject(8, 4.5, 'placeholderPlant6', new InspectComponent(
            'Sorbitol',
            'Sorbitol a sugar alcohol is commonly found on earth plants like apples, pears, peaches and cherries.',
            'sorbitolMolecule',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Sorbitol', 'sorbitolMoleculeIcon'));
            },
            { backgroundColor: [200, 50, 50, 100] }
            )),
            new PlantObject(1, 4.5, 'placeholderPlant5', new InspectComponent(
            'Acid Receptor Protein',
            'This mysterious plant appears to have a fatty acid receptor protein that is normally only found in humans. It was likely bioengineered by an alien race.',
            'acidReceptorProtein',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Acid Receptor Protein', 'acidReceptorProteinIcon'));
            },
            { backgroundColor: [100, 50, 50, 100] })),
            new PlantObject(5, 4.5, 'placeholderPlant7', new InspectComponent(
            'Ammonia',
            'The high presence of Ammonia indicates that this plant may be under severe nutrient-imbalance.',
            'ammoniaMolecule',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Ammonia', 'ammoniaMoleculeIcon'));
            },
            { backgroundColor: [200, 90, 50, 100] }))
        ]
    }

    onEnter() {
        R.add(this.background);
        for (let i = 0; i < this.plants.length; i++) {
            this.plants[i].onEnter()
            R.add(this.plants[i], 10);
        }
    }

    onExit() {
        R.remove(this.background);

        for (let i = 0; i < this.plants.length; i++) {
            R.remove(this.plants[i]);
            this.plants[i].onExit();
        }

        this.textNotificationHandler.cleanup();
    }
}