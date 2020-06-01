import { ActionsProvider, Action } from '@src/core/aaf-form/aaf-form-actions-provider';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from '@src/core/services/facade.service';
import { Observable, Subscription } from 'rxjs';
import { of } from 'rxjs';
import { AppUtills } from '@src/core/utills/appUtills';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { apiUrls } from '@src/core/utills/apiEndPoints';

@Injectable({
    providedIn: 'root'
})
export class EditUserActionsProvider implements ActionsProvider, OnDestroy {
    roleSubscription: Subscription;
    constructor(private router: Router, private facadeService: FacadeService, private ngxService: NgxUiLoaderService) {

    }

    private editUserActions() {
        const actions: Array<Action> = [];
        actions.push({ handler: this.getrole });
        actions.push({ handler: this.getloginModule });
        actions.push({ handler: this.getloginChannels });
        actions.push({ handler: this.getidType });
        actions.push({ handler: this.getlanguageId });
        actions.push({ handler: this.getregion });
        actions.push({ handler: this.getcluster });
        actions.push({ handler: this.getterritory });
        actions.push({ handler: this.getunit });
        actions.push({ handler: this.getstatus });
        actions.push({ handler: this.editUser });
        actions.push({ handler: this.getclient });
        actions.push({ handler: this.getL1 });
        actions.push({ handler: this.getsiteId });
        actions.push({ handler: this.getGeoLocations });
        actions.push({ handler: this.parentGeoLocation });    
        actions.push({ handler: this.getdepartment });
        actions.push({ handler: this.getreportingMsisdn });    
        return actions;
    } 

    getreportingMsisdn = function (args?: any): Observable<any> {
        let selectedRoles = {
            roleList: args,
            page:0,
            size:100
        }
        let reportingMisdn = [];
        if(args){
            return this.facadeService.getAllReportsToUsers(selectedRoles);
        }else{
            return of(reportingMisdn);
        }        
    }

    getdepartment = function (args?: any) {
        let departments = [];
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        masterData.departments.map(value => {
            let departmentVal = { id: value.id };
            let departmentObj = { label: value.name, value: departmentVal };
            departments.push(departmentObj);
        });
        return of(departments);
    }

    parentGeoLocation = function (args?: any): Observable<any> {
        let paginationObj = {
            pageNo : 1,
            pageSize : 100,
            siteId: args
        }    
        return this.facadeService.getSiteGeoLocationPagination(paginationObj);
    }

    getGeoLocations = function (arg1?: any,arg2?: any,arg3?: any): Observable<any> {
        let parentIds = [];
        let siteMasterData = AppUtills.getValue('masterSiteData') ? JSON.parse(AppUtills.getValue('masterSiteData')) : '';        
        siteMasterData.map((value, key) => {
            if (arg1) {
                let argsParam = [];
                if (AppUtills.checkIsArray(arg2)) {
                    argsParam = arg2;
                } else {
                    argsParam.push(arg2);
                }
                if (value.siteId == arg1) {
                    value.hierarchy.map(valueInfo => {
                        if (valueInfo.hierarchyType.id == 2) {
                            valueInfo.geoHierarchy.map(levelOneData => {
                                if (levelOneData.level == arg3) {
                                    if (argsParam.indexOf(levelOneData.parent.geoId) >= 0) {
                                        let levelOneObj = { label: levelOneData.geoName, value: levelOneData.geoId };
                                        parentIds.push(levelOneObj);
                                    }
                                    
                                }
                            });
                        }
                    });
                }
            }
        });
        return of(parentIds);
    }

    getL1 = function (args?: any): Observable<any> {
        let parentIds = [];
        let siteMasterData = AppUtills.getValue('masterSiteData') ? JSON.parse(AppUtills.getValue('masterSiteData')) : '';
        siteMasterData.map((value, key) => {
            if (args) {
                if (value.siteId == args) {
                    value.hierarchy.map(valueInfo => {
                        if (valueInfo.hierarchyType.id == 2) {
                            valueInfo.geoHierarchy.map(levelOneData => {
                                if ((levelOneData.parent == '' || levelOneData.parent == null) && levelOneData.level == 'L1') {
                                    let levelOneObj = { label: levelOneData.geoName, value: levelOneData.geoId };
                                    parentIds.push(levelOneObj);
                                }
                            });
                        }
                    });
                }
            }
        });
        return of(parentIds); 
    }    

    getsiteId = function (args?: any): Observable<any> {
        let siteIds = [];
        let siteMasterData = AppUtills.getValue('masterSites') ? JSON.parse(AppUtills.getValue('masterSites')) : '';
        siteMasterData.map((value, key) => {
            let siteObj = { label: value, value: value };
            siteIds.push(siteObj);
        });
        return of(siteIds);
    }

    getclient = function (args?: any): Observable<any> {
        let clientIds = [];
        let argsParam = [];
        if (AppUtills.checkIsArray(args)) {
            argsParam = args;
        } else {
            argsParam.push(args);
        }
        let masterData = AppUtills.getValue('roleMaster') ? JSON.parse(AppUtills.getValue('roleMaster')) : '';
        masterData.map(value => {        
            if (argsParam.indexOf(value.id) >= 0) {
                if (value.client && value.client.length > 0) {
                    value.client.map(clientData => {
                        if (clientData.enable) {
                            let clientObj = { label: clientData.name, value: clientData.clientId };
                            clientIds.push(clientObj);
                        }
                    });
                }
            }
        });
        let uniqueClientIds = [];
        if (clientIds.length > 0) {
            const result = [];
            const map = new Map();
            for (const item of clientIds) {
                if (!map.has(item.value)) {
                    map.set(item.value, true);
                    result.push({
                        value: item.value,
                        label: item.label
                    });
                }
            }
            uniqueClientIds = result;
        }
        return of(uniqueClientIds);
    }
    editUser = function (args?: any): Observable<any> {
        let editUserObj = { userId: args }
        return this.facadeService.onUserPostAPI(apiUrls.getUserById, editUserObj);
    }
    getloginModule = function (args?: any) {
        let loginModule = [];
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        masterData.loginModule.map(value => {
            let loginModuleObj = { label: value, value: value };
            loginModule.push(loginModuleObj);
        });
        return of(loginModule);
    }
    getloginChannels = function (args?: any) {
        let loginChannels = [];
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        masterData.loginChannels.map(value => {
            if (value.enable) {
                let loginChannelObj = { label: value.channel, value: value.id };
                loginChannels.push(loginChannelObj);
            }
        });
        return of(loginChannels);
    }

    getrole = function (args?: any): Observable<any> {
        let roles = [];
        let masterData = AppUtills.getValue('roleMaster') ? JSON.parse(AppUtills.getValue('roleMaster')) : '';
        masterData.map(value => {            
            //let roleVal = { id: value.id };
            let roleObj = { label: value.roleName, roleId: value.id, value: value.id };
            roles.push(roleObj);
        });
        return of(roles);
    }
    getidType = function (args?: any) {
        let nationalIdType = [];
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        masterData.idType.map(value => {
            let idTypeVal = { id: value.id };
            let nationalIdTypeObj = { label: value.name, value: idTypeVal };
            nationalIdType.push(nationalIdTypeObj);
        });
        return of(nationalIdType);
    }
    getstatus = function (args?: any) {
        let status = [];
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        //status.push({ label: "Select", value: '' });
        masterData.status.map(value => {
            let statusObj = { label: value, value: value };
            status.push(statusObj);
        });
        return of(status);
    }
    getlanguageId = function (args?: any) {
        let languages = [];
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        //languages.push({ label: "Select", value: '' });
        masterData.language.map(value => {
            let languageVal = { languageId: value.languageId };
            let languageObj = { label: value.name, value: languageVal };
            languages.push(languageObj);
        });
        return of(languages);
    }
    getregion = function (args?: any) {
        let reginons = [];
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        //reginons.push({ label: "Select", value: '' });
        masterData.region.map(value => {
            let regionObj = { label: value.levelName, value: value.id };
            reginons.push(regionObj);
        });
        return of(reginons);
    }
    getcluster = function (args?: any) {
        let clusters = [];
        let argsParam = [];
        if (AppUtills.checkIsArray(args)) {
            argsParam = args;
        } else {
            argsParam.push(args);
        }
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        //clusters.push({ label: "Select", value: '' });
        masterData.cluster.map(value => {
            if (argsParam.indexOf(value.parent.id) >= 0) {
                let clusterObj = { label: value.levelName, value: value.id };
                clusters.push(clusterObj);
            }
        });
        return of(clusters);
    }
    getterritory = function (args?: any) {
        let teritory = [];
        let argsParam = [];
        if (AppUtills.checkIsArray(args)) {
            argsParam = args;
        } else {
            argsParam.push(args);
        }
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        //teritory.push({ label: "Select", value: '' });
        masterData.territory.map(value => {
            if (argsParam.indexOf(value.parent.id) >= 0) {
                let teritoryObj = { label: value.levelName, value: value.id };
                teritory.push(teritoryObj);
            }
        });
        return of(teritory);
    }
    getunit = function (args?: any) {
        let units = [];
        let argsParam = [];
        if (AppUtills.checkIsArray(args)) {
            argsParam = args;
        } else {
            argsParam.push(args);
        }
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        //units.push({ label: "Select", value: '' });
        masterData.unit.map(value => {
            if (argsParam.indexOf(value.parent.id) >= 0) {
                let unitObj = { label: value.levelName, value: value.id };
                units.push(unitObj);
            }
        });
        return of(units);
    }

    actions(): Array<Action> {
        const actions: Array<Action> = this.editUserActions();
        return actions;
    }

    ngOnDestroy() {
        this.roleSubscription ? this.roleSubscription.unsubscribe() : '';
    }
}