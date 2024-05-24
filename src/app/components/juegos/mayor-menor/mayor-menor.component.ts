import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { PuntajesService } from '../../../services/puntajes.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [RouterLink,NgIf],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent {
  title = 'Mayor-menor';
  user: any = null;
  startButtonText: string = 'Comenzar Juego';
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  textGameOver: string = '¡PERDISTE!';
  cardImage: string = '../../../../assets/mayor-menor/red_joker.png';
  cardList: any = [
    { type: 'clubs', number: 1 },{ type: 'clubs', number: 2 },{ type: 'clubs', number: 3 },{ type: 'clubs', number: 4 },{ type: 'clubs', number: 5 },{ type: 'clubs', number: 6 },{ type: 'clubs', number: 7 },{ type: 'clubs', number: 8 },{ type: 'clubs', number: 9 },{ type: 'clubs', number: 10 },{ type: 'clubs', number: 11 },{ type: 'clubs', number: 12 },{ type: 'clubs', number: 13 },
    { type: 'diamonds', number: 1 },{ type: 'diamonds', number: 2 },{ type: 'diamonds', number: 3 },{ type: 'diamonds', number: 4 },{ type: 'diamonds', number: 5 },{ type: 'diamonds', number: 6 },{ type: 'diamonds', number: 7 },{ type: 'diamonds', number: 8 },{ type: 'diamonds', number: 9 },{ type: 'diamonds', number: 10 },{ type: 'diamonds', number: 11 },{ type: 'diamonds', number: 12 },{ type: 'diamonds', number: 13 },
    { type: 'hearts', number: 1 },{ type: 'hearts', number: 2 },{ type: 'hearts', number: 3 },{ type: 'hearts', number: 4 },{ type: 'hearts', number: 5 },{ type: 'hearts', number: 6 },{ type: 'hearts', number: 7 },{ type: 'hearts', number: 8 },{ type: 'hearts', number: 9 },{ type: 'hearts', number: 10 },{ type: 'hearts', number: 11 },{ type: 'hearts', number: 12 },{ type: 'hearts', number: 13 },
    { type: 'spades', number: 1 },{ type: 'spades', number: 2 },{ type: 'spades', number: 3 },{ type: 'spades', number: 4 },{ type: 'spades', number: 5 },{ type: 'spades', number: 6 },{ type: 'spades', number: 7 },{ type: 'spades', number: 8 },{ type: 'spades', number: 9 },{ type: 'spades', number: 10 },{ type: 'spades', number: 11 },{ type: 'spades', number: 12 },{ type: 'spades', number: 13 },
  ];
  cardsToGuess: any = [];
  puntaje: number = 0;
  attempts: number = 10;
  currentCard: any = null;
  currentNumber: number = 0;
  currentIndex: number = 0;

  // INJECTS
  authService = inject(AuthService);
  toastService = inject(ToastrService)
  router = inject(Router);
  puntajeService = inject(PuntajesService);

  constructor( ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  startGame() {
    this.attempts = 10;
    this.victory = false;
    this.activeGame = true;
    this.gameOver = false;
    this.textGameOver = '¡PERDISTE!';
    this.puntaje = 0;
    this.currentIndex = 0;
    this.startButtonText = 'Reiniciar Juego';
    this.cardList.sort(() => Math.random() - 0.5);
    this.cardsToGuess = this.cardList.slice(0, 10);
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.cardImage = `../../../../assets/mayor-menor/${this.currentCard.number}_of_${this.currentCard.type}.png`;
    this.toastService.info('Juego Iniciado', 'Mayor o Menor');
  } // end startGame

  playMayorMenor(mayorMenor: string) {
    const previousNumber: number = this.currentNumber;
    this.currentIndex++;
    this.attempts--;
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.cardImage = `../../../../assets/mayor-menor/${this.currentCard.number}_of_${this.currentCard.type}.png`;

    switch (mayorMenor) {
      case 'menor':
        if (previousNumber > this.currentNumber) {
          this.puntaje++;
          this.toastService.success('Correcto, es MENOR!');
        } else if (previousNumber === this.currentNumber) {
          this.toastService.info('¡SON IGUALES!');
        } else {
          this.toastService.error('¡NO adivinaste!');
        }
        break;
        
      case 'mayor':
        if (previousNumber < this.currentNumber) {
          this.puntaje++;
          this.toastService.success('Correcto, es MAYOR!');
        } else if (previousNumber === this.currentNumber) {
          this.toastService.info('SON IGUALES!');
        } else {
          this.toastService.error('NO adivinaste!');
        }
        break;
    }

    if (this.currentIndex === 9) {
      this.activeGame = false;
      this.gameOver = true;

      if (this.puntaje >= 5) {
        this.victory = true;
        this.textGameOver = '¡GANASTE!';

        Swal.fire({
          icon: 'success',
          title: 'GANASTE!',
          text: 'Puntos ganados: ' + this.puntaje
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'PERDISTE!',
          text: 'Perdiste tus puntos :( '
        });

      }

      // GUARDAR EL PUNTAJE
      // this.createResult();
    }

  } // end of playMayorMenor

  async guardarPuntaje() {
    this.puntaje = await this.puntajeService.guardarPuntaje(
      this.puntaje,
      this.title
    );
  }

  empezarNuevoJuego() {
    this.router.navigateByUrl('/mayor-menor', { skipLocationChange: true }).then(() => this.router.navigate(['juegos/mayor-menor']));
  }

  // createResult() {
  //   let date = new Date();
  //   let currentDate = date.toLocaleDateString();
  //   let result = {
  //     game: 'mayorMenor',
  //     user: this.user,
  //     currentDate: currentDate,
  //     victory: this.victory,
  //   };
  //   this.authService
  //     .sendUserResult('mayorMenorResultados', result)
  //     .then((res) => {
  //       console.log('Resultados Enviados!');
  //     })
  //     .catch((err) => {
  //       console.log('Error al enviar Resultados!');
  //     });
  // } // end of createResult
}
