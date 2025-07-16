import { RenderMode, ServerRoute } from '@angular/ssr';
import { LoginComponent } from './components/login/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup/signup.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { AdminComponentComponent } from './admin-component/admin-component.component';
import { UsersListComponent } from './admin-component/users-list/users-list.component';
import { ProjectsListComponent } from './admin-component/projects-list/projects-list.component';
import { AdminGuard } from './services/admin.guard';
import { ProjectsComponent } from './components/projects/projects.component';
import { InvestComponent } from './user/invest/invest/invest.component';
import { PortfolioComponent } from './user/portfolio/portfolio/portfolio.component';
import { TopUpComponent } from './user/top-up/top-up/top-up.component';
import { DeleteAccountComponent } from './user/delete-account/delete-account/delete-account.component';
import { WithdrawComponent } from './user/withdraw/withdraw/withdraw.component';

export const routes: Routes = [
  // 1) rotas públicas
  { path: 'signup', component: SignupComponent },
  { path: 'login',  component: LoginComponent },

  // 2) rota protegida
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard],
  },
  //{path: 'invest', component: InvestComponent, canActivate: [AuthGuard],},
  {
    path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard],
  },
  {
    path: 'top-up', component: TopUpComponent, canActivate: [AuthGuard],
  },
  {
    path: 'delete-account', component: DeleteAccountComponent, canActivate: [AuthGuard],
  },
  {
    path: 'withdraw', component: WithdrawComponent, canActivate: [AuthGuard],
  },
  
  {
    path: 'admin',
    component: AdminComponentComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'users',    component: UsersListComponent },
      { path: 'projects', component: ProjectsListComponent },
      // <-- redireciona vazio para users
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },

  // 3) coringa para todas as outras – só depois de todas as anteriores
  { path: '**', redirectTo: '', pathMatch: 'full' }
];