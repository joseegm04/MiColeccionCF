//Gestión de rutas de la aplicación
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { autenticacionGuard } from './guards/autenticacion.guard';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path:'', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [autenticacionGuard] },
  { path: 'users/:nombre_usuario', component: PerfilComponent, canActivate: [autenticacionGuard] },
  { path: 'chat/:nombre_usuario', component: ChatComponent, canActivate: [autenticacionGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
