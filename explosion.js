class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    console.log("Explosion");
    super(scene, x, y, "explosion");
    scene.add.existing(this);
    //this.setScale(0.5);
    this.play("explode");
  }
}
