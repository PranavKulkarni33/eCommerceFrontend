import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getRole().then((role) => {
      console.log(role);
      if ((role === 'Customer' && state.url === '/customerPage') || (role === 'Admin' && state.url === '/adminPage')) {
        // If the role matches the page, allow access
        return true;
      } else {
        // If no valid role is found or role doesn't match, redirect to login
        return this.router.parseUrl('/login');
      }
    });
  }
}
