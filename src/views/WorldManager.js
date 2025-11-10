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
            IM.renderAllItems()
            
            // cut off all music
            AM.stop("technoLoop");
            AM.stop("startGame");
            AM.stop("goodArrow2");
            AM.stop("reactorLoop");

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

                // start contagion timer
                secondaryTimer = new ScreenTimer(() => { }, {time: 45000, timerName: 'contagion'})
                R.add(secondaryTimer, 1000)

                R.add(new AlarmOverlay(() => GS.is('BotanicalQuarantine')), 100);
            }
            
        }
        if(currentIndex != 5){ // leaving botanical botanical
            IM.cleanup()
        }
        if(currentIndex == 6){ // entering map room
            AM.stopAll();
            AM.play("mapLoop");
            AM.stop("goodArrow2");
        }
        if(currentIndex == 4){ // entering reactors
            AM.stopAll();
            AM.play("reactorLoop");
            AM.stop("goodArrow2");
        }
        if(currentIndex == 3){ // entering life support
            AM.stopAll();
            AM.play("lifeSupportLoop");
            AM.stop("goodArrow2");
        }
        if(currentIndex == 2){ // entering cryo rooms
            AM.stopAll();
            AM.play("cryoLoop");
            AM.stop("goodArrow2");
        }
        if(currentIndex == 1){ // entering breaker rooms
            AM.stopAll();
            AM.play("technoLoop");
            AM.stop("goodArrow2");
        }
        if(currentIndex == 0){ // entering beginning room
            AM.stopAll();
            AM.play("startGame");
            AM.stop("goodArrow2");

            if(!GS.is('reactorStabilized')){
                secondaryTimer = new ScreenTimer(() => { }, {time: 90000, timerName: 'reactor'})
                R.add(secondaryTimer, 1000)
            }
        }
    }
}
