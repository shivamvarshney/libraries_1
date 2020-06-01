import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';

@Injectable({
  providedIn: 'root'
})
export class AuthZGuard implements CanActivate {

  constructor(private facadeService: FacadeService, private myRoute: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
    let moduleName = next.data.label;
    let booleanCheck = false;
    booleanCheck = this.facadeService.validatePermission(moduleName);    
    if (booleanCheck) {
      return true;
    } else {
      this.myRoute.navigate(['/unauthorized-page']);
      //this.facadeService.navigateToDefaultLandingModule();
      return true;
    }
  }
}