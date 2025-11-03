class WorldManager {
    constructor() {
        this.rooms = [];   // array of ViewManager instances
        this.current = 0;  // index of active room
        this.previous = null; 
    }

    keyPressed() {
        if (window.activeInterface) return false; // Don't block when a modal is open - let the interface handle it
        const room = this.activeRoom;
        if (room && typeof room.keyPressed === 'function') {
            room.keyPressed();
            return true; // consume
        }
        return false; // Don't consume if no room handled it
    }

    addRoom(vm) {
        if (this.rooms.length === 0) {
            this.rooms.push(vm);
            R.add(vm);
            if (typeof vm.onEnter === 'function') vm.onEnter();
        } else {
            this.rooms.push(vm);
        }
        return vm;
    }

    get activeRoom() {
        return this.rooms[this.current];
    }

    get activeRoomIndex(){
        return this.current
    }

    gotoRoom(indexOrVm, viewIndex = 0) {
        const nextIndex = (typeof indexOrVm === 'number')
            ? indexOrVm
            : this.rooms.indexOf(indexOrVm);

        if (nextIndex < 0 || nextIndex >= this.rooms.length) return;
        this.previous = this.current; 

        const currentVm = this.rooms[this.current];
        R.remove(currentVm);
        if (typeof currentVm.onExit === 'function') currentVm.onExit();

        let oldIndex = this.current;
        this.current = nextIndex;

        const nextVm = this.rooms[this.current];
        R.add(nextVm);
        if (typeof nextVm.onEnter === 'function') nextVm.onEnter();

        // land on a specific view within that room
        if (typeof viewIndex === 'number' && typeof nextVm.gotoIndex === 'function') {
            nextVm.gotoIndex(viewIndex);
        }

        this.roomStartup(this.current, oldIndex);
    }

    /**
     * This is a function that is run whenever we switch rooms. It can be useful for coordinate sound playing and events in rooms
     * all in one place.
     * @param {Number} currentIndex index of room player just traveled to
     * @param {Number} oldIndex index of previous room
     */
    roomStartup(currentIndex, oldIndex){
        if(currentIndex == 5){ // entering botanical
            R.add(IM, 900)
            
            // cut off all music
            AM.stop("technoLoop");
            AM.stop("startGame");
            AM.stop("goodArrow2");

            if(!GS.is('BotanicalRoomVisited')){ // if never visited botanical
                // start emergency alarm
                AM.setVolume('contagionAlarm', 0.2)
                AM.loop('contagionAlarm')
                //setTimeout(()=>{AM.fadeOut('contagionAlarm', 3000)}, 5000)

                // AI message
                AI.addText('>_  AIRBORNE CONTAMINANTS DETECTED... \n>_  INITIALIZING EMERGENCY CONTAINMENT PROTOCOL \n>_  PROCEDURE: QUARANTINE BOTANICAL ROOM');

                // set game state that we already visited botanical room once
                GS.set('BotanicalRoomVisited')

                // set game state that we are currently in botanical quarantine (for locking doors)
                GS.set('BotanicalQuarantine')
            }
            
        }
        if(currentIndex != 5){ // leaving botanical botanical
            R.remove(IM)
        }
        if(currentIndex == 4){ // entering reactor
            AM.stop("goodArrow2");
        }
    }
}
