//Archivo de tests del servicio de autenticacion
import { TestBed } from '@angular/core/testing';
import { AutenticacionService } from './autenticacion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginResponse } from '../interfaces/login';

describe('AutenticacionService', () => {
  let service: AutenticacionService;
  let mockHttp: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutenticacionService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AutenticacionService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer login correctamente', () => {
    const mockResponse: LoginResponse = { id: 1, nombre_usuario: 'usuario', correo: 'usuario@mock.com', ubicacion: 'Madrid', fecha_registro: '2025-01-01' };
    service.login('test', 'pass').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = mockHttp.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombreUsuario: 'test', password: 'pass' });
    req.flush(mockResponse);
  });

  it('debería registrar un nuevo usuario correctamente', () => {
    const mockResponse: LoginResponse = { id: 1, nombre_usuario: 'nuevoUsuario', correo: 'nuevo@mock.com', ubicacion: 'Madrid', fecha_registro: '2025-01-01' };
    service.register('nuevoUsuario', 'pass', 'nuevo@mock.com', 'Madrid').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = mockHttp.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombreUsuario: 'nuevoUsuario', password: 'pass', correo: 'nuevo@mock.com', ubicacion: 'Madrid' });
    req.flush(mockResponse);
  });

  it('deberia hacer logout correctamente', () => {
    const mockResponse = { mensaje: 'Logout correcto' };
    service.logout().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = mockHttp.expectOne(`${apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

  it('deberia checkear si el usuario esta autenticado', () => {
    const mockResponse = { usuario: { nombreUsuario: 'test' } };
    service.check().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = mockHttp.expectOne(`${apiUrl}/check`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});