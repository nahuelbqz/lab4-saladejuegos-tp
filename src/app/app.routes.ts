import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent)
    },    
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent) // lazy loading con standalone components
        // component: LoginComponent 
    },    
    {
        path: 'quien-soy',
        loadComponent: () => import('./components/quien-soy/quien-soy.component').then((m) => m.QuienSoyComponent)
    }, 
    {
        path: 'registro',
        loadComponent: () => import('./components/registro/registro.component').then((m) => m.RegistroComponent)
    },      
    {
        path: 'chat',
        loadComponent: () => import('./components/chat/chat.component').then((m) => m.ChatComponent)
    },
    {
        path: 'juegos',
        loadComponent: () => import('./components/juegos/juegos.component').then((m) => m.JuegosComponent)
    },    
    {
        path: 'juegos/ahorcado',
        loadComponent: () => import('./components/juegos/ahorcado/ahorcado.component').then((m) => m.AhorcadoComponent) // lazy loading con standalone components
    },    
    {
        path: 'juegos/mayor-menor',
        loadComponent: () => import('./components/juegos/mayor-menor/mayor-menor.component').then((m) => m.MayorMenorComponent)
    },
    {
        path: 'juegos/preguntados',
        loadComponent: () => import('./components/juegos/preguntados/preguntados.component').then((m) => m.PreguntadosComponent)
    },    
    {
        path: 'juegos/mi-juego',
        loadComponent: () => import('./components/juegos/mi-juego/mi-juego.component').then((m) => m.MiJuegoComponent)
    },    
    {
        path: 'juegos/memograma',
        loadComponent: () => import('./components/juegos/memograma/memograma.component').then((m) => m.MemogramaComponent)
    },
    {
        path: 'error',
        loadComponent: () => import('./components/error/error.component').then((m) => m.ErrorComponent)
    },    
    {
        path: '',
        loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent)
    },     
    {
        path: '**', //siempre al final
        loadComponent: () => import('./components/error/error.component').then((m) => m.ErrorComponent)
        // component: ErrorComponent 
    }
    
];
