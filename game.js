var config = {
  width: 800,
  height: 600,
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
  playerAcceleration: 0.0001,
  playerDeceleration: 0.000025,
  shootRecoil: 0.1,
  beamSpeed: 250,
  beamLifetime: 1500,
  terminalVelocity: 0.2,
  initialAsteroids: 1,
  asteroidWaveIncrease: 1,
  asteroidBreakNum: 2,
  spawnDelay: 3000,
  shootCostPoint: -5,
}

var game = new Phaser.Game(config);