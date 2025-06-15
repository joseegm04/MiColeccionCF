//Archivo de tests del componente perfil
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { of, throwError } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { CromosService } from '../../services/cromos.service';
import { ActivatedRoute } from '@angular/router';
import { Coleccion, Usuario } from '../../interfaces/usuario';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let mockUsuarioService: any;
  let mockCromosService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockUsuarioService = {
      getUsuario: jasmine.createSpy('getUsuario')
    };
    
    mockCromosService = {
      getColeccion: jasmine.createSpy('getColeccion')
    };

    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => key === 'nombre_usuario' ? 'UsuarioTest' : null
      })
    };

    await TestBed.configureTestingModule({
      declarations: [PerfilComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: CromosService, useValue: mockCromosService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar el usuario y llamar a cargarColeccion al iniciar', () => {
    const mockUsuario: Usuario = {
      id: 1,
      nombre_usuario: 'UsuarioTest',
      correo: 'usuario@mock.com',
      ubicacion: 'Málaga',
      colecciones: {
        'Coleccion 1': {
          nombre: 'Coleccion1',
          equipos: [
            { nombre: 'Equipo1', cromos: [
              {id: 1, numero: "1", nombre: 'Cromo 1', marcado: false }
            ]}
          ]
        }
      }
    };

    const mockColeccion: Coleccion = {
      nombre: 'Coleccion1',
      equipos: [
        { nombre: 'Equipo1', cromos: [
          {id: 1, numero: "1", nombre: 'Cromo 1', marcado: false }
        ]}
      ]
    };

    mockUsuarioService.getUsuario.and.returnValue(of(mockUsuario));
    mockCromosService.getColeccion.and.returnValue(of({ colecciones: [mockColeccion, { nombre: 'Coleccion2', equipos: [] }] }));
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.usuario).toEqual(mockUsuario);
    expect(component.coleccion1).toBeDefined();
  });

  it('deberia cargar la coleccion y marcar los cromos', () => {
    const mockUsuario: Usuario = {
      id: 1,
      nombre_usuario: 'UsuarioTest',
      correo: 'usuario@mock.com',
      ubicacion: 'Málaga',
      colecciones: {
        'Coleccion 1': {
          nombre: 'Coleccion1',
          equipos: [
            { nombre: 'Equipo1', cromos: [
              {id: 1, numero: "1", nombre: 'Cromo 1', marcado: false }
            ]}
          ]
        }
      }
    };

    const mockColeccion: Coleccion = {
      nombre: 'Coleccion1',
      equipos: [
        { nombre: 'Equipo1', cromos: [
          {id: 1, numero: "1", nombre: 'Cromo 1', marcado: false }
        ]}
      ]
    };

    component.usuario = mockUsuario;
    mockCromosService.getColeccion.and.returnValue(of({colecciones: [mockColeccion, { nombre: 'Coleccion2', equipos: [] }]}));
    component.cargarColeccion();
    expect(component.coleccion1).toEqual(mockColeccion);
  });

  it('deberia marcar un cromo', () => {
    const mockColeccion: Coleccion = {
      nombre: 'Coleccion1',
      equipos: [
        { nombre: 'Equipo1', cromos: [
          {id: 1, numero: "1", nombre: 'Cromo 1', marcado: false },
          {id: 2, numero: "2", nombre: 'Cromo 2', marcado: false }
        ]}
      ]
    };

    const mockColeccionUsuario: Coleccion = {
      nombre: 'Coleccion1',
      equipos: [
        { nombre: 'Equipo1', cromos: [
          {id: 1, numero: "1", nombre: 'Cromo 1', marcado: false }
        ]}
      ]
    };

    component.marcarCromo(mockColeccion, mockColeccionUsuario);
    expect(mockColeccion.equipos[0].cromos[0].marcado).toBeTrue();
    expect(mockColeccion.equipos[0].cromos[1].marcado).toBeFalse();
  });

  it('deberia manejar errores al cargar la coleccion', () => {
    component.usuario = {
      id: 1,
      nombre_usuario: 'UsuarioTest',
      correo: 'usuario@mock.com',
      ubicacion: 'Málaga',
      colecciones: {
        'Coleccion 1': {
          nombre: 'Coleccion1',
          equipos: [
            { nombre: 'Equipo1', cromos: [
              {id: 1, numero: "1", nombre: 'Cromo 1', marcado: false }
            ]}
          ]
        }
      }
    };
    spyOn(console, 'error');
    mockCromosService.getColeccion.and.returnValue(throwError(() => new Error('Error al cargar la colección')));
    component.cargarColeccion();
    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
  });

});
