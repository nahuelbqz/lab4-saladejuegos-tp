import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { doc, setDoc, addDoc, collection, getDocs, orderBy, limit, query } from "firebase/firestore"; 
import { Observable, from } from 'rxjs';
import { MensajeInterface } from '../interface/mensaje';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  firestore : Firestore = inject(Firestore); 
  listaMensajes: any = [];

  crearMensaje(mensaje: any) {
    const promise = addDoc(collection(this.firestore, 'chats'), mensaje);
    
    return from(promise);
  }

  leerMensajes() : Observable<MensajeInterface[]>{
    const col = collection(this.firestore, 'chats');

    return collectionData(col, { idField: 'id' }) as Observable<MensajeInterface[]>;
  }

}
