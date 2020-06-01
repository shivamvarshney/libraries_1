import { Injectable, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';
import { SalesService } from '@service/sales-service/sales-service.service';
import { LoginService } from './login.service';
import { ChannelPartnerService } from './channel-partner.service';
import { Observable } from 'rxjs';
import { MasterDataService } from './masterData.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FacadeService {

  constructor(private injector: Injector, private snakeBar: MatSnackBar,
    private _location: Location, private routes: Router, private _http: HttpClient) { }
  // Back to the previous page
  backClicked(): void {
    this._location.back();
  }
  // Toast popup message for response
  openArchivedSnackBar(resMsg: string, action: string) {
    if (resMsg) {
      this.snakeBar.open(resMsg, action, {
        duration: 3000
      });
    }
  }
  /* Redirect to external Dashboard */
  redirectToExternalModuleDashboard(moduleName) {
    this.routes.navigate(['/external/' + moduleName]);
  }
  /* Redirect to Module Dashboard Page, just pass the module name */
  redirectToModuleDashboard(moduleName) {
    this.routes.navigate(['/' + moduleName]);
  }
  /* Redirect to Default Module Landing page */
  navigateToDefaultLandingModule() { 
    //let defaultModuleData = this.getDefaultLandingModule();    
    //this.redirectToModuleDashboard(defaultModuleData[0].moduleName);   
    let defaultModuleData = this.getDefaultLandingModule();
    let booleanCheck = this.validatePermission(defaultModuleData[0].pgName);
    let redirectionCheck = false;
    // Need to reTest
    if (booleanCheck) {
      redirectionCheck = true;
      this.redirectToModuleDashboard(defaultModuleData[0].moduleName);
    } else {
      let allModules = this.getAllApplicationModules();
      allModules.map(value => {
        if (this.validatePermission(value.pgName)) {
          redirectionCheck = true;
          if (value.pgExternal) {
            this.redirectToExternalModuleDashboard(value.moduleName);
          } else {
            this.redirectToModuleDashboard(value.moduleName);
          }
        }
      });
    }
    // Need to reTest
    if (redirectionCheck == false) {
      this.routes.navigate(['/unauthorized-page']);
    }
    return true;    
  }

  /* Autheriation Service Functions */
  private _authService: AuthService;
  get authService(): AuthService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService;
  }
  getPermissions() {
    return this.authService.permissions();
  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  isLoggin() {
    return this.authService.isLoggin();
  }
  validatePermission(moduleName: string) {
    return this.authService.validatePermission(moduleName);
  }
  validateSpecificPermission(pernmisssionName: any) {
    return this.authService.validateSpecificPermission(pernmisssionName);
  }
  getAllApplicationModules() {
    return this.authService.getAllApplicationModules();
  }
  getDefaultLandingModule() {
    return this.authService.getDefaultLandingModule();
  }

  /* Login Module Service */
  private _loginService: LoginService;
  get loginService() {
    if (!this._loginService) {
      this._loginService = this.injector.get(LoginService);
    }
    return this._loginService;
  }
  onPostAPI(APIEndPoint, postRequest) {
    return this.loginService.onPostAPI(APIEndPoint, postRequest);
  }
  onGetAPI(APIEndPoint) {
    return this.loginService.onGetAPI(APIEndPoint);
  }

  /* Sales Service Functions */
  private _salesService: SalesService;
  get salesService(): SalesService {
    if (!this._salesService) {
      this._salesService = this.injector.get(SalesService);
    }
    return this._salesService;
  }

  // ******** Channel Partner Service ******** //
  private _cpService: ChannelPartnerService;
  get CPService(): ChannelPartnerService {
    if (!this._cpService) {
      this._cpService = this.injector.get(ChannelPartnerService);
    }
    return this._cpService;
  }
 
  downloadFile(APIEndPoint, postRequest, fileType): Observable<any> {
    if(fileType == 'blob'){
      return this._http.post(APIEndPoint, postRequest, { responseType: "blob" });
    }else{
      return this._http.post(APIEndPoint, postRequest, { observe: "response" });
    }    
  }

  onCPPostAPI(APIEndPoint, postRequest): Observable<any> {
    return this.CPService.onPostAPI(APIEndPoint, postRequest);
  }
  onCPGetAPI(APIEndPoint): Observable<any> {
    return this.CPService.onGetAPI(APIEndPoint);
  }

  /* Master Data Service Functions */
  private _masterDataService: MasterDataService;
  get masterDataService(): MasterDataService {
    if (!this._masterDataService) {
      this._masterDataService = this.injector.get(MasterDataService);
    }
    return this._masterDataService;
  }
  getmasterData(): Observable<any> {
    return this.masterDataService.getmasterData();
  }
}
