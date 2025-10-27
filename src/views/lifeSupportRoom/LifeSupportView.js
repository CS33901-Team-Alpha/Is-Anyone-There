/**
* Light Items
*/
class IndicatorLight {
  constructor(x, y, scale, lightImg, offImg, lightCond = " ", onClick = () => {}) {
    this.x = x;
    this.y = y;
    this.scale = scale;

    // Light Image
    this.lightImg = lightImg;
    this.offImg = offImg;
    this.lightCond = lightCond;
    this.show = false;
    if(this.show) {
      this.lightSprite = SM.get(this.lightImg);
    }
    else {
      this.lightSprite = SM.get(this.offImg);
    }
    this.lightSprite.setPos(this.x, this.y);
    this.lightSprite.setScale(this.scale);

    this.onClick = onClick;
  }

  update(dt) {
    this.show = GS.is(this.lightCond);
    if(this.show) {
      R.remove(this.lightSprite);
      this.lightSprite = SM.get(this.lightImg);
      this.lightSprite.setPos(this.x, this.y);
      this.lightSprite.setScale(this.scale);
      R.add(this.lightSprite, 10);
    }
    else {
      R.remove(this.lightSprite);
      this.lightSprite = SM.get(this.offImg);
      this.lightSprite.setPos(this.x, this.y);
      this.lightSprite.setScale(this.scale);
      R.add(this.lightSprite, 10);
    }
  }

  onEnter() {
    R.add(this.lightSprite, 10);
  }
  onExit() {
    R.remove(this.lightSprite);
  }
}

class SystemSign {
  constructor(x, y, scale, signImg, onClick = () => {}) {
    this.x = x;
    this.y = y;
    this.scale = scale;

    // Light Image
    this.signSprite = SM.get(signImg);
    this.signSprite.setPos(this.x, this.y);
    this.signSprite.setScale(this.scale);

    this.onClick = onClick;
  }

  update(dt) {
    
  }

  onEnter() {
    R.add(this.signSprite, 10);
  }
  onExit() {
    R.remove(this.signSprite);
  }
}

class LifeSupportView extends View {
  constructor() {
    super();

    this.background = SM.get("westWallSupport");
    this.background.setSize(16, 9);

    this.signSprite1 = new SystemSign(0.1, 3, 0.4, 'ElectricalSign');
    this.leftSprite1 = new IndicatorLight(3.9, 3.8,0.2, 'GreenLight1', 'OffLight1', 'fixedElectricalComponent');
    this.rightSprite1 = new IndicatorLight(5.4, 3.8,0.2, 'OffLight2', 'RedLight1', 'fixedElectricalComponent');
    this.signSprite2 = new SystemSign(7.6, 3, 0.4, 'OxygenSign');
    this.leftSprite2 = new IndicatorLight(11.5, 3.8, 0.2, 'GreenLight2', 'OffLight3', 'regulateOxygenPuzzleSolved');
    this.rightSprite2 = new IndicatorLight(13.25, 3.8, 0.2, 'OffLight4', 'RedLight2', 'regulateOxygenPuzzleSolved');
    this.signSprite3 = new SystemSign(3, 5.5, 0.4, 'TemperatureSign');
    this.leftSprite3 = new IndicatorLight(7.2, 6.3, 0.2, 'GreenLight3', 'OffLight5', 'regulateTempPuzzleSolved');
    this.rightSprite3 = new IndicatorLight(9, 6.3, 0.2, 'OffLight6', 'RedLight3', 'regulateTempPuzzleSolved');
  }

  draw() {
    this.background?.draw();

    push();
    fill("white");
    textSize(0.7 * VM.U);
    textAlign(CENTER, CENTER);
    text("Life Support Status", 8 * VM.U, 1 * VM.V);

    pop();
  }

  update(dt) {
    this.signSprite1.update(dt);
    this.signSprite2.update(dt);
    this.signSprite3.update(dt);
    this.leftSprite1.update(dt);
    this.leftSprite2.update(dt);
    this.leftSprite3.update(dt);
    this.rightSprite1.update(dt);
    this.rightSprite2.update(dt);
    this.rightSprite3.update(dt);
  }

  onEnter() {
    R.add(this.background);

    this.signSprite1.onEnter();
    this.signSprite2.onEnter();
    this.signSprite3.onEnter();
    this.leftSprite1.onEnter();
    this.leftSprite2.onEnter();
    this.leftSprite3.onEnter();
    this.rightSprite1.onEnter();
    this.rightSprite2.onEnter();
    this.rightSprite3.onEnter();
  }

  onExit() {
    R.remove(this.background);

    this.signSprite1.onExit();
    this.signSprite2.onExit();
    this.signSprite3.onExit();
    this.leftSprite1.onExit();
    this.leftSprite2.onExit();
    this.leftSprite3.onExit();
    this.rightSprite1.onExit();
    this.rightSprite2.onExit();
    this.rightSprite3.onExit();
  }
}