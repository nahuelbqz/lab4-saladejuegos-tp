import { Injectable, inject, signal } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Usuario } from '../clases/usuario';

import { doc, setDoc, collection, addDoc} from "firebase/firestore"; 
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  firebaseAuth = inject(Auth);

  firestore : Firestore = inject(Firestore); 

  user$ = user(this.firebaseAuth);//retorna la info del usuario
  currentUserSig = signal<Usuario | null | undefined>(undefined);

  registrarNuevoUsuario(email:string, username:string, password:string): Observable<void>{
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password    
    ).then(response => updateProfile(response.user, {displayName: username}))
  
    return from(promise);
  }

  loginDeUsuario(email:string, password:string):Observable<void>{
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {});
    return from(promise);
  }
  
  cerrarSesionDeUsuario():Observable<void>{
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  crearLogUsuario(collectionName: string, log: any) {
    // return this.getFirestore.collection(collectionName).add(log);

    const db = this.firestore;
    
    const docRef = addDoc(collection(db, collectionName), log);
    //console.log("Document written with ID: ", docRef); //docRef.id
    
  }




}
