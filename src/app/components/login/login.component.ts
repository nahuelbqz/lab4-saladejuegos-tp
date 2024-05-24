import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

import { doc, setDoc } from "firebase/firestore"; 

// interface logUsuario {
//   user: string,
//   fechaIngreso:string;
// };

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router){
  }

  toastService = inject(ToastrService);
  authService = inject(AuthService);

  protected email:string="";
  protected password:string="";
  errorMessage : string | null = null;
  
  onIniciarSesion():void {
    this.authService.loginDeUsuario(this.email, this.password)
    .subscribe({
      next:() =>{
        this.router.navigateByUrl('/home');

        this.crearLogUsuario();

        console.log('Logueo exitoso');
        this.toastService.success('Logueo exitoso!');
      },
      error: (err) => {
        this.errorMessage = err.code;
        console.log(this.errorMessage);
        console.log('Error al loguear');
        
        this.toastService.warning('Verifique sus datos', 'Error al inciar sesion');
      }
    });
    // agregarle verificaion minimo 6 caracteres
  }

  onAccesoRapido(numero:number):void {
    switch(numero) {
      case 1:
        this.email = 'admin@admin.com';
        this.password = 'soyadmin';
        this.toastService.info('Administrador', 'Campos cargados')
        break;
      case 2:
        this.email = 'invitado@invitado.com';
        this.password = 'soyinvitado';
        this.toastService.info('Invitado', 'Campos cargados')
        break;
      default:
        break;
    }
    
  }
  
  reiniciar(){
    this.email="";
    this.password="";
  }

  crearLogUsuario() {
    const todayDate = new Date();//ej Thu May 09 2024 10:54:46 GMT-0300 
    const currentDate = (todayDate.getFullYear() + '-' + ((todayDate.getMonth() + 1)) + '-' + todayDate.getDate() + ' ' +todayDate.getHours() + ':' + todayDate.getMinutes()+ ':' + todayDate.getSeconds());
    // console.log(currentDate);

    const log = {
      user: this.email,
      fechaIngreso: currentDate,
    };

    try {
      this.authService.crearLogUsuario('logUsuarios', log);
      console.log('Log Creado');
    } catch (error) {
      console.log('Error al crear el log' + error);
    }
  } // end of createLog



}//loginComponent
