const sizes = {
    LARGE: 2,
    MEDIUM: 1,
    SMALL: 0
}

var Asteroid = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize:

    function Asteroid(scene, posX, posY, size) {
        Phaser.GameObjects.Image.call(this, scene)

        this.setTexture('asteroid');

        // Change the scale and speed of the asteroids to match the size of the asteroid.
        // Smaller asteroids vary more in speed and can move faster.
        switch (size) {
            case sizes.LARGE:
                this.setScale(0.2);
                this.speed = 0.05;
                break;
            case sizes.MEDIUM:
                this.setScale(0.1);
                this.speed = 0.05 + 0.05 * Math.random();
                break;
            case sizes.SMALL:
                this.setScale(0.05);
                this.speed = 0.05 + 0.15 * Math.random();
                break;
        }

        // Randomize the rotation of the asteroid
        this.setAngle(Math.random() * 360);

        // Randomly place the asteroid at the border of the screen
        // TODO: Replace hard-coded screen bounds
        if (posX == -1 && posY == -1) {
            var perimeter = 2 * (800 - this.displayWidth) + 2 * (600 - this.displayHeight);
            var placement = perimeter * Math.random();
            if (placement < 2 * (800 - this.displayWidth)) {
                if (placement < (800 - this.displayWidth)) {
                    posX = placement + this.displayWidth / 2;
                    posY = this.displayHeight / 2;
                } else {
                    posX = placement - (800 - this.displayWidth / 2);
                    posY = (600 - this.displayHeight / 2);
                }
            } else {
                placement -= 2 * (800 - this.displayWidth);
                if (placement < (600 - this.displayHeight)) {
                    posX = this.displayWidth / 2;
                    posY = placement + this.displayHeight / 2;
                } else {
                    posX = (800 - this.displayWidth / 2);
                    posY = placement - (600 - this.displayHeight / 2);
                }
            }
        }

        this.setPosition(posX, posY);
        this.setOrigin(0.5);

        this.size = size;

        // Randomize the direction of the asteroid
        var dirX = Math.random() - 0.5;
        var dirY = Math.random() - 0.5;
        this.direction = new Phaser.Math.Vector2(dirX, dirY);
        this.direction.normalize();
    },

    move: function (delta) {
        // Move the asteroid based on the time passed. Wrap around when reaching the screen edge.
        var x = Phaser.Math.Wrap(this.x + delta * this.speed * this.direction.x,
            this.displayWidth / 2, 800 - this.displayWidth / 2);
        var y = Phaser.Math.Wrap(this.y + delta * this.speed * this.direction.y,
            this.displayHeight / 2, 600 - this.displayHeight / 2);
        this.setPosition(x, y);
    },

    demolish: function (object, asteroids, bullets) {
        // If the asteroid isn't the smallest size, create 2 new asteroids in its location
        if (this.size > sizes.SMALL) {
            for (i = 0; i < 2; i++) {
                var newAsteroid = new Asteroid(object.scene, this.x, this.y, this.size - 1);

                bullets.getChildren().forEach(function (bullet) {
                    object.scene.physics.add.collider(newAsteroid, bullet, breakAsteroidCallback);
                });
                object.scene.physics.add.collider(newAsteroid, player, breakAsteroidCallback);

                asteroids.add(newAsteroid, true);
            }
        }
        explodeAudio.play();
        // Kill the current asteroid
        // TODO: Play death animation before hiding
        asteroids.killAndHide(this);

        switch (this.size) {
            case sizes.LARGE:
                object.scene.score += 20;
            case sizes.MEDIUM:
                object.scene.score += 50;
            case sizes.SMALL:
                object.scene.score += 100;
        }
    }
});