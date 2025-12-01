/*
to do:
// - account for falling conditions, such as 2 states tringering a check state, which is in another check.
 - complex game state objects for more options (low priority)
GameState is a Set that can hold anything, this file contains the basic 
Game State Strings  :   meaning
pin entered         :   Room 1 Veiw 1 pinpad had the correct password inputed
timeout             :   the timmer ran down to 0:00

Game State Variables Currently in Use:
- "Game Started" - denotes when game begins
- "Show AI Startup" - denotes to start AI Bootup text, unset after done once
- 'Showing AI Message" - denotes when a message is currently being shown on screen, unset afterwards
- "Timer Up" - denotes when the timer reaches zero
- "Pin Solved" - denotes when the correct PIN is entered in ComputerView
- "Life Support Access Granted" - denotes when wordle puzzle solved, allows entering the Life Support door
- "Player Died" - denotes when the player dies somehow
- "Game Complete" - denotes when the game's win condition is met, completing the game
- "Wires Solved" - denotes when wires/flow puzzle solved, unlocks cryo door
- 'fixedElectricalComponent' - denotes when repair puzzle in breaker room is done, unlocks reactor
- "regulateOxygenPuzzleSolved" - denotes when oxygen puzzle has been solved in Life Support
- "regulateTempPuzzleSolved" - denotes when the temperature puzzle has been solved in Life Support
- "Ended" - checkfor value thatis set when an end condition for the game is met
            right now that is "Game Complete", "Timer Up", and "Player Died"
- "reactorStartupInitialized" - Reactor Sequence has begun; start timer
- "reactorStartupComplete" - completed reactor startup puzzle
- "restartReactorComplete" - completed restart reactor puzzle
- "operationRodComplete" - completed reactor rod puzzle
- "reactorStabilized" - stabilized reactor (aka all puzzles done in order) - used to preven ttimer from popping up again when you enter reactor
- "BotanicalRoomVisited" - whether we have been to botanical room before (prevent contagion event from starting if we have)
- "BotanicalQuarantine" - whether the quarantine is currently active. Can be used to play alarms and other things during the event. 
- "BotanicalComponentOpen" - When a plant has been clicked on, denotes the info page is open; used for fixing hitbox issue
- "Minimap Unlocked" - denotes when the map puzzle is solved; allows minimap to be used
- "Engine Gears Fixed" - denotes when the gear puzzle has been fixed in engine room; needed for throttle to be valid
- "Engine Throttle Finished" - denotes when the throttle sequence in the engine room is done; final engine puzzle
*/

class GameState {
    constructor() {
        this.states = new Set(); // simple states, string set
        this.checks = new Map(); // array for functions
        this.deaths = 0          // count for deaths 
        this.password = this.generatePassword();
        this.password1 = this.password[0];
        this.password2 = this.password[1];
        this.password3 = this.password[2];
        
        //Throttle Sequence stuff
        this.buttons = {}; // button definitions
        this.coordinates = {}; // button positions
        this.sequence = []; // correct sequence of button IDs
        this.namesArray = [];
        this.currentIndex = 0; // progress in sequence

        this.defineButtons(); // define buttons
        this.assignCoordinates(); // assign button positions
        this.randomizeSequence(); // randomize correct sequence only on start creation

        this.endString = "";
    }
    /**
     * Adds to the state list. this will check for exact values.
     * Named checks defined earlier **OR** later ( GS.checkFor(name, ()=>{}) )
     * will insert a string of it's name into the state list
     * @param {string} str parameter to store. being a string is not needed, but for consistency and availability it is prefered.
     */
    set(str) {
        this.states.add(str);
        this.update();
    }
    /**
     * removes states from the list. opposite of set
     * @param {string} str parameter to remove. being a string is not needed, but for consistency and availability it is prefered.
     */
    unset(str) {
        this.states.delete(str);
        this.update();
    }
    /**
     * "Game state is `str`" checks if the game state is set to the given state's name.
     * @param {*} str the state to check for.
     * @returns true if that state is in the list; false if not.
     */
    is(str) {
        if(this.states.has(str)) {
            return true;
        }
        return false;
    }
    /**
     * Add a preemtive state change by providing a state `name` and a boolean lambda function `func` to the function. The list **will** update after the addition.
     * If the states checked in the lambda are already set, the state added through here will immediatly be set upon declaration. (hands free updating)
     * @param {string} name name of the state being checked for, input into the state list accessable through GS.is(str) when triggered.
     * @param {() => boolean} func make a **lambda** returning the point which the checker is true.
     */
    checkFor(name, func = () => {}) {
        this.checks.set(name, func);
        this.update();
    }
    /**
     * updated list based on checkers.
     * already implemented in-class where needed, avoid use.
     */
    update() {
        for(const [name,f] of this.checks) {
            if(!this.states.has(name) && f()) {
                this.set(name);
            } else if(this.states.has(name) && !f()) {
                this.unset(name);
            }
        }
    }

    loadState(){
        const savedState = JSON.parse(localStorage.getItem('currentGameState'))

        // only bring state over if it exists, if not, then leave gamestate object as is (everything unset, 0 deaths)
        if(savedState){
            this.deaths = savedState.deaths || 0

            for(const state of savedState.states){
                this.set(state)
            }
        }
    }

    persistState(){
        // looks weird but this will convert the gamestate into a JSON string, then back into a JS object so we can add states to it (see getStatesAsArr)
        const gsObj = JSON.parse(JSON.stringify(this))
        gsObj.states = this.getStatesAsArr()

        // make a filter list of states that we wanna save
        const save = ['Pin Solved','fixedElectricalComponent', 'Wires Solved', 'reactorStartupComplete', 
                        'restartReactorComplete', 'operationRodComplete', 'regulateOxygenPuzzleSolved', 
                        'regulateTempPuzzleSolved', 'Life Support Access Granted', 'Minimap Unlocked', 
                        'Engine Gears Fixed', "Engine Throttle Finished"
                    ]; // save these states, drop others
        gsObj.states = gsObj.states.filter((state) => save.includes(state))

        localStorage.setItem('currentGameState', JSON.stringify(gsObj))
    }

    // we need this because our this.states is a Set, and JSON.stringify (what we use to persist) does NOT convert the elements of the set into
    // the output (they show up as {})
    getStatesAsArr(){
        return Array.from(this.states)
    }

    incrementDeaths(){
        this.deaths++;
    }
    getDeaths() {
        return this.deaths;
    }

    setString(string) {
        this.endString = string;
    }

    getString(string) {
        return this.endString;
    }

    generatePassword(){
      let password = "";
      for (let i = 0; i < 3; ++i) {
        const num = str(int(random(1, 10)));
        password += num;
      }
      console.log(password);
      return password;
    }

    getPassword() {
        return this.password;
    }

    getPassword1() {
        return this.password1;
    }

    getPassword2() {
        return this.password2;
    }

    getPassword3() {
        return this.password3;
    }

    getNames(array) {
        return array;
    }

    //Throttle sequence functions
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
        //const ids = [6, 3, 2, 0, 4, 1, 7, 5]; uncomment for set sequence every time
         const ids = Object.values(this.buttons).map(b => b.id); // grab the ids and put them in an array. b is each button object and b.id is the id property of that object
        
        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]]; // swap
        }

        this.sequence = ids;
        this.currentIndex = 0; // reset progress

        this.namesArray = this.sequence.map(id => {
        return Object.values(this.buttons).find(b => b.id === id).name;
        });

        console.log("Intended order:", this.namesArray);
    }

    getButtons() {
        return this.buttons;
    }

    getCoordinates() {
        return this.coordinates;
    }

    getSequence() {
        return this.sequence;
    }

    getNamesArray() {
        return this.namesArray;
    }

    // Object?
    //get(name) {}
}