// src/app/game-scenes/main.scene.ts

import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private ship!: Phaser.Physics.Arcade.Sprite;
  private bullets!: Phaser.Physics.Arcade.Group;
  private asteroids!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spacebar!: Phaser.Input.Keyboard.Key;
  private score: number = 0;
  private shotTimestamps: number[] = [];

  constructor() {
    super('main');
  }

  preload() {
    this.load.image('spaceship',  'assets/game/spaceship.png');
    this.load.image('bullet',     'assets/game/bullet.png');
    this.load.image('asteroid',   'assets/game/asteroid.png');
    this.load.image('background', 'assets/game/background.png');
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(0, 0, 'background').setOrigin(0);
    bg.setDisplaySize(width, height);

    this.ship = this.physics.add
      .sprite(width / 2, height - 50, 'spaceship')
      .setCollideWorldBounds(true)
      .setAngle(-90);
    this.ship.body.setSize(this.ship.width * 0.3, this.ship.height * 0.3);

    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true
    });

    this.asteroids = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image
    });
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const x = Phaser.Math.Between(20, width - 20);
        const asteroid = this.asteroids.get(x, 0, 'asteroid') as Phaser.Physics.Arcade.Image;
        if (asteroid) {
          const scale = Phaser.Math.FloatBetween(0.05, 0.3);
          asteroid
            .setActive(true)
            .setVisible(true)
            .enableBody(true, x, 0, true, true)
            .setVelocityY(Phaser.Math.Between(100, 200))
            .setScale(scale)
            .setCollideWorldBounds(false);
        }
      }
    });

    this.physics.add.overlap(
      this.bullets,
      this.asteroids,
      (bulletObj, asteroidObj) => {
        const bullet = bulletObj as Phaser.Physics.Arcade.Image;
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;
        bullet.destroy();
        asteroid.destroy();
        this.score += 1;
      }
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  override update() {
    if (this.cursors.left?.isDown)       this.ship.setVelocityX(-300);
    else if (this.cursors.right?.isDown) this.ship.setVelocityX(300);
    else                                  this.ship.setVelocityX(0);

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shoot();
    }
  }

  private shoot() {
    const now = this.time.now;
    this.shotTimestamps = this.shotTimestamps.filter(ts => now - ts < 5000);
    if (this.shotTimestamps.length >= 10) {
      return;
    }
    this.shotTimestamps.push(now);

    const bullet = this.bullets.get() as Phaser.Physics.Arcade.Image;
    if (!bullet) return;
    bullet
      .enableBody(true, this.ship.x, this.ship.y - 20, true, true)
      .setTexture('bullet')
      .setAngle(-90)
      .setVelocityY(-300)
      .setCollideWorldBounds(false);
  }
}
