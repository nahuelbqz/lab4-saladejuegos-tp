import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { PuntajesService } from '../../../services/puntajes.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent {

  toastService = inject(ToastrService);
  authService = inject(AuthService);

  user: any = null;
  
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  title = 'Ahorcado';
  palabraOculta = '';
  intentos = 0;
  gano = false;
  perdio = false;
  puntaje = 0;
  letras = [
    'a','b','c','d','e','f','g','h','i','j',
    'k','l','m','n','o','p','q','r','s','t',
    'u','v','w','x','y','z',
  ];
  
  botonesHabilitados: boolean[] = Array(this.letras.length).fill(true); // Inicialmente, todos los botones están habilitados

  palabras: string[] = [
    'Sandia','Manzana','Pera','Casa','Sol','Luna',
    'Arbol','Perro','Gato','Banana','Auto','Piano',
    'Libro','Guitarra','Pintura','Leon','Lobo','Flauta',
    'Chocolate','Pizza','Celular','Avion','Barco','Computadora'
  ];
  
  palabra = this.palabraAleatoria().toLowerCase();

  palabraAleatoria(): string {
    const indiceAleatorio = Math.floor(Math.random() * this.palabras.length);
    return this.palabras[indiceAleatorio];
  }

  constructor(private router: Router, private puntajeService: PuntajesService) {
    this.palabraOculta = '_ '.repeat(this.palabra.length);
  }

  comprobar(letra: any) {
    this.existeLetra(letra);
    const palabraOcultaArreglo = this.palabraOculta.split(' ');

    const indice = this.letras.indexOf(letra);
    if (indice !== -1) {
      this.botonesHabilitados[indice] = false;
    }

    for (let i = 0; i <= this.palabra.length; i++) {
      if (this.palabra[i] === letra) {
        palabraOcultaArreglo[i] = letra;
      }
    }
    this.palabraOculta = palabraOcultaArreglo.join(' ');
    this.verificaGanador();
  }

  verificaGanador() {
    const palabraArr = this.palabraOculta.split(' ');
    const palabraEvaluar = palabraArr.join('');

    if (palabraEvaluar === this.palabra) {
      this.gano = true;
      Swal.fire({
        icon: 'success',
        title: 'GANASTE!',
        text: 'Puntos ganados: ' + this.palabra.length,
      }).then(() => {
        this.puntaje += this.palabra.length;
        this.guardarPuntaje();
      });

      this.toastService.success('Puntaje guardado con exito!');

    }
    
    if (this.intentos === 7) {
      this.perdio = true;
      Swal.fire({
        icon: 'error',
        title: 'PERDISTE!',
        html: 'La palabra correcta era: <b>' + this.palabra + '</b>',
      });
    }
  }

  existeLetra(letra: any) {
    if (this.palabra.indexOf(letra) >= 0) {
    } else {
      this.intentos++;
    }
  }

  async guardarPuntaje() {
    this.puntaje = await this.puntajeService.guardarPuntaje(
      this.puntaje,
      this.title
    );
  }
  
  
  empezarNuevoJuego() {
    this.router.navigateByUrl('/ahorcado', { skipLocationChange: true }).then(() => this.router.navigate(['juegos/ahorcado']));
  }
  
}
