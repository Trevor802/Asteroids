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

    this.frame = this.add.image(0, 0, "frame");
    this.frame.setOrigin(0, 0);
    this.frame.setDepth(10000);

    this.origin = {
      x: (config.width - gameSettings.screenWidth) / 2, 
      y: (config.height - gameSettings.screenHeight) / 2 
    };

    this.physics.world.bounds.x = this.origin.x;
    this.physics.world.bounds.y = this.origin.y;
    this.physics.world.bounds.width = gameSettings.screenWidth;
    this.physics.world.bounds.height = gameSettings.screenHeight;

    this.leftBtnNormal = this.add.image(1140, 985, "left_normal");
    this.leftBtnNormal.setDepth(10001);
    this.leftBtnPressed = this.add.image(1140, 985, "left_pressed");
    this.leftBtnPressed.setDepth(10001);
    this.leftBtnPressed.setVisible(false);
    this.rightBtnNormal = this.add.image(1240, 985, "right_normal");
    this.rightBtnNormal.setDepth(10001);
    this.rightBtnPressed = this.add.image(1240, 985, "right_pressed");
    this.rightBtnPressed.setDepth(10001);
    this.rightBtnPressed.setVisible(false);
    this.fireBtnNormal = this.add.image(765, 985, "fire_normal");
    this.fireBtnNormal.setDepth(10001);
    this.fireBtnPressed = this.add.image(765, 985, "fire_pressed");
    this.fireBtnPressed.setDepth(10001);
    this.fireBtnPressed.setVisible(false);

    //Sounds
    this.shootAudio = this.sound.add('shootAudio');
    this.explodeAudio = this.sound.add('explodeAudio');
    this.waveClearAudio = this.sound.add('waveClear');
    this.waveClearedAudioPlayed = false;
    this.waveStartAudio = this.sound.add('waveStart');
    this.waveStartAudioPlayed = false;
    this.playerExplosion = this.sound.add('playerExplosion');

    //Creating player
    this.player = this.physics.add.sprite(config.width / 2, config.height/2, "player");
    this.player.depth = 50;
    this.player.alpha = 0;
    //this.player.play("thrust");

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
    this.scoreLabel = this.add.bitmapText(this.origin.x + 10, this.origin.y + 5, "pixelFont", "SCORE 000000", 32);
    this.scoreLabel.setDepth(100);
    this.score = 0;

    //Wave messages
    this.waveMessage = this.add.bitmapText(config.width / 2, config.height / 2, "pixelFont", "", 32);
    this.waveMessage.setOrigin(0.5, 0.5);
    this.waveMessage.setCenterAlign();
    this.waveMessage.setDepth(100);

    //Wave outlines
    this.clearedOutline = this.add.image(config.width / 2, config.height / 2, "wave_cleared");
    this.clearedOutline.setVisible(false);
    this.clearedOutline.setDepth(75);

    this.incomingOutline = this.add.image(config.width / 2, config.height / 2, "asteroids_incoming");
    this.incomingOutline.setVisible(false);
    this.incomingOutline.setDepth(75);

    //Lives
    this.livesLabel = this.add.bitmapText(this.origin.x + gameSettings.screenWidth - 100, 
      this.origin.y + 5, "pixelFont", "LIVES  3", 32);
    this.livesLabel.setDepth(100);
    this.lives = 3;

    //Game state
    this.spawning = true;
    this.waveResetTime = 0;

    //Starting intro
    this.introTime = gameSettings.introDelay;
  }

  update(time, delta) {
    //Updating Background Position
    this.background.tilePositionY -= 0.2;

    //On press, call movePlayerManager || On release set the velocities to 0
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    this.movePlayerManager(delta);
    if (!this.spawning)
      this.physics.world.wrap(this.player, 0);
    this.physics.world.wrapArray(this.projectiles.getChildren(), 0);

    //Phaser.Math.wrap(this.player.x, 0, config.width);

    //Shoot Beams
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.spawning) {
        if (this.introTime > gameSettings.introPadding) {
          this.introTime = gameSettings.introPadding;
        }
        return;
      }
      this.fireBtnPressed.setVisible(true);
      this.shoot();
    }
    if (Phaser.Input.Keyboard.JustUp(this.spacebar)){
      this.fireBtnPressed.setVisible(false);
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)){
      this.leftBtnPressed.setVisible(true);
    }
    if (Phaser.Input.Keyboard.JustUp(this.cursorKeys.left)){
      this.leftBtnPressed.setVisible(false);
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)){
      this.rightBtnPressed.setVisible(true);
    }
    if (Phaser.Input.Keyboard.JustUp(this.cursorKeys.right)){
      this.rightBtnPressed.setVisible(false);
    }

    //Deleting the beam objects
    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update(delta);
    }

    // Move all the asteroids
    for (var i = 0; i < this.asteroids.getChildren().length; i++) {
      this.asteroids.getChildren()[i].move(delta, {scene: this});
    }

    if (this.introTime > 0) {
      this.playIntro(delta);
      return;
    }

    // Begin the next wave if all asteroids are gone
    if (this.asteroids.countActive(true) == 0) {
      this.beginNextWave(delta);
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

    var explosion = new Explosion(this, player.x, player.y);
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
    var y = config.height / 2 + gameSettings.screenHeight / 2 + this.player.height; //Hidden at the bottom of the screen
    this.player.enableBody(true, x, y, true, true);
    this.player.angle = 0;

    //Setting the player indestructible using this variable
    this.player.alpha = 0.5;
    this.spawning = true;

    //Animate the ship and use a timer at the same time
    var tween = this.tweens.add({
      targets: this.player,
      x: config.width/2,
      y: config.height/2,
      ease: 'Power1',
      duration: 1500,
      repeat: 0,
      onComplete: function() {
        this.currentVelocity.x = 0;
        this.currentVelocity.y = 0;
        this.spawning = false;
        this.player.alpha = 0.7;
        this.time.addEvent({
          delay: gameSettings.spawnInvulnerability,
          callback: this.makeVulnerable,
          callbackScope: this,
          loop: false
        });
      },
      callbackScope: this
    });
  }

  beginNextWave(delta) {
      if (!this.waveClearedAudioPlayed){
        this.waveClearAudio.play();
        this.waveClearedAudioPlayed = true;
      }
      if (this.waveResetTime > 0) {
        if (this.waveResetTime - gameSettings.transitionPadding > (gameSettings.spawnDelay -
            gameSettings.transitionPadding) * 2/3) {
          this.clearedOutline.setVisible(true);
          this.clearedOutline.setAlpha((1 - Math.abs((this.waveResetTime - gameSettings.transitionPadding) -
              (gameSettings.spawnDelay - gameSettings.transitionPadding) * 5/6) /
              ((gameSettings.spawnDelay - gameSettings.transitionPadding) / 6)) * 2);
          this.waveMessage.text = "WAVE CLEARED!";
        } else if ((this.waveResetTime - gameSettings.transitionPadding) <
            (gameSettings.spawnDelay - gameSettings.transitionPadding)/3 && this.waveResetTime >=
            gameSettings.transitionPadding) {
          if (!this.waveStartAudioPlayed){
            this.waveStartAudio.play();
            this.waveStartAudioPlayed = true;
          }
          this.incomingOutline.setVisible(true);
          this.incomingOutline.setAlpha((1 - Math.abs((this.waveResetTime - gameSettings.transitionPadding) -
              (gameSettings.spawnDelay - gameSettings.transitionPadding) / 6) /
              ((gameSettings.spawnDelay - gameSettings.transitionPadding) / 6)) * 2);
          this.clearedOutline.setVisible(false);
          this.waveMessage.text = this.asteroidSpawnNum + " INCOMING\nASTEROIDS DETECTED!";
        } else {
          this.clearedOutline.setVisible(false);
          this.waveMessage.text = "";
        }

        this.waveResetTime -= delta;
        return;
      } else {
        this.incomingOutline.setVisible(false);
        this.clearedOutline.setVisible(false);
        this.waveMessage.text = "";
      }

      this.waveClearedAudioPlayed = false;
      this.waveStartAudioPlayed = false;

      this.waveResetTime = gameSettings.spawnDelay;

      // Clear out inactive asteroids, remove them from the scene and destroy them
      this.asteroids.clear(true, true);

      // Spawn new asteroids
      for (var i = 0; i < this.asteroidSpawnNum; i++) {
        this.asteroids.add(new Asteroid(this, -1, -1, sizes.LARGE), true);
      }

      // Make next wave spawn more asteroids than this one
      this.asteroidSpawnNum += gameSettings.asteroidWaveIncrease;
  }

  playIntro(delta) {
    if (this.introTime - gameSettings.introPadding > 0) {
      if (!this.waveStartAudioPlayed){
        this.waveStartAudio.play();
        this.waveStartAudioPlayed = true;
      }

      this.incomingOutline.setVisible(true);
      this.incomingOutline.setAlpha((1 - Math.abs((this.introTime - gameSettings.introPadding) -
          (gameSettings.introDelay - gameSettings.introPadding) / 2) /
          ((gameSettings.spawnDelay - gameSettings.introPadding) / 2)) * 2);
      this.clearedOutline.setVisible(false);
      if (this.introTime < gameSettings.introDelay - gameSettings.introPadding) {
        var introText = "FORWARD THRUSTERS: FATAL ERROR!\nSEVERE DAMAGE DETECTED\n\nMOUNTED BLASTER: " +
            "OPERATIONAL\n\nWARNING: ASTEROID DETECTED!";
        if (this.waveMessage.text != introText) {
          this.waveMessage.text += introText[this.waveMessage.text.length];
        }
      }
    } else {
      this.incomingOutline.setVisible(false);
      this.waveMessage.text = "";
    }

    if (this.introTime >= gameSettings.introPadding && this.introTime - delta < gameSettings.introPadding) {
      this.time.addEvent({
        delay: 0,
        callback: this.resetPlayer,
        callbackScope: this,
        loop: false
      });
    }

    this.introTime -= delta;
  }

  makeVulnerable() {
    this.player.alpha = 1;
  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while(stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
}
