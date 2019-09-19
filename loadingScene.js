var globalScore = "000000";

class LoadingScene extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload() {
    //Load Images
    this.load.image("background", "assets/images/background.png");
    this.load.image("wave_cleared", "assets/images/AllClearScanlinesLarge.png");
    this.load.image("asteroids_incoming", "assets/images/WarningScanlinesLarge.png");
    this.load.image("player", "assets/images/SpaceShip.png");
    this.load.image("left_normal", "assets/images/LeftArrowUnpressed.png");
    this.load.image("left_pressed", "assets/images/LeftArrowPressed.png");
    this.load.image("right_normal", "assets/images/RightArrowUnpressed.png");
    this.load.image("right_pressed", "assets/images/RightArrowPressed.png");
    this.load.image("fire_normal", "assets/images/FireUnpressed.png");
    this.load.image("fire_pressed", "assets/images/FirePressed.png");
    this.load.image("frame", "assets/images/Cockpit.png");

    //Load spritesheets
    //this.load.spritesheet("beam", "assets/spritesheets/beam.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('asteroid_big_1', 'assets/images/asteroid1.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('asteroid_big_2', 'assets/images/asteroid2.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('asteroid_big_3', 'assets/images/asteroid3.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('asteroid_medium_1', 'assets/images/asteroid4.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('asteroid_medium_2', 'assets/images/asteroid5.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('asteroid_small', 'assets/images/asteroid6.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('explosion', 'assets/spritesheets/explosion.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('smoke', 'assets/spritesheets/recoil_smoke.png', {frameWidth: 128, frameHeight: 128});

    //Load Title
    this.load.image("title", "assets/images/title2.png");
    this.load.image("beam", "assets/images/beam.png");

    //Load Font
    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

    //Load Audio
    this.load.audio('shootAudio', 'assets/MissileFire.wav');
    this.load.audio('explodeAudio', 'assets/AsteroidExplode.wav');
    this.load.audio('bgm', 'assets/BackgroundMusic.wav');
    this.load.audio('waveClear', 'assets/sounds/AllClear.wav');
    this.load.audio('waveStart', 'assets/sounds/IncomingAsteroids.mp3');
    this.load.audio('playerExplosion', 'assets/sounds/explosion.mp3');
  }

  create() {

    //Loading Background TileSprite
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    this.frame = this.add.image(0, 0, "frame");
    this.frame.setOrigin(0, 0);
    this.frame.setDepth(10000);

    this.leftBtnNormal = this.add.image(1140, 985, "left_normal");
    this.leftBtnNormal.setDepth(10001);
    this.rightBtnNormal = this.add.image(1240, 985, "right_normal");
    this.rightBtnNormal.setDepth(10001);
    this.fireBtnNormal = this.add.image(765, 985, "fire_normal");
    this.fireBtnNormal.setDepth(10001);
    
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
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0, //Run only once
      hideOnComplete: true //Disappear once done
    });

    this.anims.create({
      key: "smoke",
      frames: this.anims.generateFrameNumbers("smoke"),
      frameRate: 20,
      repeat: 0, //Run only once
      hideOnComplete: true //Disappear once done
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
