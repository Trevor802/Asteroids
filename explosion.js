class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    //console.log("Explosion");
    super(scene, x, y, "explosion");
    scene.add.existing(this);
    scene.playerExplosion.play();
    this.setScale(2);
    this.play("explode");
  }
}

class Smoke extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, angle = 0) {
    super(scene, x, y, "smoke");
    scene.add.existing(this);
    this.angle = angle;
    this.setScale(1);
    this.setDepth(100);
    this.play("smoke");
  }
}
