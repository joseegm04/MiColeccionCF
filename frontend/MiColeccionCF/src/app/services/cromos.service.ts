import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColeccionesResponse } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class CromosService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/cromos';

  getColeccion(): Observable<ColeccionesResponse> {
    return this.http.get<ColeccionesResponse>(`${this.apiUrl}/`, {withCredentials: true});
  }

  insertarCromo(idUsuario: number, idCromo: number, idColeccion: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/insertarCromo`, { idUsuario, idCromo, idColeccion }, {withCredentials: true});
  }

  borrarCromo(idUsuario: number, idCromo: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/borrarCromo`, { params: { idUsuario, idCromo }, withCredentials: true });
  }
}
