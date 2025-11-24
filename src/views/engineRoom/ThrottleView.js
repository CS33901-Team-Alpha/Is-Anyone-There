class ThrottleView extends View 
{
    constructor() 
    {
        super();

        this.background = SM.get("EngineRoom4");
        this.background.setSize(16, 9);

        this.buttons = {}; // button definitions
        this.coordinates = {}; // button positions
        this.sequence = []; // correct sequence of button IDs
        this.currentIndex = 0; // progress in sequence

        this.won = false; // puzzle completion status
        this.inputLocked = false; // prevent input during reset

        this.defineButtons(); // define buttons
        this.assignCoordinates(); // assign button positions
        this.randomizeSequence(); // randomize correct sequence only on start creation

        this.closeBtn = new Button(14, 1.2, 0.8, (self) => {
            this.activeInterface = "ScreenView";
            R.add(this.highlight);
            R.remove(this.closeBtn);
        });

        // clickable highlight
        this.highlight = new HighlightEvent(5.4, 2.45, 4.7, 3.7, 255,255,255,() =>{
            this.activeInterface = "PuzzleView";
            R.remove(this.highlight);
            R.add(this.closeBtn);
        });

        this.locked = false;

        this.activeInterface = "ScreenView";
    }

    getNames(array) {
        return array;
    }

    defineButtons() 
    {
        // Define buttons with shapes/colors
        const buttonDefs = [
        { name: "Yellow Button", color: "yellow", activeImage: "YellowOff", onImage: "YellowOn", offImage: "YellowOff"},
        { name: "Blue Button", color: "blue", activeImage: "BlueButtonOff", onImage: "BlueButtonOn", offImage: "BlueButtonOff"},
        { name: "Green Button", color: "green", activeImage: "GreenOff", onImage: "GreenOn", offImage: "GreenOff"},
        { name: "Purple Button", color: "purple", activeImage: "PurpleOff", onImage: "PurpleOn", offImage: "PurpleOff"},
        { name: "Orange Switch", color: "orange", activeImage: "OrangeOff", onImage: "OrangeOn", offImage: "OrangeOff"},
        { name: "Pink Switch", color: "pink", activeImage: "PinkOff", onImage: "PinkOn", offImage: "PinkOff"},
        { name: "Blue Switch", color: "cyan", activeImage: "BlueSwitchOff", onImage: "BlueSwitchOn", offImage: "BlueSwitchOff"},
        { name: "Red Switch", color: "red", activeImage: "RedOff", onImage: "RedOn", offImage: "RedOff"}
        ];

        

        // Assign positions in a grid
        for (let i = 0; i < buttonDefs.length; i++) // create button objects
        {
            const def = buttonDefs[i];
            this.buttons[def.name] = {
                id: i, // unique id
                color: def.color, // current color
                original: def.color, // store original color
                name: def.name, // button name
                activeImage: def.activeImage, //active sprite image
                onImage: def.onImage, //on sprite
                offImage: def.offImage,  //off sprite
                col: i % 4,
                row: Math.floor(i / 4)
            };
        }
    }

    assignCoordinates() // position buttons on screen 
    {
        const spacingX = 3, spacingY = 2.5; // spacing between buttons

        const cols = 4;
        const rows = 2;
        
        const totalWidth = (cols - 1) * spacingX;
        const totalHeight = (rows - 1) * spacingY;

        const startX = (16 - totalWidth) / 2;
        const startY = (9 - totalHeight) / 2;

        // Shuffle button names before assigning positions
        const shapeNames = this.getNames(Object.keys(this.buttons)); // can comment out for fixed button locations. here

        shapeNames.forEach((name, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            this.coordinates[name] = {
                x: startX + col * spacingX,
                y: startY + row * spacingY
            };
        });
    }

    randomizeSequence() 
    {
        // create randomized sequence of button IDs
        const ids = [6, 3, 2, 0, 4, 1, 7, 5];

        this.sequence = ids;
        this.currentIndex = 0; // reset progress

        console.log("Intended order:", this.sequence.map(id => {
        return Object.values(this.buttons).find(b => b.id === id).name;
        }));
    }

    draw() 
    {
        this.background?.draw();

        const u = VM.u();
        const v = VM.v();

        if(this.activeInterface == "PuzzleView") {
            stroke(220,220,220)
            strokeWeight(0.1*VM.U);
            fill(0, 0, 0, 200); // Red, Green, Blue
            rect(1* VM.U, 1*VM.V, 14*VM.U, 7*VM.V);

            var i = 1;
            var trackingx1 = 2.5;
            var trackingx2 = 3;

            // Buttons
            for (const [name, btn] of Object.entries(this.buttons))
            {
                const pos = this.coordinates[name];
                if (!pos) continue;

                const px = pos.x * u;
                const py = pos.y * v;

                push();
                fill(btn.color);
                noStroke();

                var ImageSprite = SM.get(btn.activeImage);

                if(i <= 4) {
                    image(ImageSprite.src, trackingx1*u, 2.25*v, 2 * u, 2 * v);
                    trackingx1 = trackingx1 + 3;
                }
                else {
                    image(ImageSprite.src, trackingx2*u, 5*v, 1 * u, 2 * v);
                    trackingx2 = trackingx2 + 3;
                }

                ++i;
                pop();
            }
        }
    }

    mousePressed(m) 
    {
        if(this.activeInterface == "PuzzleView") {
            if (this.inputLocked || this.won) return; // ignore input if locked or already won
            
            const u = VM.u();
            const v = VM.v(); 
            const mx = m.x * u;
            const my = m.y * v;


            for (const [name, btn] of Object.entries(this.buttons)) // check each button positions
            {
                const pos = this.coordinates[name]; // get button position
                if (!pos) continue;

                const px = pos.x * u;
                const py = pos.y * v;

                let hit = false;

                hit = mx >= (px - u) && mx <= (px + u) && // x bounds
                        my >= (py - v) && my <= (py + v); // y bounds

                if (hit) {
                    this.handleClick(btn);
                    return;
                }
            }
        }
    }

    handleClick(btn) 
    {
        if (this.inputLocked || this.won) return; // ignore input if locked or already won

        if (btn.id === this.sequence[this.currentIndex]) // correct button
        {
            AM.play("reactorBeep");
            btn.color = "lightgreen"; // change this specific button to lightgreen
            btn.activeImage = btn.onImage; // change this specific button to lightgreen
            this.currentIndex++; // increment progress

            if (this.currentIndex >= this.sequence.length) // if index == length of solution or is greater somehow set all the buttons to green
            {
                AM.play("reactorFix");
                this.won = true; // puzzle is solved
                this.inputLocked = true; // lock input
                AI.addText('>_  MAIN ENGINE STATUS UPDATING... \n>_  THROTTLE SEQUENCE INITIATED \n>_  ENGINE STATUS: OPERATIONAL');
            }
        } 
        else 
        { 
            AM.play("badArrow");
            this.inputLocked = true; // lock input during reset
            this.resetImages();
            this.currentIndex = 0; // reset progress
        }
    }

    resetImages() 
    {
        for (const btn of Object.values(this.buttons)) 
        {
            btn.activeImage = btn.offImage;
        }
        this.inputLocked = false; // unlock input
    }

    onEnter() {
        R.add(this.highlight);
        R.add(this.PadSprite);
    }

    onExit() {
        R.remove(this.highlight);
        R.remove(this.PadSprite);
        this.activeInterface = "ScreenView";
    }
}
