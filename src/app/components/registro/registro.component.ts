import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  authService = inject(AuthService)
  toastServ = inject(ToastrService);
  form: any;

  constructor(private router: Router){
    
  }
  
  
  protected username!:string;
  protected email!:string;
  protected password!:string;

  errorMessage : string | null = null

  onRegistrarse():void {
    //const rawForm = this.form.getRawValue();
    this.authService.registrarNuevoUsuario(this.email, this.username, this.password)
    .subscribe({
      next:() =>{
      this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.errorMessage = err.code;
        console.log(this.errorMessage);
        this.toastServ.warning('Intentelo nuevamente','Error al registrarse');
      }
    });
    // agregarle verificaion para todos LOS CASOS DE ERROR
  }




}
