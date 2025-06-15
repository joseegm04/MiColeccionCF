//Componente de la lista de cromos
import { Component, Input } from '@angular/core';
import { Coleccion, Cromo, Equipo, Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css'
})
export class ChecklistComponent {
  @Input() editable: boolean = true;
  @Input() coleccion: Coleccion | undefined;
}
