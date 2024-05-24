import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiPaisesService {

  // http = inject(HttpClient);

  constructor() {}

  async getPaises() {
    try {
      const response: any = await fetch('https://restcountries.com/v3.1/all');
      const paises: any = await response.json();
      
      return paises;
      
      // return this.http.get('https://restcountries.com/v3.1/all');
    } catch (error) {
      console.log(error);
    }
  }
}
