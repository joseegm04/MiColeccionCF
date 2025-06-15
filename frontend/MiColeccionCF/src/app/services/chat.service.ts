//Archivo que se comunica con el backend para el socket del chat y cargar los mensajes de conversaciones previas.
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../interfaces/mensaje';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: Socket;
  private socketUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  conectar(): Socket {
    this.socket = io(this.socketUrl, { withCredentials: true, transports: ['websocket'] });
    return this.socket;
  }

  getMensajes(idEmisor: number, idReceptor: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.socketUrl}/chat/${idEmisor}/${idReceptor}`, { withCredentials: true });
  }
}
