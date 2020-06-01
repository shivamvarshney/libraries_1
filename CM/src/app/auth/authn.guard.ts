import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';

@Injectable({
  providedIn: 'root'
})
export class AuthNGuard implements CanActivate {
  constructor(
    private facadeService:FacadeService,
    private myRoute: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
    if (this.facadeService.isLoggedIn()) {
      return true;
    } else {
      return this.myRoute.parseUrl('/login');
    }
  }
}