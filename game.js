var config = {
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  scene: [LoadingScene, GameScene],
  pixelArt: true,

  physics: {
    default: "arcade",
    arcade: {
      //gravity: {y: 200},
      debug: false
    }
  }
}

var gameSettings = {
  playerSpeed: 200,
  rotationSpeed: 5,
  playerAccleration: 5,
  beamSpeed: 250,
}

var game = new Phaser.Game(config);

/*window.onload = function () {

}*/
