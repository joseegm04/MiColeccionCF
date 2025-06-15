import { TestBed } from '@angular/core/testing';

import { CromosService } from './cromos.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ColeccionesResponse } from '../interfaces/usuario';

describe('CromosService', () => {
  let service: CromosService;
  let mockHttp: HttpTestingController;
  const apiUrl = 'http://localhost:3000/cromos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CromosService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener la colección', () => {
    const mockResponse: ColeccionesResponse = {
      colecciones: [
        { nombre: 'Colección 1', equipos: [] }
      ]
    };

    service.getColeccion().subscribe(coleccion => {
      expect(coleccion).toEqual(mockResponse);
    });
    const req = mockHttp.expectOne(`${apiUrl}/`); 
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResponse);
  });

  it('debería insertar un cromo', () => {
    const mockResponse = 1;

    service.insertarCromo(1, 2, 3).subscribe(id => {
      expect(id).toEqual(mockResponse);
    });
    const req = mockHttp.expectOne(`${apiUrl}/insertarCromo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.body).toEqual({ idUsuario: 1, idCromo: 2, idColeccion: 3 });
    req.flush(mockResponse);
  });

  it('debería borrar un cromo', () => {
    const mockResult = { mensaje: 'Cromo borrado' };
    service.borrarCromo(1, 2).subscribe(res => {
      expect(res).toEqual(mockResult);
    });
    const req = mockHttp.expectOne(
      r => r.method === 'DELETE' && r.url === `${apiUrl}/borrarCromo`
    );
    expect(req.request.params.get('idUsuario')).toBe('1');
    expect(req.request.params.get('idCromo')).toBe('2');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResult);
  });
});
