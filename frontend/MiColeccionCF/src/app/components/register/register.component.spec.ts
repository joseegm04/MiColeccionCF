//Archivo de tests del componente register
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAutenticacionService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAutenticacionService = {
      register: jasmine.createSpy('register')
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AutenticacionService, useValue: mockAutenticacionService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia llamar al register con los datos correctos', () => {
    const mockCredenciales = { nombreUsuario: 'usuario@mock.com', password: 'password', correo: 'usuario@mock.com', ubicacion: 'Madrid' };
    component.registerData = mockCredenciales;
    mockAutenticacionService.register.and.returnValue(of({}));
    component.onRegister();
    expect(mockAutenticacionService.register).toHaveBeenCalledWith(mockCredenciales.nombreUsuario, mockCredenciales.password, mockCredenciales.correo, mockCredenciales.ubicacion);
  });

  it('debería navegar a /login si el registro es exitoso', () => {
    const mockCredenciales = { nombreUsuario: 'usuario@mock.com', password: 'password', correo: 'usuario@mock.com', ubicacion: 'Madrid' };
    component.registerData = mockCredenciales;
    mockAutenticacionService.register.and.returnValue(of({}));
    component.onRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería mostrar mensaje de error en caso de fallo en el registro', () => {
    const errorResponse = { error: {} };
    const mockCredenciales = { nombreUsuario: 'usuario@mock.com', password: 'password', correo: 'usuariomock.com', ubicacion: 'Madrid' };
    component.registerData = mockCredenciales;
    mockAutenticacionService.register.and.returnValue(throwError(() => errorResponse));
    component.onRegister();
    expect(component.mensajeError).toBe('Error al registrar el usuario');
  });
});
