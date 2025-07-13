import { RenderMode, ServerRoute } from '@angular/ssr';
import { LoginComponent } from './components/login/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup/signup.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  // 1) rotas públicas
  { path: 'signup', component: SignupComponent },
  { path: 'login',  component: LoginComponent },

  // 2) rota protegida
  {
    path: '',
    component: HomeComponentComponent, //colocar outras páginas (protegidas por rota)
    canActivate: [AuthGuard]
  },

  // 3) coringa para todas as outras – só depois de todas as anteriores
  { path: '**', redirectTo: '', pathMatch: 'full' }
];