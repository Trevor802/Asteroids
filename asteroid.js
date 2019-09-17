const sizes = {
    LARGE: 2,
    MEDIUM: 1,
    SMALL: 0
}

var Asteroid = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Asteroid(scene, posX, posY, size) {
        Phaser.GameObjects.Sprite.call(this, scene)

        this.isChild = false;

        // Change the scale and speed of the asteroids to match the size of the asteroid.
        // Smaller asteroids vary more in speed and can move faster.
        switch (size) {
            case sizes.LARGE:
                this.setTexture('asteroid_big');
                //this.play("ast_big_anim");
                this.speed = 0.05;
                this.angle = 360 * Math.random();
                this.spinSpeed = 0.025 * Math.random() - 0.0125;
                break;
            case sizes.MEDIUM:
                this.setTexture('asteroid_medium');
                //this.play("ast_med_anim");
                this.speed = 0.05 + 0.05 * Math.random();
                this.angle = 360 * Math.random();
                this.spinSpeed = 0.2 * Math.random() - 0.1;
                break;
            case sizes.SMALL:
                this.setTexture('asteroid_small');
                //this.play("ast_small_anim");
                this.speed = 0.05 + 0.15 * Math.random();
                this.angle = 360 * Math.random();
                this.spinSpeed = 0.8 * Math.random() - 0.4;
                break;
        }

        this.childAsteroids = [];

        // Randomly place the asteroid at the border of the screen
        // TODO: Replace hard-coded screen bounds
        if (posX == -1 && posY == -1) {
            var perimeter = 2 * (config.width - this.displayWidth) + 2 * (config.height - this.displayHeight);
            var placement = perimeter * Math.random();
            if (placement < 2 * (config.width - this.displayWidth)) {
                if (placement < (config.width - this.displayWidth)) {
                    posX = placement + this.displayWidth / 2;
                    posY = this.displayHeight / 2;
                } else {
                    posX = placement - (config.width - this.displayWidth / 2);
                    posY = (config.height - this.displayHeight / 2);
                }
            } else {
                placement -= 2 * (config.width - this.displayWidth);
                if (placement < (config.height - this.displayHeight)) {
                    posX = this.displayWidth / 2;
                    posY = placement + this.displayHeight / 2;
                } else {
                    posX = (config.width - this.displayWidth / 2);
                    posY = placement - (config.height - this.displayHeight / 2);
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
                return;
            }
        }

        // Move the asteroid based on the time passed. Wrap around when reaching the screen edge.
        var x = Phaser.Math.Wrap(this.x + delta * this.speed * this.direction.x,
            0, config.width);
        var y = Phaser.Math.Wrap(this.y + delta * this.speed * this.direction.y,
            0, config.height);
        this.setPosition(x, y);

        this.angle += delta * this.spinSpeed;

        // Add "child asteroids" to this asteroid. To the player it just looks like one asteroid
        // wrapping around the screen.
        var childrenCount = 0;
        if (x >= 0 && x < this.displayWidth / 2) {
            childrenCount++;
            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, this.x + config.width, this.y, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(this.x + config.width, this.y);
            }
        } else if (x < config.width && x > config.width - this.displayWidth / 2) {
            childrenCount++;
            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, this.x - config.width, this.y, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(this.x - config.width, this.y);
            }
        }

        if (y >= 0 && y < this.displayHeight / 2) {
            childrenCount++;
            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, this.x, this.y + config.height, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(this.x, this.y + config.height);
            }
        } else if (y < config.height && y > config.height - this.displayHeight / 2) {
            childrenCount++;
            if (this.childAsteroids.length < childrenCount) {
                var newAsteroid = new Asteroid(object.scene, this.x, this.y - config.height, this.size);
                newAsteroid.setIsChild(true);
                this.childAsteroids.push(newAsteroid);
                object.scene.asteroids.add(newAsteroid, true);
            } else {
                this.childAsteroids[childrenCount - 1].setPosition(this.x, this.y - config.height);
            }
        }

        // Handle literal corner case
        if (childrenCount == 2) {
            childrenCount++;
            var cornerX = x;
            var cornerY = y;

            if (x < (config.width / 2)) {
                cornerX += config.width;
            } else {
                cornerX -= config.width;
            }

            if (y < (config.height / 2)) {
                cornerY += config.height;
            } else {
                cornerY -= config.height;
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

        // Sync child rotation with parent
        for (var i = 0; i < this.childAsteroids.length; i++) {
            //this.childAsteroids[i].setFrame(this.anims.currentFrame.textureFrame);
            this.childAsteroids[i].angle = this.angle;
            this.childAsteroids[i].spinSpeed = this.spinSpeed;
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
                //object.scene.scoreLabel.text = "SCORE " + object.scene.score;
                break;
            case sizes.MEDIUM:
                object.scene.score += 50;
                //object.scene.scoreLabel.text = "SCORE " + object.scene.score;
                break;
            case sizes.SMALL:
                object.scene.score += 100;
                //object.scene.scoreLabel.text = "SCORE " + object.scene.score;
                break;
              default:
                break;
        }

        var scoreFormatted = this.scene.zeroPad(this.scene.score, 6);
        object.scene.scoreLabel.text = "SCORE " + scoreFormatted;
        globalScore = scoreFormatted;
    },

    setIsChild: function (isChild) {
        this.isChild = isChild;
    }
});
