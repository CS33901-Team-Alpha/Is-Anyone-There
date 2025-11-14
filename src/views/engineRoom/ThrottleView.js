class ThrottleView extends View 
{
    constructor() 
    {
        super();

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

    defineButtons() 
    {
        // Define buttons with shapes/colors
        const buttonDefs = [
        { name: "Blue Square", shape: "rect", color: "blue" },
        { name: "Red Circle", shape: "circle", color: "red" },
        { name: "Yellow Rect", shape: "rect", color: "yellow" },
        { name: "Purple Circle", shape: "circle", color: "purple" }
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
                col: i, // number of columns depending on indexes
                row: 0
            };
        }
    }

    assignCoordinates() // position buttons on screen 
    {
        // FIX VM USAGE. MATH IS OFF
        const u = VM.u();
        const v = VM.v();
        const spacing = 3 * u; // horizontal spacing
        const startX = (16 * u - spacing * (Object.keys(this.buttons).length - 1)) / 2; // center buttons. grabs width and subtracts total spacing then divides by 2
        const y = 4.5 * v; // vertical center. grabs height and divides by 2 then uses the vm v

        let i = 0;
        for (const name of Object.keys(this.buttons)) // assign x,y coordinates
        {
            this.coordinates[name] = { // position objects
                x: startX + i * spacing, // Centered horizontally + spacing
                y: y // Centered vertically
            };

            i++;
        }
    }

    randomizeSequence() 
    {
        // create randomized sequence of button IDs
        const ids = Object.values(this.buttons).map(b => b.id); // grab the ids and put them in an array. b is each button object and b.id is the id property of that object
        this.sequence = ids.sort(() => Math.random() - 0.5); // CHANGE THIS TO SOMETHING MORE SIMPLE
        this.currentIndex = 0; // reset progress

        console.log("Intended order:", this.sequence.map(id => {
        return Object.values(this.buttons).find(b => b.id === id).name;
        }));
    }

    draw() 
    {
        //CHANGE VM USAGE
        const u = VM.u();
        const v = VM.v();

        // Border
        push();
        stroke(0); // black border
        strokeWeight(4); // thick border
        noFill();
        rectMode(CENTER);
        rect(width / 2, height / 2, width - 40, height - 40); // border rectangle
        pop();

        // Buttons
        for (const [name, btn] of Object.entries(this.buttons)) // 
        {
            const pos = this.coordinates[name];
            if (!pos) continue;

            push();
            fill(btn.color);
            noStroke();
            if (btn.shape === "rect") 
            {
                rectMode(CENTER); // center rect
                rect(pos.x, pos.y, 2 * u, 2 * v, 6); // rounded corners
            } 
            else 
            {
                ellipse(pos.x, pos.y, 2 * u, 2 * v);
            }
            pop();
        }
    }

    mousePressed(m) 
    {
        if (this.inputLocked || this.won) return; // ignore input if locked or already won
        
        const px = m.x * width / 16; // convert to view coords
        const py = m.y * height / 9; // convert to view coords

        for (const [name, btn] of Object.entries(this.buttons)) // check each button positions
        {
            const pos = this.coordinates[name]; // get button position
            if (!pos) continue;
            let hit = false;

            if (btn.shape === "rect") 
            {
                hit = px >= pos.x - VM.u() && px <= pos.x + VM.u() &&
                    py >= pos.y - VM.v() && py <= pos.y + VM.v(); // rectangular hitbox
            } 
            else 
            {
                const dx = px - pos.x; // circular hitbox
                const dy = py - pos.y; // ...
                hit = Math.sqrt(dx * dx + dy * dy) <= VM.u(); // radius
            }

            if (hit) // button was clicked
            {
                this.handleClick(btn); // process click
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
        { // FIX INPUT ON FAILURE
            this.setAllColors("red"); // convert all the buttons to red to show a mistake
            this.inputLocked = true; // lock input during reset
            setTimeout(() => this.resetColors(), 1000); // delay then reset after 1 second
            this.inputLocked = false; // unlock input after reset
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
    }
}
