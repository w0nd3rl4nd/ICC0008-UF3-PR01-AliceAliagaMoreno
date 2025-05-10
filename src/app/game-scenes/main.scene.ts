import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    this.load.image('spaceship', 'assets/game/spaceship.png');
    this.load.image('asteroid', 'assets/game/asteroid.png');
    this.load.image('background', 'assets/game/background.png');
    this.load.image('bullet', 'assets/game/bullet.png');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
  
    const bg = this.add.image(0, 0, 'background').setOrigin(0);
    bg.setDisplaySize(width, height);
  }
}
