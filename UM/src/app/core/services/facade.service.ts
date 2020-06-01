import { Injectable, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';
import { SalesService } from '@service/sales-service/sales-service.service';
import { LoginService } from './login.service';
import { UserService } from './user.service';
import { RolesService } from './roles.service';
import { Observable } from 'rxjs';
import { MasterDataService } from './masterData.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class FacadeService {

  constructor(private injector: Injector,private snakeBar: MatSnackBar,
    private _location: Location,private routes: Router ) {  }
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
  /* Redirect to Module Dashboard Page, just pass the module name */
  redirectToModuleDashboard(moduleName){
    this.routes.navigate(['/'+moduleName]);
  }
  /* Redirect to Default Module Landing page */
  navigateToDefaultLandingModule(){
    let defaultModuleData = this.getDefaultLandingModule(); 
    let booleanCheck = this.validatePermission(defaultModuleData[0].pgName);    
    let redirectionCheck = false;
    if (booleanCheck) {
      redirectionCheck = true;
      this.redirectToModuleDashboard(defaultModuleData[0].moduleName);
    }else{
      let allModules = this.getAllApplicationModules();
      allModules.map(value=>{
        if(this.validatePermission(value.pgName)){
          redirectionCheck = true;
          this.redirectToModuleDashboard(value.moduleName);
        }
      });
    }
    if(redirectionCheck == false){
      this.routes.navigate(['/unauthorized-page']);
    }
    return true;
  }
  /* Role Management Service */
  private _roleManagement: RolesService;
  get roleManagement(): RolesService {
    if (!this._roleManagement) {
      this._roleManagement = this.injector.get(RolesService);
    }
    return this._roleManagement;
  }
  onRolePostAPI(APIEndPoint, postRequest): Observable<any> {
    return this.roleManagement.onPostAPI(APIEndPoint, postRequest);
  }
  onRoleGetAPI(APIEndPoint): Observable<any> {
    return this.roleManagement.onGetAPI(APIEndPoint);
  }
  saveRole(saveRoleParams, saveType): Observable<any> {
    return this.roleManagement.saveRole(saveRoleParams, saveType);
  }
  getRoleById(params): Observable<any> {
    return this.roleManagement.getRoleById(params);
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
  getAllApplicationModules(){
    return this.authService.getAllApplicationModules();
  }
  getDefaultLandingModule(){
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
  // ******** User Management Service ******** //
  private _userService: UserService;
  get userService(): UserService {
    if (!this._userService) {
      this._userService = this.injector.get(UserService);
    }
    return this._userService;
  }
  onUserPostAPI(APIEndPoint, postRequest): Observable<any> {
    return this.userService.onPostAPI(APIEndPoint, postRequest);
  }
  onUserGetAPI(APIEndPoint): Observable<any> {
    return this.userService.onGetAPI(APIEndPoint);
  }
  getUserById(args): Observable<any> {
    return this.userService.getUserById(args);
  }
  /* Master Data Service Functions */
  private _masterDataService: MasterDataService;
  get masterDataService(): MasterDataService {
    if (!this._masterDataService) {
      this._masterDataService = this.injector.get(MasterDataService);
    }
    return this._masterDataService;
  }
  masterPostAPI(APIEndPoint, postRequest): Observable<any> {
    return this.masterDataService.masterPostAPI(APIEndPoint, postRequest);
  }
  masterGetAPI(APIEndPoint): Observable<any> {
    return this.masterDataService.masterGetAPI(APIEndPoint);
  }
  getmasterData():Observable<any>{
    return this.masterDataService.getmasterData();
  }
  getUserMCompleteMasterData():Observable<any>{
    return this.masterDataService.getUserMCompleteMasterData();
  }
  getRoleMCompleteMasterData():Observable<any>{
    return this.masterDataService.getRoleMCompleteMasterData();
  }
  getCompleteMasterData():Observable<any>{
    return this.masterDataService.getCompleteMasterData();
  }
  getSiteMasterData(url):Observable<any>{
    return this.masterDataService.getSiteMasterData(url);
  }
  getAllSitePerLvele(obj):Observable<any>{
    return this.masterDataService.getAllSitePerLvele(obj);
  }
  getSiteHierarchy(obj):Observable<any>{
    return this.masterDataService.getSiteHierarchy(obj);
  }
  getAllSItes():Observable<any>{
    return this.masterDataService.getAllSItes();
  }
  getAllReportsToUsers(reportsToObj):Observable<any>{
    return this.userService.getAllReportsToUsers(reportsToObj);
  }
  getSiteGeoLocationPagination(paginationObj):Observable<any>{
    return this.masterDataService.getSiteGeoLocationPagination(paginationObj);
  }
  getSiteGeoLocationData():Observable<any>{
    return this.masterDataService.getSiteGeoLocationData();
  }
  getGeoFields():Observable<any>{
    return this.masterDataService.getGeoFields();
  }
}
