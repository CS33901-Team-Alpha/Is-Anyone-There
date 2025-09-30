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
    });
    
    this.numberImage = SM.get('secondNumber');
    this.numberImage.setPos(7, 3.4);
    this.numberImage.setScale(4);
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

class FileCabinetView extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("WestWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);
        this.secretId = 2; // index of cabinet that will be unlocked
        
        this.cabinetUI = new OpenCabinetUI();

        this.scale = 0.3
        this.allFileCabinets = [];
        for(let i = 0; i < 4; i++){
            this.allFileCabinets.push(new FileCabinet(i, 1.5+3*i, 5.7, this.scale, `FileCabinet${i+1}`, (obj) => {
                console.log(`File Cabinet ${i} Clicked`)

                if(obj.id == this.secretId){
                    console.log('this is the secret cabinet.')
                    this.textNotificationHandler.addText('You opened a mysterious file cabinet.')
                    this.cabinetUI.onAdd()
                    R.add(this.cabinetUI, 10)
                }else{
                    this.textNotificationHandler.addText('This file cabinet appears to be locked...')
                    console.log('this is a locked cabinet.')
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