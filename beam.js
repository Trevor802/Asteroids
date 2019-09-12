class Beam extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    var x = scene.player.x;
    var y = scene.player.y;

    super(scene, x, y, "beam");
    scene.add.existing(this);

    this.angle = scene.player.angle;
    this.play("beam_anim");
    scene.physics.world.enableBody(this);

    // if(this.angle >= -90 && this.angle <= 90) {
    //   this.body.velocity.y = -gameSettings.beamSpeed;
    //   this.body.velocity.x = gameSettings.beamSpeed * Math.tan(this.angle * Math.PI/180);
    // } else {
    //   this.body.velocity.y = gameSettings.beamSpeed;
    //   this.body.velocity.x = -gameSettings.beamSpeed * Math.tan(this.angle * Math.PI/180);
    // }
    this.body.velocity.x = gameSettings.beamSpeed * Math.cos((this.angle - 90) * Math.PI / 180);
    this.body.velocity.y = gameSettings.beamSpeed * Math.sin((this.angle - 90) * Math.PI / 180);

    //this.beamSound.play();
  }

  update() {
    if(this.y < 0 || this.x < 0 || this.y > 600 || this.x > 800) {
      this.destroy();
    }
  }
}
