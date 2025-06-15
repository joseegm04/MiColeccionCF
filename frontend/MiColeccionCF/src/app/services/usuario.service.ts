//Archivo que se comunica con el backend para obtener los datos de los usuarios
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/usuario';

  getMiUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}`, {withCredentials: true});
  }

  getUsuariosCercanos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuariosCercanos`, {withCredentials: true});
  }

  getUsuario(nombre_usuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${nombre_usuario}`, {withCredentials: true});
  }
}
