class ThrottleView extends View 
{
    constructor() 
    {
        super();

        this.background = SM.get("MetalWall");
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
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    defineButtons() 
    {
        // Define buttons with shapes/colors
        const buttonDefs = [
        { name: "Blue Square", shape: "rect", color: "blue" },
        { name: "Red Circle", shape: "circle", color: "red" },
        { name: "Yellow Rect", shape: "rect", color: "yellow" },
        { name: "Purple Circle", shape: "circle", color: "purple" },
        { name: "Orange Square", shape: "rect", color: "orange" },
        { name: "Green Circle", shape: "circle", color: "green" },
        { name: "Cyan Rect", shape: "rect", color: "cyan" },
        { name: "Magenta Circle", shape: "circle", color: "magenta" }
        ];

        // Assign positions in a grid
        for (let i = 0; i < buttonDefs.length; i++) // create button objects
        {
            const def = buttonDefs[i];
            this.buttons[def.name] = {
                id: i, // unique id
                name: def.name, // button name
                shape: def.shape, // shape type
                color: def.color, // current color
                original: def.color, // store original color
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
        const shuffledNames = this.shuffle(Object.keys(this.buttons)); // can comment out for fixed button locations. here

        shuffledNames.forEach((name, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            this.coordinates[name] = {
                x: startX + col * spacingX,
                y: startY + row * spacingY
            };
        });

        //to here

        //Uncomment for non shuffled positions
        //Non Shuffled
        // for (const btn of Object.values(this.buttons)) // assign x,y coordinates
        // {
        //     this.coordinates[btn.name] = { // position objects
        //         x: startX + btn.col * spacingX,
        //         y: startY + btn.row * spacingY
        //     };
        // }
    }

    randomizeSequence() 
    {
        // create randomized sequence of button IDs
        const ids = Object.values(this.buttons).map(b => b.id); // grab the ids and put them in an array. b is each button object and b.id is the id property of that object
        
        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]]; // swap
        }

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

            if (btn.shape === "rect") 
            {
                rectMode(CENTER); // center rect
                rect(px, py, 2 * u, 2 * v, 6); // rounded corners
            } 
            else if (btn.shape === "circle")
            {
                ellipse(px, py, 2 * u, 2 * v);
            }
            pop();
        }
    }

    mousePressed(m) 
    {
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

            if (btn.shape === "rect") {
                hit = mx >= (px - u) && mx <= (px + u) && // x bounds
                    my >= (py - v) && my <= (py + v); // y bounds
            } else if (btn.shape === "circle") {
                const dx = mx - px;
                const dy = my - py;
                hit = Math.sqrt(dx * dx + dy * dy) <= u; // radius
            }

            if (hit) {
                this.handleClick(btn);
                return;
            }
        }
    }

    handleClick(btn) 
    {
        if (this.inputLocked || this.won) return; // ignore input if locked or already won

        if (btn.id === this.sequence[this.currentIndex]) // correct button
        {
            btn.color = "lightgreen"; // change this specific button to lightgreen
            this.currentIndex++; // increment progress

            if (this.currentIndex >= this.sequence.length) // if index == length of solution or is greater somehow set all the buttons to green
            {
                this.won = true; // puzzle is solved
                this.inputLocked = true; // lock input
                this.setAllColors("green"); // all green
            }
        } 
        else 
        { 
            this.setAllColors("red"); // convert all the buttons to red to show a mistake
            this.inputLocked = true; // lock input during reset
            setTimeout(() => this.resetColors(), 1000); // delay then reset after 1 second
            this.currentIndex = 0; // reset progress
        }
    }

    setAllColors(color) 
    {
        for (const btn of Object.values(this.buttons)) 
        {
            btn.color = color;
        }
    }

    resetColors() 
    {
        for (const btn of Object.values(this.buttons)) 
        {
            btn.color = btn.original;
        }
        this.inputLocked = false; // unlock input
    }
}
