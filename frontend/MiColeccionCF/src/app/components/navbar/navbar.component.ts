//Componente de la barra de navegación
import { Component } from '@angular/core';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private autenticacionService: AutenticacionService, private router: Router) {}

  onLogout() {
    this.autenticacionService.logout().subscribe({
      next: (res) => {
        console.log('Logout exitoso');
      },
      error: (err) => {
        console.error('Error en el logout', err);
      }
    });
  }
}
