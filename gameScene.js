class GameScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    //Background
    //this.background = this.add.image(0, 0, "background");
    this.currentVelocity = new Phaser.Math.Vector2(0, 0);
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    //Sounds
    this.shootAudio = this.sound.add('shootAudio');
    this.explodeAudio = this.sound.add('explodeAudio');

    //Creating PLayers
    this.player = this.physics.add.sprite(config.width / 2, config.height/2, "player");
    this.player.play("thrust");

    //Ship Controls
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    //game.world.setBounds(0, 0, config.width, config.height);
    //this.player.setCollideWorldBounds(true);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //Group for Beams
    this.projectiles = this.add.group();

    //Asteroids
    this.asteroidSpawnNum = gameSettings.initialAsteroids; // The number of asteroids to spawn next wave, initial amount set here
    this.asteroids = this.physics.add.group({ classType: Asteroid, runChildUpdate: true }); // The group of asteroids

    //Collision Asteroid and Enemy
    this.physics.add.overlap(this.projectiles, this.asteroids, this.hitAsteroid, null, this);

    //Collision Asteroid and Player
    this.physics.add.overlap(this.player, this.asteroids, this.hurtPlayer, null, this);

    //SCORE
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE 000000", 32);
    this.score = 0;

    //Lives
    this.livesLabel = this.add.bitmapText(config.width - 100, 5, "pixelFont", "LIVES  3", 32);
    this.lives = 3;

    this.waveResetTime = 0;
  }

  update(time, delta) {
    //Updating Background Position
    this.background.tilePositionY -= 0.2;

    //On press, call movePlayerManager || On release set the velocities to 0
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    this.movePlayerManager(delta);
    this.physics.world.wrap(this.player, 0);
    this.physics.world.wrapArray(this.projectiles.getChildren(), 0);

    //Phaser.Math.wrap(this.player.x, 0, config.width);

    //Shoot Beams
    if(Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if(this.player.alpha < 1) {
        return;
      }
      this.shoot();
    }

    //Deleting the beam objects
    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update(delta);
    }

    // Move all the asteroids
    for (var i = 0; i < this.asteroids.getChildren().length; i++) {
        this.asteroids.getChildren()[i].move(delta, { scene: this });
    }

    // Begin the next wave if all asteroids are gone
    if (this.asteroids.countActive(true) == 0) {
        if (this.waveResetTime > 0) {
            this.waveResetTime -= delta;
            return;
        }

        this.waveResetTime = gameSettings.spawnDelay;

        // Clear out inactive asteroids, remove them from the scene and destroy them
        this.asteroids.clear(true, true);

        // Spawn new asteroids
        for (i = 0; i < this.asteroidSpawnNum; i++) {
            this.asteroids.add(new Asteroid(this, -1, -1, sizes.LARGE), true);
        }

        // Make next wave spawn more asteroids than this one
        this.asteroidSpawnNum += gameSettings.asteroidWaveIncrease;
    }
  }

  movePlayerManager(delta) {
    if(this.cursorKeys.left.isDown) {
      this.player.angle -= gameSettings.rotationSpeed % 360;
    } else if (this.cursorKeys.right.isDown) {
      this.player.angle += gameSettings.rotationSpeed % 360;
    }

    // Accelerate when the up key is held
    if(this.cursorKeys.up.isDown) {
      this.currentVelocity.x += gameSettings.playerAcceleration * Math.sin(this.player.angle * Math.PI/180) * delta;
      this.currentVelocity.y -= gameSettings.playerAcceleration * Math.cos(this.player.angle * Math.PI/180) * delta;
    } else {
      // Decelerate a bit when not accelerating
      var magnitude = this.currentVelocity.length();
      magnitude -= gameSettings.playerDeceleration * delta;
      if (magnitude <= 0) {
        this.currentVelocity.x = 0;
        this.currentVelocity.y = 0;
      } else {
        this.currentVelocity.normalize();
        this.currentVelocity.scale(magnitude);
      }
    }

    // Have a terminal velocity so the player can't accelerate into light speed
    if (this.currentVelocity.length() > gameSettings.terminalVelocity) {
      this.currentVelocity.normalize();
      this.currentVelocity.scale(gameSettings.terminalVelocity);
    }

    this.player.x += this.currentVelocity.x * delta;
    this.player.y += this.currentVelocity.y * delta;
  }

  shoot() {
    if(!this.player.active)
      return;

    this.shootAudio.play();
    this.projectiles.add(new Beam(this));
    this.currentVelocity.x -= gameSettings.shootRecoil * Math.sin(this.player.angle * Math.PI/180);
    this.currentVelocity.y += gameSettings.shootRecoil * Math.cos(this.player.angle * Math.PI/180);
  }

  hitAsteroid(projectile, asteroid) {
    if (!asteroid.active)
      return;
    //var explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    //this.resetAsteroid(asteroid);
    //asteroid.disableBody(true, true);
    asteroid.demolish({scene: this}, this.asteroids)

    //this.explosionSound.play();
  }

  hurtPlayer(player, asteroid) {
    if (!asteroid.active) {
      return;
    }

    if(this.player.alpha < 1) {
      return;
    }

    this.lives -= 1;
    this.livesLabel.text = "LIVES  " + this.lives;

    this.player.disableBody(true, true);

    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });

    //this.backgroundMusic.stop();
    if(this.lives <= -1) {
      this.scene.stop("playGame");
      this.scene.start("restartGame");
    }
  }

  resetPlayer() {
    var x = config.width / 2;
    var y = -8; //Hidden at the bottom of the screen
    this.player.enableBody(true, x, y, true, true);
    this.player.angle = 0;

    //Setting the player indestructible using this variable
    this.player.alpha = 0.5;

    //Animate the ship and use a timer at the same time
    var tween = this.tweens.add({
      targets: this.player,
      x: config.width/2,
      y: config.height/2, //Move ship 64 pixels above the bottom of the screen
      ease: 'Power1',
      duration: 1500,
      repeat: 0,
      onComplete: function() {
        this.player.alpha = 1; //Once tween is done, we remove the transparency
      },
      callbackScope: this
    });
  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while(stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
}
