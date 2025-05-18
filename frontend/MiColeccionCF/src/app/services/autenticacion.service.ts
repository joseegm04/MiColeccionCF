import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../interfaces/login';
import { Observable } from 'rxjs';
import { RegisterResponse } from '../interfaces/register';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000';

  login(nombreUsuario: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { nombreUsuario, password }, {withCredentials: true});
  }

  register(nombreUsuario: string, password: string, correo: string, ubicacion: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { nombreUsuario, password, correo, ubicacion }, {withCredentials: true});
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, {withCredentials: true});
  }
}
