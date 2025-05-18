import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Coleccion, Cromo, Equipo, Usuario } from '../../interfaces/usuario';
import { CromosService } from '../../services/cromos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(private usuarioService: UsuarioService, private cromosService: CromosService, private router: Router) {}

  public usuario!: Usuario;
  public coleccion1!: Coleccion;
  public coleccion2!: Coleccion;
  public cromosGuardados: number[] = [];
  public cromosCargados: { [idColeccion: number]: number[] } = [];

  ngOnInit(): void {
    this.usuarioService.getMiUsuario().subscribe({
      next: (res) => {
        this.usuario = res;
        this.cargarColeccion();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  cargarColeccion(): void {
    this.cromosService.getColeccion().subscribe({
      next: (res) => {
        this.coleccion1 = res.colecciones[0];
        this.coleccion2 = res.colecciones[1];

        this.cromosCargados[1] = [];
        this.cromosCargados[2] = [];

        this.coleccion1.equipos.forEach((equipo) => {
          equipo.cromos.forEach((cromo) => {
            if (cromo.marcado) this.cromosCargados[1].push(cromo.id);
          });
        });

        this.coleccion2.equipos.forEach((equipo) => {
          equipo.cromos.forEach((cromo) => {
            if (cromo.marcado) this.cromosCargados[2].push(cromo.id);
          });
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  guardarCromos(coleccion: Coleccion, idColeccion: number): void {
    this.cromosGuardados = [];

    coleccion.equipos.forEach((equipo) => {
      equipo.cromos.forEach((cromo) => {
        if (cromo.marcado) {
          this.cromosGuardados.push(cromo.id);
        }
      });
    });

    const cromosCargados = this.cromosCargados[idColeccion];

    if(this.cromosGuardados.length === 0 && cromosCargados.length === 0) {
      console.log("No hay cambios que guardar");
      return;
    }

    this.cromosGuardados.forEach((idCromo) => {
      if (!cromosCargados.includes(idCromo)) {
        this.cromosService.insertarCromo(this.usuario.id, idCromo, idColeccion).subscribe({
          next: (res) => {
            console.log(`Cromo ${idCromo} guardado con éxito`);
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });

    cromosCargados.forEach((idCromo) => {
      if (!this.cromosGuardados.includes(idCromo)){
        this.cromosService.borrarCromo(this.usuario.id, idCromo).subscribe({
          next: (res) => {
            console.log(`Cromo ${idCromo} borrado con éxito`);
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }
}
