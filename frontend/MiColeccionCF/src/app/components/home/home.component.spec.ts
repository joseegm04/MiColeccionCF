//Archivo de tests del componente home
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { of, throwError } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { CromosService } from '../../services/cromos.service';
import { Coleccion, Usuario } from '../../interfaces/usuario';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUsuarioService: any;
  let mockCromosService: any;

  beforeEach(async () => {
    mockUsuarioService = {
      getMiUsuario: jasmine.createSpy('getMiUsuario').and.returnValue(of({}))
    }

    mockCromosService = {
      getColeccion: jasmine.createSpy('getColeccion').and.returnValue(of({})),
      insertarCromo: jasmine.createSpy('insertarCromo').and.returnValue(of({})),
      borrarCromo: jasmine.createSpy('borrarCromo').and.returnValue(of({}))
    }

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: CromosService, useValue: mockCromosService },
        { provide: 'Router', useValue: { navigate: jasmine.createSpy('navigate') } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar el usuario y las colecciones al iniciar', () => {
    const mockUsuario: Usuario = {
      id: 1,
      correo: 'usuario@mock.com',
      nombre_usuario: 'Usuario',
      ubicacion: 'Madrid',
      colecciones: { 
        'Coleccion 1': {
          nombre: 'Coleccion 1',
          equipos: [
            {
              nombre: 'Equipo 1',
              cromos: [
                { id: 1, numero: "1", nombre: 'Cromo 1', marcado: false }
              ]
            }
          ]
        }
      } 
    };

    const mockColeccion: Coleccion = {
      nombre: 'Coleccion 1',
      equipos: [
        {
          nombre: 'Equipo 1',
          cromos: [
            { id: 1, numero: "1", nombre: 'Cromo 1', marcado: false }
          ]
        }
      ]
    };

    mockUsuarioService.getMiUsuario.and.returnValue(of(mockUsuario));
    mockCromosService.getColeccion.and.returnValue(of({ colecciones: [mockColeccion] }));

    fixture.detectChanges();

    expect(mockUsuarioService.getMiUsuario).toHaveBeenCalled();
    expect(mockCromosService.getColeccion).toHaveBeenCalled();
    expect(component.usuario.nombre_usuario).toBe('Usuario');
    expect(component.coleccion1.nombre).toBe('Coleccion 1');
  });

  it('deberia manejar errores al cargar el usuario', () => {
    spyOn(console, 'error');
    mockUsuarioService.getMiUsuario.and.returnValue(throwError(() => new Error('Error al cargar el usuario')));
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('deberia guardar y borrar cromos correctamente', () => {
    component.usuario = {
      id: 1,
      correo: 'usuario@mock.com',
      nombre_usuario: 'Usuario',
      ubicacion: 'Madrid',
      colecciones: {}
    };

    const mockCromoMarcado = { id: 1, numero: "1", nombre: 'Cromo 1', marcado: true };
    const mockCromoSinMarcar = { id: 2, numero: "2", nombre: 'Cromo 2', marcado: false };

    const mockColeccion: Coleccion = {
      nombre: 'Coleccion 1',
      equipos: [{ nombre: 'Equipo 1', cromos: [mockCromoMarcado, mockCromoSinMarcar] }]
    };

    component.cromosCargados[1] = [2];

    component.cromosService = mockCromosService;
    component.guardarCromos(mockColeccion, 1);

    expect(mockCromosService.insertarCromo).toHaveBeenCalledWith(component.usuario.id, 1, 1);
    expect(mockCromosService.borrarCromo).toHaveBeenCalledWith(component.usuario.id, 2);
    expect(component.cromosCargados[1]).toEqual([1]);
  });
});
