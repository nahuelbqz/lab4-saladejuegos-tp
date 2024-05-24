import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-juego',
  standalone: true,
  imports: [RouterLink,NgIf,NgFor],
  templateUrl: './mi-juego.component.html',
  styleUrl: './mi-juego.component.css'
})
export class MiJuegoComponent {
  numSquares: number = 9;
  colors: string[] = [];
  pickedColor: string = '';
  message: string = '';
  h1BackgroundColor: string = '#2C8E99';
  failCount: number = 0;
  maxFails: number = 5;
  user :any = null;


  authService = inject(AuthService);
  toastService = inject(ToastrService)
  router = inject(Router);


  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
        this.init();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  init(): void {
    this.colors = this.genRandomColors(this.numSquares);
    this.pickedColor = this.chooseColor();
    this.message = '';
    this.h1BackgroundColor = '#2C8E99';
    this.failCount = 0;
    this.updateSquares();
  }

  reset(): void {
    this.colors = this.genRandomColors(this.numSquares);
    this.pickedColor = this.chooseColor();
    this.h1BackgroundColor = '#2C8E99';
    this.message = '';
    this.failCount = 0;
    this.updateSquares();
  }

  handleSquareClick(clickedColor: string, square: HTMLElement): void {
    if (clickedColor === this.pickedColor) {
      this.message = 'Correct';
      this.changeColors(this.pickedColor);
      
      this.toastService.success( 'Es ese color!','CORRECTO!');
      
      Swal.fire({
        icon: 'success',
        title: 'GANASTE!',
        // text: 'Puntos ganados: ' + this.puntaje
      }).then( () => this.disableSquares() );

    } else {
      square.style.backgroundColor = '#232323';
      this.message = 'Try again';
      this.failCount++;

      this.toastService.error( 'Intentalo nuevamente','NO ES ESE COLOR!');

      if (this.failCount >= this.maxFails) {
        this.message = 'Game Over';
        this.disableSquares();

        Swal.fire({
          icon: 'error',
          title: 'PERDISTE!',
          text: 'Perdiste tus puntos!'
        });

      }
    }
  }

  disableSquares(): void {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
      (square as HTMLElement).style.pointerEvents = 'none';
    });
  }

  changeColors(color: string): void {
    this.colors = this.colors.map(() => color);
    this.h1BackgroundColor = color;
  }

  chooseColor(): string {
    const random = Math.floor(Math.random() * this.colors.length);
    return this.colors[random];
  }

  genRandomColors(num: number): string[] {
    const arr: string[] = [];
    for (let i = 0; i < num; i++) {
      arr.push(this.makeColor());
    }
    return arr;
  }

  makeColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  updateSquares(): void {
    const squares = document.querySelectorAll('.square');
    squares.forEach((square, index) => {
      if (this.colors[index]) {
        (square as HTMLElement).style.display = 'block';
        (square as HTMLElement).style.backgroundColor = this.colors[index];
        (square as HTMLElement).style.pointerEvents = 'auto';
      } else {
        (square as HTMLElement).style.display = 'none';
      }
    });
  }


  empezarNuevoJuego() {
    this.router.navigateByUrl('/mi-juego', { skipLocationChange: true }).then(() => this.router.navigate(['juegos/mi-juego']));
  }

}




