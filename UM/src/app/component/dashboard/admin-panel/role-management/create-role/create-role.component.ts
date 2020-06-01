import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { requireCheckboxesToBeCheckedValidator } from './atLeastOneCheckboxCheckedValidator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppUtills } from '@src/core/utills/appUtills';
import { AppConstants } from '@src/core/utills/constant';
import { FacadeService } from '@src/core/services/facade.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { ComponentCanDeactivate } from '@src/auth/authd.guard';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service';
import { DataService } from '@service/data-share-service/data.service';
import { Subscription } from 'rxjs';
  
@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent implements OnInit, ComponentCanDeactivate, OnDestroy {

  isDirty: boolean = false;
  editResponse = [];
  roleReportsToMapping = []
  permissionGroups = [];
  clientArray = [];
  roleTypeObj;
  clientObj;
  departmentObj = [];
  loginPartners = [];
  loginModules: any;
  showPermissions: boolean = false;
  createRole: FormGroup;
  levelData = [];
  reportingManagers = [];
  permissionsModules = [];
  allPermissions = [];
  selectAllPermissions: boolean = false;
  selectModuleErrorText: boolean = true;
  cehckedPermissions = [];
  validatePermissionsCheck: boolean = false;
  editRoleId: number;
  editResp: any;
  // Declare All Subscriptions
  getAllPermissionGroupsSubscription: Subscription;
  filteredRoleSubscription: Subscription;
  getRoleTypeSubscription: Subscription;
  getRoleReportsToMappinSubscription: Subscription;
  getLoginModulesSubscription: Subscription;
  getLoginPartnersSubscription: Subscription;
  getRoleByIdSubscription: Subscription;
  saveRoleSubscription:Subscription;
  getClientsSubscription: Subscription;
  roleTypeSubscrition: Subscription;
  roleLevelsSubscription: Subscription;
  reportingManagersSubscription: Subscription;
  modalRespSubscription:Subscription;
  editID: string;
  // Default Class Declare
  activeStatusClass = 'border_color';
  inactiveStatusClass = 'border_color_red';
  statusObject = [true, false];
  filterargs = { sort: 'ASC' };
  clientsCheck : boolean = false;
  pmsChecks : boolean = false;
  dynamicModuleIds = [];

  constructor(private ngxService: NgxUiLoaderService,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private route: Router,
    private facadeService: FacadeService,
    private aafModelService: AafModelService,
    private dataService: DataService) {      
  }

  // On change of the Permission Checkboxes
  onCheckboxChange(permissionId, event) {
    if (event.target.checked) {
      this.cehckedPermissions.push(permissionId);
    } else {
      for (var i = 0; i < this.cehckedPermissions.length; i++) {
        if (this.cehckedPermissions[i] == permissionId) {
          this.cehckedPermissions.splice(i, 1);
        }
      }
    }
  }

  // confirmation popup
  canDeactivate(): boolean {
    return !this.isDirty;
  }

  // On initilization Page
  ngOnInit() {
    this._route.params.subscribe(
      (params: Params) => {
        this.editID = params.id;
      }
    )

    this.modalRespSubscription = this.dataService.listen().subscribe(
      (data: any) => {
        data.modalResponseType ? (
          this.isDirty = false,
          this.back()
        ) : this.isDirty = true;
      });

    // Fet role Types
    this.ngxService.start();
    this.getRoleTypeSubscription = this.facadeService.onRoleGetAPI(apiUrls.roleTypes).subscribe(
      resp => {
        if (resp.result) {
          this.roleTypeObj = resp.result;
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

    // for client id
    this.ngxService.start();
    this.getClientsSubscription = this.facadeService.onRoleGetAPI(apiUrls.clientID).subscribe(
      resp => {
        if (resp.result) {
          this.clientObj = resp.result;          
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
    // Get permission groups
    this.ngxService.start();
    this.getAllPermissionGroupsSubscription = this.facadeService.onRoleGetAPI(apiUrls.permissions).subscribe(
      resp => {
        if (resp.result) {
          this.permissionGroups = resp.result;
          this.createRoleForm();          
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

  redirectTo(uri: string) {
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(
      () => this.route.navigate([uri])
    );
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!(((<Element>event.target).className.toString().split(' ')[0]).toString() == 's_module')) {
      this.showPermissions = false;
    }
  }

  //toggle permission
  toggleShow() {
    this.showPermissions = !this.showPermissions;
  }
  // Back to the Previous page
  back() {
    if (this.editID) {
      this.route.navigate(['/role/roles']);
    } else {
      this.route.navigate(['/role']);
    }
  }
  // Reset all the permissions
  resetAllPermissions() {
    this.selectAllPermissions = !this.selectAllPermissions;
    this.allPermissions.map((objVal, objKey) => {
      objVal.permissions.map((objVal, indexKey) => {
        this.allPermissions[objKey].permissions[indexKey].selected = this.selectAllPermissions;
        if (this.selectAllPermissions) {
          this.cehckedPermissions.push(objVal.id);
        }
      });
    });
    if (!this.selectAllPermissions) {
      this.cehckedPermissions = [];
    } 
  }
  // Create Role Form Initilization
  createRoleForm() {
    this.createRole = new FormGroup({
      roleName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z\ ]{1,40}$')]),
      roleType: new FormControl('', Validators.required),
      level: new FormControl({ value: '', disabled: true }, Validators.required),
      reportsTo: new FormControl({ value: '', disabled: true }, Validators.required),
      clientId: new FormControl('', Validators.required),
      departments: new FormControl('', Validators.required),
      roleDescription: new FormControl('', Validators.maxLength(500)),
      modulePermission: new FormArray([], requireCheckboxesToBeCheckedValidator())
    });
    this._route.params.subscribe(
      (param: Params) => {
        if (param.id) {
          this.editRoleId = param.id;
          this.ngxService.start();
          this.getRoleByIdSubscription = this.facadeService.getRoleById(this.editRoleId).subscribe(
            roleData => {
              if (roleData.result) {
                this.editResp = roleData.result;
                this.fillEditForm();
              } this.ngxService.stop();
            },
            err => {
              this.ngxService.stop();
            },
            () => {
              this.ngxService.stop();
            }
          );
        }
      }
    );
    this.onChanges();
  }
  // Update all role Information
  fillEditForm() {
    console.log(this.editResp)
    this.createRole.controls['roleName'].patchValue(this.editResp.roleName);
    this.createRole.controls['roleType'].patchValue(this.editResp.roleType);
    this.createRole.controls['roleDescription'].patchValue(this.editResp.description);
    if (this.editResp.roleType != '' && this.editResp.roleType != 'ADMIN') {
      this.createRole.get('level').enable();
      this.getFilteredLevels();
      this.createRole.get('reportsTo').disable();
      this.createRole.controls['level'].patchValue(this.editResp.level);
      if (this.editResp.level && this.editResp.level != '' && this.editResp.level > 1) {
        this.createRole.get('reportsTo').enable();
        this.getFilteredReportingManagers(this.editResp.level, this.createRole);
        this.createRole.controls['reportsTo'].patchValue(this.editResp.reportsToRole.id);
      }
    }
    // *********** Edit Client ID *********** //
    let allgetUniqueClientIds = this.getUniqueClientIds(this.editResp.client);
    this.createRole.controls['clientId'].setValue(allgetUniqueClientIds);    
    this.updatePermissionModules();
    if(this.editResp.departments){
      let departments = [];
      this.editResp.departments.map(editedDepart=>{
        departments.push(editedDepart.id);
      });
      this.createRole.controls['departments'].setValue(departments);  
    }
    // *********** Edit Client ID *********** //    
    // Get all the Module Ids
    let allPermissionIds = this.getUniquePermissinIds(this.editResp.permissions);
    let permissionsModuleIds = this.getAllModuleIds(allPermissionIds);
    // Set Module Permission Groups
    this.setPermisionGroups(permissionsModuleIds);    
    // Get all the Filtered Permissions
    this.getThePermissions();
    // Update permissions data
    this.updatePermissionsCheckedArray(allPermissionIds);
    if (this.editResp.active && (this.editResp.active == true || this.editResp.active == 'true')) {
      this.activeStatusClass = 'border_color';
      this.inactiveStatusClass = 'border_color_red';
    } else {
      this.activeStatusClass = 'border_color_red';
      this.inactiveStatusClass = 'border_color';
    }
  }
  // Get All client Ids
  getUniqueClientIds(clientGroupObj) {
    let clientGIds = [];
    clientGroupObj.map((pval, pkey) => {
      if (pval && pval.enable == true) {
        clientGIds.push(pval.clientId);
      }
    });
    this.clientArray = clientGIds;
    return clientGIds;
  }
  // Get All Permission Ids
  getUniquePermissinIds(permissionsObj) {
    let permissionIds = [];
    permissionsObj.map((permVal, permKey) => {
      permissionIds.push(permVal.id);
    });
    this.cehckedPermissions = permissionIds;
    return permissionIds;
  }
  //update selected client Array
  updateClientCheckedArray(userclientIds) {
    this.clientArray = [];
    this.editResp.client.map((objVal, objKey) => {

    })
  }

  // Update Selected Permissions Array
  updatePermissionsCheckedArray(permissionsIds) {
    this.cehckedPermissions = [];
    this.allPermissions.map((objVal, objKey) => {
      objVal.permissions.map((modulePermiVal, indexKey) => {
        if (permissionsIds.indexOf(modulePermiVal.id) !== -1) {
          this.allPermissions[objKey].permissions[indexKey].selected = true;
          this.cehckedPermissions.push(modulePermiVal.id);
        }
      });
    });
    this.createRole.controls.modulePermission.markAsTouched();
  }
  // Set Permission Groups as checked 
  setPermisionGroups(permissionModuleIds) {
    let modulePermissionControlls = this.createRole.controls.modulePermission as FormArray;
    while (modulePermissionControlls.length !== 0) {
      modulePermissionControlls.removeAt(0);
    }
    this.permissionsModules.map((o, i) => {
      let booleanCheck = false;
      if (permissionModuleIds.indexOf(o.id) !== -1) {
        booleanCheck = true;
      }
      const control = new FormControl(booleanCheck);
      (this.createRole.controls.modulePermission as FormArray).push(control);
    });
  }
  // Get all Unique Module Ids corrospinding to Permission Ids
  getAllModuleIds(permissionIds) {
    let permissionsDataInfo = [];
    this.permissionGroups.filter(function (permissios) {
      permissios.permissions.map(function (permissiosObj) {
        if (permissionIds.indexOf(permissiosObj.id) !== -1) {
          permissionsDataInfo.push(permissios.id);
        }
      });
    });
    let uniqueValues = AppUtills.getUniqueValueArray(permissionsDataInfo);
    return uniqueValues;
  }
  // Get selected All Modules
  getSelectedAllModules(controlledData) {
    return controlledData.map(
      (value, index) => value ? this.permissionsModules[index].id : null
    ).filter(value => value !== null);
  }
  // Get selected All Permissions
  getSelectedPermissions(controlledData) {
    return controlledData.map(
      (value, index) => value ? this.allPermissions[index].id : null
    ).filter(value => value !== null);
  }
  get allServiceBasedPermissions() {
    const deeplyClonedObject = JSON.parse(JSON.stringify(this.permissionGroups));    
    return deeplyClonedObject;
  }
  // Get Permission Modules specific to Client Ids
  updatePermissionModules(){
    let clonedData = this.allServiceBasedPermissions;
    let clientIds = this.createRole.controls.clientId.value;
    let permissionsDataInfo = [];
    this.clientsCheck = false;
    this.dynamicModuleIds = [];
    let defaultPGIds = [];
    this.departmentObj = [];
    let departments = [];
    if(clientIds.length > 0){
      this.clientObj.map(clientValues=>{
        if (clientIds.indexOf(clientValues.clientId) != -1 && clientValues.departments && clientValues.departments.length > 0) {
          clientValues.departments.map(department=>{
            let departmentObj = { id:department.id, label:department.name };
            departments.push(departmentObj);
          });
        }
      });
      if(departments.length > 0){
        this.departmentObj = AppUtills.removeDuplicates(departments, 'id');
      }      
      clonedData.map(function (permissiosData) {
        permissiosData.permissions.map(mapped=>{
          mapped.client.map(clientInfo=>{
            if (clientIds.indexOf(clientInfo.clientId) != -1) {
              if(defaultPGIds.indexOf(permissiosData.id) < 0){
                let permissionModuleObj = { id: permissiosData.id, name: permissiosData.groupName, description: permissiosData.description };
                permissionsDataInfo.push(permissionModuleObj);
                defaultPGIds.push(permissiosData.id);
              }
            }
          })
        });    
      });
    } 
    this.dynamicModuleIds = defaultPGIds;
    this.permissionsModules = permissionsDataInfo;
    this.updatePermissionModuleData();    
    if(defaultPGIds.length > 0){      
      this.clientsCheck = true;      
    }
  }
  // Set Permission Modules Data for Module Selection
  updatePermissionModuleData(){
    let modulePermissionControlls = this.createRole.controls.modulePermission as FormArray;    
    let modulesPermissions = [];
    modulePermissionControlls.controls.map((moduleValue, moduleKey) => {      
      modulesPermissions.push(moduleValue.value);
    });    
    while (modulePermissionControlls.length !== 0) {
      modulePermissionControlls.removeAt(0);
    }
    this.permissionsModules.map((o, i) => {
      let booleanCheck = false;            
      const control = new FormControl(booleanCheck);
      (this.createRole.controls.modulePermission as FormArray).push(control);
    });   
    this.pmsChecks = false;
  }
  checkandValidate(){
    let clientIds = this.createRole.controls.clientId.value;
    let booleanCheck = false;
    if(clientIds.length > 0){
      booleanCheck =  true;
    }
    return booleanCheck;
  }
  // Get the filtered permissions
  getThePermissions() {    
    this.ngxService.start();
    this.pmsChecks = false;    
    let permissionModules = this.createRole.controls.modulePermission as FormArray;    
    let modulesPermissions = [];
    permissionModules.controls.map((moduleValue, moduleKey) => {
      modulesPermissions.push(moduleValue.value);
    });
    let modulesPermissionsData = this.getSelectedAllModules(modulesPermissions);
    
    let selectedClientIds = this.createRole.controls.clientId.value;
    

    this.allPermissions = this.getAllFilteredPermissions(modulesPermissionsData,selectedClientIds);
    this.ngxService.stop();
    this.selectAllPermissions = false;
    if (this.allPermissions.length <= 0) {
      this.cehckedPermissions = [];
    } else {
      let allTempPermissionsIds = [];
      this.allPermissions.map((moduleIteVal, moduleIteKey) => {
        moduleIteVal.permissions.map((perVal, perKey) => {
          allTempPermissionsIds.push(perVal.id);
        });
      });
      let updatedCheckBoxPermissions = [];
      this.cehckedPermissions.map((permVal, permKey) => {
        if (allTempPermissionsIds.indexOf(permVal) != -1) {
          updatedCheckBoxPermissions.push(permVal);
        };
      });
      this.cehckedPermissions = updatedCheckBoxPermissions;
      if (allTempPermissionsIds.length > 0 && this.cehckedPermissions.length > 0) {
        if (allTempPermissionsIds.length == this.cehckedPermissions.length) {
          this.selectAllPermissions = true;
        }
      }
      this.pmsChecks = true;
    }
  }
  // Get All Filtered Module Specific Permissions
  getAllFilteredPermissions(moduleIds,selectedClientIds) {
    if (moduleIds.length < 1) {
      return [];
    }
    if(selectedClientIds.length < 1){
      return [];
    }
    let clonedData = this.allServiceBasedPermissions;
    let preparePermissionsObj = [];
    for (let counter = 0; counter < moduleIds.length; counter++) {
      clonedData.forEach((permissionData, permissionKey) => {
        if (permissionData.id == moduleIds[counter]) {
          preparePermissionsObj.push(permissionData);
        }
      });
    }
    preparePermissionsObj.map((permissionGp, permissionGpKey) => {
      permissionGp.permissions.filter((permissionsObj, permissionsKey) => {
        preparePermissionsObj[permissionGpKey].permissions[permissionsKey].selected = false;
        if (this.cehckedPermissions.indexOf(permissionsObj.id) != -1) {
          preparePermissionsObj[permissionGpKey].permissions[permissionsKey].selected = true;
        }
        if(permissionsObj.client.length > 0){
          let savedClientIds = [];
          permissionsObj.client.map((value, key) => {
            savedClientIds.push(value.clientId);
          });
          let assignedCLientPermissionCheck = false;
          selectedClientIds.map(portalClientId=>{
            if(savedClientIds.indexOf(portalClientId) !== -1){
              assignedCLientPermissionCheck = true;
            }
          });          
          if (assignedCLientPermissionCheck == false) {
            delete preparePermissionsObj[permissionGpKey].permissions[permissionsKey];
          }
        }else{
          delete preparePermissionsObj[permissionGpKey].permissions[permissionsKey];
        }
        /*
        if (permissionsObj.loginChannels.length > 0) {
          let permissionIds = [];
          permissionsObj.loginChannels.map((value, key) => {
            permissionIds.push(value.id);
          });
          if ((this.intersection(permissionIds)).length < 1) {
            delete preparePermissionsObj[permissionGpKey].permissions[permissionsKey];
          }
        } else {
          delete preparePermissionsObj[permissionGpKey].permissions[permissionsKey];
        }
        */
      });
      preparePermissionsObj[permissionGpKey].permissions = this.checkNullAndUndefined(permissionGp.permissions);
    });
    return preparePermissionsObj;
  }
  checkNullAndUndefined(obj) {
    return obj.map(
      (value, index) => value ? value : null
    ).filter(value => value !== null);
  }
  // Get all the filterd Permissions using login channels
  intersection(arr2) {
    return arr2.filter((ele => {
      return ele;
    }));
  }
  // Get total Count of the Permission Obj
  getTotalCount() {
    if (this.allPermissions.length > 0) {
      this.selectModuleErrorText = false;
      return true;
    } else {
      this.selectModuleErrorText = true;
      return false;
    }
  }
  // Filter All Permission Modules
  getAllPermissionModules() {
    let permissionsDataInfo = [];
    this.permissionGroups.filter(function (permissios) {
      let permissionModuleObj = { id: permissios.id, name: permissios.groupName, description: permissios.description };
      permissionsDataInfo.push(permissionModuleObj);
    });
    this.permissionsModules = permissionsDataInfo;    
  }
  // On each changes this function will going to observe
  onChanges() {
    this.createRole.valueChanges.subscribe(val => {
      if (this.editID) {
        // No need to check isDirty
      } else {
        this.isDirty = true;
      }
    });

    // On change of RoleType
    this.roleTypeSubscrition = this.createRole.get('roleType').valueChanges.subscribe(
      selectedRoleType => {
        // As it change, we need to set isDirty as true
        this.isDirty = true;
        // Reset to blank level Data Array
        this.levelData = [];
        // Reset to blank Reporting Manager Data Array
        this.reportingManagers = [];
        // Disableing the Reports To Dropdown in case of role type selection 
        this.createRole.get('level').disable();
        this.createRole.get('reportsTo').disable();
        // If selected role is not empty
        if (selectedRoleType && selectedRoleType != 'ADMIN') {
          // Enabling Select Level dropdown
          this.createRole.get('level').enable();
          // Get all the Levels for selected Role Type
          this.getFilteredLevels();
        }
      });
    // On change of Level Selection
    this.roleLevelsSubscription = this.createRole.get('level').valueChanges.subscribe(
      selectedLevel => {
        // Reset to blank Reports To Managers Data Array
        this.reportingManagers = [];
        // If selected Level is not empty        
        this.createRole.get('reportsTo').disable();
        if (selectedLevel && selectedLevel != '' && selectedLevel > 1) {
          this.createRole.get('reportsTo').enable();
          // Get the all reportsTo Data
          this.getFilteredReportingManagers(selectedLevel, this.createRole);
        }
      }
    );
  }
  // Get all the Levels,required Param is Selected Role Type
  getFilteredLevels() {
    let editableId;
    this._route.params.subscribe(
      (params: Params) => {
        editableId = params.id;
      }
    );
    this.filteredRoleSubscription = this.facadeService.onRoleGetAPI(apiUrls.roles).subscribe(
      resp => {        
        this.ngxService.start();        
        if (resp.result) {
          this.roleReportsToMapping = resp.result;
          let levelDataSets = [];
          this.roleReportsToMapping.filter(function (role) {
            if(editableId){
              if(editableId != role.id){
                let levelObj = { level: role.level, levelTitle: AppConstants.createRoleLevel + ' ' + role.level };
                levelDataSets.push(levelObj);
              }
            }else{
              let levelObj = { level: role.level, levelTitle: AppConstants.createRoleLevel + ' ' + role.level };
              levelDataSets.push(levelObj);
            }            
          });          
          if(levelDataSets.length > 0){
            let uniqueRecord = AppUtills.removeDuplicates(levelDataSets, 'level');          
            let max = AppUtills.getMaxLevel(uniqueRecord) + 1;
            uniqueRecord.push({ level: max, levelTitle: AppConstants.createRoleLevel + ' ' + max });
            this.levelData = uniqueRecord;
          }else{
            let level_one = 1;
            let uniqueRecord = [];
            uniqueRecord.push({ level: level_one, levelTitle: AppConstants.createRoleLevel + ' ' + level_one });
            this.levelData = uniqueRecord;
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
  // Get all the Reports To,required Param is Selected Role Type and selected Level
  getFilteredReportingManagers(levelId, formGroup: FormGroup) {
    let editableId;
    this._route.params.subscribe(
      (params: Params) => {
        editableId = params.id;
      }
    );
    let reportingManager = [];
    this.reportingManagersSubscription = this.facadeService.onRoleGetAPI(apiUrls.roles).subscribe(
      resp => {
        if (resp.result) {
          this.roleReportsToMapping = resp.result;
          let levelDataSets = [];
          let filteredReportsToR0les = this.roleReportsToMapping.filter(function (role) {
            return role.level == levelId - 1;
          });
          filteredReportsToR0les.map((val, key) => {
            if(editableId){
              if(editableId != val.id){
                let reportingManagers = { id: val.id, name: val.roleName };
                reportingManager.push(reportingManagers);
              }
            }else{
              let reportingManagers = { id: val.id, name: val.roleName };
              reportingManager.push(reportingManagers);
            }            
          });
          this.reportingManagers = reportingManager;
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
  // Save The role Creation Form Data
  submit() {
    this.isDirty = false;
    if (this.cehckedPermissions.length <= 0) {
      this.validatePermissionsCheck = true;
      return false;
    }
    let formValue = this.createRole.value;
    let saveType = 'create';
    if (this.editRoleId) {
      saveType = 'edit';
    }
    let roleName = formValue.roleName;
    let roleType = formValue.roleType;
    let level = formValue.level;    
    let clientId = formValue.clientId;    
    let roleDescription = formValue.roleDescription;
    let roleId = this.editRoleId ? this.editRoleId : '';    
    // Prepare Reports To   
    let reportsObj = null;
    if (formValue.reportsTo && formValue.reportsTo != '' && (typeof formValue.reportsTo !== 'undefined')) {
      reportsObj = { "id": formValue.reportsTo };
    }
    // Prepare client ID 
    if (formValue.clientId && formValue.clientId != '' && (typeof formValue.clientId !== 'undefined')) {
        if (formValue.clientId) {
          this.clientArray = [];
          formValue.clientId.map((v, k) => {
              this.clientArray.push({
                "clientId": v
              });
          });
        }
    }
    // Prepare Departments
    let departmentsObj = [];
    formValue.departments.map((departmentValue) => {      
      let departmentobj = { id: departmentValue };
      departmentsObj.push(departmentobj);
    });
    // Prepare Permissions Group
    let modulesGroups = [];
    formValue.modulePermission.map((moduleValue) => {
      modulesGroups.push(moduleValue);
    });
    let modulesGroupData = this.getSelectedAllModules(modulesGroups);
    // Prepare Permissions Data
    let permissionsObj = [];
    this.cehckedPermissions = AppUtills.getUniqueValueArray(this.cehckedPermissions);
    this.cehckedPermissions.map((permissionVal) => {
      let obj = { id: permissionVal };
      permissionsObj.push(obj);
    });
    // Prepare Final Object needs to be save
    let toSaveObj = {
      departments:departmentsObj,
      roleName: roleName,
      description: roleDescription,
      reportsToRole: reportsObj,
      level: level,
      permissions: permissionsObj,
      roleType: roleType,
      client: this.clientArray,
      id: roleId
    };    
    if (this.editRoleId) {
      toSaveObj['active'] = true;
    }    
    // Call Edit or Create Role API    
    this.ngxService.start();
    this.saveRoleSubscription = this.facadeService.saveRole(toSaveObj, saveType).subscribe(
      resp => { 
        this.ngxService.stop();             
        if (resp.statusCode == 200 && resp.message) {
          this.facadeService.openArchivedSnackBar(resp.message, 'Success');
          this.route.navigate(['/role/roles']);
        }else{
          this.facadeService.openArchivedSnackBar(resp.message, 'Retry');
        }
      },
      error=>{
        this.ngxService.stop();
        if (error.error && error.error.message && error.error.message != '') {
          this.facadeService.openArchivedSnackBar((error.error.message || error.message), 'Retry');
        }
      }
    );
  }
  resetForm() {
    this.createRole.reset();
    this.createRole.controls['roleType'].patchValue('');
    this.createRole.controls['clientId'].patchValue('');
    this.cehckedPermissions = [];
    this.clientsCheck = false;
    this.pmsChecks = false;
    this.selectAllPermissions = false;
    this.allPermissions = [];
    this.cehckedPermissions = [];
    let modulePermissionControlls = this.createRole.controls.modulePermission as FormArray;
    while (modulePermissionControlls.length !== 0) {
      modulePermissionControlls.removeAt(0);
    }
  } 
  ngOnDestroy() {        
    this.roleTypeSubscrition ? this.roleTypeSubscrition.unsubscribe() : '';
    this.getClientsSubscription ? this.getClientsSubscription.unsubscribe() : '';
    this.filteredRoleSubscription ? this.filteredRoleSubscription.unsubscribe() : '';
    this.roleLevelsSubscription ? this.roleLevelsSubscription.unsubscribe() : '';
    this.reportingManagersSubscription ? this.reportingManagersSubscription.unsubscribe() : '';    
    this.getAllPermissionGroupsSubscription ? this.getAllPermissionGroupsSubscription.unsubscribe() : '';
    this.getRoleTypeSubscription ? this.getRoleTypeSubscription.unsubscribe() : '';
    this.getRoleReportsToMappinSubscription ? this.getRoleReportsToMappinSubscription.unsubscribe() : '';
    this.getRoleByIdSubscription ? this.getRoleByIdSubscription.unsubscribe() : '';
    this.saveRoleSubscription ? this.saveRoleSubscription.unsubscribe() : '';
    this.modalRespSubscription ? this.modalRespSubscription.unsubscribe() : '';    
  }

  log() {

  }
}