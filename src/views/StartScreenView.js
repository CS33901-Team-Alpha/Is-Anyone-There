//importing the classes that this file depends on
import { View } from './ViewManager.js';
import { VM } from './VM.js';
import { StartScreenModel } from './StartScreenModel.js';

export class StartScreenView extends View{
    constructor(onStart){
        super(0,0,0, '');

        this.model = new StartScreenModel(); //create model

    this.onStart = onStart;
    // Button in 16:9 units (centered horizontally)
    this.btnW = 2.8;
    this.btnH = 0.9;
    this.btnX = 8 - this.btnW / 2;
    this.btnY = 5.8;
    }


  update(dt){
    this.model.update(dt);
  }
  
  draw(){
    background(0, 20, 80, 25);

    const u = VM.u();
    const v = VM.v();
        
    //pass model states to draws
    this.drawStarField(this.model.stars);
    this.drawShootingStar(this.model.shootingStar);
    this.drawButton();

    //now draws based on model state
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(gameFont);

    textSize(0.8 * v);
    text(this.title, 8 * u, 3.7 * v);

    textSize(0.3 * v);
    text(this.instruction, 8 * u, 4.6 * v);

  }
  
  mousePressed(p){
    const hit =
        p.x >= this.btnX &&
        p.x <= this.btnX + this.btnW &&
        p.y >= this.btnY &&
        p.y <= this.btnY + this.btnH;        
        
    if (hit && this.onStart) {
        this.onStart();
    } else if (!hit && !this.musicStarted) {
        this.model.startMusic();

        if(startScreenMusic && !startScreenMusic.isPlaying()){
            startScreenMusic.setLoop(true);
            startScreenMusic.play();
        }

    }
  }        
  drawStarField(stars){
    const u = VM.u();
    const v = VM.v();

    for (const s of stars) {
        stroke(255, s.a);
        strokeWeight(s.r * u);
        point(s.x * u, s.y * v);
    }
  }

  drawShootingStar(ss){
    const u = VM.u();
    const v = VM.v();

    if(ss.step < 2.5){
        const n = ss.step + 0.02;
        
        stroke(0, 20, 80, 30);
        strokeWeight(0.03 * u);
        line(ss.fromX * u, ss.fromY * v, ss.toX * u, ss.toY * v);
    }
    if(ss.step < 1){
        stroke(255, (1 - this.step) * 200);
        strokeWeight(0.02 * u);

        const ax = lerp(ss.fromX, ss.toX, this.step);
        const ay = lerp(ss.fromY, ss.toY, this.step);
        const bx = lerp(ss.fromX, ss.toX, n);
        const by = lerp(ss.fromY, ss.toY, n);

        line(ax * u, ay * v, bx * u, by * v);
    }
  }
  

  drawButton(){
    const u = VM.u();
    const v = VM.v();

    const m = VM.mouse();
    const hover =
      m.x >= this.btnX &&
      m.x <= this.btnX + this.btnW &&
      m.y >= this.btnY &&
      m.y <= this.btnY + this.btnH;

    if (hover) {
      fill(100, 150, 255, 200);
      stroke(150, 200, 255, 150);
      strokeWeight(0.08 * u);
    } else {
      fill(50, 100, 200, 200);
      noStroke();
    }

    rect(this.btnX * u, this.btnY * v, this.btnW * u, this.btnH * v, 0.5 * u);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(gameFont);
    textSize(0.25 * v);
    const cx = (this.btnX + this.btnW / 2) * u;
    const cy = (this.btnY + this.btnH / 2) * v;
    text('Start!', Math.round(cx), Math.round(cy));
  }
}