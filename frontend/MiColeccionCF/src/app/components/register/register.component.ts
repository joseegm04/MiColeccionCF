//Componente del registro de un usuario nuevo
import { Component } from '@angular/core';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Router } from '@angular/router';
import { provincias } from './provincias';
import { Register } from '../../interfaces/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private AutenticacionService: AutenticacionService, private router: Router) { }
  
  registerData: Register = {
    nombreUsuario: '',
    password: '',
    correo: '',
    ubicacion: ''
  };
  mensajeError: string = '';

  provincias= provincias;

  onRegister(){
    this.AutenticacionService.register(this.registerData.nombreUsuario, this.registerData.password, this.registerData.correo, this.registerData.ubicacion).subscribe({
      next: (res) => {
        console.log('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.mensajeError = err.error.error || 'Error al registrar el usuario';
        console.error('Error en el registro', err.error);
      }
    })
  }
}
