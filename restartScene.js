class RestartScene extends Phaser.Scene {
  constructor() {
    super("restartGame");
  }

  create() {
    //Loading Background TileSprite
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    this.frame = this.add.image(0, 0, "frame");
    this.frame.setOrigin(0, 0);
    this.frame.setDepth(10000);

    this.leftBtnNormal = this.add.image(650, 985, "left_normal");
    this.leftBtnNormal.setDepth(10001);
    this.rightBtnNormal = this.add.image(750, 985, "right_normal");
    this.rightBtnNormal.setDepth(10001);
    this.fireBtnNormal = this.add.image(1150, 985, "fire_normal");
    this.fireBtnNormal.setDepth(10001);

    this.scoreTextLabel = this.add.bitmapText(config.width/2 - 240, config.height/2 - 150, "pixelFont", "YOUR SCORE IS " + globalScore, 64);
    this.title = this.add.image(config.width/2, config.height/2, "title");
    this.title.setScale(0.8);
    this.startScreenLabel = this.add.bitmapText(config.width/2 - 240, config.height/2 + 100 , "pixelFont", "PRESS ENTER TO START", 64);
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    //Updating Background Position
    this.background.tilePositionY -= 0.2;

    if(Phaser.Input.Keyboard.JustDown(this.enter)) {
      this.startGame();
    }
  }

  startGame() {
    this.scene.start("playGame");
  }
}
