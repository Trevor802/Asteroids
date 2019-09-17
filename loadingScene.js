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
    this.load.image("player", "assets/Images/SpaceShip.png");

    //Load spritesheets
    //this.load.spritesheet("beam", "assets/spritesheets/beam.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('asteroid_big', 'assets/spritesheets/MoonAsteroid_01.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('asteroid_medium', 'assets/spritesheets/MoonAsteroid_02.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('asteroid_small', 'assets/spritesheets/MoonAsteroid_03.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('explosion', 'assets/spritesheets/explosion.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('smoke', 'assets/spritesheets/recoil_smoke.png', {frameWidth: 64, frameHeight: 64});

    //Load Title
    this.load.image("title", "assets/images/title2.png");
    this.load.image("beam", "assets/images/beam.png");

    //Load Font
    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

    //Load Audio
    this.load.audio('shootAudio', 'assets/MissileFire.wav');
    this.load.audio('explodeAudio', 'assets/AsteroidExplode.wav');
    this.load.audio('bgm', 'assets/BackgroundMusic.m4a');
    this.load.audio('waveClear', 'assets/Sounds/AllClear.wav');
    this.load.audio('waveStart', 'assets/Sounds/IncomingAsteroids.mp3');
    this.load.audio('playerExplosion', 'assets/sounds/explosion.mp3');
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
