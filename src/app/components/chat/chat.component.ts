import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MensajeInterface } from '../../interface/mensaje';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  authService = inject(AuthService);
  chatService = inject(ChatService);
  toastService = inject(ToastrService);
  router = inject(Router);

  nuevoMensaje: string = "";
  listaMensajes: any = [];
  user : any = null;

  constructor(){
  }

  mensaje?: MensajeInterface[] = [];

  ngOnInit(): void
  {
    //si no esta log lo mando al login
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['/login']);
      }
    });

    this.chatService.leerMensajes().subscribe((mensajesLeidos) => {
      // mensajesLeidos.forEach(msj => {
      //   console.log(msj.fecha);
      // });

      mensajesLeidos.sort((a, b) => {
        const timestampA = this.convertDateToUnix(a.fecha);
        const timestampB = this.convertDateToUnix(b.fecha);

        return timestampA - timestampB;
      })

      this.mensaje = mensajesLeidos;
    });

      // console.log(this.mensaje?.forEach(msj => { msj.user}));
  }

  enviarMensaje() {
    if (this.nuevoMensaje.trim() == '') {
      this.toastService.info('Debes escribir un mensaje');
      return;
    }
    const todayDate = new Date();
    const currentDate = (todayDate.getDate() + '-' + ((todayDate.getMonth() + 1)) + '-' + todayDate.getFullYear() + ' ' +todayDate.getHours() + ':' + todayDate.getMinutes()+ ':' + todayDate.getSeconds());
    //console.log(currentDate);

    const mensaje = {
      user: this.authService.currentUserSig()?.email,
      texto: this.nuevoMensaje,
      fecha: currentDate
    };
    this.chatService.crearMensaje(mensaje);
    this.nuevoMensaje = '';
    // this.scrollToTheLastElementByClassName();
  } // end of sendMessage

  //FALTA ORDENAR LOS MENSAJES POR FECHA 


  
  convertDateToUnix(fecha: any) : number{
    const initialDate = fecha;
    const splitDate = initialDate.split(' ');
    const date = splitDate[0].split('-');
    const time = splitDate[1].split(':');
    const dd = date[0];
    const mm = date[1] - 1;
    const yyyy = date[2];
    const hh = time[0];
    const min = time[1];
    const ss = time[2];
    const dateDate = new Date(yyyy, mm, dd, hh, min, ss);

    return dateDate.getTime();//la fecha en formato unix
  } // end of convertDateToUnix


}//end of chatComponent
