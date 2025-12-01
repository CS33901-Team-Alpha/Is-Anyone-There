class AudioManager{
    loadSounds(){
        // use this.add so the sounds are stored on this instance
        this.add("titleScreen", loadSound('assets/Is_Anybody_There.mp3'));
        // cryo chamber
        this.add("creepyBackground", loadSound('assets/sounds/creepy-background.mp3'));
        // first room
        this.add("buttonBeep", loadSound('assets/sounds/buttonPressBeep.mp3'));
        this.add("successPinpad", loadSound('assets/sounds/successPinpad.mp3'));
        this.add("failurePinpad", loadSound('assets/sounds/pinpadFailure.mp3'));

        this.add("drawerOpen", loadSound('assets/sounds/drawerOpen.mp3'));
        this.add("drawerClose", loadSound('assets/sounds/drawerClose.mp3'));
        this.add("drawerLocked", loadSound('assets/sounds/drawerLocked.mp3'));
        this.add("door-lock", loadSound('assets/sounds/door-lock.mp3'));
        this.add("doorOpen", loadSound('assets/sounds/doorOpen.mp3'));
        this.add("technoLoop", loadSound('assets/sounds/technoLoop.mp3'));
        this.add("startGame", loadSound('assets/sounds/startGame.mp3'));
        this.add("cryoLoop", loadSound('assets/sounds/cryoLoop.mp3'));
        // sounds added recently
        this.add("doorLock", loadSound('assets/sounds/doorLock.mp3'));
        this.add("lockBreak", loadSound('assets/sounds/lockBreak.mp3'));
        this.add("wireConnect", loadSound('assets/sounds/wireConnect.mp3'));
        this.add("allWires", loadSound('assets/sounds/allWires.mp3'));
        this.add("componentGood", loadSound('assets/sounds/componentGood.mp3'));
        this.add("componentBad", loadSound('assets/sounds/componentBad.mp3'));
        this.add("electricDeath", loadSound('assets/sounds/electricDeath.mp3'));
        this.add("fixElectronic", loadSound('assets/sounds/fixElectronic.mp3'));
        this.add("reactorZap", loadSound('assets/sounds/reactorZap.mp3'));
        this.add("reactorExplosion", loadSound('assets/sounds/reactorExplosion.mp3'));
        this.add("checkpoint", loadSound('assets/sounds/checkpoint.mp3'));
        this.add("reactorFix", loadSound('assets/sounds/reactorFix.mp3'));
        this.add("goodArrow", loadSound('assets/sounds/goodArrow.mp3'));
        this.add("goodArrow2", loadSound('assets/sounds/goodArrow2.mp3'));
        this.add("badArrow", loadSound('assets/sounds/badArrow.mp3'));
        this.add("reactorRestart", loadSound('assets/sounds/reactorRestart.mp3'));


        // botanical room
        this.add("contagionAlarm", loadSound('assets/sounds/contagionAlarm.mp3'));
    }
    constructor() {
        this.sounds = new Map();
        this.pausedSounds = new Set;
    }

    //adds sound to the map
    add(name, sound) {
        this.sounds.set(name, sound);
    }

    //allows you to access the sound
    get(name) {
        return this.sounds.get(name);
    }

    //plays the sound (doesn't loop)
    play(name) {
        const sound = this.get(name);
        if (sound && !sound.isPlaying()) {
            sound.play();
        }
    }

    //stops the sound
    stop(name) {
        const sound = this.get(name);
        if (sound && sound.isPlaying()) {
            sound.stop();
        }
    }

    //loops the sound
    loop(name) {
        const sound = this.get(name);
        if (sound && !sound.isLooping()) {
            sound.loop();
        }
    }

    //pauses the sound
    pause(name) {
        const sound = this.get(name);
        if (sound && sound.isPlaying()) {
            sound.pause();
        }
    }

    //allows you to set the volume of the sound (used for fading in and out, 1.0 is normal sound)
    setVolume(name, volume) {
        const sound = this.get(name);
        if (sound) {
            sound.setVolume(volume);
        }
    }

    //lets you fade in the sound, time is in miliseconds (1000 = 1 second)
    fadeIn(name, duration = 1000, targetVolume = 1.0) {
        const sound = this.get(name);
        if (sound) {
            if (!sound.isPlaying()) {
                sound.setVolume(0);
                sound.loop();
            }
            sound.setVolume(0, 0); 
            sound.setVolume(targetVolume, duration / 1000);
        }
    }

    //fades out the sound
    fadeOut(name, duration = 1000) {
        const sound = this.get(name);
        if (sound && sound.isPlaying()) {
            const currentVolume = sound.getVolume();
            sound.setVolume(currentVolume, 0);
            sound.setVolume(0, duration / 1000);

            //Stops the sound after fade
            setTimeout(() => {
                sound.stop();
            }, duration);
        }
    }

    //pauses all sounds that were playing
    pauseAll() {
        this.pausedSounds.clear(); // Clear previous state
        for (let [name, sound] of this.sounds.entries()) {
            if (sound.isPlaying()) {
                sound.pause();
                this.pausedSounds.add(name);
            }
        }
    }

    //resumes all sounds that were playing
    resumeAll() {
        for (let name of this.pausedSounds) {
            const sound = this.get(name);
            if (sound && !sound.isPlaying()) {
                sound.play();
            }
        }
        this.pausedSounds.clear(); // Clear after resuming
    }

    stopAll() {
        for (let [name, sound] of this.sounds.entries()) {
            if (sound.isPlaying()) {
                sound.stop();
            }
        }
    }

    isPlaying(name) {
        const sound = this.get(name);
        return sound ? sound.isPlaying() : false;
    }

    isLooping(name) {
        const sound = this.get(name);
        return sound ? sound.isLooping() : false;
    }
}

// export class so callers can instantiate
export { AudioManager };

