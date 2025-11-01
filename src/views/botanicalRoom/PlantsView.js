/** TEMPORARY VIEW FOR TESTING THE INSPECT MECHANIC */

class PlantObject{
    /**
     * @param {*} inpsectComponent - an instace of InspectComponent
     */
    constructor(x, y, spriteName, inpsectComponent, scale=0.5){
        this.x = x;
        this.y = y;
        
        this.testPlant = SM.get(spriteName);     
        this.testPlant.setPos(x, y); 
        this.testPlant.setScale(scale);

        [this.width, this.height] = this.testPlant.getWH()

        this.inspection = inpsectComponent;
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
            this.inspection.onEnter();
            R.add(this.inspection, 11);
        }
    }

    onEnter(){
        R.add(this.testPlant, 10)
    }

    onExit(){
        R.remove(this.testPlant, 10)
        R.remove(this.inspection)
        this.inspection.onExit()
    }
}

class PlantsView extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        this.plants = [new PlantObject(4, 6, 'placeholderPlant', new InspectComponent(
            'Erythroxylum coca',
            'Erythroxylum coca contains trace alkaloids including C17H21NO4 (Cocaine). Handle with care—its properties may be repurposed...',
            'placeholderMolecule2',
            'Collect',
            () => {
                IM.addItem(new InventoryItem('Erythroxylum coca', 'placeholderMoleculeIcon2'));
            },
            { backgroundColor: [200, 50, 50, 100] }
        )),
        new PlantObject(12, 3, 'placeholderPlant3', new InspectComponent(
                'Inferon Alpha Protein',
                'A recombinant soluble version of the host receptor that binds the contagion\'s surface attachment protein and prevents cell entry.',
                'inferonAlphaProtein',
                'Collect',
                () => {
                    IM.addItem(new InventoryItem('Inferon Alpha Protein', 'inferonAlphaProteinIcon'));
                },
                { backgroundColor: [200, 50, 50, 100] }
            ), 1)
        ]

        this.alarmOverlay = new AlarmOverlay(() => GS.is('BotanicalQuarantine'))
    }

    update(dt){
        this.textNotificationHandler.update(dt)
    }

    draw() {
        
    }

    onEnter() {
        // add objects to renderer
        R.add(this.background, 1);
        
        for(let i = 0; i < this.plants.length; i++){
            R.add(this.plants[i], 10)
            this.plants[i].onEnter();
        }

        R.add(this.alarmOverlay, 100)
    }
    
    onExit() {
        R.remove(this.background, 1);

        for(let i = 0; i < this.plants.length; i++){
            R.remove(this.plants[i])
            this.plants[i].onExit()
        }

        R.remove(this.alarmOverlay)
    }
}