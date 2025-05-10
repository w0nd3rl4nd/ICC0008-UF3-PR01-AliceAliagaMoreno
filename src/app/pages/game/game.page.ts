import { Component, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MainScene } from '../../game-scenes/main.scene';
import * as Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  imports: [CommonModule, IonicModule],
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit {
  game!: Phaser.Game;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const parent = document.getElementById('game-container')!;
      const width = parent.clientWidth || window.innerWidth;
      const height = parent.clientHeight || window.innerHeight;
  
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width,
        height,
        parent: 'game-container',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        },
        scene: [MainScene]
      };
  
      this.game = new Phaser.Game(config);
    }, 100);
  }
}