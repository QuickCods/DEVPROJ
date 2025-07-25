import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // Só permite se estiver logado **e** for Admin
    if (this.auth.isLoggedIn() && this.auth.getUserRole() === 'Admin') {
      return true;
    }
    // Senão redireciona para a home (ou login)
    return this.router.createUrlTree(['/']);
  }
}
