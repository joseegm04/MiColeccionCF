import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
 public usuarios: Usuario[] = [];

 constructor(private usuarioService: UsuarioService) {}

 ngOnInit(): void {
  this.usuarioService.getUsuariosCercanos().subscribe({
    next: (res) => {
      this.usuarios = res;
    },
    error: (err) => {
      console.error(err);
    }
  });
 }
}
