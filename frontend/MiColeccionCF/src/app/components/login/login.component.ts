//Componente del inicio de sesión
import { Component } from '@angular/core';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Router } from '@angular/router';
import { Login } from '../../interfaces/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: Login = {
    nombreUsuario: '',
    password: ''
  };
  mensajeError: string = '';

  constructor(private AutenticacionService: AutenticacionService, private router: Router) { }

  onLogin(){
    this.AutenticacionService.login(this.loginData.nombreUsuario, this.loginData.password).subscribe({
      next: (res) => {
        console.log('Login exitoso');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.mensajeError = err.error.error || 'Error al iniciar sesión';
        console.error('Error en el login', err);
      }
    });
  }
}
