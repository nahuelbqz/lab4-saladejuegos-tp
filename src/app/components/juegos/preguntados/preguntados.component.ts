import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiPaisesService } from '../../../services/api-paises.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [NgClass,NgIf,NgForOf,RouterLink],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent {
  user: any = null;
  listOfCountries: any = [];
  listOfQuestions: any = [];
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  gameOverText: string = 'PERDISTE!';
  score: number = 0;
  attempts: number = 10;
  currentQuestion: any = null;
  loadedQuestions: boolean = false;
  currentIndex: number = 0;
  correctAnswer: boolean = false;
  wrongAnswer: boolean = false;

  toastService = inject(ToastrService);
  router = inject(Router);
  authService = inject(AuthService);
  apiPaises = inject(ApiPaisesService);

  constructor(){
     this.apiPaises.getPaises();
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(async (user: any) => {
      if (user) {
        this.user = user;

        // this.apiPaises.getPaises().subscribe(
        //   (data: any) => {
        //     this.arrayPreguntas = data.results; // array de preguntas - respuestas
        //     console.log(this.arrayPreguntas);
        //     this.pasarProximaPregunta();
        //   },
        //   (err) => {
        //     console.log(err);
        //   }
        // );
        
        const paises = await this.apiPaises.getPaises();
        this.listOfCountries = paises.map((country: any) => {
          return {
            name: country.translations.spa.official,
            flag: country.flags.png,
          };
        });
        
        this.startGame();
      } else {
        this.router.navigate(['/login']);
      }
    });
  } // end of ngOnInit

  startGame() {
    this.generateQuestions();
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    this.activeGame = true;
    this.toastService.info('Juego iniciado', 'Preguntados');
  } // end of startGame

  generateQuestions() {
    this.listOfCountries.sort(() => Math.random() - 0.5);
    this.listOfQuestions = this.listOfCountries
      .slice(0, 10)
      .map((country: any) => {
        const option2 = this.listOfCountries[this.generateRandomNumber()].name;
        const option3 = this.listOfCountries[this.generateRandomNumber()].name;
        const option4 = this.listOfCountries[this.generateRandomNumber()].name;
        const options = [country.name, option2, option3, option4].sort(
          () => Math.random() - 0.5
        );
        return {
          answer: country.name,
          options: options,
          flag: country.flag,
        };
      });
    this.loadedQuestions = true;
  } // end of generateQuestions

  generateRandomNumber() {
    return Math.floor(Math.random() * 249);
  } // end of generateRandomNumber

  play(option: string, event: Event) {
    if (this.activeGame) {
      const btn = <HTMLButtonElement>event.target;
      btn.disabled = true;
      if (option === this.currentQuestion.answer) {
        this.score++;
        this.correctAnswer = true;
        setTimeout(() => {
          this.correctAnswer = false;
        }, 300);
        this.toastService.success(`Adivinaste!, es ${this.currentQuestion.answer}` , 'Preguntados');
      } else {
        this.wrongAnswer = true;
        setTimeout(() => {
          this.wrongAnswer = false;
        }, 300);
        this.toastService.error(
          `Incorrecto!, era ${this.currentQuestion.answer}`,
          'Preguntados'
        );
      }

      if (this.currentIndex < 9) {
        this.currentIndex++;
        setTimeout(() => {
          this.currentQuestion = this.listOfQuestions[this.currentIndex];
        }, 500);
      }

      if (this.attempts > 0) {
        this.attempts--;
        if (this.attempts === 0) {
          this.activeGame = false;
          this.gameOver = true;
          if (this.score >= 4) {
            this.victory = true;
            this.gameOverText = 'GANASTE!';
            this.toastService.success('GANASTE!', 'Preguntados');
          } else {
            this.toastService.error('PERDISTE!', 'Preguntados');
          }

          //RESULTADO
          // this.createResult();

        }
      }
    }
  } // end of play

  restartGame() {
    this.generateQuestions();
    this.currentIndex = 0;
    this.score = 0;
    this.attempts = 10;
    this.activeGame = true;
    this.victory = false;
    this.gameOver = false;
    this.gameOverText = 'PERDISTE!';
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    this.toastService.info('Juego Reiniciado', 'Preguntados');
  } // end of restartGame

  // createResult() {
  //   const date = new Date();
  //   const currentDate = date.toLocaleDateString();
  //   const result = {
  //     game: 'preguntados',
  //     user: this.user,
  //     currentDate: currentDate,
  //     victory: this.victory,
  //   };
  //   this.authService
  //     .sendUserResult('preguntadosResultados', result)
  //     .then((res: any) => {
  //       console.log('Resultados Enviados!');
  //     })
  //     .catch((err: any) => {
  //       console.log('Error al enviar Resultados!');
  //     });
  // } // end of createResult

}
