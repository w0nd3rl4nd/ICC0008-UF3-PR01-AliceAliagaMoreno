import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  imports: [CommonModule, IonicModule, FormsModule],
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  playerName: string = '';
  highScore: number = 0;

  ngOnInit() {
    const storedHighScore = localStorage.getItem('highScore');
    this.highScore = storedHighScore ? Number(storedHighScore) : 0;
  }

  constructor(private router: Router) {}

  startGame() {
    if (this.playerName.trim().length) {
      this.router.navigate(['/game'], { queryParams: { name: this.playerName } });
    } else {
      alert('Por favor, introduce tu nombre');
    }
  }
}
