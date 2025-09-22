class FileCabinetObject {
    constructor(id, x, y, xsize, ysize, imageFile, onClick = () => {}){
        this.id = id; // for now just using index
        this.x = x;
        this.y = y;
        
        this.cabinetSprite = new Sprite2D(imageFile, x, y, {width: xsize, height: ysize})

        this.xsize = xsize;
        this.ysize = ysize; 
        this.onClick = onClick;

    }

    isMouseInBounds(){
        return (
            mouseX >= this.x && mouseX <= this.x + this.xsize &&
            mouseY >= this.y && mouseY <= this.y + this.ysize
        );
    }

    update(dt){

    }

    draw(){
        // noStroke()
        // image(this.imageFile, this.x, this.y)
        this.cabinetSprite.draw()
    }

    mousePressed() {
        if (this.isMouseInBounds()) {
            this.onClick(this)
        };
    }
}

class OpenCabinetUIObject {
    constructor(x, y, xsize, ysize, uiText, uiName, onClick = () => {}){
        this.x = x;
        this.y = y;

        this.uiText = uiText; // for now just our secret number
        this.uiName = uiName; 

        this.xsize = xsize;
        this.ysize = ysize;
        this.onClick = onClick;

        this.secretSprite = new Sprite2D('assets/object/secondNumber.png', this.x+this.xsize/2-75, 
            this.y+this.ysize/2-75, {width: 200, height: 200})

        this.baseColor = color(122, 128, 134);
        this.hoverColor = color(122, 128, 134);
    }

    // adjust bounds so that only X to close is clickable
    isMouseInBounds(){
        return (
            mouseX >= this.x && mouseX <= this.x + this.xsize &&
            mouseY >= this.y && mouseY <= this.y + this.ysize
        );
    }

    update(dt){

    }

    draw(){
        // ponly draw if visible
        if(true){
            let color = this.isMouseInBounds() ? this.hoverColor : this.baseColor;

            // draw ui window
            noStroke()
            fill(color);
            rect(this.x, this.y, this.xsize, this.ysize, 8);

            // draw closing x at top right corner
            fill('black')
            textSize(40)
            text('X', this.x+this.xsize-40, this.y+40)

            // draw text in middle of ui
            // fill('black')
            // textSize(150)
            // text(this.uiText, this.x+this.xsize/2, this.y+this.ysize/2)
            this.secretSprite.draw()

            // draw name of ui element
            fill('black')
            textSize(20)
            text(this.uiName, this.x+20, this.y+20*2)
        }
    }

    mousePressed() {
        if (this.isMouseInBounds()) {
            this.onClick(this)
        };
    }
}


class FileCabinetView extends View {
    constructor(backgroundImg, fcImg, cabinetCount=4) {
        super(172, 170, 172, "");
        this.fadoutRate = 0.03 // smaller, slower
        this.secretNumber = "8"; // number to display
        this.cabinets = []
        this.fcImg = fcImg
        this.backgroundImg = backgroundImg

        // fadeout and stuff
        this.lockedVisibility = 0;
        this.holdFadeout = false;
        this.timer = 0;

        let randx;
        let randy;

        let cabinetWidth = 150;
        let cabinetHeight = 300;

        let coordinates = [[300, 430],[600, 470],[900, 430],[1200, 440]];

        // let chosenCabinet = Math.floor(Math.random() * (cabinetCount)); // the one that hides the number
        let chosenCabinet = 2;

        for(let i = 0; i < cabinetCount; i++){
            randx = coordinates[i][0]
            randy = coordinates[i][1]
            this.cabinets.push(new FileCabinetObject(i, randx, randy, cabinetWidth, cabinetHeight,
                 'assets/testObjects/filecabinet.png',
                (obj) => {
                    if(obj.id == chosenCabinet){
                        console.log('You have clicked the chosen cabinet, it was id '+obj.id)

                        R.add(this.uiObject, 100)
                    }
                    else{
                        console.log('This file cabinet is locked.')
                        this.lockedVisibility = 1;
                        this.holdFadeout = true;
                    }
                }
            ))
        }

        this.uiWidth = 600;
        this.uiHeight = 400;

        this.uiObject = new OpenCabinetUIObject(windowWidth/2 - this.uiWidth/2, windowHeight/2 - this.uiHeight/2, this.uiWidth, this.uiHeight, this.secretNumber,
            'Mysterious Filing Cabinet',
            (obj) => {
                R.remove(this.uiObject)
            }
        )
    }

    draw(){
        super.draw();

        background(this.backgroundImg)
        // // displaying number
        // // always exponentially decay visibility of number
        // this.numberVisibility = this.numberVisibility * (1-this.fadoutRate);

        // // set to 0 so it doesn't stay there for too long (while being barely visible, exp decay gets slower as visibility gets closer to 0)
        // if(this.numberVisibility < 0.1){
        //     this.numberVisibility = 0; 
        // }

        // displaying locked cabinet
        if(this.holdFadeout == false){
            this.lockedVisibility = this.lockedVisibility * (1-this.fadoutRate);
            if(this.lockedVisibility < 0.1){
                this.lockedVisibility = 0; 
            }
        }

        fill(0, 0, 0, 255*this.lockedVisibility)
        textSize(30)
        text("This file cabinet is locked...", 30, 60)
    }

    update(dt) {
        if(this.holdFadeout){
            this.timer += dt;

            // if text has been on screen for 1 seconds, enable fadeout
            if(this.timer > 1){
                this.holdFadeout = false;
                this.timer = 0;
            }
        }
    }

    keyPressed() {
    }

    mousePressed(){
        console.log(mouseX)
        console.log(mouseY)
    }

    onEnter() {
        for(let c of this.cabinets){
            R.add(c)
        }
    }

    onExit() {
        for(let c of this.cabinets){
            R.remove(c)
        }
        R.remove(this.uiObject, 100)
    }
}