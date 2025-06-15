import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistComponent } from './checklist.component';
import { Coleccion } from '../../interfaces/usuario';
import { FormsModule } from '@angular/forms';

describe('ChecklistComponent', () => {
  let component: ChecklistComponent;
  let fixture: ComponentFixture<ChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChecklistComponent],
      imports: [FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia recibir la coleccion', () => {
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
    component.coleccion = mockColeccion;
    expect(component.coleccion).toBe(mockColeccion);
  });

  it('deberia respetar el atributo editable', () => {
    component.editable = true;
    expect(component.editable).toBeTrue();
    
    component.editable = false;
    expect(component.editable).toBeFalse();
  });

  it('deberia mostrar los equipos y cromos en el html', () => {
    const mockColeccion: Coleccion = {
      nombre: 'Coleccion 1',
      equipos: [
        {
          nombre: 'Equipo 1',
          cromos: [
            { id: 1, numero: "1", nombre: 'Cromo 1', marcado: false },
            { id: 2, numero: "2", nombre: 'Cromo 2', marcado: true }
          ]
        },
        {
          nombre: 'Equipo 2',
          cromos: [
            { id: 3, numero: "3", nombre: 'Cromo 3', marcado: false }
          ]
        }
      ]
    };
    
    component.coleccion = mockColeccion;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Coleccion 1');
    expect(compiled.textContent).toContain('Equipo 1');
    expect(compiled.textContent).toContain('Equipo 2');
    expect(compiled.textContent).toContain('Cromo 1');
    expect(compiled.textContent).toContain('Cromo 2');
    expect(compiled.textContent).toContain('Cromo 3');
  });
});
