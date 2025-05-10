import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  playerName: string = '';

  constructor(private router: Router) {}

  startGame() {
    if (this.playerName.trim().length) {
      this.router.navigate(['/game'], { queryParams: { name: this.playerName } });
    } else {
      alert('Por favor, introduce tu nombre');
    }
  }
}
