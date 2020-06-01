import { Injectable, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';
import { SalesService } from '@service/sales-service/sales-service.service';
import { LoginService } from './login.service';
import { CMService } from './cm.service';
import { Observable } from 'rxjs';
import { MasterDataService } from './masterData.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { RolesService } from './roles.service';
import { AppUtills } from '../utills/appUtills';
import { Howl, Howler } from 'howler';

@Injectable({
  providedIn: 'root'
})

export class FacadeService {


  sound = new Howl({
    src: ['./assets/images/beep.mp3']
  });

  constructor(private injector: Injector, private snakeBar: MatSnackBar,
    private _location: Location, private routes: Router) { }
  // Back to the previous page
  backClicked(): void {
    this._location.back();
  }

  redirectTo(uri) {
    this.routes.navigateByUrl('/', { skipLocationChange: true }).then(
      () => this.routes.navigate(['/case-management/case/kyc/' + uri])
    );
  }

  handleServerEvents(data: any) {
    //console.log('Call Timing',new Date());
    if (data && data.data) {
      //console.log('data.data is ', data.data);
      let loggedInUserInfo = JSON.parse(AppUtills.getValue('userData'));
      let parsedJson = JSON.parse(data.data);
      //console.log('parsedJson.actor.userName is ', parsedJson.actor.userName, ' loggedInUserInfo.username is ', loggedInUserInfo.username);
      //console.log('parsedJson.caseId is ', parsedJson.caseId);
      if (parsedJson && parsedJson.actor && parsedJson.actor.userName && loggedInUserInfo && loggedInUserInfo.username && parsedJson.actor.userName == loggedInUserInfo.username && parsedJson.caseId) {
        //console.log('parsedJson.visiblityType is ', parsedJson.visiblityType, ' and parsedJson.assignmentType is ', parsedJson.assignmentType);
        let storedCaseDetails = AppUtills.getValue('storedCaseDetails');
        if (storedCaseDetails && storedCaseDetails != '') {
          AppUtills.removeValue('storedCaseDetails');
        }
        if (parsedJson.visiblityType == 'HIDE' && parsedJson.assignmentType == 'SUPERVISOR') {
          let caseInfo = AppUtills.getValue('newCaseData');
          //console.log('caseInfo is ', caseInfo);
          if (caseInfo && caseInfo != '') {
            let storageParsedJson = JSON.parse(caseInfo);
            //console.log('storageParsedJson.caseId is ', storageParsedJson.caseId, ' and parsedJson.caseId is ', parsedJson.caseId);
            //if (storageParsedJson.caseId == parsedJson.caseId) {
            AppUtills.removeValue('newCaseData');
            this.openCaseEventArchivedSnackBar('Case has been removed.', 'Success');
            this.routes.navigate(['/case-management/']);
            //}
          }
        }
        else if (parsedJson.visiblityType == 'SHOW') {
          let newCaseInfo = {
            caseId: parsedJson.caseId,
            currentTime: new Date(),
            maxTime: parsedJson.timeInMilli / 1000,
            caseEvent: 'SHOW'
          };
          let stringifyString = JSON.stringify(newCaseInfo);
          let showCaseInfo = AppUtills.getValue('newCaseData');
          //console.log('caseInfo is ', showCaseInfo);
          if (showCaseInfo && showCaseInfo != '') {
            let showStorageParsedJson = JSON.parse(showCaseInfo);
            //console.log('storageParsedJson.caseId is ', showStorageParsedJson.caseId, ' and parsedJson.caseId is ', parsedJson.caseId);
            //if (showStorageParsedJson.caseId != parsedJson.caseId) {
            AppUtills.removeValue('newCaseData');
            AppUtills.setValue('newCaseData', stringifyString);
            //this.redirectTo(parsedJson.caseId);
            //this.myRoute.navigate(['/case-management/case/kyc/' + parsedJson.caseId]);
            //this.openCaseEventArchivedSnackBar('New Case has been assigned.', 'Success');
            //}
          }
          else {
            AppUtills.setValue('newCaseData', stringifyString);
            //this.redirectTo(parsedJson.caseId);
            //this.routes.navigate(['/case-management/case/kyc/' + parsedJson.caseId]);
            //this.openCaseEventArchivedSnackBar('New Case has been assigned.', 'Success');
          }
          if (parsedJson.caseId) {
            this.sound.play();
            Howler.volume(0.5);
            this.openCaseEventArchivedSnackBar('New Case has been assigned.', 'Success');
            this.redirectTo(parsedJson.caseId);
          }
        }
      }
    }
  }


  navigateToDeDashboard() {
    this.routes.navigate(['/case-management/']);
  }
  navigateToCaseDetailsPage(caseId) {
    this.routes.navigate(['/case-management/case/kyc/' + caseId]);
  }

  // Toast popup message for response
  openCaseEventArchivedSnackBar(resMsg: string, action: string) {
    if (resMsg) {
      this.snakeBar.open(resMsg, action, {
        duration: 3000
      });
    }
    // if (resMsg) {      
    //   let snackBarRef = this.snakeBar.open(resMsg, action, {
    //     duration: 300
    //   });
    // if(action == 'Success'){
    //   snackBarRef.onAction().subscribe(()=> this.navigateToDeDashboard());
    // }else{
    //   snackBarRef.onAction().subscribe(()=> this.navigateToCaseDetailsPage(action));
    // }      
    //}
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
  navigateToDefaultApplicationLandingModule() {
    let defaultModuleData = this.getDefaultLandingModule();
    this.redirectToModuleDashboard(defaultModuleData[0].moduleName);
  }
  /* Redirect to Default Module Landing page */
  navigateToDefaultLandingModule() {
    let defaultModuleData = this.getDefaultLandingModule();
    let booleanCheck = this.validatePermission(defaultModuleData[0].pgName);
    let redirectionCheck = false;
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
    if (redirectionCheck == false) {
      this.routes.navigate(['/unauthorized-page']);
    }
    return true;
  }

  /* Redirect to Dashboard */
  backToDashboard() {
    this.routes.navigate(['/case-management']);
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

  // ******** Case Management Service ******** //
  private _cmService: CMService;
  get CPService(): CMService {
    if (!this._cmService) {
      this._cmService = this.injector.get(CMService);
    }
    return this._cmService;
  }

  onCMPostAPI(APIEndPoint, postRequest): Observable<any> {
    return this.CPService.onPostAPI(APIEndPoint, postRequest);
  }
  onCMGetAPI(APIEndPoint): Observable<any> {
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
}
