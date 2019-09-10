class GameScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    //Background
    //this.background = this.add.image(0, 0, "background");
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    //Sounds
    this.shootAudio = this.sound.add('shootAudio');
    this.explodeAudio = this.sound.add('explodeAudio');
    this.backgroundMusic = this.sound.add('bgm');
    this.backgroundMusic.play({loop: true, volume: 10, rate: 1});

    //Creating PLayers
    this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
    this.player.play("thrust");

    //Ship Controls
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    //game.world.setBounds(0, 0, config.width, config.height);
    //this.player.setCollideWorldBounds(true);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //Group for Beams
    this.projectiles = this.add.group();

    //Asteroids
    this.asteroidSpawnNum = 4; // The number of asteroids to spawn next wave, initially 4
    this.asteroids = this.physics.add.group({ classType: Asteroid, runChildUpdate: true }); // The group of asteroids

    //Collision Asteroid and Enemy
    this.physics.add.overlap(this.projectiles, this.asteroids, this.hitAsteroid, null, this);

    //Collision Asteroid and Player
    this.physics.add.overlap(this.player, this.asteroids, this.hurtPlayer, null, this);

    //SCORE
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE 0", 16);
    this.score = 0;
  }

  update(time, delta) {
    //Updating Background Position
    this.background.tilePositionY -= 0.2;

    //On press, call movePlayerManager || On release set the velocities to 0
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    this.movePlayerManager();
    this.physics.world.wrap(this.player, 32);
    //Phaser.Math.wrap(this.player.x, 0, config.width);

    //Shoot Beams
    if(Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if(this.player.active) {
        this.shootAudio.play();
        this.projectiles.add(new Beam(this));
      }
    }

    //Deleting the beam objects
    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }

    // Move all the asteroids
    this.asteroids.getChildren().forEach(function (asteroid) {
        asteroid.move(delta);
    });

    // Begin the next wave if all asteroids are gone
    if (this.asteroids.countActive(true) == 0) {
        // Clear out inactive asteroids, remove them from the scene and destroy them
        this.asteroids.clear(true, true);
        //index = 0;

        // Spawn new asteroids
        for (i = 0; i < this.asteroidSpawnNum; i++) {
            this.asteroids.add(new Asteroid(this, -1, -1, sizes.LARGE), true);
        }

        // Make next wave spawn 2 more asteroids than this one (this is what it looked like Asteroids was doing)
        this.asteroidSpawnNum += 2;
    }
  }

  movePlayerManager() {
    if(this.cursorKeys.left.isDown) {
      this.player.angle -= gameSettings.rotationSpeed % 360;
    } else if (this.cursorKeys.right.isDown) {
      this.player.angle += gameSettings.rotationSpeed % 360;
    }

    if(this.cursorKeys.up.isDown) {
      this.player.x += gameSettings.playerAccleration * Math.sin(this.player.angle * Math.PI/180);
      this.player.y -= gameSettings.playerAccleration * Math.cos(this.player.angle * Math.PI/180);
    }
  }

  hitAsteroid(projectile, asteroid) {
    if (!asteroid.active)
      return;
    //var explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    //this.resetAsteroid(asteroid);
    //asteroid.disableBody(true, true);
    asteroid.demolish({scene: this}, this.asteroids)

    //this.score += 15;
    //this.scoreLabel.text = "SCORE " + this.score;
    //var scoreFormatted = this.zeroPad(this.score, 6);
    //this.scoreLabel.text = "SCORE " + scoreFormatted;

    //this.explosionSound.play();
  }

  hurtPlayer(player, asteroid) {
    if (!asteroid.active)
      return;

    this.scene.restart("playGame");
  }
}
