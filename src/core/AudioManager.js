let soundPaths = {};
let loadedSounds = {};

function preload() { 
    gameFont = loadFont('assets/font/PressStart2P-Regular.ttf')
    menuMusic = loadSound("assets/Is_Anybody_There.mp3")

    //registerSound('menu', 'assets/Is_Anybody_There.mp3')

    //loadRegisteredSounds()
}

//Old Attempted Code attempting to preload through functions
/*
function registerSound(name, path) {
  soundPaths[name] = path;
}


function loadRegisteredSounds() {
  for (let name in soundPaths) {
    loadedSounds[name] = loadSound(soundPaths[name]);
  }
}


function getSound(name) {
  return loadedSounds[name];
}
  */
