function random(min, max){
    return Math.random() * (max - min) + min;
}

export class StartScreenModel{

    constructor(){
        this.title = 'Is Anyone There?';
        this.instruction = 'Click anywhere to start music';
        this.musicStarted = false;

        //star field data
        this.stars = Array.from({length:200}, () => ({
        x: random(16),
        y: random(9),
        r:random(0.02, 0.06),
        a: random(120,255)
        }));

    //shooting star data
    this.shootingStar = { 
      fromX: 0, fromY: 0, 
      toX: 0, toY: 0, 
      step: 3 
    };
    }
//same logic as draw star field and draw shooting star
    update(dt) {

        for(const s of this.stars){
            s.a += random(-5, 5);
        }

        const ss = this.shootingStar;
        if(ss.step >= 2.5){
            ss.fromX = random(16);
            ss.fromY = random(4.5);
            ss.toX = random(ss.fromX + 0.5, 16);
            ss.toY = random(ss.fromY + 0.2, 4.5);
            ss.step = 0;
        }
        if(ss.step < 2.5){
            ss.step += 0.02;
        }
    }

//updates state when music starts
    startMusic(){
        this.musicStarted = true;
        this.instruction = 'Click Start to Begin';
    }
}