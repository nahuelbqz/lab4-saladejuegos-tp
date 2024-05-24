import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideToastr } from 'ngx-toastr';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    importProvidersFrom(provideFirebaseApp(() => initializeApp({apiKey: "AIzaSyD3OTsCBinoPN86tGog91IifEfU772zupE",
    authDomain: "tp-saladejuegos-f1e04.firebaseapp.com",
    projectId: "tp-saladejuegos-f1e04",
    storageBucket: "tp-saladejuegos-f1e04.appspot.com",
    messagingSenderId: "299541075715",
    appId: "1:299541075715:web:ff3fda98ce2090accabb36"
  }))),
    importProvidersFrom(provideAuth(() => getAuth())),
    provideAnimations(),
    provideToastr({timeOut:2000, preventDuplicates:true, positionClass:'toast-bottom-right'}),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"tp-saladejuegos-f1e04","appId":"1:299541075715:web:ff3fda98ce2090accabb36","storageBucket":"tp-saladejuegos-f1e04.appspot.com","apiKey":"AIzaSyD3OTsCBinoPN86tGog91IifEfU772zupE","authDomain":"tp-saladejuegos-f1e04.firebaseapp.com","messagingSenderId":"299541075715"}))),
    importProvidersFrom(provideFirestore(() => getFirestore())),

  ]
};
