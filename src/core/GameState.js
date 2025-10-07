/*
GameState is a Set that can hold anything, this file contains the basic 
Game State Strings  :   meaning
pin entered         :   Room 1 Veiw 1 pinpad had the correct password inputed
timeout             :   the timmer ran down to 0:00
*/

class GameState {
    constructor() {
        this.states = new Set(); // simple states
        this.checks = new Map(); // array for functions
    }
    // void, adds
    set(str) {
        this.states.add(str);
        //this.update();
    }
    // bool, only on string in set
    is(str) {
        if(str in this.states) {
            return true;
        }
        return false;
    }
    // add a check function to the list of ran functions
    checkFor(name, func = () => {}) {
        this.checks.set(name, func);
    }
    // update automatic checkers like end states
    update() {
        for(const [name,f] of this.checks) {
            if(f()) {
                this.set(name);
            }
        }
    }
    // Object?
    //get(name) {}
}