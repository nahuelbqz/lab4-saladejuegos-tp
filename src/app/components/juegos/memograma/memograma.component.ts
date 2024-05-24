import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-memograma',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './memograma.component.html',
  styleUrl: './memograma.component.css'
})
export class MemogramaComponent {
  colors: string[] = ['#FF5733', '#33FF57', '#5733FF', '#FF33F5', '#33E5FF', '#D833FF', '#FFC733', '#33FFEB', '#FF333F'];
  shuffledColors: string[];
  firstCard: any = null;
  secondCard: any = null;
  pairsFound: number = 0;
  message: string = '';
  user : any = null;

  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastrService);

  constructor() {
    this.shuffledColors = this.colors.concat(this.colors).sort(() => 0.5 - Math.random());
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  handleCardClick(card: any) {
    if (!this.firstCard) {
      this.firstCard = card;
      card.style.backgroundColor = card.dataset.color;
    } else if (this.firstCard === card) {
      return;
    } else if (!this.secondCard) {
      this.secondCard = card;
      card.style.backgroundColor = card.dataset.color;
      if (this.firstCard.dataset.color === this.secondCard.dataset.color) {
        setTimeout(() => {
          this.firstCard.style.visibility = 'hidden';
          this.secondCard.style.visibility = 'hidden';
          this.firstCard = null;
          this.secondCard = null;
          this.pairsFound++;
          if (this.pairsFound === this.colors.length) {
            this.message = '¡Felicidades! Has completado el memorama.';
            setTimeout(() => {
              this.message = '';
              this.resetGame();
            }, 2000);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          this.firstCard.style.backgroundColor = '#363636';
          this.secondCard.style.backgroundColor = '#363636';
          this.firstCard = null;
          this.secondCard = null;
        }, 1000);
      }
    }
  }

  resetGame() {
    this.pairsFound = 0;
    this.firstCard = null;
    this.secondCard = null;
    this.shuffledColors = this.colors.concat(this.colors).sort(() => 0.5 - Math.random());
  }
}
