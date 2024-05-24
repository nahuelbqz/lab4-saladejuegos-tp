import { Injectable } from '@angular/core';
import { Firestore, getDocs, collection, addDoc, query, orderBy, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Puntaje } from '../clases/puntaje';
import { authState, updateProfile, getAuth } from '@angular/fire/auth';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PuntajesService {

  user$?: Observable<any | null>;
  puntajes: Puntaje[] = [];
  puntaje: number = 0;

  constructor(private firestore: Firestore) {
    getAuth().onAuthStateChanged(() => {
      this.user$ = new Observable((observer) => {
        observer.next(getAuth().currentUser);
      });
    });
  }

  private async obtenerUsuario(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user$?.subscribe(async (data) => {
        resolve(data);
      });
    });
  }


  async obtenerPuntajes(juego: string) {
    this.puntajes = [];
    const querySnapshot = await getDocs(collection(this.firestore, 'puntajes'));
    querySnapshot.forEach((doc) => {
      let puntaje = doc.data() as Puntaje;
      puntaje.id = doc.id;
      this.puntajes.push(puntaje);
    });
    this.puntajes = this.puntajes.filter((element) => element.juego === juego);
    return this.puntajes;
  }

  private async guardarPuntajeBase(puntaje: number, juego: string) {
    let usuario = await this.obtenerUsuario();
    let data = {
      usuario: usuario.displayName ? usuario.displayName : usuario.email,
      fecha: new Date().getTime(), //devuelve fecha en unix(milisegundos)
      puntaje: puntaje,
      juego: juego,
    };

    const usuarioRef = collection(this.firestore, 'puntajes');
    return addDoc(usuarioRef, data);
  }

  async guardarPuntaje(puntaje: number, juego: string) {
    this.puntaje = puntaje;
    if (puntaje !== 0) {
      await this.guardarPuntajeBase(puntaje, juego)
        .then(async (respuesta) => {
          // await Swal.fire('Puntaje guardado', '', 'success');
          console.log('Puntaje guardado:' + this.puntaje);
          this.puntaje = 0;
        })
        .catch((error) => {
          // Swal.fire('Error al guardar puntaje', '', 'error');
          console.log(error);
        });
    }
    else {
      Swal.fire('ERROR', 'No se puede guardar puntajes nulos', 'error');
    }

    return this.puntaje;
  }



  convertirFechaUnixAFechaNormal(fechaUnix: number): string {
    // Crea un nuevo objeto Date usando los milisegundos
    const fecha = new Date(fechaUnix);
    // Usa métodos de Date para obtener día, mes y año
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const año = fecha.getFullYear();

    const hora = fecha.getHours();
    const min = fecha.getMinutes();
    const seg = fecha.getSeconds();

    // Formatea la fecha como desees, por ejemplo: "DD/MM/AAAA"
    return `${dia}/${mes}/${año} ${hora}:${min}:${seg}`;
}
}
