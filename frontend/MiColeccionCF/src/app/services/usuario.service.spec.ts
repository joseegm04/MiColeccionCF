//Archivo de tests del servicio de los usuarios
import { TestBed } from '@angular/core/testing';

import { UsuarioService } from './usuario.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Usuario } from '../interfaces/usuario';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let mockHttp: HttpTestingController;
  const apiUrl = 'http://localhost:3000/usuario';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UsuarioService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener el usuario que ha iniciado sesión', () => {
    const mockUsuario: Usuario = {
      id: 1,
      nombre_usuario: 'testUser',
      correo: 'usuario@mock.com',
      ubicacion: 'Madrid'
    };

    service.getMiUsuario().subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });
    const req = mockHttp.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockUsuario);
  });

  it('deberia obtener los usuarios cercanos', () => {
    const mockUsuarios: Usuario[] = [
      { id: 2, nombre_usuario: 'cerca1', correo: 'cerca1@mock.com', ubicacion: 'Madrid' },
      { id: 3, nombre_usuario: 'cerca2', correo: 'cerca2@mock.com', ubicacion: 'Madrid' }
    ];

    service.getUsuariosCercanos().subscribe(usuarios => {
      expect(usuarios).toEqual(mockUsuarios);
    });
    const req = mockHttp.expectOne(`${apiUrl}/usuariosCercanos`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockUsuarios);
  });

  it('deberia obtener un usuario por su nombre de usuario', () => {
    const mockUsuario: Usuario = { id: 4, nombre_usuario: 'usuario', correo: 'usuario@mock.com', ubicacion: 'Madrid' };

    service.getUsuario('usuario').subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });
    const req = mockHttp.expectOne(`${apiUrl}/${mockUsuario.nombre_usuario}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockUsuario);
  });
});
