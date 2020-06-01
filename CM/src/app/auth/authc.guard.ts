import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCGuard implements CanActivate {
  constructor(
    private facadeService:FacadeService,
    private myRoute: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
    let moduleName = next.data.module;
    let permissionsName = next.data.label;    
    let booleanCheck = this.facadeService.validateSpecificPermission(permissionsName);
    if (booleanCheck) {
      return true;
    } else {      
      this.myRoute.navigate(['/unauthorized-page']);
      return true;
    }
  }
} 