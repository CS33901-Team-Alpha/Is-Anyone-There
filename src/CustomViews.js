class ComputerView extends View {

    constructor() {
        super(58, 134, 255, "");
        this.text = "";
        this.ComputerIsOpen_ = false;
        this.PinIsOpen_ = false;

        this.pinpadimg_ = loadImage('../assets/testObjects/pinpad.png');
        this.backgroundimg_ = loadImage('../assets/testObjects/NorthWall.png');

        this.ScreenWidth_ = width - 200;
        this.ScreenHeight_ = height - 100;
        this.PinWidth_ = width/2;
        this.PinHeight_ = this.ScreenHeight_;

        this.bttn = new ConditionalButton(width/7, height/20, 800,() => {
            this.openComputer();
        }, true, 128, 128, 128, true);

        this.closebttn = new ConditionalButton(width/2+this.ScreenWidth_/2-20, height/2-this.ScreenHeight_/2-20, 50, () => {
            this.closeComputer();
        }, false, 200, 35, 35, false);

        this.pinbttn = new ConditionalButton(width/2 + 500, height/1.5 - 150, 80, () => {
            this.openPin();
        }, true, 255, 255, 255, true);

        this.closepinbttn = new ConditionalButton(width/2+this.PinWidth_/2-40, height/2-this.PinHeight_/2+1-20, 80, () => {
            this.closePin();
        }, false, 200, 35, 35, false);
    
        //---------------------------------------- Pinpad Setup ----------------------------------

        this.PinAttempt_ = "";
        this.PinString_ = "Enter Pin: ";
        this.PinCount_ = 0;
        this.Password_ = "393";
        this.PinMessage_ == "";

        this.pinbttn1 = new ConditionalButton(width/2 - this.PinWidth_/2 + 105, height/2- this.PinHeight_/2 +175 , 100, () => {
            this.PinPress("1");
        }, false, 200,200,200, true);

        this.pinbttn2 = new ConditionalButton(width/2 - this.PinWidth_/2 + 255, height/2- this.PinHeight_/2 +175, 100, () => {
            this.PinPress("2");
        }, false, 200,200,200, true);
        
        this.pinbttn3 = new ConditionalButton(width/2 - this.PinWidth_/2 + 405, height/2- this.PinHeight_/2 +175, 100, () => {
            this.PinPress("3");
        }, false, 200,200,200, true);

        this.pinbttn4 = new ConditionalButton(width/2 - this.PinWidth_/2 + 105, height/2- this.PinHeight_/2 + 295, 100, () => {
            this.PinPress("4");
        }, false, 200,200,200, true);

        this.pinbttn5 = new ConditionalButton(width/2 - this.PinWidth_/2 + 255, height/2- this.PinHeight_/2 + 295, 100, () => {
            this.PinPress("5");
        }, false, 200,200,200, true);

        this.pinbttn6 = new ConditionalButton(width/2 - this.PinWidth_/2 + 405, height/2- this.PinHeight_/2 + 295, 100, () => {
            this.PinPress("6");
        }, false, 200,200,200, true);

        this.pinbttn7 = new ConditionalButton(width/2 - this.PinWidth_/2 + 105, height/2- this.PinHeight_/2 + 415, 100, () => {
            this.PinPress("7");
        }, false, 200,200,200, true);

        this.pinbttn8 = new ConditionalButton(width/2 - this.PinWidth_/2 + 255, height/2- this.PinHeight_/2 + 415, 100, () => {
            this.PinPress("8");
        }, false, 200,200,200, true);

        this.pinbttn9 = new ConditionalButton(width/2 - this.PinWidth_/2 + 405, height/2- this.PinHeight_/2 + 415, 100, () => {
            this.PinPress("9");
        }, false, 200,200,200, true);

        //-------------------------Console Interaction---------------------
        this.givenCommand_ = "";
        this.EnterPressed_ = false;
    }

    draw(){
        super.draw();
        background(this.backgroundimg_);
        push();
        textSize(50);
        if(this.ComputerIsOpen_) {
            this.PinIsOpen_ = false;
            stroke(100);
            strokeWeight(10);
            fill(0,0,0);
            rect(width/2 - this.ScreenWidth_/2, height/2- this.ScreenHeight_/2, this.ScreenWidth_, this.ScreenHeight_);
            textSize(25);
            strokeWeight(0);
            fill(255,255,255);
            text("> Type Command for Computer...ENTER to execute", width/2 - this.ScreenWidth_/2 + 25, height/2- this.ScreenHeight_/2 + 50);
            text("> " + this.givenCommand_, width/2 - this.ScreenWidth_/2 + 25, height/2- this.ScreenHeight_/2 + 115);
            if(this.EnterPressed_) {
                text("> Command : " + this.givenCommand_ + " : EXECUTED", width/2 - this.ScreenWidth_/2 + 25, height/2- this.ScreenHeight_/2 + 180);
                text("> Closing Terminal...", width/2 - this.ScreenWidth_/2 + 25, height/2- this.ScreenHeight_/2 + 245);
                setTimeout(() => {
                    this.closeComputer();
                }, "2000");
            }
            this.closebttn.CanDraw();
            this.bttn.NotDraw();
            this.pinbttn.NotDraw();
        }

        if(!this.ComputerIsOpen_ && !this.PinIsOpen_) {
            image(this.pinpadimg_, width/2 + 500, height/1.5 - 150,);
            this.pinpadimg_.resize(80, 80);
            this.bttn.CanDraw();
            this.closebttn.NotDraw();
            this.pinbttn.CanDraw();
            this.closepinbttn.NotDraw();
            this.pinbttn1.NotDraw();
            this.pinbttn2.NotDraw();
            this.pinbttn3.NotDraw();
            this.pinbttn4.NotDraw();
            this.pinbttn5.NotDraw();
            this.pinbttn6.NotDraw();
            this.pinbttn7.NotDraw();
            this.pinbttn8.NotDraw();
            this.pinbttn9.NotDraw();
        }

        if(this.PinIsOpen_) {
            this.ComputerIsOpen_ = false;
            fill(255, 255, 255);
            stroke(0);
            strokeWeight(15);
            rect(width/2 - this.PinWidth_/2, height/2- this.PinHeight_/2, this.PinWidth_, this.PinHeight_, 50);
            fill(0, 0, 0);
            strokeWeight(0);
            rect(width/2 - this.PinWidth_/2 + 50, height/2- this.PinHeight_/2 +70, this.PinWidth_-90, this.PinHeight_/6);
            fill('black');
            textSize(30);
            text(this.PinMessage_, width/2 - this.PinWidth_/2 + 125, height/2- this.PinHeight_/2+50);
            fill('limegreen');
            textSize(50);
            text(this.PinString_ + this.PinAttempt_ , width/2 - this.PinWidth_/2 + 65, height/2- this.PinHeight_/2 +135);
            for (let i = 1; i < 10; i += 1) {
                textSize(100);
                text(i , width/2 - this.PinWidth_/2 +(150*((i-1)%3)) +125, height/2- this.PinHeight_/2 +135+(125*ceil(i/3)));
            }
            this.closepinbttn.CanDraw();
            this.bttn.NotDraw();
            this.pinbttn.NotDraw();
            this.pinbttn1.CanDraw();
            this.pinbttn2.CanDraw();
            this.pinbttn3.CanDraw();
            this.pinbttn4.CanDraw();
            this.pinbttn5.CanDraw();
            this.pinbttn6.CanDraw();
            this.pinbttn7.CanDraw();
            this.pinbttn8.CanDraw();
            this.pinbttn9.CanDraw();
        }

        textSize(20);
        textAlign(CENTER);
        pop();
    }

    openComputer() {
        this.ComputerIsOpen_ = true;
    }

    closeComputer() {
        this.ComputerIsOpen_ = false;
        this.givenCommand_ = "";
        this.EnterPressed_ = false;
    }

    openPin() {
        this.PinIsOpen_ = true;
    }

    closePin() {
        this.PinIsOpen_ = false;
        this.PinMessage_ = "";
        this.PinAttempt_ = "";
        this.PinCount_ = 0;
    }

    PinPress(key) {
        this.PinAttempt_ = this.PinAttempt_ + key;
        this.PinCount_++;
        if(this.PinCount_ == 3) {
            if(this.PinAttempt_ === this.Password_) {
                this.PinMessage_ = "Correct Pin Entered!";
                this.PinCount_ = 0;
                this.PinAttempt_ = "";
                setTimeout(() => {
                    this.closePin();
                }, "1500");
            }
            else {
                this.PinMessage_ = "Incorrect Pin, Try Again";
                this.PinCount_ = 0;
                this.PinAttempt_ = "";
            }
        }
    }

    keyPressed() {
        if (keyCode === ENTER && this.givenCommand_ !== "") {
            this.EnterPressed_ = true;
        }
        else if(keyCode === BACKSPACE) {
            this.givenCommand_ = this.givenCommand_.substring(0, this.givenCommand_.length - 1); 
        }
        else {
            this.givenCommand_ = this.givenCommand_ + key;
        }
    }


    onEnter() {
        R.add(this.bttn);
        R.add(this.closebttn);
        R.add(this.pinbttn);
        R.add(this.closepinbttn);
        R.add(this.pinbttn1);
        R.add(this.pinbttn2);
        R.add(this.pinbttn3);
        R.add(this.pinbttn4);
        R.add(this.pinbttn5);
        R.add(this.pinbttn6);
        R.add(this.pinbttn7);
        R.add(this.pinbttn8);
        R.add(this.pinbttn9);
    }

    onExit() {
        R.remove(this.bttn);
        R.remove(this.closebttn);
        R.remove(this.pinbttn);
        R.remove(this.closebttn);
        R.remove(this.pinbttn1);
        R.remove(this.pinbttn2);
        R.remove(this.pinbttn3);
        R.remove(this.pinbttn4);
        R.remove(this.pinbttn5);
        R.remove(this.pinbttn6);
        R.remove(this.pinbttn7);
        R.remove(this.pinbttn8);
        R.remove(this.pinbttn9);
    }

}

class TimerView extends View {
    constructor() {
        super(255, 99, 71, "Room 2 - Timer");
        this.timer = new Timer(30000);
        this.timeLabel = 0;
    }

    draw(){
        super.draw();
        push();
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(50);
        text(this.timeLabel , width/2, height/4);

        textSize(20);
        text("Press Space To reset Timer" , width/2, height/2 + 40);
        pop();
    }

    update(dt) {
        this.timeLabel = this.timer.getSeconds();
    }

    keyPressed() {
        if(keyCode === 32) this.timer.reset();
    }
}

class EventView extends View {
    constructor() {
        super(58, 134, 255, "Room 1");
        this.text = "";
        this.bttn1 = new Button(width/2 - 100, height/1.5, 50, () => {
            this.text = "Event 1";
        });
        this.bttn2 = new Button(width/2, height/1.5, 50, () => {
            this.text = "Event 2";
        });
        this.bttn3 = new Button(width/2 + 100, height/1.5, 50, () => {
            this.text = "Event 3";
        });
    }

    draw(){
        super.draw();
        push();
        fill(0, 0, 0);
        textSize(50);
        text(this.text, width/2, height/4);

        textSize(20);
        textAlign(CENTER);
        text("Press Buttons To Show Events" , width/2, height/2 + 40);
        pop();
    }

    onEnter() {
        R.add(this.bttn1);
        R.add(this.bttn2);
        R.add(this.bttn3);
    }

    onExit() {
        R.remove(this.bttn1);
        R.remove(this.bttn2);
        R.remove(this.bttn3);
    }
}

class MoveView extends View {
    constructor() {
        super(60, 179, 113, "Room 3");
        this.block1 = new MoveBlock(width/1.5, height/1.5, 100);
        this.block2 = new MoveBlock(width/4, height/4, 100);
        this.block3 = new MoveBlock(width/4, height/1.5, 100);
        this.block4 = new MoveBlock(width/1.5, height/4, 100);
    }

    draw() {
        super.draw();
        push();
        textSize(20);
        textAlign(CENTER);
        text("Move the Boxes around!" , width/2, height/2 + 40);
        pop();
    }

    onEnter() {
        R.add(this.block1);
        R.add(this.block2);
        R.add(this.block3);
        R.add(this.block4);
    }

    onExit() {
        R.remove(this.block1);
        R.remove(this.block2);
        R.remove(this.block3);
        R.remove(this.block4);
    }
}