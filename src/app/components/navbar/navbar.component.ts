import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  router = inject(Router);
  authService = inject(AuthService);
  toastServ = inject(ToastrService);
  isLogged = false;

  ngOnInit():void{
    this.authService.user$.subscribe((user)=> {
      if(user){
        this.authService.currentUserSig.set({
          email: user.email!,
          nombre: user.displayName!,
        });
        this.isLogged = true;
      } else {
        this.authService.currentUserSig.set(null);
        this.isLogged = false;
      }

      console.log(this.authService.currentUserSig());
    
    });
  }

  cerrarSesion() : void{
    this.authService.cerrarSesionDeUsuario();
    this.isLogged = false;
    this.authService.currentUserSig.set(null);

    console.log('Sesion cerrada');
    this.toastServ.info('La sesion cerrada correctamente', 'Fin de sesion');
    
    this.router.navigateByUrl('login');
  }

}
