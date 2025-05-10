// src/app/game-scenes/main.scene.ts

import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private ship!: Phaser.Physics.Arcade.Sprite;
  private bullets!: Phaser.Physics.Arcade.Group;
  private asteroids!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spacebar!: Phaser.Input.Keyboard.Key;
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private scoreText!: Phaser.GameObjects.Text;
  private score: number = 0;
  private shotTimestamps: number[] = [];
  private missed: number = 0;
  private missedText!: Phaser.GameObjects.Text;

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

    this.scoreText = this.add.text(10, 10, 'Puntuación: 0', { fontSize: '24px', color: '#fff' }).setDepth(1);
    this.missedText = this.add.text(10, 40, 'Escapados: 0/5', { fontSize: '24px', color: '#f88' }).setDepth(1);

    this.ship = this.physics.add
      .sprite(width / 2, height - 50, 'spaceship')
      .setCollideWorldBounds(true)
      .setAngle(-90);
    this.ship.body.setSize(this.ship.width * 0.3, this.ship.height * 0.3);

    this.bullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, runChildUpdate: true });
    this.asteroids = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image });

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

    this.physics.add.overlap(this.bullets, this.asteroids, (b, a) => {
      (b as Phaser.Physics.Arcade.Image).destroy();
      (a as Phaser.Physics.Arcade.Image).destroy();
      this.score += 1;
      this.scoreText.setText(`Puntuación: ${this.score}`);
    });

    this.cursors    = this.input.keyboard.createCursorKeys();
    this.spacebar  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pauseKey  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  override update() {
    const { width, height } = this.scale;

    if (this.cursors.left?.isDown)       this.ship.setVelocityX(-300);
    else if (this.cursors.right?.isDown) this.ship.setVelocityX(300);
    else                                  this.ship.setVelocityX(0);

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shoot();
    }

    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.scene.isPaused('main') ? this.scene.resume('main') : this.scene.pause('main');
    }

    if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart();
    }

    this.asteroids.getChildren().forEach(obj => {
      const ast = obj as Phaser.Physics.Arcade.Image;
      if (ast.active && ast.y > height + ast.displayHeight) {
        ast.destroy();
        this.missed += 1;
        this.missedText.setText(`Escapados: ${this.missed}/5`);
        if (this.missed >= 5) {
          this.add.text(width/2, height/2, 'GAME OVER', { fontSize: '48px', color: '#f00' })
            .setOrigin(0.5).setDepth(2);
          this.scene.pause('main');
        }
      }
    });
  }

  private shoot() {
    const now = this.time.now;
    this.shotTimestamps = this.shotTimestamps.filter(ts => now - ts < 5000);
    if (this.shotTimestamps.length >= 10) return;
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