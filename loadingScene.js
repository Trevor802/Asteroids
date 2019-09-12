var globalScore = 0;

class LoadingScene extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload() {
    //Load Images
    this.load.image("background", "assets/images/background.png");
    this.load.spritesheet("player", "assets/spritesheets/player.png", {frameWidth: 16, frameHeight: 24});
    this.load.spritesheet("beam", "assets/spritesheets/beam.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('asteroid_big', 'assets/spritesheets/Asteroid_01_Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('asteroid_medium', 'assets/spritesheets/Asteroid_02_Sheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('asteroid_small', 'assets/spritesheets/Asteroid_03_Sheet.png', { frameWidth: 16, frameHeight: 16 });

    //Load Title
    this.load.image("title", "assets/images/title2.png");

    //Load Font
    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

    //Load Audio
    this.load.audio('shootAudio', 'assets/MissileFire.wav');
    this.load.audio('explodeAudio', 'assets/AsteroidExplode.wav');
    this.load.audio('bgm', 'assets/BackgroundMusic.m4a');
  }

  create() {
    //Loading Background TileSprite
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    //Loading Background Music
    this.backgroundMusic = this.sound.add('bgm');
    this.backgroundMusic.play({loop: true, volume: 1, rate: 1});

    this.title = this.add.image(config.width/2, config.height/2, "title");
    this.title.setScale(0.8);
    this.startScreenLabel = this.add.bitmapText(config.width/2 - 240, config.height/2 + 100 , "pixelFont", "PRESS ENTER TO START", 64);
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    //Create Animations
    this.anims.create({
      key: "thrust",
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "beam_anim",
      frames: this.anims.generateFrameNumbers("beam"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
        key: "ast_big_anim",
        frames: this.anims.generateFrameNumbers("asteroid_big"),
        frameRate: 3,
        repeat: -1
    });

    this.anims.create({
        key: "ast_med_anim",
        frames: this.anims.generateFrameNumbers("asteroid_medium"),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: "ast_small_anim",
        frames: this.anims.generateFrameNumbers("asteroid_small"),
        frameRate: 12,
        repeat: -1
    });
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
