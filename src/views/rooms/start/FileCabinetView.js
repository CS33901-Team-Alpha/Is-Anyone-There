/**
 * Note to anyone using this as a reference for making views:
 * Pay close attention to the z-index (which elements are on top) when doing R.add(SOMETHING),
 * For e.g:
 *      Z-index of the FileCabinet object's sprite must be greater than z-index of the room
 *      background image.
 */

class FileCabinet {
    constructor(id, x, y, scale, img,  onClick = () => {}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.background = SM.get(img);
        this.background.setPos(this.x, this.y);
        this.background.setScale(this.scale);
        this.width = 1.93
        this.height = 2.3

        this.onClick = onClick;
        this.highlight = new HighlightEvent(this.x, this.y, this.width, this.height);
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
        R.add(this.background, 9)
        R.add(this.highlight);
    }
    onExit() {
        R.remove(this.background);
        R.remove (this.highlight);
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
        }
    }
}

class OpenCabinetUI {
  constructor(onExit = () => {}) {
    this.onExit = onExit;

    // close button removes itself and calls cleanup onRemove
    this._closeBtn = new Button(11.5, 2.4, 0.6, (self) => {
      R.selfRemove(self);
      R.remove(this);
      onExit();
      this.onRemove()

      AM.play('drawerClose')
    });

    this.number = GS.getPassword2();
    
    console.log(`cabinet has number: `+ this.number);
    const spriteName = `secondNumber`+ this.number;
    this.numberImage = SM.get(spriteName); 
    this.numberImage.setPos(6.5, 3);
    this.numberImage.setScale(0.75);
  }

  draw() {
    const u = VM.u(), v = VM.v();

    push();
    fill(169,169,169);
    stroke(255);
    strokeWeight(2);
    rect(3.5 * u, 2.2 * v, 9 * u, 4.6666 * v, 10);

    pop();
  }

  update(dt) {}

  keyPressed() {
    return false; // Event not handled
  }

  /* The following two member functions just for removing what's on the UI. Call add before adding OpenCabinetUI to R
  and call remove when removing OpenCabinetUI to R
  
  TODO: I'm sure there is a way of doing this without these*/
  onAdd(){
    R.add(this._closeBtn, 11);
    R.add(this.numberImage, 15)
  }

  onRemove() {
    R.remove(this._closeBtn);
    R.remove(this.numberImage)
  }
} 

class SequenceHintUI {
  constructor(onExit = () => {}) {
    this.onExit = onExit;

    // close button removes itself and calls cleanup onRemove
    this._closeBtn = new Button(11.5, 2.4, 0.6, (self) => {
      R.selfRemove(self);
      R.remove(this);
      onExit();
      this.onRemove()

      AM.play('drawerClose')
    });

    this.sequence = GS.getNamesArray();

    const SpriteName1 = this.sequence[0];
    const SpriteName2 = this.sequence[1];
    const SpriteName3 = this.sequence[2];
    const SpriteName4 = this.sequence[3];
    const SpriteName5 = this.sequence[4];
    const SpriteName6 = this.sequence[5];
    const SpriteName7 = this.sequence[6];
    const SpriteName8 = this.sequence[7];

    this.inputSprite1 = SM.get(SpriteName1);
    this.inputSprite2 = SM.get(SpriteName2);
    this.inputSprite3 = SM.get(SpriteName3);
    this.inputSprite4 = SM.get(SpriteName4);
    this.inputSprite5 = SM.get(SpriteName5);
    this.inputSprite6 = SM.get(SpriteName6);
    this.inputSprite7 = SM.get(SpriteName7);
    this.inputSprite8 = SM.get(SpriteName8);

 
    this.inputSprite1.setPos(4, 3);
    this.inputSprite2.setPos(6, 3);
    this.inputSprite3.setPos(8, 3);
    this.inputSprite4.setPos(10, 3);
    this.inputSprite5.setPos(4, 5);
    this.inputSprite6.setPos(6, 5);
    this.inputSprite7.setPos(8, 5);
    this.inputSprite8.setPos(10, 5);

    if(SpriteName1 == "Red Switch" || SpriteName1 == "Blue Switch" || SpriteName1 == "Pink Switch" || SpriteName1 == "Orange Switch") {
        this.inputSprite1.setScale(0.7);
    }
    else {this.inputSprite1.setScale(0.4);}
    if(SpriteName2 == "Red Switch" || SpriteName2 == "Blue Switch" || SpriteName2 == "Pink Switch" || SpriteName2 == "Orange Switch") {
        this.inputSprite2.setScale(0.7);
    }
    else {this.inputSprite2.setScale(0.4);}
    if(SpriteName3 == "Red Switch" || SpriteName3 == "Blue Switch" || SpriteName3 == "Pink Switch" || SpriteName3 == "Orange Switch") {
        this.inputSprite3.setScale(0.7);
    }
    else {this.inputSprite3.setScale(0.4);}
    if(SpriteName4 == "Red Switch" || SpriteName4 == "Blue Switch" || SpriteName4 == "Pink Switch" || SpriteName4 == "Orange Switch") {
        this.inputSprite4.setScale(0.7);
    }
    else {this.inputSprite4.setScale(0.4);}
    if(SpriteName5 == "Red Switch" || SpriteName5 == "Blue Switch" || SpriteName5 == "Pink Switch" || SpriteName5 == "Orange Switch") {
        this.inputSprite5.setScale(0.7);
    }
    else {this.inputSprite5.setScale(0.4);}
    if(SpriteName6 == "Red Switch" || SpriteName6 == "Blue Switch" || SpriteName6 == "Pink Switch" || SpriteName6 == "Orange Switch") {
        this.inputSprite6.setScale(0.7);
    }
    else {this.inputSprite6.setScale(0.4);}
    if(SpriteName7 == "Red Switch" || SpriteName7 == "Blue Switch" || SpriteName7 == "Pink Switch" || SpriteName7 == "Orange Switch") {
        this.inputSprite7.setScale(0.7);
    }
    else {this.inputSprite7.setScale(0.4);}
    if(SpriteName8 == "Red Switch" || SpriteName8 == "Blue Switch" || SpriteName8 == "Pink Switch" || SpriteName8 == "Orange Switch") {
        this.inputSprite8.setScale(0.7);
    }
    else {this.inputSprite8.setScale(0.4);}

    console.log("Input sprites imported");
  }

  draw() {
    const u = VM.u(), v = VM.v();

    push();
    fill(169,169,169);
    stroke(255);
    strokeWeight(2);
    rect(3.5 * u, 2.2 * v, 9 * u, 4.6666 * v, 10);

    pop();
  }

  update(dt) {}

  keyPressed() {
    return false; // Event not handled
  }

  /* The following two member functions just for removing what's on the UI. Call add before adding OpenCabinetUI to R
  and call remove when removing OpenCabinetUI to R
  
  TODO: I'm sure there is a way of doing this without these*/
  onAdd(){
    R.add(this._closeBtn, 11);
    R.add(this.inputSprite1, 15);
    R.add(this.inputSprite2, 15);
    R.add(this.inputSprite3, 15);
    R.add(this.inputSprite4, 15);
    R.add(this.inputSprite5, 15);
    R.add(this.inputSprite6, 15);
    R.add(this.inputSprite7, 15);
    R.add(this.inputSprite8, 15);
  }

  onRemove() {
    R.remove(this._closeBtn);
    R.remove(this.inputSprite1);
    R.remove(this.inputSprite2);
    R.remove(this.inputSprite3);
    R.remove(this.inputSprite4);
    R.remove(this.inputSprite5);
    R.remove(this.inputSprite6);
    R.remove(this.inputSprite7);
    R.remove(this.inputSprite8);
  }
} 

class FileCabinetView extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("WestWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);
        this.secretId = 2; // index of cabinet that will be unlocked
        this.secondsecretId = 0; //index of cabinet that has sequence hint
        
        this.cabinetUI = new OpenCabinetUI();
        this.sequenceUI = new SequenceHintUI();

        this.scale = 0.3
        this.allFileCabinets = [];
        for(let i = 0; i < 4; i++){
            this.allFileCabinets.push(new FileCabinet(i, 1.5+3*i, 5.7, this.scale, `FileCabinet${i+1}`, (obj) => {
                console.log(`File Cabinet ${i} Clicked`)

                if(obj.id == this.secretId){
                    this.textNotificationHandler.addText('You opened a mysterious file cabinet.')
                    this.cabinetUI.onAdd()
                    R.add(this.cabinetUI, 10)
                    AM.play('drawerOpen')
                }
                else if(obj.id == this.secondsecretId){
                    this.textNotificationHandler.addText('You opened a mysterious file cabinet.')
                    this.sequenceUI.onAdd()
                    R.add(this.sequenceUI, 10)
                    AM.play('drawerOpen')
                }else{
                    this.textNotificationHandler.addText('This file cabinet appears to be locked...')
                    console.log('this is a locked cabinet.')
                    AM.play('drawerLocked')
                }
            }));
        }
    }

    update(dt){
        // pass time to fading logic for text notifications
        this.textNotificationHandler.update(dt)
    }

    draw() {

    }

    onEnter() {
        // add objects to renderer
        R.add(this.background);
        for(let i = 0; i < 4; i++){
            R.add(this.allFileCabinets[i])
        }
        // call onenters
        for(let i = 0; i < 4; i++){
            this.allFileCabinets[i].onEnter()
        }
    }

    onExit() {
        R.remove(this.background);
        
        // make sure we remove UI on view change
        this.cabinetUI.onRemove()
        R.remove(this.cabinetUI)

        // remove all the cabinets too
        for(let i = 0; i < 4; i++){
            R.remove(this.allFileCabinets[i])
        }

        // remove highlights and sprite for filecabinet objects
        for(let i = 0; i < 4; i++){
            this.allFileCabinets[i].onExit()
        }

        this.textNotificationHandler.cleanup()
    }
}