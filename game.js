var config = {
  width: 1200,
  height: 900,
  backgroundColor: 0x000000,
  scene: [LoadingScene, GameScene, RestartScene],
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
  playerAcceleration: 0,
  playerDeceleration: 0.000025,
  shootRecoil: 0.1,
  beamSpeed: 250,
  beamLifetime: 1500,
  terminalVelocity: 0.4,
  initialAsteroids: 1,
  asteroidWaveIncrease: 1,
  asteroidBreakNum: 2,
  spawnDelay: 10000,
  transitionPadding: 1000,
}

var game = new Phaser.Game(config);