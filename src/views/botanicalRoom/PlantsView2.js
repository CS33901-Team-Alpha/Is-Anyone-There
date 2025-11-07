class PlantsView2 extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);

        // this.plant = new PlantObject(8, 6, 'placeholderPlant2', new InspectComponent('Chionodoxa siehei',
        //      'Chionodoxa siehei is composed of 0.5% C19H28O2 (Testosterone). Perhaps it can be used to make something useful...',
        //       'placeholderMolecule',
        //      'Collect',
        //      () => {
        //         IM.addItem(new InventoryItem('Chionodoxa siehei', 'placeholderMoleculeIcon'))
        //      },
        //     {backgroundColor: [28, 197, 145, 100]}));

        
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
        
        // R.add(this.plant, 10)
        // this.plant.onEnter()

        R.add(this.alarmOverlay, 100)
    }
    
    onExit() {
        R.remove(this.background, 1);

        // R.remove(this.plant)
        // this.plant.onExit()

        R.remove(this.alarmOverlay)
        this.textNotificationHandler.cleanup();
    }
}