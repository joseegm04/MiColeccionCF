//Componente del perfil del usuario que se visite
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coleccion, Usuario } from '../../interfaces/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { CromosService } from '../../services/cromos.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  public usuario!: Usuario;
  public coleccion1!: Coleccion;
  public coleccion2!: Coleccion;

  constructor(private usuarioService: UsuarioService, private cromosService: CromosService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const nombreUsuario = params.get('nombre_usuario');
      if(nombreUsuario) {
        this.usuarioService.getUsuario(nombreUsuario).subscribe(usuario => {
          this.usuario = usuario;
          this.cargarColeccion();
        });
      }
    });
  }

  cargarColeccion(): void {
    if (this.usuario){
      this.cromosService.getColeccion().subscribe({
        next: (res) => {
          this.coleccion1 = res.colecciones[0];
          this.coleccion2 = res.colecciones[1];

          res.colecciones.forEach((coleccion) => {
            const coleccionUsuario = this.usuario.colecciones?.[coleccion.nombre];
            this.marcarCromo(coleccion, coleccionUsuario);
          });
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  marcarCromo(coleccion: Coleccion, coleccionUsuario: Coleccion | undefined): void {
    if(coleccionUsuario) {
      coleccion.equipos.forEach((equipo) => {
        const equipoUsuario = coleccionUsuario.equipos.find(eq => eq.nombre === equipo.nombre);
        if(equipoUsuario) {
          equipo.cromos.forEach((cromo) => {
            cromo.marcado = !!equipoUsuario.cromos.find(cr => cr.id === cromo.id);
          });
        }
      });
    }
  }
}
