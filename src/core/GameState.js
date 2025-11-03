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
- "regulateOxygenPuzzleSolved" - denotes when oxygen puzzle has been solved in Life Support
- "regulateTempPuzzleSolved" - denotes when the temperature puzzle has been solved in Life Support
- "Ended" - checkfor value thatis set when an end condition for the game is met
            right now that is "Game Complete", "Timer Up", and "Player Died"
- "reactorStartupInitialized" - Reactor Sequence has begun; start timer
- "reactorStartupComplete" - completed reactor startup puzzle
- "restartReactorComplete" - complted restart reactor puzzle
- "operationRodComplete" - completed reactor rod puzzle
- "reactorStabilized" - stabilized reactor (aka all puzzles done in order) - used to preven timer from popping up again when you enter reactor
*/

class GameState {
    constructor() {
        this.states = new Set(); // simple states, string set
        this.checks = new Map(); // array for functions
        this.deaths = 0          // count for deaths 

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

    incrimentDeaths(){
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

    // Object?
    //get(name) {}
}