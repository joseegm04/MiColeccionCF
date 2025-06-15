//Archivo de tests del componente users-list
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListComponent } from './users-list.component';
import { Usuario } from '../../interfaces/usuario';
import { of, throwError } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockUsuarioService: any;

  beforeEach(async () => {
    mockUsuarioService = {
      getUsuariosCercanos: jasmine.createSpy('getUsuariosCercanos').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [UsersListComponent],
      providers: [
        {provide: UsuarioService, useValue: mockUsuarioService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar los usuarios cercanos al iniciar', () => {
    const mockUsuarios: Usuario[] = [
      { id: 1, nombre_usuario: 'Usuario 1', correo: 'usuario1@example.com', ubicacion: 'Málaga' },
      { id: 2, nombre_usuario: 'Usuario 2', correo: 'usuario2@example.com', ubicacion: 'Sevilla' }
    ];

    mockUsuarioService.getUsuariosCercanos.and.returnValue(of(mockUsuarios));
    component.ngOnInit();
    expect(component.usuarios).toEqual(mockUsuarios);
  });

  it('deberia mostrar los usuarioscercanos en el html', () => {
    const mockUsuarios: Usuario[] = [
      { id: 1, nombre_usuario: 'Usuario 1', correo: 'usuario1@example.com', ubicacion: 'Málaga' },
      { id: 2, nombre_usuario: 'Usuario 2', correo: 'usuario2@example.com', ubicacion: 'Sevilla' }
    ];

    component.usuarios = mockUsuarios;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Usuario 1');
    expect(compiled.textContent).toContain('Usuario 2');
  });

  it('deberia manejar errores al cargar usuarios cercanos', () => {
    spyOn(console, 'error');
    mockUsuarioService.getUsuariosCercanos.and.returnValue(throwError(() => new Error('Error al cargar usuarios')));
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
