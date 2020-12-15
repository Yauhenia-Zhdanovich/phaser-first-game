let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 460,
  parent: 'gameContainer',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
let player;
let platforms;
let cursors;
let stars;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'https://i.ibb.co/R4CmY8z/Cielo.png');
  this.load.image('ground', 'https://i.ibb.co/YLXVFSJ/shelf1.png');
  this.load.image('star', 'https://i.ibb.co/RBqwMLv/element-yellow-diamond.png');
  this.load.spritesheet('dude', 'https://i.ibb.co/vwyHqRc/guy.png', { frameWidth: 16, frameHeight: 24 });
}

function create () {
  this.add.image(400, 230, 'sky');
  platforms = this.physics.add.staticGroup();
  let groundCoordinates = [
    { x: 64, y: 442 },
    { x: 180, y: 442 },
    { x: 300, y: 442 },
    { x: 420, y: 442 },
    { x: 540, y: 442 },
    { x: 660, y: 442 },
    { x: 780, y: 442 },
    { x: 600, y: 320 },
    { x: 720, y: 320 },
    { x: 70, y: 250 },
    { x: 685, y: 200 },
    { x: 558, y: 200 },
    { x: 430, y: 200 },

  ];
  groundCoordinates.forEach(item => {
    platforms.create(item.x, item.y, 'ground')
  })

  player = this.physics.add.sprite(100, 300, 'dude').setScale(2);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 0 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  stars.children.iterate(function (child) {

  child.setScale(0.5).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  this.physics.add.collider(stars, platforms, );


  this.physics.add.collider(player, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update () {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

}

function collectStar (player, star)
{
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);
}

