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
