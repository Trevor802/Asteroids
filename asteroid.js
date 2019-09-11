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
        this.isChild = false;

        // Change the scale and speed of the asteroids to match the size of the asteroid.
        // Smaller asteroids vary more in speed and can move faster.
        switch (size) {
            case sizes.LARGE:
                this.setScale(1);
                this.speed = 0.05;
                break;
            case sizes.MEDIUM:
                this.setScale(0.5);
                this.speed = 0.05 + 0.05 * Math.random();
                break;
            case sizes.SMALL:
                this.setScale(0.25);
                this.speed = 0.05 + 0.15 * Math.random();
                break;
        }

        this.childAsteroids = [];

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

    move: function (delta, object) {
        if (this.isChild || !this.active)
            return;

        for (var i = 0; i < this.childAsteroids.length; i++) {
            if (!this.childAsteroids[i].active) {
                this.childAsteroids[i].setIsChild(false);
                for (var j = 0; j < this.childAsteroids.length; j++) {
                    if (i == j)
                        continue;

                    object.scene.asteroids.killAndHide(this.childAsteroids[j]);
                    object.scene.asteroids.remove(this.childAsteroids[j], true, true);
                }

                object.scene.asteroids.killAndHide(this);
                object.scene.asteroids.remove(this, true, true);
                break;
            }
        }

        // Move the asteroid based on the time passed. Wrap around when reaching the screen edge.
        var x = Phaser.Math.Wrap(this.x + delta * this.speed * this.direction.x,
            0, 800);
        var y = Phaser.Math.Wrap(this.y + delta * this.speed * this.direction.y,
            0, 600);
        this.setPosition(x, y);

        // Add "child asteroids" to this asteroid. To the player it just looks like one asteroid
        // wrapping around the screen.
        var childrenCount = 0;
        if (x >= 0 && x < this.displayWidth / 2) {
            childrenCount++;
            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, this.x + 800, this.y, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(this.x + 800, this.y);
            }
        } else if (x < 800 && x > 800 - this.displayWidth / 2) {
            childrenCount++;
            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, this.x - 800, this.y, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(this.x - 800, this.y);
            }
        }

        if (y >= 0 && y < this.displayHeight / 2) {
            childrenCount++;
            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, this.x, this.y + 600, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(this.x, this.y + 600);
            }
        } else if (y < 600 && y > 600 - this.displayHeight / 2) {
            childrenCount++;
            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, this.x, this.y - 600, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(this.x, this.y - 600);
            }
        }

        // Handle literal corner case
        if (childrenCount == 2) {
            childrenCount++;
            var cornerX = x;
            var cornerY = y;

            if (x < 400) {
                cornerX += 800;
            } else {
                cornerX -= 800;
            }

            if (y < 300) {
                cornerY += 600;
            } else {
                cornerY -= 600;
            }

            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, cornerX, cornerY, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(cornerX, cornerY);
            }
        }

        // Remove any "excess" asteroids
        while (this.childAsteroids.length > childrenCount) {
            object.scene.asteroids.killAndHide(this.childAsteroids[this.childAsteroids.length - 1]);
            object.scene.asteroids.remove(this.childAsteroids[this.childAsteroids.length - 1], true, true);
            this.childAsteroids.pop();
        }
    },

    demolish: function (object, asteroids) {
        // If the asteroid isn't the smallest size, create 2 new asteroids in its location
        if (this.size > sizes.SMALL) {
            for (i = 0; i < gameSettings.asteroidBreakNum; i++) {
                asteroids.add(new Asteroid(object.scene, this.x, this.y, this.size - 1), true);
            }
        }
        object.scene.explodeAudio.play();
        // Kill the current asteroid
        // TODO: Play death animation before hiding
        asteroids.killAndHide(this);
        for (var j = 0; j < this.childAsteroids.length; j++) {
            object.scene.asteroids.killAndHide(this.childAsteroids[j]);
            object.scene.asteroids.remove(this.childAsteroids[j], true, true);
        }

        switch (this.size) {
            case sizes.LARGE:
                object.scene.score += 20;
                object.scene.scoreLabel.text = "SCORE " + object.scene.score;
                break;
            case sizes.MEDIUM:
                object.scene.score += 50;
                object.scene.scoreLabel.text = "SCORE " + object.scene.score;
                break;
            case sizes.SMALL:
                object.scene.score += 100;
                object.scene.scoreLabel.text = "SCORE " + object.scene.score;
                break;
              default:
                break;
        }
    },

    setIsChild: function (isChild) {
        this.isChild = isChild;
    }
});
