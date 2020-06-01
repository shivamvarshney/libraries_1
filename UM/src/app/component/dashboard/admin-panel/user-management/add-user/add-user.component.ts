import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '@service/data-share-service/data.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { HttpClient } from '@angular/common/http';
import { ComponentCanDeactivate } from '@src/auth/authd.guard';
import { ListRange } from '@angular/cdk/collections';
import { environment } from '@environment/environment';
//import { SelectAutocompleteComponent } from 'mat-select-autocomplete'; 

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, ComponentCanDeactivate {

  saveUserUnsubscriber: Subscription;
  masterDataSubscriber: Subscription;
  siteGeoFieldsSubscriber: Subscription;
  filteredRoleSubscription: Subscription;
  reportingManagerSubscriber: Subscription;
  getUserPromptSubscription: Subscription;
  userModalResponseSubscription: Subscription;
  sitesSubscription: Subscription;
  forkJoinSubscriber: Subscription;
  onChangeSubscriber: Subscription;
  siteLevelForkJoinSubscriber: Subscription;
  routeParamSubscriber: Subscription;
  userDetailsSubscriber: Subscription;
  rmDetailsSubscriber: Subscription;
  getClientsSubscriber: Subscription;
  roleDetailsSubscriber: Subscription;
  unauthorized_msg: string;
  formLength: number = 0;
  isDirty: boolean = false;
  currentDate = new Date();
  addUserForm: FormGroup;

  /* Code for Reporting Managers */
  pageNo = 0;
  perPageCount = 200;
  totalVisibleManagers = 0;
  totalManagers = 0;
  reportingManagersoptions = new BehaviorSubject<string[]>([]);
  reportingManagersoptions$: Observable<string[]>;
  reportingManagersArray = [];
  /* End of the Code for Reporting Managers */
  rolesObj: any;
  lowestRoleLevel: number;
  reportingManagerStrict: boolean = true;
  clientsObj: any;
  loginModules: any;
  selectedloginModule = 'auuid';
  loginChannlesObj: any;
  nationalIdTypesObj: any;
  departmentsObj: any;
  langulagesObj: any;
  minDate: any;
  maxDate: any;
  allSitesObj: any;
  addUserRegex: string = environment.userRegexErrorMsg;
  addUserAUUIDRegexMsg: string = environment.loginTypePattern;
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport;
  @ViewChild('autoComplInput') autoComplInput: ElementRef;
  /* Code for Site Multi Select AutoComplete */
  //@ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
  selectedSiteOptions = [];
  siteShowError = false;
  siteErrorMessage = '';
  siteItemSize: number;
  /* End of the Code for Site Multi Select AutoComplete */
  /* sITE dUMMY dATA */
  geoFields = [];
  geolocationData;
  /* eND OF tHE sITE dUMMY dATA */
  /* For Edit Case */
  paramUserId: number;
  siteIdsStore = [];
  public siteMultiFilterCtrl: FormControl = new FormControl();
  initialRange: ListRange = { start: 0, end: 5 } as ListRange;

  submiText: string = 'Submit';

  /* New Structure */
  apiClientsObj = [];
  departmentRolesOptions = new BehaviorSubject<string[]>([]);
  departmentRolesOptions$: Observable<string[]>;
  totalDepartmentRoles = 0;
  departmentRolePageNo = 0;
  totalVisibledepartmentRoles = 0;
  perPageDepartmentRoles = 5;
  clientDependentFields = ['client','department','role','reportingMsisdn'];

  constructor(private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private _routes: Router,
    private dataService: DataService,
    private _http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    this.getAllMasterData();
    this.reportingManagersoptions$ = this.reportingManagersoptions.asObservable();
    this.minDate = new Date(1930, 0, 1);
    this.maxDate = new Date(AppUtills.getCurrentYear(), AppUtills.getCurrentMonth(), AppUtills.getCurrentDay() - 1);
    this.routeParamSubscriber = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params.id) {
          this.paramUserId = params.id;
          this.submiText = 'Update';
        }
      }
    );
  }

  getAllRootClients() {
    this.ngxService.start();
    this.getClientsSubscriber = this.facadeService.onRoleGetAPI(apiUrls.clientID).subscribe(
      resp => {
        if (resp.result) {
          this.apiClientsObj = resp.result;
          this.createUserForm();
        }
        this.ngxService.stop();
      },
      err => {
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    );
  }
  handleEnableFormField() {
    this.isDirty = true;
    this.pageNo = 0;
    this.totalVisibleManagers = 0;
    this.totalManagers = 0;
    this.enableAllFormFields();
    this.loginModuleChange();
  }
  handleDisableFormField() {
    this.isDirty = false;
    this.addUserForm.controls.client.setValue('');
    this.addUserForm.controls.department.setValue('');
    this.disableAllFormFields();
  }
  handleClientDependency() {
    // Set Department Reset as well disable
    this.departmentsObj = [];
    this.addUserForm.controls.department.setValue('');
    this.disableFormField('department');
    this.markFieldAsUnCheck('department');
    // Set Roles Reset and Disable
    this.makeDepartmentRoleEmpty();
    this.addUserForm.controls.role.setValue('');
    this.disableFormField('role');
    this.markFieldAsUnCheck('role');
    // Set Reporting Managers Reset as well disable
    this.makeRoleReportingMSISDNEmpty();
    this.resetMsisdnFieldInfo();
    this.addUserForm.controls.reportingMsisdn.setValue('');
    this.disableFormField('reportingMsisdn');
    this.markFieldAsUnCheck('reportingMsisdn');
    // Make Reporting Manager Mendatory 
    this.addReportingManagerValidations();
  }
  clientChange() {
    // Now all Dependent FIelds
    this.handleClientDependency();
    // CLient Ids Field enable or Disable
    let selectedClientIds = this.addUserForm.controls.client.value;
    if (selectedClientIds.length > 0) {
      this.handleEnableFormField();
      this.allClientDepartments(selectedClientIds);
    } else {
      this.handleDisableFormField();
    }
    this.dataService.userStatus(this.isDirty);
  }
  // Select All Departments
  getAllDepartments() {
    if (this.addUserForm.controls['client'].value.length > 0) {
      this.clientChange();
    } else {
      // Handle Client Dependency
      this.handleClientDependency();
    }
  }
  // Get All Departments after selection of Client Ids
  allClientDepartments(clientIds) {
    let clientDepartmentsObj = [];
    this.departmentsObj = [];
    if (clientIds.length > 0) {
      this.enbleFormField('department');
      this.apiClientsObj.map((clientInfo, clientKey) => {
        if (clientIds.indexOf(clientInfo.clientId) >= 0 && clientInfo.departments && clientInfo.departments.length > 0) {
          clientInfo.departments.map((depaValue, depaKey) => {
            clientDepartmentsObj.push({ label: depaValue.name, value: depaValue.id })
          });
        }
      });
      if (clientDepartmentsObj.length > 0) {
        const result = [];
        const map = new Map();
        for (const item of clientDepartmentsObj) {
          if (!map.has(item.value)) {
            map.set(item.value, true);
            result.push({
              value: item.value,
              label: item.label
            });
          }
        }
        this.departmentsObj = result;
      }
    }
  }
  // Make empty departmentRolesObj
  makeDepartmentRoleEmpty() {
    this.departmentRolesOptions = new BehaviorSubject<string[]>([]);
    this.departmentRolesOptions$ = this.departmentRolesOptions.asObservable();
    this.totalDepartmentRoles = 0;
    this.departmentRolePageNo = 0;
    this.totalVisibledepartmentRoles = 0;
  }
  // After Selection of Departments Get Roles
  getDepartmentRoles() {
    let departmentId = this.addUserForm.controls['department'].value;
    let clientIds = this.addUserForm.controls['client'].value;
    this.makeDepartmentRoleEmpty();
    if (departmentId && departmentId != '' && clientIds && clientIds.length > 0) {
      this.addUserForm.controls.role.setValue('');
      this.markFieldAsUnCheck('role');
      this.enbleFormField('role');
      this.prepareDepartmentRolesApiObj(clientIds.join(), departmentId);
    }
  }
  // prepare Department Roles Api URL
  prepareDepartmentRolesApiObj(clientIds, departmentId, roleIds?: any) {
    this.addUserForm.controls.role.setValue('');
    this.markFieldAsUnCheck('role');
    let upadatedRolesApiUrl = apiUrls.roleSearch + '?size=' + this.perPageDepartmentRoles + '&page=' + this.departmentRolePageNo;
    if (departmentId) {
      upadatedRolesApiUrl += '&departments=' + departmentId;
    }
    if (clientIds) {
      upadatedRolesApiUrl += '&ClientId=' + departmentId;
    }
    this.getDepartmentalRoles(upadatedRolesApiUrl, roleIds);
  }
  // On Scroll of Department Roles, get next page Roles 
  getNextRoleBatch() {
    if (this.totalVisibledepartmentRoles < this.totalDepartmentRoles) {
      let departmentId = this.addUserForm.controls['department'].value;
      let clientIds = this.addUserForm.controls['client'].value;
      let upadatedRolesApiUrl = apiUrls.roleSearch + '?departments=' + departmentId + '&ClientId=' + clientIds + '&size=' + this.perPageDepartmentRoles + '&page=' + this.departmentRolePageNo;
      this.getDepartmentalRoles(upadatedRolesApiUrl);
    }
  }
  // Make API Call to get Department Roles
  getDepartmentalRoles(urlString, editRoleIds?: any) {
    this.ngxService.start();
    this.filteredRoleSubscription = this.facadeService.onRolePostAPI(urlString, {}).subscribe(
      resp => {
        if (resp.body.result) {
          this.totalDepartmentRoles = resp.body.result.totalElements;
          this.departmentRolePageNo = this.departmentRolePageNo + 1;
          this.totalVisibledepartmentRoles = this.totalVisibledepartmentRoles + resp.body.result.numberOfElements;
          let updatedResult = [...this.departmentRolesOptions.value, ...resp.body.result.content];
          if (updatedResult.length > 0) {
            updatedResult = this.removeDuplicateRoles(updatedResult);
            let booleanCall = true;
            this.departmentRolesOptions.next(updatedResult);
            if (editRoleIds && editRoleIds.length > 0) {
              let roleIds = this.getAllRoleIds(updatedResult);
              let tobeFetchedRoleIds = [];
              editRoleIds.map(e_roleId => {
                if (roleIds.indexOf(e_roleId) == -1) {
                  tobeFetchedRoleIds.push(e_roleId);
                }
              });
              if (tobeFetchedRoleIds.length > 0) {
                booleanCall = false;
              }              
              if (booleanCall) {                
                this.addUserForm.controls['role'].setValue(editRoleIds);
                this.makeRoleRMOptional();
              } else {
                this.fetchAndUpdateEditRoleObj(tobeFetchedRoleIds, editRoleIds);
              }
            }            
          }
        }
        this.ngxService.stop();
      },
      err => {
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    );
  }
  // Get All Role Ids
  getAllRoleIds(roleResult) {
    let roleIds = [];
    roleResult.map(role => {
      roleIds.push(role.id);
    });
    return roleIds;
  }
  // Remove Duplicate Roles
  removeDuplicateRoles(rolesObj) {
    let result = [];
    const map = new Map();
    rolesObj.map((item, key) => {
      if (!map.has(item.id)) {
        map.set(item.id, true);
        result.push(rolesObj[key]);
      }
    });
    return result;
  }
  // Fetch all Roles in case of edit, to append in the rolesObject
  fetchAndUpdateEditRoleObj(roleIds, editRoleIds) {
    let apiRequests = [];
    roleIds.map((mVal, mKey) => {
      let preparedUrl = apiUrls.roleSearch + '?id=' + mVal + '&size=1&page=0';
      let apiRequst = this._http.post(preparedUrl, {});
      apiRequests.push(apiRequst);
    });
    this.roleDetailsSubscriber = forkJoin(apiRequests).subscribe(
      resData => {
        if (resData && resData.length > 0) {
          resData.map(res => {
            if (res.result && res.result.content && res.result.content.length > 0) {
              let appendedResult = [...res.result.content, ...this.departmentRolesOptions.value];
              this.departmentRolesOptions.next(appendedResult);
            }
          });
          this.addUserForm.controls['role'].setValue(editRoleIds);
          this.makeRoleRMOptional();
        }
      }
    );
  }
  // Make empty Reporting MSISDN
  makeRoleReportingMSISDNEmpty() {
    this.reportingManagersoptions = new BehaviorSubject<string[]>([]);
    this.reportingManagersoptions$ = this.reportingManagersoptions.asObservable();
    this.totalManagers = 0;
    this.pageNo = 0;
    this.totalVisibleManagers = 0;
  }
  // On selection of Role, get Reporting Managers
  getRoleReportingManagers() {
    let roleIds = this.addUserForm.controls['role'].value;
    this.resetMsisdnFieldInfo();
    this.addUserForm.controls.reportingMsisdn.setValue('');
    this.markFieldAsUnCheck('reportingMsisdn');
    this.makeRoleReportingMSISDNEmpty();
    if (roleIds && roleIds.length > 0) {
      this.makeRoleRMOptional();
      this.enbleFormField('reportingMsisdn');
      this.getRoleChangeReportingManagers();
    } else {
      this.addReportingManagerValidations();
      this.disableFormField('reportingMsisdn');
    }
  }
  // Verify Role Reporting Manager can be as Optional field?
  makeRoleRMOptional() {
    let lowestRoleLevel = this.getLowestDeparmentRoleLevel();
    let selectedRoleIds = this.addUserForm.controls.role.value;
    let selectedLevels = [];
    this.departmentRolesOptions.value.map((roleInfo) => {
      if (selectedRoleIds.indexOf(roleInfo['id']) >= 0) {
        selectedLevels.push(roleInfo['level'])
      }
    });
    let validationCheck: boolean = false;
    for (let counter = 0; counter < selectedLevels.length; counter++) {
      if (lowestRoleLevel == selectedLevels[counter]) {
        validationCheck = true;
        break;
      }
    }
    if (validationCheck) {
      this.removeReportingManagerValidations();
    }
    else {
      this.addReportingManagerValidations();
    }
  }
  // Get Lowest level Id of Role
  getLowestDeparmentRoleLevel() {
    if (this.departmentRolesOptions.value.length > 0) {
      let lowestLevel = this.departmentRolesOptions.value[0]['level'];
      this.departmentRolesOptions.value.map((roleInfo) => {
        if (lowestLevel >= roleInfo['level']) {
          lowestLevel = roleInfo['level'];
        }
      });
      return lowestLevel;
    }
  }
  // Remove vlidation from Reporting Manager
  removeReportingManagerValidations() {
    this.addUserForm.get('reportingMsisdn').clearValidators();
    this.addUserForm.get('reportingMsisdn').updateValueAndValidity();
    this.reportingManagerStrict = false;
  }
  // Add vlidation on Reporting Manager
  addReportingManagerValidations() {
    this.addUserForm.get('reportingMsisdn').setValidators([Validators.required]);
    this.addUserForm.get('reportingMsisdn').updateValueAndValidity();
    this.reportingManagerStrict = true;
  }
  // On Role Change Needs to trigger
  getRoleChangeReportingManagers() {
    this.addUserForm.controls.reportingMsisdn.setValue('');
    this.markFieldAsUnCheck('reportingMsisdn');
    let preparedRMObj = {
      roleList: this.addUserForm.controls.role.value,
      clientList: this.addUserForm.controls.client.value,
      departmentList: [this.addUserForm.controls.department.value]
    }
    this.getReportingManagerAPICall(preparedRMObj);
  }
  // On Scroll Of Reporting Managers, Call API to get next page reporting managers
  getNextBatch() {
    if (this.totalVisibleManagers < this.totalManagers) {
      let preparedSrcolRMObj = {
        roleList: this.addUserForm.controls.role.value,
        clientList: this.addUserForm.controls.client.value,
        departmentList: [this.addUserForm.controls.department.value]
      }
      this.getReportingManagerAPICall(preparedSrcolRMObj, 'SCROLL');
    }
  }
  // Make API Call to get Reporting Managers
  getReportingManagerAPICall(preparedRMObj, source?: string, managerId?: any, userSiteIds?: string[]) {
    let selectedRoles = {
      roleList: preparedRMObj.roleList,
      page: this.pageNo,
      size: this.perPageCount,
      clientList: preparedRMObj.clientList,
      departmentList: preparedRMObj.departmentList
    }
    this.ngxService.start();
    this.reportingManagerSubscriber = this.facadeService.getAllReportsToUsers(selectedRoles).subscribe(
      (resp: any) => {
        if (resp.result) {
          this.totalManagers = resp.result.totalElements;
          this.pageNo = this.pageNo + 1;
          this.totalVisibleManagers = this.totalVisibleManagers + resp.result.numberOfElements;
          let updatedResult = [...this.reportingManagersoptions.value, ...resp.result.content];
          if (updatedResult.length > 0) {
            updatedResult = this.removeDuplicateReportingUsers(updatedResult);
            this.reportingManagersArray = updatedResult;
            let booleanCall = true;
            if (managerId) {
              booleanCall = false;
              updatedResult.map(values => {
                if (managerId == values.id) {
                  booleanCall = true;
                }
              });
            }
            if (booleanCall) {
              this.reportingManagersoptions.next(updatedResult);
              if (source) {
                if (updatedResult.length > 0 && managerId) {
                  this.handleSiteInformation(updatedResult, managerId, userSiteIds);
                }
              }
              this.ngxService.stop();
            } else {
              if (this.totalVisibleManagers < this.totalManagers) {
                this.getEditRMDetails(managerId, userSiteIds);
              } else {
                if (managerId && userSiteIds.length > 0 && userSiteIds[0] != 'SITE_CALL') {
                  this.siteIdsStore = userSiteIds;
                  this.specificSiteChangeEvent(userSiteIds, 'REPORTING_MANAGERS');
                }
                this.ngxService.stop();
              }
            }
          }
        } else {
          this.ngxService.stop();
        }
      },
      err => {
        this.ngxService.stop();
      }
    );
  }

  checkRMSites(RMId) {
    let reporingRMSites = [];
    this.reportingManagersArray.map((userInfo) => {
      if (userInfo.id == RMId && userInfo.sites && userInfo.sites.length > 0) {
        reporingRMSites = userInfo.sites;
      }
    });
    return reporingRMSites;
  }

  getManagerGeoHierarchy() {
    let selectedReportingMsisdn = this.addUserForm.controls.reportingMsisdn.value;
    if (selectedReportingMsisdn) {
      let reporingRMSites = this.checkRMSites(selectedReportingMsisdn);
      if (reporingRMSites.length > 0) {
        this.allSitesObj = reporingRMSites;
        this.siteIdsStore = reporingRMSites;
        this.specificSiteChangeEvent(reporingRMSites, 'REPORTING_MANAGERS');
      }
    }
  }

  makeRMOptional() {
    let selectedRoleIds = this.addUserForm.controls.role.value;
    let selectedLevels = [];
    this.rolesObj.map((roleInfo) => {
      if (selectedRoleIds.indexOf(roleInfo.id) >= 0) {
        selectedLevels.push(roleInfo.level)
      }
    });
    let validationCheck: boolean = false;
    for (let counter = 0; counter < selectedLevels.length; counter++) {
      if (this.lowestRoleLevel == selectedLevels[counter]) {
        validationCheck = true;
        break;
      }
    }
    if (validationCheck) {
      this.removeReportingManagerValidations();
    }
    else {
      this.addReportingManagerValidations();
    }
  }



  getLowestRoleLevel() {
    let lowestLevel = this.rolesObj[0].level;
    this.rolesObj.map((roleInfo) => {
      if (lowestLevel >= roleInfo.level) {
        lowestLevel = roleInfo.level;
      }
    });
    this.lowestRoleLevel = lowestLevel;
  }

  //confirmation pupup
  canDeactivate(): boolean {
    return !this.isDirty;
  }

  updateSiteIdStoreEditCase(siteIds) {
    let fetchedSiteIds = siteIds;
    let clonedSites = this.getAllSites();
    let filteredData = clonedSites.filter(filteredVals => {
      return fetchedSiteIds.indexOf(filteredVals) == -1 ? filteredVals : '';
    });
    this.allSitesObj = fetchedSiteIds.concat(filteredData);
    this.addUserForm.controls['siteId'].setValue(fetchedSiteIds);
    this.siteIdsStore = fetchedSiteIds;
  }

  updateUserForm(saveUserObj) {
    // Update Client and Dependent fields
    // Update Client Obj
    let clientInfo = [];
    saveUserObj.client.map(clientInfp => {
      clientInfo.push(clientInfp.clientId);
    });
    this.addUserForm.controls.client.setValue(clientInfo);
    // Update All Form fields
    this.enableAllFormFields();
    // Get All Departments
    this.allClientDepartments(clientInfo);
    // Update DepartmentValue
    if (saveUserObj.department && saveUserObj.department.id) {
      this.addUserForm.controls.department.setValue(saveUserObj.department.id);
    }
    // Update Role Field Data
    this.makeDepartmentRoleEmpty();
    let roleDInfo = [];
    saveUserObj.role.map(roleInfo => {
      roleDInfo.push(roleInfo.id);
    });
    this.prepareDepartmentRolesApiObj(clientInfo, saveUserObj.department ? (saveUserObj.department.id ? saveUserObj.department.id : '') : '', roleDInfo);
    // Update Reports To Manager Obj and make it optional as selected Role Levels
    if (roleDInfo.length > 0 && clientInfo.length > 0 && (saveUserObj.department && saveUserObj.department.id)) {
      let preparedRMObj = {
        roleList: roleDInfo,
        clientList: clientInfo,
        departmentList: [saveUserObj.department.id]
      }
      if (saveUserObj.reportingMsisdn) {
        let userSiteIds = ['SITE_CALL'];
        if (saveUserObj.sites && saveUserObj.sites.length > 0) {
          userSiteIds = saveUserObj.sites;
          this.getReportingManagerAPICall(preparedRMObj, 'SCROLL', saveUserObj.reportingMsisdn, userSiteIds);
        } else {
          this.getReportingManagerAPICall(preparedRMObj, 'SCROLL', saveUserObj.reportingMsisdn, userSiteIds);
        }
      }
      else if (saveUserObj.sites && saveUserObj.sites.length > 0) {
        this.updateSiteIdStoreEditCase(saveUserObj.sites);
        this.getReportingManagerAPICall(preparedRMObj, 'SCROLL');
        this.specificSiteChangeEvent(saveUserObj.sites);
        this.addUserForm.controls.siteId.setValue(saveUserObj.sites);
      } else {
        this.getReportingManagerAPICall(preparedRMObj, 'SCROLL');
      }
    } else {
      if (saveUserObj.sites.length > 0) {
        this.specificSiteChangeEvent(saveUserObj.sites);
      }
    }
    // Update Login Module with Login Module Values   
    this.addUserForm.controls.loginModule.setValue(saveUserObj.loginModule);
    // Update MSISDN Value
    if (saveUserObj.msisdn) {
      this.addUserForm.controls.msisdn.setValue(saveUserObj.msisdn);
    }
    // Auuid Field checks
    this.addUserForm.get('auuid').disable();
    this.selectedloginModule = 'msisdn';
    if (saveUserObj.loginModule == 'AUUID') {
      this.enbleFormField('auuid');
      this.selectedloginModule = 'auuid';
      this.addUserForm.controls.auuid.setValue(saveUserObj.auuid);
    }
    // Update Login Channels
    let savedLoginChannels = [];
    saveUserObj.loginChannels.map(loginChannel => {
      savedLoginChannels.push(loginChannel.id);
    });
    this.addUserForm.controls.loginChannels.setValue(savedLoginChannels);
    // Update Nation Id Type
    if (saveUserObj.idType && saveUserObj.idType.id) {
      this.addUserForm.controls.idType.setValue(saveUserObj.idType.id);
    }
    // Update Nation Id
    if (saveUserObj.nationalId) {
      this.addUserForm.controls.nationalId.setValue(saveUserObj.nationalId);
    }
    // Update Mobile No
    if (saveUserObj.mobileNumber && saveUserObj.mobileNumber != '') {
      this.addUserForm.controls.mobileNumber.setValue(saveUserObj.mobileNumber);
    }
    // Update First Name
    this.addUserForm.controls.firstName.setValue(saveUserObj.firstName);
    // Update Last Name
    this.addUserForm.controls.lastName.setValue(saveUserObj.lastName);
    // Update Email Id
    this.addUserForm.controls.email.setValue(saveUserObj.email);
    // Update DOB
    this.addUserForm.controls.dob.setValue(new Date(saveUserObj.dob));
    // Update Language
    if (saveUserObj.languageId && saveUserObj.languageId.languageId) {
      this.addUserForm.controls.languageId.setValue(saveUserObj.languageId.languageId);
    }
  }
  getUserDetails() {
    if (this.paramUserId) {
      this.ngxService.start();
      let editUserObj = { userId: this.paramUserId };
      this.userDetailsSubscriber = this.facadeService.onUserPostAPI(apiUrls.getUserById, editUserObj).subscribe(
        (resp: any) => {
          if (resp.body.result) {
            this.updateUserForm(resp.body.result);
          } else {
            this.facadeService.openArchivedSnackBar('User not Found in the System', 'Success');
            this.back();
          }
        },
        err => {
          this.ngxService.stop();
          this.facadeService.openArchivedSnackBar('User not Found in the System', 'Success');
          this.back();
        }
      )
    }
  }

  getAllSites() {
    let siteMasterData = AppUtills.getValue('masterSites');
    const deeplyClonedAutoCompleteObject = JSON.parse(siteMasterData);
    return deeplyClonedAutoCompleteObject;
  }

  getAllGeoLocations() {
    let masterGeoLocations = AppUtills.getValue('masterGeoLocations');
    const deeplyClonedAutoCompleteObject = JSON.parse(masterGeoLocations);
    return deeplyClonedAutoCompleteObject;
  }

  getGeoField(levelId, value) {
    let finallevelInfo = this.geolocationData[levelId].filter(levelvalue => {
      return value.indexOf(levelvalue.id) >= 0 ? levelvalue : '';
    });
    return finallevelInfo;
  }

  updateParentGeoLocations(levelInfo) {
    // Fetch All Options Data by condition, Parent and rootLevel
    let getCommonlevel = levelInfo[0].rootlevel;
    let getCommonParentLevel = levelInfo[0].parentLevel;
    let levelValueIds = [];
    let levelParentIds = [];
    levelInfo.map(levelvalues => {
      levelValueIds.push(levelvalues.id);
      if (levelParentIds.indexOf(levelvalues.parent) < 0) {
        levelParentIds.push(levelvalues.parent);
      }
    });
    let clonedData = this.getAllGeoLocations();
    let filteredLevelOptions = clonedData[getCommonlevel].filter((levelData) => {
      return levelParentIds.indexOf(levelData.parent) >= 0 ? levelData : '';
    });
    this.geolocationData[getCommonlevel] = [];
    this.geolocationData[getCommonlevel] = filteredLevelOptions;
    this.addUserForm.controls[getCommonlevel].setValue(levelValueIds);
    if (getCommonParentLevel && getCommonParentLevel != '' && levelParentIds.length > 0) {
      let geoFieldData = this.getGeoField(getCommonParentLevel, levelParentIds);
      this.updateParentGeoLocations(geoFieldData);
    }
  }

  updateChildGeoLocations(levelInfo) {
    let levelValueIds = [];
    levelInfo.map(levelvalues => {
      levelValueIds.push(levelvalues.id);
    });
    let childLevel = this.getChildLevel(levelInfo[0].rootlevel);
    let clonedData = this.getAllGeoLocations();
    if (clonedData[childLevel]) {
      let filteredLevelOptions = clonedData[childLevel].filter((levelData) => {
        return levelValueIds.indexOf(levelData.parent) >= 0 ? levelData : '';
      });
      if (filteredLevelOptions.length > 0) {
        let filteredChild = [];
        filteredLevelOptions.map((filterdLevel) => {
          filteredChild.push(filterdLevel.id);
        });
        this.geolocationData[childLevel] = [];
        this.geolocationData[childLevel] = filteredLevelOptions;
        this.addUserForm.controls[childLevel].setValue(filteredChild);
        this.updateChildGeoLocations(filteredLevelOptions);
      }
    }
  }

  getChildLevel(level) {
    let childNode = 'L1';
    if (level && level != '') {
      let splittedString = level.split('');
      let incrementedString = parseInt(splittedString[1]) + 1;
      childNode = 'L' + incrementedString;
    }
    return childNode;
  }

  updateAllChild(levelId) {
    let clonedData = this.getAllGeoLocations();
    if (clonedData[levelId]) {
      this.geolocationData[levelId] = [];
      this.geolocationData[levelId] = clonedData[levelId];
      this.addUserForm.controls[levelId].setValue([]);
      this.updateAllChild(this.getChildLevel(levelId));
    }
  }

  updateChildSiteSourceGeoLocations(levelInfo) {
    let levelValueIds = [];
    levelInfo.map(levelvalues => {
      levelValueIds.push(levelvalues.id);
    });
    let childLevel = this.getChildLevel(levelInfo[0].rootlevel);
    let clonedData = this.getAllGeoLocations();
    if (clonedData[childLevel]) {
      let filteredLevelOptions = clonedData[childLevel].filter((levelData) => {
        return levelValueIds.indexOf(levelData.parent) >= 0 ? levelData : '';
      });
      if (filteredLevelOptions.length > 0) {
        let filteredChild = [];
        filteredLevelOptions.map((filterdLevel) => {
          filteredChild.push(filterdLevel.id);
        });
        this.geolocationData[childLevel] = [];
        this.geolocationData[childLevel] = filteredLevelOptions;
        this.addUserForm.controls[childLevel].setValue(filteredChild);
        this.updateChildSiteSourceGeoLocations(filteredLevelOptions);
      }
    } else {
      let lastChildHierarchy = (this.geoFields).slice(-1);
      if (lastChildHierarchy[0].fieldLevelId == levelInfo[0].rootlevel) {
        this.getAllSitesPerLevel();
      }
    }
  }

  checkImmediateChildHirerachy(fieldLevelKey) {
    let selectedAllCheck = false;
    let levelOptions = this.geolocationData[fieldLevelKey];
    let selectedValues = this.addUserForm.controls[fieldLevelKey].value;
    if (selectedValues && selectedValues.length == levelOptions.length) {
      selectedAllCheck = true;
    }
    return selectedAllCheck;
  }

  updateGeoHierarchyForReportingManagers() {
    if (this.geoFields) {
      let clonedData = this.getAllGeoLocations();
      let disableCheck = false;
      let levelIds = [];
      let geoData = this.geolocationData;
      for (let counter = 0; counter < this.geoFields.length; counter++) {
        if (geoData[this.geoFields[counter].fieldLevelId]) {
          levelIds.push(this.geoFields[counter].fieldLevelId);
          // Get its immediate Child
          let immediateChildLevel = this.getChildLevel(this.geoFields[counter].fieldLevelId);
          if (clonedData[immediateChildLevel]) {
            // Check its next child is selected All, if true, then break
            if (this.checkImmediateChildHirerachy(immediateChildLevel)) {
              disableCheck = true;
              break;
            }
          }
        }
      }
      if (disableCheck && levelIds.length > 0) {
        for (let counter = 0; counter < levelIds.length; counter++) {
          if (clonedData[levelIds[counter]]) {
            this.disableFormField(levelIds[counter]);
          }
        }
      }
    }
  }

  geoSiteHandler(geoInfo, values, source?: string) {
    let geoFieldData = this.getGeoField(geoInfo.fieldLevelId, values);
    if (values.length > 0) {
      this.updateParentGeoLocations(geoFieldData);
      if (source && (source == 'SITE' || source == 'REPORTING_MANAGERS')) {
        this.updateChildGeoLocations(geoFieldData);
      } else {
        this.updateChildSiteSourceGeoLocations(geoFieldData);
      }
      if (source == 'REPORTING_MANAGERS') {
        this.updateGeoHierarchyForReportingManagers();
      }
    } else {
      this.updateAllChild(this.getChildLevel(geoInfo.fieldLevelId));
      this.siteIdsStore = [];
      this.allSitesObj = this.getAllSites();
      this.addUserForm.controls['siteId'].setValue([]);
    }
  }

  getAllOnChangeEvents() {
    if (this.addUserForm) {
      if (this.geoFields) {
        this.geoFields.map((geoFieldV, geoFieldK) => {
          if (this.addUserForm.get(geoFieldV.fieldLevelId)) {
            this.onChangeSubscriber = this.addUserForm.get(geoFieldV.fieldLevelId).valueChanges.subscribe(
              changedValue => {
                let clonedData = this.getAllGeoLocations();
                this.geolocationData[geoFieldV.fieldLevelId] = [];
                this.geolocationData[geoFieldV.fieldLevelId] = clonedData[geoFieldV.fieldLevelId];
                if (changedValue) {
                  this.geolocationData[geoFieldV.fieldLevelId] = this.geolocationData[geoFieldV.fieldLevelId].filter(option => {
                    return option.level.toLowerCase().indexOf(changedValue.toLowerCase()) >= 0;
                  })
                }
              }
            );
          }
        });
      }
    }
  }

  resetRMGeoHierarchy() {
    let clonedData = this.getAllGeoLocations();
    this.geoFields.map((geoFieldV, geoFieldK) => {
      this.geolocationData[geoFieldV.fieldLevelId] = [];
      this.geolocationData[geoFieldV.fieldLevelId] = clonedData[geoFieldV.fieldLevelId];
      this.addUserForm.controls[geoFieldV.fieldLevelId].setValue([]);
      this.enbleFormField(geoFieldV.fieldLevelId);
      this.markFieldAsUnCheck(geoFieldV.fieldLevelId);
    });
    this.addUserForm.controls['siteId'].setValue([]);
  }

  markcheckUncheck(fieldInfo) {
    this.geoSiteHandler(fieldInfo, this.addUserForm.controls[fieldInfo.fieldLevelId].value);
  }

  resetGeoHierarchy() {
    let clonedData = this.getAllGeoLocations();
    this.geoFields.map((geoFieldV, geoFieldK) => {
      this.geolocationData[geoFieldV.fieldLevelId] = [];
      this.geolocationData[geoFieldV.fieldLevelId] = clonedData[geoFieldV.fieldLevelId];
      this.addUserForm.controls[geoFieldV.fieldLevelId].setValue([]);
    });
    this.addUserForm.controls['siteId'].setValue([]);
  }

  resetMsisdnFieldInfo() {
    let selectedReportingMsisdn = this.addUserForm.controls.reportingMsisdn.value;
    if (selectedReportingMsisdn) {
      this.resetRMGeoHierarchy();
      this.resetSitesInformation();
    }
  }

  resetSitesInformation() {
    this.allSitesObj = this.getAllSites();
  }

  getFilteredGeoField(levelId) {
    let filteredGeoLevel = this.geoFields.filter((fieldvalue, fieldKey) => {
      return fieldvalue.fieldLevelId == levelId ? fieldvalue : '';
    });
    return filteredGeoLevel
  }

  getAllSitesPerLevel() {
    let lastChildHierarchy = (this.geoFields).slice(-1);
    let selectedLeafLevelIds = this.addUserForm.controls[lastChildHierarchy[0].fieldLevelId].value;
    let selectedIds = {
      levelIdList: selectedLeafLevelIds
    }
    this.ngxService.start();
    this.sitesSubscription = this.facadeService.getAllSitePerLvele(selectedIds).subscribe(
      (resp: any) => {
        if (resp.result) {
          let fetchedSiteIds = [];
          resp.result.map(values => {
            fetchedSiteIds.push(values);
          });
          this.siteItemSize = fetchedSiteIds.length;
          this.siteIdsStore = [];
          this.allSitesObj = [];
          let clonedSites = this.getAllSites();
          let filteredData = clonedSites.filter(filteredVals => {
            return fetchedSiteIds.indexOf(filteredVals) == -1 ? filteredVals : '';
          });
          this.allSitesObj = fetchedSiteIds.concat(filteredData);
          this.addUserForm.controls['siteId'].setValue(fetchedSiteIds);
          this.siteIdsStore = fetchedSiteIds;
          this.ngxService.stop();
        }
      },
      err => {
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    );
  }

  markSitecheckUncheck() {
    if (this.addUserForm.controls['siteId'].value.length > 0) {
      this.allSitesObj = [];
      let clonedSites = this.getAllSites();
      this.siteIdsStore = [];
      this.siteIdsStore = clonedSites;
      this.specificSiteChangeEvent(clonedSites);
    } else {
      this.resetGeoHierarchy();
    }
  }

  updateSiteStore(triggeredSiteId) {
    let siteIndex = this.siteIdsStore.indexOf(triggeredSiteId);
    if (siteIndex == -1) {
      this.siteIdsStore.push(triggeredSiteId)
    } else {
      this.siteIdsStore.splice(siteIndex, 1);
    }
    if (this.siteIdsStore.length > 0) {
      this.specificSiteChangeEvent(this.siteIdsStore);
      this.siteItemSize = this.siteIdsStore.length;
    } else {
      this.resetGeoHierarchy();
    }
  }

  specificSiteChangeEvent(siteIds, source?: any, editRMSiteIds?: string[]) {
    if (siteIds.length > 0) {
      this.ngxService.start();
      let siteIdsObj = {
        siteIdList: siteIds
      }
      this.forkJoinSubscriber = this.facadeService.getSiteHierarchy(siteIdsObj).subscribe(
        (resp: any) => {
          this.resetGeoHierarchy();
          if (resp.statusCode == 200 && resp.result && Object.keys(resp.result).length > 0) {
            let siteKeys = Object.keys(resp.result);
            let bulkSitesData = [];
            let leafGeoInfo = {};
            siteKeys.map((siteData, siteKey) => {
              resp.result[siteKeys[siteKey]].map((siteInfo, siteObjKey) => {
                if (siteInfo.leafNodeHierarchyType.name == "Sales Geographical Hierarchy") {
                  bulkSitesData.push(siteInfo.leafNodeId.id);
                  let levelId = siteInfo.leafNodeId.levelHierarchy.levelId
                  leafGeoInfo = this.getFilteredGeoField('L' + levelId)[0];
                }
              });
            });
            if (bulkSitesData.length > 0) {
              let uniqueLeafNodeIds = Array.from(new Set(bulkSitesData));
              // this.allSitesObj = [];
              // let clonedSites = this.getAllSites();
              // let filteredData = clonedSites.filter(filteredVals => {
              //   return siteIds.indexOf(filteredVals) == -1 ? filteredVals : '';
              // });
              // this.allSitesObj = siteIds.concat(filteredData);
              // this.siteItemSize = siteIds.length;
              this.addUserForm.controls['siteId'].setValue(siteIds);
              if (editRMSiteIds && editRMSiteIds.length > 0) {
                this.addUserForm.controls['siteId'].setValue(editRMSiteIds);
              }
              if (source) {
                this.geoSiteHandler(leafGeoInfo, uniqueLeafNodeIds, source);
              } else {
                this.geoSiteHandler(leafGeoInfo, uniqueLeafNodeIds, 'SITE');
              }
              this.ngxService.stop();
            }
          }
        },
        err => {
          this.ngxService.stop();
        }
      )
    }
  }

  siteChange() {
    console.log('Shivam Va from siteCHange event');
    //let selectedSiteIds = this.addUserForm.controls['siteId'].value;
    //this.specificSiteChangeEvent(selectedSiteIds);
  }
  openedChange(opened) {
    if (!opened) {
      this.cdkVirtualScrollViewPort.setRenderedContentOffset(0);
      this.cdkVirtualScrollViewPort.setRenderedRange(this.initialRange);
      if (this.siteIdsStore.length > 0) {
        this.addUserForm.controls['siteId'].setValue(this.siteIdsStore);
      }
    } else {
      this.siteMultiFilterCtrl.setValue('');
      document.getElementsByClassName('cdk-virtual-scroll-viewport')[0].scrollTop = 5;
    }
  }
  ngOnInit() {
    this.userModalResponseSubscription = this.dataService.listen().subscribe(
      (data: any) => {
        if (data) {
          data.modalResponseType ? (
            this.isDirty = false,
            this.back()
          ) : this.isDirty = true;
        }
      });
    this.siteMultiFilterCtrl.valueChanges.subscribe((searchV) => {
      this.allSitesObj = this.getAllSites();
      let clonedSites = this.getAllSites();
      //this.siteAllCheckBox = false;
      if (searchV) {
        let filteredData = clonedSites.filter(filteredVals => {
          let search = searchV.toLowerCase();
          return filteredVals.toLowerCase().indexOf(search) > -1 ? filteredVals : '';
        });
        this.allSitesObj = filteredData;
      }
    });
    let ssoCreateAgentButtonLabel = AppUtills.getValue('ssoCreateAgentButtonLabel');
    if (ssoCreateAgentButtonLabel && ssoCreateAgentButtonLabel != '' && ssoCreateAgentButtonLabel != null) {
      this.submiText = ssoCreateAgentButtonLabel;
    }
  }

  onChangeForm() {
    this.addUserForm.valueChanges.subscribe(val => {
      this.isDirty = true;
    })
  }

  // On Change of The Department
  departmentManagers() {
    let departmentId = this.addUserForm.controls['department'].value;
    if (departmentId && departmentId != '') {
      this.resetMsisdnFieldInfo();
      this.addUserForm.controls.reportingMsisdn.setValue('');
      this.markFieldAsUnCheck('reportingMsisdn');
      this.enbleFormField('reportingMsisdn');
      this.reportingManagersoptions = new BehaviorSubject<string[]>([]);
      this.reportingManagersoptions$ = this.reportingManagersoptions.asObservable();
      this.totalManagers = 0;
      this.pageNo = 0;
      this.totalVisibleManagers = 0;
      this.getRoleChangeReportingManagers();
    }
  }
  // All Filtered Reporting Managers
  filterReportingManagers(eventType?: string) {
    let departmentId = this.addUserForm.controls['department'].value;
    let clientIds = this.addUserForm.controls['client'].value;
    let filteredReportingUsers = [];
    this.reportingManagersArray.map((filteredInfo, filteredKey) => {
      if (filteredInfo['department'] && filteredInfo['department'].id == departmentId) {
        let allUserClients = [];
        filteredInfo['client'].map(clientInfo => {
          allUserClients.push(clientInfo.clientId);
        });
        if (allUserClients.length > 0) {
          let boolean = false;
          clientIds.map(clientId => {
            if (allUserClients.indexOf(clientId) >= 0) {
              boolean = true;
            }
          });
          if (boolean) {
            filteredReportingUsers.push(this.reportingManagersArray[filteredKey]);
          }
        }
      }
    })
    this.reportingManagersoptions.next(filteredReportingUsers);
    if (eventType) {
      //this.reportingManagersoptions.next(filteredReportingUsers);
    } else {
      this.pageNo = 1;
    }
  }
  // Remove Duplicate Users From Response
  removeDuplicateReportingUsers(reporingManagers) {
    let result = [];
    const map = new Map();
    reporingManagers.map((item, key) => {
      if (!map.has(item.id)) {
        map.set(item.id, true);
        result.push(reporingManagers[key]);
      }
    });
    return result;
  }

  handleSiteInformation(reportingManagers, managerId, userSiteIds) {
    reportingManagers.map(values => {
      if (values['id'] == managerId) {
        this.addUserForm.controls.reportingMsisdn.setValue(values['id']);
        if (userSiteIds && userSiteIds.length > 0) {
          if (values['sites'] && values['sites'].length > 0) {
            this.callSpecificSitesData(userSiteIds, values['sites']);
          } else if (userSiteIds[0] != 'SITE_CALL') {
            this.siteIdsStore = userSiteIds;
            this.specificSiteChangeEvent(userSiteIds, 'REPORTING_MANAGERS');
          }
        }
      }
    });
  }

  getEditRMDetails(RMId, rmSiteIds) {
    this.ngxService.start();
    let editUserObj = { userId: RMId };
    this.rmDetailsSubscriber = this.facadeService.onUserPostAPI(apiUrls.getUserById, editUserObj).subscribe(
      (resp: any) => {
        if (resp.body.result) {
          let rmArray = [resp.body.result];
          let appendedResult = [...rmArray, ...this.reportingManagersoptions.value];
          this.reportingManagersoptions.next(appendedResult);
          this.handleSiteInformation(appendedResult, RMId, rmSiteIds);
        }
        this.ngxService.stop();
      },
      err => {
        this.ngxService.stop();
      }
    )
  }

  updatedUseerSites(userSites, rmSites) {
    let updatedUserSites = [];
    userSites.map(val => {
      if (rmSites.indexOf(val) >= 0) {
        updatedUserSites.push(val);
      }
    });
    return updatedUserSites;
  }

  callForAllUserSites(rmSites) {
    this.siteIdsStore = rmSites;
    this.specificSiteChangeEvent(rmSites, 'REPORTING_MANAGERS', rmSites);
  }

  callSpecificSitesData(userSites, rmSites) {
    this.allSitesObj = rmSites;
    let boolenToShowRM = true;
    if (userSites[0] != 'SITE_CALL') {
      let updatedUserSites = this.updatedUseerSites(userSites, rmSites);
      if (updatedUserSites.length > 0) {
        boolenToShowRM = false;
        this.siteIdsStore = updatedUserSites;
        this.specificSiteChangeEvent(rmSites, 'REPORTING_MANAGERS', updatedUserSites);
      }
    }
    if (boolenToShowRM) {
      this.callForAllUserSites(rmSites);
    }
  }

  enbleFormField(field) {
    this.addUserForm.get(field).enable();
  }
  disableFormField(field) {
    this.addUserForm.get(field).disable();
  }
  enableAllFormFields() {
    Object.keys(this.addUserForm.controls).map((field, fieldKey) => {
      if(this.clientDependentFields.indexOf(field) == -1){
        this.addUserForm.get(field).enable();
      }
    });
  }
  disableAllFormFields() {
    Object.keys(this.addUserForm.controls).map((field, fieldKey) => {
      if(this.clientDependentFields.indexOf(field) == -1){
        this.addUserForm.get(field).disable();
      }
    });
  }
  loginModuleChange() {
    let selectedLoginModuleValue = this.addUserForm.controls.loginModule.value;
    this.addUserForm.get('auuid').disable();
    this.selectedloginModule = 'auuid';
    if (selectedLoginModuleValue == 'MSISDN') {
      this.selectedloginModule = 'msisdn';
    } else if (selectedLoginModuleValue == 'AUUID') {
      this.addUserForm.get('auuid').enable();
    }
  }
  roleChange() {
    let selectedRoleIds = this.addUserForm.controls.role.value;
    this.resetMsisdnFieldInfo();
    this.addReportingManagerValidations();
    if (selectedRoleIds.length > 0) {
      this.isDirty = true;
      this.pageNo = 0;
      this.totalVisibleManagers = 0;
      this.totalManagers = 0;
      this.enableAllFormFields();
      this.loginModuleChange();
      this.getAllClients();
      this.makeRMOptional();
    } else {
      this.isDirty = false;
      this.addUserForm.controls.client.setValue('');
      this.addUserForm.controls.department.setValue('');
      this.disableAllFormFields();
    }
    this.dataService.userStatus(this.isDirty);
  }

  allRoleClients(roleIds) {
    let uniqueClientIds = [];
    this.rolesObj.map(value => {
      if (roleIds.indexOf(value.id) >= 0) {
        if (value.client && value.client.length > 0) {
          value.client.map(clientData => {
            if (clientData.enable) {
              let clientObj = { label: clientData.name, value: clientData.clientId, departments: clientData.departments };
              uniqueClientIds.push(clientObj);
            }
          });
        }
      }
    });
    if (uniqueClientIds.length > 0) {
      const result = [];
      const map = new Map();
      for (const item of uniqueClientIds) {
        if (!map.has(item.value)) {
          map.set(item.value, true);
          result.push({
            value: item.value,
            label: item.label,
            clientDepartments: item.departments
          });
        }
      }
      uniqueClientIds = result;
      this.clientsObj = uniqueClientIds;
    }
  }

  getAllClients() {
    this.clientsObj = [];
    this.addUserForm.controls.client.setValue('');
    this.markFieldAsUnCheck('client');
    let selectedRoleIds = this.addUserForm.controls.role.value;
    this.allRoleClients(selectedRoleIds);
    this.clientChange();
  }

  getAllLoginModules() {
    let loginModule = [];
    let loginModuleMasterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
    loginModuleMasterData.loginModule.map(value => {
      let loginModuleObj = { label: value, value: value };
      loginModule.push(loginModuleObj);
    });
    this.loginModules = loginModule;
  }

  getAllLoginChannels() {
    let loginChannels = [];
    let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
    masterData.loginChannels.map(value => {
      if (value.enable) {
        let loginChannelObj = { label: value.channel, value: value.id };
        loginChannels.push(loginChannelObj);
      }
    });
    this.loginChannlesObj = loginChannels;
  }

  getAllLanguages() {
    let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
    this.langulagesObj = [];
    masterData.language.map(value => {
      let languageObj = { label: value.name, value: value.languageId };
      this.langulagesObj.push(languageObj);
    });
  }

  getAllNationIdTypes() {
    let nationalIdType = [];
    let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
    masterData.idType.map(value => {
      let nationalIdTypeObj = { label: value.name, value: value.id };
      nationalIdType.push(nationalIdTypeObj);
    });
    this.nationalIdTypesObj = nationalIdType;
  }

  getAllMasterGeoFields() {
    let masterGeoFields = AppUtills.getValue('geoFields') ? JSON.parse(AppUtills.getValue('geoFields')) : '';
    if (masterGeoFields) {
      this.geoFields = masterGeoFields;
    }
  }

  createGeoAddressFormGroup() {
    this.geoFields.map((geoFieldV, geoFieldK) => {
      let control = new FormControl({ value: '', disabled: true }, [Validators.required]);
      this.addUserForm.addControl(geoFieldV.fieldLevelId, control);
    });
    let siteControl = new FormControl({ value: '', disabled: true }, [Validators.required]);
    this.siteItemSize = 10;
    this.addUserForm.addControl('siteId', siteControl);
    this.formLength = 8;
    this.getUserDetails();
    //this.getAllOnChangeEvents();
  }

  initializeMasterData() {
    this.getAllMasterGeoFields();
    this.getAllLoginModules();
    this.getAllLoginChannels();
    this.getAllNationIdTypes();
    this.getAllLanguages();
    this.allSitesObj = this.getAllSites();
    this.geolocationData = this.getAllGeoLocations();
  }

  createUserForm() {
    this.initializeMasterData();
    this.addUserForm = new FormGroup({
      client: new FormControl({ value: '', disabled: false }, Validators.required),
      department: new FormControl({ value: '', disabled: true }, Validators.required),
      role: new FormControl('', [Validators.required]),
      reportingMsisdn: new FormControl({ value: '', disabled: true }, Validators.required),
      loginModule: new FormControl({ value: '', disabled: true }, Validators.required),
      auuid: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(environment.regex)]),
      msisdn: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(environment.addUserReg)]),
      loginChannels: new FormControl({ value: '', disabled: true }, Validators.required),
      idType: new FormControl({ value: '', disabled: true }, Validators.required),
      nationalId: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern("^[0-9a-zA-Z-/.]{7,20}$")]),
      mobileNumber: new FormControl({ value: '', disabled: true }, [Validators.pattern(environment.addUserReg)]),
      firstName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern("^[a-zA-Z.]{2,30}$")]),
      lastName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern("^[a-zA-Z.]{2,30}$")]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]),
      dob: new FormControl({ value: '', disabled: true }, Validators.required),
      languageId: new FormControl({ value: '', disabled: true }, Validators.required)
    });
    this.createGeoAddressFormGroup();
    this.onChangeForm();
  }

  back() {
    this._routes.navigate(['/user']);
  }

  redirectTo(uri: string) {
    this._routes.navigateByUrl('/', { skipLocationChange: true }).then(
      () => this._routes.navigate([uri])
    );
  }

  getAllMasterData() {
    this.ngxService.start();
    let masterData = AppUtills.getValue('masterData');
    let storageGeoFields = AppUtills.getValue('geoFields');
    let masterSites = AppUtills.getValue('masterSites');
    let masterGeoLocations = AppUtills.getValue('masterGeoLocations');
    if ((masterData && masterData != '') && (storageGeoFields && storageGeoFields != '') && (masterSites && masterSites != '') && (masterGeoLocations && masterGeoLocations != '')) {
      //this.getRoles();
      this.getAllRootClients();
    } else {
      this.ngxService.start();
      this.masterDataSubscriber = this.facadeService.getCompleteMasterData().subscribe(
        (masterResp: any) => {
          if (masterResp) {
            masterResp.map((value, key) => {
              if (value.statusCode == 200 && value.result) {
                if (key == 1) {
                  value.result.map(geoFieldsData => {
                    if (geoFieldsData.type == "Sales Geographical Hierarchy") {
                      let geoFieldsCounter = 1;
                      let geoFieldsObj = [];
                      let apiRequests = [];
                      geoFieldsData.levels.map((fieldV, fieldK) => {
                        let geoFieldObj = { fieldLevelId: 'L' + geoFieldsCounter, fieldLevel: fieldV }
                        geoFieldsObj.push(geoFieldObj);
                        let preparedUrl = apiUrls.siteLevelHirerchy + '?levelId=' + geoFieldsCounter;
                        let getgeoLevelData = this._http.post(preparedUrl, {});
                        apiRequests.push(getgeoLevelData);
                        geoFieldsCounter += 1;
                      });
                      AppUtills.removeValue('geoFields');
                      AppUtills.setValue('geoFields', JSON.stringify(geoFieldsObj));
                      this.siteLevelForkJoinSubscriber = forkJoin(apiRequests).subscribe(
                        (geolocations: any) => {
                          if (geolocations) {
                            let geoData = {};
                            geolocations.map((geolocation, key) => {
                              if (geolocation.statusCode == 200 && geolocation.result && geolocation.result.length > 0) {
                                let preparedLevel = 'L' + geolocation.result[0].levelHierarchy.levelId;
                                geoData[preparedLevel] = [];
                                geolocation.result.map(iteration => {
                                  let parentId = '';
                                  let parentLevel = '';
                                  if (iteration.parent) {
                                    parentId = iteration.parent.id;
                                    parentLevel = 'L' + iteration.parent.levelHierarchy.levelId;
                                  }
                                  let preparedObj = { id: iteration.id, level: iteration.levelName, rootlevel: preparedLevel, parent: parentId, parentLevel: parentLevel }
                                  geoData[preparedLevel].push(preparedObj);
                                });
                              }
                            });
                            AppUtills.removeValue('masterGeoLocations');
                            AppUtills.setValue('masterGeoLocations', JSON.stringify(geoData));
                            //this.getRoles();
                            this.getAllRootClients();
                            this.ngxService.stop();
                          }
                        }
                      );
                    }
                  });
                } else if (key == 2) {
                  AppUtills.removeValue('masterSites');
                  AppUtills.setValue('masterSites', JSON.stringify(value.result));
                } else {
                  AppUtills.removeValue('masterData');
                  AppUtills.setValue('masterData', JSON.stringify(value.result));
                }
              }
            })
          }
        },
        err => {
          console.log(err);
          this.ngxService.stop();
        }
      );
    }
  }

  getRoles() {
    this.filteredRoleSubscription = this.facadeService.onRoleGetAPI(apiUrls.roles).subscribe(
      resp => {
        this.ngxService.start();
        if (resp.result) {
          this.rolesObj = resp.result;
          this.getLowestRoleLevel();
          this.createUserForm();
        }
        this.ngxService.stop();
      },
      err => {
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    );
  }

  markFieldAsUnCheck(field) {
    const control = this.addUserForm.get(field);
    control.markAsUntouched({ onlySelf: true });
  }

  resetUserForm() {
    if (this.paramUserId) {
      this.back();
      return false;
    }
    this.addUserForm.controls.languageId.setValue('');
    this.addUserForm.controls.dob.setValue('');
    this.addUserForm.controls.email.setValue('');
    this.addUserForm.controls.lastName.setValue('');
    this.addUserForm.controls.firstName.setValue('');
    this.addUserForm.controls.mobileNumber.setValue('');
    this.addUserForm.controls.nationalId.setValue('');
    this.addUserForm.controls.idType.setValue('');
    this.addUserForm.controls.loginChannels.setValue([]);
    this.addUserForm.controls.loginModule.setValue('');
    this.addUserForm.controls.msisdn.setValue('');
    this.addUserForm.get('msisdn').disable();
    this.addUserForm.controls.auuid.setValue('');
    this.addUserForm.get('auuid').disable();
    this.addUserForm.controls.department.setValue('');
    this.departmentsObj = [];
    this.addUserForm.controls.client.setValue([]);
    this.clientsObj = [];
    this.addUserForm.controls.reportingMsisdn.setValue('');
    this.addUserForm.controls.role.setValue([]);
    let clonedData = this.getAllGeoLocations();
    this.geoFields.map((geoFieldV, geoFieldK) => {
      this.geolocationData[geoFieldV.fieldLevelId] = [];
      this.geolocationData[geoFieldV.fieldLevelId] = clonedData[geoFieldV.fieldLevelId];
      this.addUserForm.controls[geoFieldV.fieldLevelId].setValue([]);
      const control = this.addUserForm.get(geoFieldV.fieldLevelId);
      control.markAsTouched({ onlySelf: true });
    });
    this.addUserForm.controls['siteId'].setValue([]);
    const siteControl = this.addUserForm.get('siteId');
    siteControl.markAsTouched({ onlySelf: true });
    return true;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.addUserForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        const fieldControl = this.addUserForm.get(name);
        fieldControl.markAsTouched({ onlySelf: true });
      }
    }
  }

  submit() {
    if (this.addUserForm.valid) {
      let formValue = this.addUserForm.value;
      this.ngxService.start();
      /* Role Object */
      let saveRoleIdObj = [];
      formValue.role.map(value => {
        saveRoleIdObj.push({ id: value });
      });
      /* Client Id Obj */
      let saveClientIdObj = [];
      formValue.client.map(value => {
        saveClientIdObj.push({ clientId: value });
      });
      /* loginChannels Obj */
      let saveLoginCHannlesObj = [];
      formValue.loginChannels.map(value => {
        saveLoginCHannlesObj.push({ id: value })
      });
      /* Date Obj As Requested */
      let today = new Date(formValue.dob);
      let cDate = today.getDate();
      let cMonth = today.getMonth() + 1;
      let cYear = today.getFullYear();
      let dobReq = cMonth + '/' + cDate + '/' + cYear;
      /* Prepare Level Obj */
      let levelsObj = [];
      /*
      this.geoFields.map(value => {
        formValue[value.fieldLevelId].map(geoId => {
          levelsObj.push({ id: geoId });
        });
      });
      */
      /* Updated Final Request */
      let saveUserObj = {
        role: saveRoleIdObj,
        client: saveClientIdObj,
        reportingMsisdn: formValue.reportingMsisdn,
        loginModule: formValue.loginModule,
        loginChannels: saveLoginCHannlesObj,
        status: "ACTIVE",
        idType: { id: formValue.idType },
        nationalId: formValue.nationalId,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        dob: dobReq,
        languageId: { languageId: formValue.languageId },
        sites: formValue.siteId,
        department: { id: formValue.department },
        levelId: levelsObj
      }
      if (formValue.auuid) {
        saveUserObj['auuid'] = formValue.auuid
      }
      if (formValue.msisdn) {
        saveUserObj['msisdn'] = formValue.msisdn
      }
      if (formValue.mobileNumber) {
        saveUserObj['mobileNumber'] = formValue.mobileNumber
      }
      let saveUserEndPoint = apiUrls.userCreate;
      if (this.paramUserId) {
        saveUserObj['id'] = this.paramUserId;
        saveUserEndPoint = apiUrls.updateUser;
      }
      this.saveUserUnsubscriber = this.facadeService.onUserPostAPI(saveUserEndPoint, saveUserObj).subscribe(res => {
        res = res.body || res;
        let data = res;
        if (data) {
          this.ngxService.stop();
          this.isDirty = false;
          if (data.statusCode == 200 && data.message) {
            this.facadeService.openArchivedSnackBar(data.message, 'Success');
            let ssoCreateAgentRedirectUrl = AppUtills.getValue('ssoCreateAgentRedirectUrl');
            if (ssoCreateAgentRedirectUrl && ssoCreateAgentRedirectUrl != '' && ssoCreateAgentRedirectUrl != null) {
              let updatedSsoCreateAgentRedirectUrl = ssoCreateAgentRedirectUrl + data.result.id;
              window.top.location.href = updatedSsoCreateAgentRedirectUrl;
            } else {
              this._routes.navigate(['/user/users']);
            }
          } else {
            this.facadeService.openArchivedSnackBar(data.message || 'Something Went Wrong', 'Retry');
          }
        }
      }, error => {
        if (AppUtills.showErrorMessage(error)) {
          this.facadeService.openArchivedSnackBar('Something Went Wrong', 'Retry');
        }
      });
    } else {
      this.findInvalidControls();
    }
  }


  ngOnDestroy() {
    this.masterDataSubscriber ? this.masterDataSubscriber.unsubscribe() : '';
    this.siteGeoFieldsSubscriber ? this.siteGeoFieldsSubscriber.unsubscribe() : '';
    this.saveUserUnsubscriber ? this.saveUserUnsubscriber.unsubscribe() : '';
    this.filteredRoleSubscription ? this.filteredRoleSubscription.unsubscribe() : '';
    this.reportingManagerSubscriber ? this.reportingManagerSubscriber.unsubscribe() : '';
    this.sitesSubscription ? this.sitesSubscription.unsubscribe() : '';
    this.forkJoinSubscriber ? this.forkJoinSubscriber.unsubscribe() : '';
    this.onChangeSubscriber ? this.onChangeSubscriber.unsubscribe() : '';
    this.siteLevelForkJoinSubscriber ? this.siteLevelForkJoinSubscriber.unsubscribe() : '';
    this.routeParamSubscriber ? this.routeParamSubscriber.unsubscribe() : '';
    this.userDetailsSubscriber ? this.userDetailsSubscriber.unsubscribe() : '';
    this.userModalResponseSubscription ? this.userModalResponseSubscription.unsubscribe() : '';
    this.rmDetailsSubscriber ? this.rmDetailsSubscriber.unsubscribe() : '';
    this.roleDetailsSubscriber ? this.roleDetailsSubscriber.unsubscribe() : '';
  }
}
