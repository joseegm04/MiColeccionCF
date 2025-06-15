//Archivo de tests del componente chat
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { ChatService } from '../../services/chat.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockUsuarioService: any;
  let mockChatService: any;
  let mockActivatedRoute: any;
  let mockSocket: any;

  beforeEach(async () => {
    mockSocket = {
      emit: jasmine.createSpy('emit'),
      on: jasmine.createSpy('on'),
      off: jasmine.createSpy('off'),
      disconnect: jasmine.createSpy('disconnect')
    };

    mockUsuarioService = {
      getUsuario: jasmine.createSpy('getUsuario'),
      getMiUsuario: jasmine.createSpy('getMiUsuario')
    };

    mockChatService = {
      conectar: jasmine.createSpy('conectar').and.returnValue(mockSocket),
      getMensajes: jasmine.createSpy('getMensajes')
    };

    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => key === 'nombre_usuario' ? 'receptor' : null
      })
    };

    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: ChatService, useValue: mockChatService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener el nombre del receptor desde la ruta', () => {
    mockUsuarioService.getUsuario.and.returnValue(of({ id: 2 }));
    mockUsuarioService.getMiUsuario.and.returnValue(of({ id: 1 }));
    mockChatService.getMensajes.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component.nombre_receptor).toBe('receptor');
  });

  it('debe cargar el usuario receptor y el emisor al iniciar', () => {
    mockUsuarioService.getUsuario.and.returnValue(of({ id: 2 }));
    mockUsuarioService.getMiUsuario.and.returnValue(of({ id: 1 }));
    mockChatService.getMensajes.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component.idReceptor).toBe(2);
    expect(component.idEmisor).toBe(1);
  });

  it('debe conectar el socket y cargar mensajes al iniciar', () => {
    mockUsuarioService.getUsuario.and.returnValue(of({ id: 2 }));
    mockUsuarioService.getMiUsuario.and.returnValue(of({ id: 1 }));
    mockChatService.getMensajes.and.returnValue(of([]));
    fixture.detectChanges();
    expect(mockChatService.conectar).toHaveBeenCalled();
    expect(mockSocket.emit).toHaveBeenCalledWith('abrirChat', { id_emisor: 1, id_receptor: 2 });
    expect(mockChatService.getMensajes).toHaveBeenCalledWith(1, 2);
  });

  it('no debe conectar ni cargar mensajes si el usuario receptor no existe', () => {
    mockUsuarioService.getUsuario.and.returnValue(of(null));
    fixture.detectChanges();
    expect(component.idReceptor).toBeUndefined();
    expect(mockChatService.conectar).not.toHaveBeenCalled();
  });

  it('debe cargar mensajes correctamente', () => {
    const mensajes = [
      { contenido: 'Hola', id_emisor: 1, id_receptor: 2, fecha_envio: new Date().toISOString() }
    ];
    mockUsuarioService.getUsuario.and.returnValue(of({ id: 2 }));
    mockUsuarioService.getMiUsuario.and.returnValue(of({ id: 1 }));
    mockChatService.getMensajes.and.returnValue(of(mensajes));
    fixture.detectChanges();
    expect(component.mensajes.length).toBe(1);
    expect(typeof component.mensajes[0].fecha_envio).toBe('string');
  });

  it('debe enviar un mensaje correctamente', () => {
    component.idEmisor = 1;
    component.idReceptor = 2;
    component.mensaje = 'Test';
    component.socket = mockSocket;
    component.enviarMensaje();
    expect(mockSocket.emit).toHaveBeenCalledWith('enviarMensaje', jasmine.objectContaining({
      contenido: 'Test',
      id_emisor: 1,
      id_receptor: 2
    }));
    expect(component.mensaje).toBe('');
  });

  it('no debe enviar mensaje si el campo está vacío', () => {
    component.mensaje = '   ';
    component.socket = mockSocket;
    component.enviarMensaje();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it('debe limpiar el socket al destruir el componente', () => {
    component.socket = mockSocket;
    component.ngOnDestroy();
    expect(mockSocket.off).toHaveBeenCalledWith('recibirMensaje');
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('debe manejar errores de servicios', () => {
    spyOn(console, 'error');
    mockUsuarioService.getUsuario.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalled();
  });
});