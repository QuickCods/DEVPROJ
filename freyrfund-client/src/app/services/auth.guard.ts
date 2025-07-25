import { Injectable }       from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable }       from 'rxjs';
import { AuthService }      from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      return true;              // deixa passar
    }
    return this.router.createUrlTree(['/login']);  // redireciona p/ login
  }
}
