class LoadingScene extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload() {
    //Load Images
    this.load.image("background", "assets/images/background.png");
    this.load.spritesheet("player", "assets/spritesheets/player.png", {frameWidth: 16, frameHeight: 24});
    this.load.spritesheet("beam", "assets/spritesheets/beam.png", {frameWidth: 16, frameHeight: 16});
    this.load.image('asteroid', 'assets/images/Asteroid.png');

    this.load.audio('shootAudio', 'assets/MissileFire.wav');
    this.load.audio('explodeAudio', 'assets/AsteroidExplode.wav');
    this.load.audio('bgm', 'assets/BackgroundMusic.m4a');

    //Load Font
    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

    //Load Audio
  }

  create() {
    this.scene.start("playGame");

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
  }
}
