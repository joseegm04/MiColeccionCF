//Componente del chat.
import { Component, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
import { Socket } from 'socket.io-client';
import { Mensaje } from '../../interfaces/mensaje';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  public mensajes: Mensaje[] = [];
  public mensaje: string = '';
  public idEmisor!: number;
  public idReceptor!: number;
  public nombre_receptor!: string;
  public socket!: Socket;
  public usuario!: Usuario;
  @ViewChild('scrollContainer') scrollContainer!: any;
  
  constructor(private usuarioService: UsuarioService, private chatService: ChatService, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.nombre_receptor = params.get('nombre_usuario') ?? '';
    });

    this.usuarioService.getUsuario(this.nombre_receptor).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.idReceptor = usuario.id;
        this.usuarioService.getMiUsuario().subscribe({
          next: (usuario) => {
            this.idEmisor = usuario.id;
            this.conectarSocket();
            this.cargarMensajes();
          },
          error: (err) => {
            console.error(err);
          }
        });
      },
      error: (err) => {
        console.error(err);
      }
    });

    
  }

  conectarSocket(): void {
    this.socket = this.chatService.conectar();

    this.socket.emit('abrirChat', { id_emisor: this.idEmisor, id_receptor: this.idReceptor });
    this.socket.on('recibirMensaje', (mensaje: Mensaje) => {
      mensaje.fecha_envio = new Date(mensaje.fecha_envio).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      this.mensajes.push(mensaje);
      this.scrollAbajo();
    })
  }

  cargarMensajes(): void {
    this.chatService.getMensajes(this.idEmisor, this.idReceptor).subscribe({
      next: (res) => {
        this.mensajes = res.map(mensaje => ({
          ...mensaje,
          fecha_envio: new Date(mensaje.fecha_envio).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        }));
        this.scrollAbajo();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  enviarMensaje(): void {
    if (!this.mensaje.trim()) {
      return;
    }

    const mensaje: Mensaje = {
      contenido: this.mensaje,
      id_emisor: this.idEmisor,
      id_receptor: this.idReceptor,
      fecha_envio: new Date().toISOString()
    };

    this.socket.emit('enviarMensaje', mensaje);
    this.mensaje = '';
    this.scrollAbajo();
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    } 
  }

  scrollAbajo(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    });
  }
}
