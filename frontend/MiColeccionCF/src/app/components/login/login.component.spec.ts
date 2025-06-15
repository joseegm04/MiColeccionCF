//Archivo de tests del componente login
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAutenticacionService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAutenticacionService = {
      login: jasmine.createSpy('login')
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AutenticacionService, useValue: mockAutenticacionService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia llamar al login con los datos correctos', () => {
    const mockCredenciales = { nombreUsuario: 'usuario@mock.com', password: 'password' };
    component.loginData = mockCredenciales;
    mockAutenticacionService.login.and.returnValue(of({}));
    component.onLogin();
    expect(mockAutenticacionService.login).toHaveBeenCalledWith(mockCredenciales.nombreUsuario, mockCredenciales.password);
  });

  it('deberia redirigir al home en caso de login exitoso', () => {
    const mockCredenciales = { nombreUsuario: 'usuario@mock.com', password: 'password' };
    component.loginData = mockCredenciales;
    mockAutenticacionService.login.and.returnValue(of({}));
    component.onLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debe mostrar un mensaje de error en caso de fallo en el login', () => {
    const mockCredenciales = { nombreUsuario: 'usuario@mock.com', password: 'wrong password' };
    const errorResponse = { error: {} };
    mockAutenticacionService.login.and.returnValue(throwError(() => errorResponse));
    component.loginData = mockCredenciales;
    component.onLogin();
    expect(component.mensajeError).toBe('Error al iniciar sesión');
  });
});