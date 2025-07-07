import { RenderMode, ServerRoute } from '@angular/ssr';
import { LoginComponent } from './components/login/login/login.component';
import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup/signup.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];