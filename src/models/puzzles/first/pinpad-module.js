// @ts-check
// puzzle module for pinpad
/* The pinpad module will provide a pinpad with
 * States that prevent spamming or misinput
 * while not actually delaying with time like it's predecesor.
*/

// utility functions
/**
 * 
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function constrain(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function random(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * 100 % 9) + min;
}

// constants
export const PINS_ORIGIN = { u: 5.85, v: 3.4 };
export const PINS_OFFSET = { u: 1.75, v: 1.5 };
export const PINS_SIZE = 0.9;
export const PASSWORD_SIZE = 3;

// positioning contants for view modules
export const PIN_TLu = 5;
export const PIN_BRu = 6;
export const PIN_TLv = 1.4;
export const PIN_BRv = 7;

export class PinButton {
    /** A pin button for input into the pinpad. 
     * pressing will return the value. when action taken, always change the pin pad state.
     * 
     * @param {number | null} x      the position on the grid of pins from top left on the x axis
     * @param {number | null} y      the position on the grid of pins from top left on the y axis
     * @param {number} value  the number on the pin.
     */
    constructor(x, y, value) {
        this.x = x; // may constrain to be 3x3 or 3x4 later.
        this.y = y;
        this.value = value;
    }

    press() {
        return this.value;
    }
}

/**
 * @private
 * @param {number | null} x x spot on pin grid
 * @param {number | null} y y spot on pin grid
 * @param {number} v value of pin button
 * @returns a pin button, this is a shortcut func
 */
function p(x,y,v) {
    return new PinButton(x,y,v);
}

/**
 * forwarded all the computation to this function.
 * @param {number} x x coord from external (controler probably) 
 * @param {number} y y coord from external
 * @returns {{x:number,y:number}} Object of x and y for the pinpad grid. 
 */
export function transform(x,y) {
    return {x,y};
}

const state = {
    IDLE: 0,
    INPUT: 1, // for preventing spamming on the inputs
    PROCESSING: 2 // for when a full password is entered and needs to be tested.
}

// basically password checker class, use for asset help
export class Passkey {
    /**
     * # Passkey class
     * 
     * has a set number of slots for a pass code
     * [ 000 ]
     * 
     * - numbers entered one at a time
     * - able to see the current state, and position of the object
     * [ 340 ]:
     * getInput():  [3,4,0]
     * getInsert(): 2 (index 2)
     * 
     * @param {Array<number>} password js array of numbers to be compared to the array for input.
     */
    constructor(password) {
        // creates the storage for the password
        /** @type {Array<number>} */
        this.input = new Array(PASSWORD_SIZE);
        /** @type {Array<number>} */
        this.answer = password;
        // because I need pass by reference 
        /** @type {Number} because I need it as an object*/
        this.insert = 0;

        this.entryDriver = this.passwordEntryBehavior_();
        this.entryDriver.next(); // obligitory initial use :)

        this.unlock = false;

        /** @type {Object} literally just carries data so it can be found without breaking the  */
        this.junkCarrier = {}

        // any errors in case something is wrong.
        if(password.length !== PASSWORD_SIZE) throw new Error("Password does not fit pasword, size conflict.");

    }

    // getters for values
    /**
     * @returns the stored numbers being the entered numbers by user. user enters 7, 4, and 9: returns [ 7, 4, 9 ]
     */
    getEntry()  { return this.input;  }
    getInsert() { return this.insert; }
    getAnswer() { return this.answer; }

    /**
     * @private
     * A Function that handles the streaming input of the password in a graceful / voodoo witch black magic manner
     * 
     * 
     * this gives a decent idea, but i removed it cause PBR doesn't exist--param {Object} obj { arr: Array<number>, count: number } a Object containing the input sequence and the count/index. 
     *      This is an object to be able to change the references inside it, which is needed as it changes `this.input` and `this.insert`
     * 
     * @example
     * ```
     * let generator = passwordEntryBehavior(); // {this.input,this.insert}
     * 
     * generator.next(); // returns insert value, needed to initialize the sequence.
     * 
     * generator.next(7); // input has put 7 in the 0 insert position ; input = [0,0,0] --> [7,0,0] | insert = 0 --> 1
     * // ...
     * generator.next(9); // last entry determined by PASSWORD_SIZE, checks password and returns true if match, false if not.
     * 
     * // more practical for last entry
     * if(generator.next(9)) {
     *     // SOLVED!!!
     * }
     * // DISCLAIMER, code does not work only because I skipped lines and added 2 examples of 2 final entries.
     * ```
     */
    *passwordEntryBehavior_() {
        // Comments for debugging
        // console.log("password input starting");

        // Check for extremities
        if( this.insert > PASSWORD_SIZE) {
            throw new Error("starting insertion beyond set maximum size. ensure 'insert' and input were cleaned or used properly. Ask Ben if you see this, you really shouldn't...");
        }
        // maybe check array state
        do {
            // console.log("looping");
            this.input[this.insert] = yield this.insert/* put value here to return it each use. may not need. */; 
            this.insert++;
        } while( this.insert !== PASSWORD_SIZE);

        // NOTE: might delay a round for additional state changing!!!!!

        let match = this.answer.every((value,index) => value === this.input[index] ); // get the correctness of the input
        // console.log("password is correct: " + match);
        return match;
    }

    // entering a number to the passkey
    /**The Simplified **public** way to enter numbers. 
     * 
     * @param {number} num 
     */
    enter(num) {
        /** @typedef {boolean | number} */
        let determinant = this.entryDriver.next(num).value;

        if(typeof(determinant) == "boolean") { // exists
            this.unlock = determinant; // unlock matches determinant
            // push reset duties to pindad itself, since this module does not need to do that automatically
            return;
        }
        
        // POSSIBLE debug space to set checks that ensure behavior or fix bugs.
        if(determinant > PASSWORD_SIZE) throw new Error("WTF have you done to get here? your insert index exceded where it can't and you are here. this will be a miricle");
    }

    /**Needs slight confirmation on testing, but should work to set everything to enter no matter
     * 
     * @param {boolean} unsolve optional set to true to undo the state saying the puzzle was solved.
     */
    reset(unsolve = false) {
        // to reset, first change insert to carry the generator if it is not done already
        this.insert = -1; // -1 to pull to 0 when generator continues

        // call next, check if it's done
        let temp = this.entryDriver.next();
        if(temp.done) { // start new generator if it is done.
            this.entryDriver = this.passwordEntryBehavior_();
            this.entryDriver.next(); // obligitory first function
        } // not done needs no work (i think)

        // now reset array to clear values
        this.input = new Array(PASSWORD_SIZE);

        // now unsolve
        if(unsolve) this.unlock = false;
    }

    /**
     * only if you want to :) 2 line backend with twice as much in frontend
     */
    backspace() {
        this.insert -= 2;
        this.entryDriver.next();
        // will leave an entry as undefined but no issues forseen.
    }

    /**
     * Stops the password from inputting, just use if this causes lag or performange issues, cause the generator is basically ALWAYS running.
     */
    stop() {
        this.entryDriver.return(false);
        // not really checking if this stops this. but i'd image the function is done now.
    }

    /**
     * starts up the generator again without reseting
     */
    reboot() {
        this.entryDriver = this.passwordEntryBehavior_();
        this.entryDriver.next();
    }
}

/**
 *
 * 
 * @property {Array<PinButton>} pins array of the buttons for the pin pad [0,1,2,3,4,5,6,7,8,9], [0] is used as a null/off-set as there is no 0 button
 * @property {any} state {IDLE, INPUT, PROCESSING} idle is waiting input, input is inputting one input and accepts no other, processing is looking at a complete password and declaring correctness.
 * @property {Array<number>} password A randomly generated PASSWORD_SIZE (set in module file constants) password to solve the puzzle
 * @property {Passkey} key The storage and display getter for the current attempt password. also is the checker for the correct password
 * 
 */
export class Pinpad {
    /**
     * 
     * 
     */
    constructor() {

        // creation of the buttons
        this.pins = [ // Ordered to do pins[5].press() returns 5, 0 has no asset
            p(null,null,0),
            p(0,0, 1 ), p(1,0, 2 ), p(2,0, 3 ),
            p(0,1, 4 ), p(1,1, 5 ), p(2,1, 6 ),
            p(0,2, 7 ), p(1,2, 8 ), p(2,2, 9 )
        ]; 

        //setting the state
        this.state = state.IDLE; // state to prevent spamming

        // generating the password
        let password = Array.from({ length:PASSWORD_SIZE }, () => Math.floor(random(1,9)));

        // setting the password and initiallizing the passkey interface
        this.key = new Passkey(password);

        // just an idea, but would control if stuff is input, allowing calls on object even when not on screen.
        // this.inview = true;
    }

    /* Class plan:
     * getters:
     * A LOT OF GETTERS for the front end
     * 
     * state:
     * - list: IDLE, INPUT, PROCESSING
     * - IDLE: nothing is occuring, and buttons are ready to be pushed.
     * - INPUT: A location was entered, and what if a pin was pressed, and the passkey processing of all that needs to be acted on. allows for animation time
     * 
     * 
     * 
     * 
     * 
     */
    /** Coordinates based on the grid of pins, (null, null) is no pin press
     * before input, use the transform function in the input to convert input coordinates into useable pinpad numbers.
     * 
     * @param {number | { x: number, y:number } | null} pos1 X coordinate pushed OR the object of { x:number, y:number } such as given by the {@link transform} function
     * @param {number | null} pos2 Y coordinate pushed
     * 
     * @example
     * ```
     * pad.push(1,1); // push the middle button
     * pad.push({ x: 1, y: 1 });
     * pad.push(transform(1,1));
     * ```
     */
    push(pos1, pos2 = null) {
        // getting the x and y of the cell
        let x = -1;
        let y = -1;
        if(typeof pos1 === "object" && pos1 !== null) {
            x = pos1.x;
            y = pos1.y;
        } else {
            if(pos1 === 0 || !!pos1) x = pos1; // !! checks for not falsy ( null, undefined, NaN, ect.) also checks for 0 because 0 is falsy.
            if(pos2 === 0 || !!pos2) y = pos2; 
        }

        // 
    }
}

let pad = new Pinpad();



export { constrain, random };
