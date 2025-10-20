function loadSounds(){
    AM.add("titleScreen", loadSound('assets/Is_Anybody_There.mp3'));

    // cryo chamber
    AM.add("creepyBackground", loadSound('assets/sounds/creepy-background.mp3'));

    // first room
    AM.add("buttonBeep", loadSound('assets/sounds/buttonPressBeep.mp3'));
    AM.add("successPinpad", loadSound('assets/sounds/successPinpad.mp3'));
    AM.add("failurePinpad", loadSound('assets/sounds/pinpadFailure.mp3'));

    AM.add("drawerOpen", loadSound('assets/sounds/drawerOpen.mp3'));
    AM.add("drawerClose", loadSound('assets/sounds/drawerClose.mp3'));
    AM.add("drawerLocked", loadSound('assets/sounds/drawerLocked.mp3'));
}

class AudioManager{

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
}
    
