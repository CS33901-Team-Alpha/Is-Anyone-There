class PlantObject{
    constructor(x, y, spriteName, inspect, scale=0.5){
        this.x = x;
        this.y = y;

        this.plant = SM.get(spriteName);
        this.plant.setPos(x, y);
        this.plant.setScale(scale);
        
        [this.width, this.height] = this.plant.getWH()

        this.inspectComponent = inspect
    }

    isMouseInBounds(mx, my) {
        const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();

        return (
            m.x >= this.x &&
            m.x <= this.x + this.width &&
            m.y >= this.y &&
            m.y <= this.y + this.height
        );
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            R.add(this.inspectComponent, 20)
            this.inspectComponent.onEnter()
        }
    }

    onEnter(){
        R.add(this.plant, 10);
    }

    onExit(){
        R.remove(this.plant);
        R.remove(this.inspectComponent)
        this.inspectComponent.onExit()
    }
}

class PlantsView extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("northWallBotanical");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        this.plants = [
            new PlantObject(2.5, 4.5, 'placeholderPlant', new InspectComponent(
            'Ascorbic Acid',
            'In the post-collapse biolabs of the Outer Belt, ascorbic acid became the cornerstone of emergency field medicine.',
            'ascorbicAcidMolecule',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Ascorbic Acid', 'ascorbicAcidMoleculeIcon'));
            },
            { backgroundColor: [200, 50, 50, 100] })),
            new PlantObject(7, 4.5, 'placeholderPlant3', new InspectComponent(
            'Inferon Alpha Protein',
            'The protein is secreted by the beautiful vines of the Lumafera plant, a rare organism found deep within the oxygen-saturated jungles of Epsilon IV.',
            'inferonAlphaProtein',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Inferon Alpha', 'inferonAlphaProteinIcon'));
            },
            { backgroundColor: [200, 50, 50, 100] })),
        ];

    }

    
    onEnter() {
        R.add(this.background);

        for (let i = 0; i < this.plants.length; i++) {
            this.plants[i].onEnter()
            R.add(this.plants[i], 10);
        }

    }

    mousePressed(m) {
        for (let i = 0; i < this.plants.length; i++) {
            if (this.plants[i].mousePressed(m)) return true;
        }
        return false;
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