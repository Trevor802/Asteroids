var config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
    physics: {
        default:'arcade',
        arcade: {
            gravity: {y : 200}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bg', 'assets/background.png')
}

function create() {
    this.image = this.add.image(800, 600, 'bg');
    this.title = this.add.text(400, 300, 'Asteroids', {fontFamily: "Times New Roman"});
}

function update() {

}