import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MainScene } from '../../game-scenes/main.scene';
import { ActivatedRoute, Router } from '@angular/router';
import * as Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  imports: [CommonModule, IonicModule],
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit, OnDestroy {
  game!: Phaser.Game;
  playerName: string = 'Jugador Anónimo';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.playerName = params['name'] || 'Jugador Anónimo';
    });

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
        scene: []
      };

      this.game = new Phaser.Game(config);

      this.game.scene.add('main', MainScene, true, {
        playerName: this.playerName,
        onGameOverNavigate: this.onGameOverNavigate.bind(this)
      });
    }, 100);
  }

  onGameOverNavigate(name: string, score: number) {
    console.log('Game Over', name, score);
    this.router.navigate(['/scores'], {
      queryParams: { name, score }
    });
  }

  ngOnDestroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}