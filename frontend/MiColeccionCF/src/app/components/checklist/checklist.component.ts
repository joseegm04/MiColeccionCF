import { Component, Input } from '@angular/core';
import { Coleccion, Cromo, Equipo, Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css'
})
export class ChecklistComponent {
  @Input() usuario: Usuario | undefined;
  @Input() coleccion: Coleccion | undefined;

  ngOnChanges(): void {
    const coleccionUsuario: Coleccion | undefined = this.usuario?.colecciones?.[this.coleccion?.nombre || ''];

    if (this.coleccion && coleccionUsuario) {
      this.coleccion.equipos.forEach((equipo) => {
        equipo.cromos.forEach((cromo) => {
          cromo.marcado = false;
        });
      });
      if(coleccionUsuario) {
        this.marcarCromo(this.coleccion, coleccionUsuario);
      }
    }
  }

  marcarCromo(coleccion: Coleccion, coleccionUsuario: any): void{
    if(!coleccionUsuario) return;

    coleccion.equipos.forEach((equipo) => {
      const equipoUsuario: Equipo | undefined = coleccionUsuario.equipos.find((eq: Equipo) => eq.nombre === equipo.nombre);
      if (equipoUsuario) {
        equipo.cromos.forEach((cromo) => {
          const cromoUsuario: Cromo | undefined = equipoUsuario.cromos.find((cr: Cromo) => cr.id === cromo.id);
          if(cromoUsuario) {
            cromo.marcado = true;
          }
          else {
            cromo.marcado = false
          };
        });
      }
    });
  }
}
