var config = {
  width: 1920,
  height: 1080,
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
  screenWidth: 800,
  screenHeight: 800,
  playerSpeed: 200,
  rotationSpeed: 5,
  playerAcceleration: 0,
  playerDeceleration: 0.000025,
  shootRecoil: 0.2,
  beamSpeed: 800,
  beamLifetime: 400,
  terminalVelocity: 0.4,
  initialAsteroids: 1,
  asteroidWaveIncrease: 1,
  asteroidBreakNum: 2,
  spawnDelay: 8000,
  introDelay: 10000,
  transitionPadding: 1000,
  introPadding: 2000,
  spawnInvulnerability: 1500,
  smokeOffset: 70
}

var game = new Phaser.Game(config);