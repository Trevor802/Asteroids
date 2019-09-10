var config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
    physics: {
        default:'arcade',
        arcade: {
            gravity: {y : 200}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bg', 'assets/background.png');
    this.load.image('asteroid', 'assets/Asteroid.png');
    this.load.audio('shootAudio', 'assets/MissileFire.wav');
    this.load.audio('explodeAudio', 'assets/AsteroidExplode.wav');
    this.load.audio('bgm', 'assets/Blue_Sizzle_Madness_Paranoia.mp3');
}

function create() {
    this.image = this.add.image(800, 600, 'bg');
    this.title = this.add.text(400, 300, 'Asteroids', { fontFamily: "Times New Roman" });
    shootAudio = this.sound.add('shootAudio');
    explodeAudio = this.sound.add('explodeAudio');
    backgroundMusic = this.sound.add('bgm');
    backgroundMusic.play({loop: true, volume: 0.3});

    asteroidSpawnNum = 4; // The number of asteroids to spawn next wave, initially 4
    asteroids = this.add.group(); // The group of asteroids
    cursors = this.input.keyboard.createCursorKeys(); // The state of the keyboard


    index = 0; // TODO: Remove later. Temporarily used to show asteroid demolition.
}

function update(time, delta) {
    // Move all the asteroids
    asteroids.getChildren().forEach(function (asteroid) {
        asteroid.move(delta);
    });

    // Begin the next wave if all asteroids are gone
    if (asteroids.countActive(true) == 0) {
        // Clear out inactive asteroids, remove them from the scene and destroy them
        asteroids.clear(true, true);
        index = 0;

        // Spawn new asteroids
        for (i = 0; i < asteroidSpawnNum; i++) {
            asteroids.add(new Asteroid(this, -1, -1, sizes.LARGE), true);
        }

        // Make next wave spawn 2 more asteroids than this one (this is what it looked like Asteroids was doing)
        asteroidSpawnNum += 2;
    }


    // TODO: Replace once we have the ship and collisions/bullets in.
    // This is a temporary demonstration of the demolition of asteroids.
    // Press the space bar to destroy asteroids.
    if (cursors.space.isDown) {
        asteroids.getChildren()[index].demolish(this, asteroids);
        index++;
    }
}