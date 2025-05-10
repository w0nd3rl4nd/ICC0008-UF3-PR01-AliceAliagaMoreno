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
  private missedText!: Phaser.GameObjects.Text;
  private score: number = 0;
  private missed: number = 0;
  private shotTimestamps: number[] = [];
  private isGameOver: boolean = false;
  private playerName: string = '';

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

    const { playerName } = this.sys.game.config as any;
    this.playerName = playerName || 'Jugador Anónimo';

    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(width, height);

    this.scoreText = this.add.text(10, 10, 'Puntuación: 0', {
      fontSize: '24px',
      color: '#ffffff'
    }).setDepth(1);

    this.missedText = this.add.text(10, 40, 'Escapados: 0/5', {
      fontSize: '24px',
      color: '#ff8888'
    }).setDepth(1);

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
        if (this.isGameOver) return;

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

    this.physics.add.overlap(this.bullets, this.asteroids, (bulletObj, asteroidObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Image;
      const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;
      bullet.destroy();
      asteroid.destroy();
      this.score += 1;
      this.scoreText.setText(`Puntuación: ${this.score}`);
    });

    this.cursors     = this.input.keyboard.createCursorKeys();
    this.spacebar    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pauseKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.restartKey  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  override update() {
    if (this.isGameOver) return;

    const { height } = this.scale;

    if (this.cursors.left?.isDown) {
      this.ship.setVelocityX(-300);
    } else if (this.cursors.right?.isDown) {
      this.ship.setVelocityX(300);
    } else {
      this.ship.setVelocityX(0);
    }

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
      const asteroid = obj as Phaser.Physics.Arcade.Image;
      if (asteroid.active && asteroid.y > height + asteroid.displayHeight) {
        asteroid.destroy();
        this.missed += 1;
        this.missedText.setText(`Escapados: ${this.missed}/5`);
        if (this.missed >= 5) {
          this.gameOver();
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

  private gameOver() {
    this.isGameOver = true;
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000'
    }).setOrigin(0.5).setDepth(10);

    const highScore = localStorage.getItem('highScore');
    if (!highScore || this.score > Number(highScore)) {
      localStorage.setItem('highScore', String(this.score));
      this.add.text(width / 2, height / 2 + 50, `Nueva Puntuación Más Alta: ${this.score}`, {
        fontSize: '24px',
        color: '#00ff00'
      }).setOrigin(0.5).setDepth(10);
    }

    this.scene.pause('main');
  }
}
