//Archivo de pruebas del navbar
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { of } from 'rxjs';
import { AutenticacionService } from '../../services/autenticacion.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAutenticacionService: any;

  beforeEach(async () => {
    mockAutenticacionService = {
      logout: jasmine.createSpy('logout').and.returnValue(of({}))
    };
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: AutenticacionService, useValue: mockAutenticacionService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia llamar al logout en onLogout', () => {
    component.onLogout();
    expect(mockAutenticacionService.logout).toHaveBeenCalled();
  });
});
