// password: henry 
// effect: cut to black, play audio, fade in image. if ESC pressed, restart the game

class HenryPasswordSequence {
  constructor() {
    this.phase = 'cutToBlack'; // 'cutToBlack', 'playingAudio', 'fadeInImage', 'showingImage'
    this.fadeValue = 255; // For black screen fade out
    this.imageFadeValue = 0; // For image fade in
    this.audio = henryAudio; // Use preloaded asset
    this.image = henryImage; // Use preloaded asset
    this.startTime = 0;
    this.audioStarted = false;
    
    // Mark interface as active to prevent normal game interaction
    window.activeInterface = 'HenrySequence';
    
    this.startTime = Date.now();
  }
  
  draw() {
    const u = VM.u();
    const v = VM.v();
    
    // Fill the entire screen
    push();
    
    if (this.phase === 'cutToBlack') {
      // Immediate cut to black
      background(0);
      
      // After a brief moment, start audio
      if (Date.now() - this.startTime > 500 && !this.audioStarted) {
        this.startAudio();
      }
      
    } else if (this.phase === 'playingAudio' || this.phase === 'fadeInImage') {
      // Keep black background during audio
      background(0);
      
      // Start fading in the image after audio has been playing for a bit
      if (this.phase === 'fadeInImage' && this.image) {
        tint(255, this.imageFadeValue);
        
        // Center the image on screen, scale to fit
        const aspectRatio = this.image.width / this.image.height;
        let imgWidth, imgHeight;
        
        if (aspectRatio > 16/9) {
          // Image is wider than screen ratio
          imgWidth = 16 * u;
          imgHeight = (16 * u) / aspectRatio;
        } else {
          // Image is taller than screen ratio
          imgHeight = 9 * v;
          imgWidth = (9 * v) * aspectRatio;
        }
        
        const imgX = (16 * u - imgWidth) / 2;
        const imgY = (9 * v - imgHeight) / 2;
        
        image(this.image, imgX, imgY, imgWidth, imgHeight);
        noTint();
        
        // Gradually increase image opacity
        this.imageFadeValue = min(255, this.imageFadeValue + 3);
        
        if (this.imageFadeValue >= 255) {
          this.phase = 'showingImage';
        }
      }
      
    } else if (this.phase === 'showingImage') {
      // Show the image at full opacity
      background(0);
      
      if (this.image) {
        const aspectRatio = this.image.width / this.image.height;
        let imgWidth, imgHeight;
        
        if (aspectRatio > 16/9) {
          imgWidth = 16 * u;
          imgHeight = (16 * u) / aspectRatio;
        } else {
          imgHeight = 9 * v;
          imgWidth = (9 * v) * aspectRatio;
        }
        
        const imgX = (16 * u - imgWidth) / 2;
        const imgY = (9 * v - imgHeight) / 2;
        
        image(this.image, imgX, imgY, imgWidth, imgHeight);

      }
      
      // Show ESC instruction
      fill(255);
      textAlign(CENTER, BOTTOM);
      textFont(terminusFont);
      textSize(0.3 * v);
      text("Press ESC to restart the game", 8 * u, 8.5 * v);
    }
    
    pop();
  }
  
  startAudio() {
    if (this.audio && !this.audioStarted && this.audio.isLoaded()) {
      this.audio.play();
      this.audioStarted = true;
      // Start fading in image immediately when audio starts
      this.phase = 'fadeInImage';
      
    } else if (!this.audioStarted) {
      // If audio isn't loaded or fails, still proceed to image after delay
      console.warn('Henry audio not loaded, proceeding without audio');
      this.phase = 'fadeInImage';
      this.audioStarted = true; // Prevent repeated attempts
    }
  }
  
  update(dt) {
    // Handle phase transitions and timing, TBD
  }
  
  keyPressed() {
    if (keyCode === ESCAPE || key === 'Escape') {
      this.restartGame();
    }
  }
  
  restartGame() {
    // Stop audio if playing
    if (this.audio && this.audio.isPlaying()) {
      this.audio.stop();
    }
    
    // Clear active interface
    window.activeInterface = null;
    
    // Remove this sequence from renderer
    R.remove(this);
    
    // Restart the game by reloading the page
    // This is the simplest way to ensure a clean restart
    location.reload();
  }
  
  // Clean up when removed
  onRemove() {
    if (this.audio && this.audio.isPlaying()) {
      this.audio.stop();
    }
    window.activeInterface = null;
  }
}

// Password checking function that can be called from Terminal
function checkPassword(input) {
  if (input.startsWith('*') && input.slice(1).toLowerCase() === 'henry') {
    // Trigger henry sequence
    const henrySequence = new HenryPasswordSequence();
    R.add(henrySequence, 100); // High z-index to render on top of everything
    return true;
  }
  return false;
}