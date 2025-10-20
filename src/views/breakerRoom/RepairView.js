/** Temporarily utility object function for checking the collision
 * if we do more rooms like this (where you have to drag items to use them), we 
 * probably wanna figure out a better way.
 */
const BROKEN_COMPONENT_ID = 1; // id of the broken cpu component 
const repairTargetRegistry = {};
function repairItemUsed(itemName, x, y, width, height, notifHandler){
    // takes as input which item was used, with it's position and size

    // console.log(repairTargetRegistry)

    for(targetId in repairTargetRegistry){
        const targetx = repairTargetRegistry[targetId]['x']
        const targety = repairTargetRegistry[targetId]['y']
        const targetw = repairTargetRegistry[targetId]['w']
        const targeth = repairTargetRegistry[targetId]['h']

        // for now only checks if top left corner of item is within the bounds of target
        const collide = (x >= targetx &&
            x <= targetx + targetw &&
            y >= targety &&
            y <= targety + targeth)

        if(collide){
            // if(targetId == BROKEN_COMPONENT_ID){
            //     console.log(`used ${itemName} on target component`)
            //     notifHandler.addText(`used ${itemName} on broken component.`)
            // }
            // else{
            //     console.log(`used ${itemName} on perfectly working component.`)
            //     notifHandler.addText(`used ${itemName} on perfectly working component.`)
            // }

            // You die if you use electrical tape on working component
            if((itemName == 'electricalTape') && (targetId != BROKEN_COMPONENT_ID)){
                console.log('Used electrical tape on working component (player died)')
                GS.set("Player Died")
            }
            // you fix the component if you use electrical tape on broken component
            else if((itemName == 'electricalTape') && (targetId == BROKEN_COMPONENT_ID)){
                notifHandler.addText('You have fixed a broken component!')
                
                AI.addText('>_  SYSTEM CONDITION STABILIZING... \n>_  RETURNING TO NORMAL OPERATION... \n>_  --- THANK YOU USER ---');
                
                setTimeout(() => {
                    GS.set("Game Complete");
                }, 6000);
            }
            else if((itemName == 'voltimeter') && (targetId != BROKEN_COMPONENT_ID)){
                notifHandler.addText('This component seems to be working fine.')
            }
            else if((itemName == 'voltimeter') && (targetId == BROKEN_COMPONENT_ID)){
                notifHandler.addText('This component is not functional.')
            }
            else{
                console.log('A collision happened and this interaction is not defined.')
            }

            break;
        }
    }
}

/**
 * Class for repair item moving
 */
class MoveableRepairItem {
    /* Ideally we want a moveable object base class later 
    
        itemUsed
    */
    constructor(x, y, imgName, scale, notifHandler, itemUsed = () => {}) {
        this.id = imgName;
        this.itemUsed = itemUsed;
        this.textNotificationHandler = notifHandler;
        this.initialx = x;
        this.initialy = y;

        this.x = x;
        this.y = y;

        this.sprite = SM.get(imgName)
        this.sprite.setPos(this.x, this.y);
        this.sprite.setScale(scale);

        [this.width, this.height] = this.sprite.getWH()

        this.drag = false;
        this.dragDx = 0;
        this.dragDy = 0;

        this.active = false; // if item is actually visible
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

    update(dt) {
        if (!this.drag) {
            this.sprite.setPos(this.x, this.y); // make sure we reset to original position
            return;
        }

        const m = VM.mouse();

        this.x = m.x - this.dragDx;
        this.y = m.y - this.dragDy;

        this.sprite.setPos(this.x, this.y); // update position on drag
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            const m = VM.mouse();
            this.drag = true;

            // change in positions on drag
            this.dragDx = m.x - this.x;
            this.dragDy = m.y - this.y;
        }
    }

    mouseReleased() {
        // pass current coordinates into itemUsed callback (before teleporting to initial x and y)
        if(this.drag){
            this.itemUsed(this.id, this.x, this.y, this.width, this.height, this.textNotificationHandler);
        }
        
        this.drag = false;

        this.x = this.initialx;
        this.y = this.initialy;

    }

    // make the item actually visible
    onEnter(){
        R.add(this.sprite, 16)

        this.active = true;
    }

    onExit(){
        R.remove(this.sprite)
        this.active = false;
    }
}

/**
 * Class for static components that will be fixed my movable items
 */
class ElectricalComponent {
    constructor(id, x, y, imgName, scale, onClick=()=>{}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.click = onClick;

        this.sprite = SM.get(imgName)
        this.sprite.setPos(this.x, this.y);
        this.sprite.setScale(scale);

        [this.width, this.height] = this.sprite.getWH()

        // add to repair target registry for collision checking with items
        repairTargetRegistry[id] = {x:this.x, y:this.y, w:this.width, h:this.height};
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

    update(dt) {
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.click(this);
        }
    }

    mouseReleased() {
        this.drag = false;
    }

    onEnter(){
        R.add(this.sprite, 13)
    }

    onExit(){
        R.remove(this.sprite)
    }
}

/**
 * Repair Tool Cabinet holds moveable items
 */
class RepairToolCabinet {
    constructor(x, y, scale, notifHandler, onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        // constants
        this.clicksToBreak = 10; // break lock
        // for hitbox
        this.width = 4;
        this.height = 3;

        // cabinet
        this.closedSprite = SM.get("closedRepair");
        this.closedSprite.setPos(this.x, this.y);
        this.closedSprite.setScale(this.scale);

        this.openSprite = SM.get("openRepair");
        this.openSprite.setPos(this.x, this.y);
        this.openSprite.setScale(this.scale);

        // items - scale and pos manually set for now
        this.voltimeter = new MoveableRepairItem(this.x + 2.3, this.y + 1.72, 'voltimeter', 0.08, notifHandler, repairItemUsed);
        this.electricalTape = new MoveableRepairItem(this.x + 1.2, this.y + 1.95, 'electricalTape', 0.1, notifHandler, repairItemUsed);

        // --- lock visuals and mechanics
        // should be in lower right corner of repair tool cabinet, manually placed for now
        this.lockSprite = SM.get("rustyLock");
        this.lockSprite.setPos(this.x + 1.9, this.y + 2.2);
        this.lockSprite.setScale(0.1);

        this.animationPlaying = false;
        this.clicks = 0;
        this.lockBroken = false;

        this.onClick = onClick;
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

    update(dt) {
        // MAKE THIS TIME BASED NOT EXECUTION COUNT BASED
        if (this.animationPlaying) {
            /* you can play around with these values for the animation. Just note that rotatio is in radians, so PI/180 is 1 degree.
            I made the speed and range of rotation increase with clicks so it seems like it's being pulled more the more u click it
            */
            this.lockSprite.setRotation(
                this.lockSprite.rotation + this.clicks * (Math.PI / 180)
            );

            if (this.lockSprite.rotation > this.clicks * (Math.PI / 45)) {
                this.lockSprite.rotation = 0;
                this.animationPlaying = false;
            }
        }
    }

    onEnter() {
        R.add(this.closedSprite, 9);
        R.add(this.lockSprite, 10);
    }
    onExit() {
        R.remove(this.closedSprite);
        R.remove(this.lockSprite);
        R.add(this.openSprite);

        // call onexit to cleanup the moveable objects after cabinet has been opened
        this.voltimeter.onExit()
        this.electricalTape.onExit()
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this.clicks);

            // play quick animation to show lock moving
            this.animationPlaying = true;
            this.clicks += 1;

            if (this.clicks > this.clicksToBreak) {
                this.lockBroken = true;

                R.remove(this.closedSprite);
                R.remove(this.lockSprite);

                R.add(this.openSprite);

                // add items and call their onenters
                R.add(this.voltimeter)
                this.voltimeter.onEnter();
                
                R.add(this.electricalTape)
                this.electricalTape.onEnter();
            }
        }
    }
}

/**
 * Component holder will hold the ElectricalComponent objects
 */
class ComponentHolderObject{
    constructor(x, y, scale, viewNotifHandler, onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.textNotificationHandler = viewNotifHandler;

        this.sprite = SM.get('componentHolder');
        this.sprite.setPos(this.x, this.y);
        this.sprite.setScale(this.scale);

        [this.width, this.height] = this.sprite.getWH()

        // manually position electrical components
        const componentClickMessage = () => {
            if(Math.random() > 0.5){
                this.textNotificationHandler.addText("Maybe one of these electrical components is broken.");
            }
            else{
                this.textNotificationHandler.addText("Perhaps I can repair this?");
            }
        }

        this.ecs = [];
        this.ecs.push(new ElectricalComponent(0, 1.8, 6, 'cpu1', 0.1, componentClickMessage))
        this.ecs.push(new ElectricalComponent(1, 1.95, 6.9, 'cpu2', 0.09, componentClickMessage))
        this.ecs.push(new ElectricalComponent(2, 7.2, 6.6, 'cpu3', 0.12, componentClickMessage))
        this.ecs.push(new ElectricalComponent(3, 5.3, 6.3, 'cpu4', 0.15, componentClickMessage))

        this.onClick = onClick;
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

    onEnter() {
        R.add(this.sprite, 9)

        for(let ec of this.ecs){
            R.add(ec, 10);
            ec.onEnter();
        }
    }
    onExit() {
        R.remove(this.sprite);
        for(let ec of this.ecs){
            R.remove(ec);
            ec.onExit();
        }
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
        }
    }
}

class RepairView extends View {
    constructor() {
        super(0, 0, 0, "");
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85, {
            holdFadeoutFor: 2.5,
        });

        this.repairCabinet = new RepairToolCabinet(1, 1, 0.4, this.textNotificationHandler, (clickCount) => {
            if (clickCount == 0) {
                this.textNotificationHandler.addText(
                    "A lock seems to be holding this cabinet shut."
                );
            } else if (clickCount == 2) {
                this.textNotificationHandler.addText("This lock looks old...");
            }
        });

        this.componentHolder = new ComponentHolderObject(1.2, 5, 0.6, this.textNotificationHandler, ()=>{});

        this.slidingDoor = new StandaloneSlidingDoor(12, 2, 1, () => {}, true, 2, null, 2, 0, () => false);

        this.slidingDoor.setRoom(this);
    }

    update(dt) {
        // pass time to fading logic for text notifications
        this.textNotificationHandler.update(dt);
        this.slidingDoor.update(dt);
    }

    draw() {
        this.slidingDoor.draw();
    }

    mousePressed(m) {
        if (this.slidingDoor.mousePressed(m)) {return true;} // stop propagation
    }

    onEnter() {
        R.add(this.background);
        R.add(this.repairCabinet);
        R.add(this.componentHolder);

        // call on enters
        this.repairCabinet.onEnter();
        this.componentHolder.onEnter();
        this.slidingDoor.onEnter();
    }
    
    onExit() {
        R.remove(this.background);
        R.remove(this.repairCabinet);
        R.remove(this.componentHolder);
        
        // call on exits
        this.repairCabinet.onExit();
        this.componentHolder.onExit();
        this.slidingDoor.onExit();
    }
}
