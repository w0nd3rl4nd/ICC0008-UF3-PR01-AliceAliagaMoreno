import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface ScoreEntry {
  name: string;
  score: number;
}

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './scores.page.html',
  styleUrls: ['./scores.page.scss'],
})
export class ScoresPage implements OnInit {
  scores: ScoreEntry[] = [];
  playerName: string = 'Jugador Anónimo';
  playerScore: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const name = this.route.snapshot.queryParamMap.get('name');
    const scoreParam = this.route.snapshot.queryParamMap.get('score');
    const score = scoreParam ? Number(scoreParam) : NaN;
  
    const stored: ScoreEntry[] = JSON.parse(localStorage.getItem('guardianes_scores') || '[]');
  
    if (name && !isNaN(score)) {
      stored.push({ name, score });
      localStorage.setItem('guardianes_scores', JSON.stringify(stored));
    }
  
    this.scores = stored.sort((a, b) => b.score - a.score);
    this.playerName = name || 'Jugador Anónimo';
    this.playerScore = score || 0;
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
