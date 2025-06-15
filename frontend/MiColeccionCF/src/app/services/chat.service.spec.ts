//Archivo de tests del servicio del chat
import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Mensaje } from '../interfaces/mensaje';

describe('ChatService', () => {
  let service: ChatService;
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ChatService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe cargar los mensajes correctamente', () => {
    const mockMensajes: Mensaje[] = [
      { id: 1, contenido: 'Hola', id_emisor: 1, id_receptor: 2, fecha_envio: '2025-06-10T12:00:00Z' },
      { id: 2, contenido: '¿Cómo estás?', id_emisor: 2, id_receptor: 1, fecha_envio: '2025-06-10T12:00:00Z' }
    ];

    service.getMensajes(1, 2).subscribe(mensajes => {
      expect(mensajes).toEqual(mockMensajes);
    });
    const req = mockHttp.expectOne('http://localhost:3000/chat/1/2');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockMensajes);
  });

  it('debe conectar al socket correctamente', () => {
    const socket = service.conectar();
    expect(socket).toBeDefined();
    expect(typeof socket.io.on).toBe('function');
    expect(typeof socket.io.emit).toBe('function');
  });
});
