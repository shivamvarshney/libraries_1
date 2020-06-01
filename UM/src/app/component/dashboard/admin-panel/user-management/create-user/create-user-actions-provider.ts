import { ActionsProvider, Action } from '@src/core/aaf-form/aaf-form-actions-provider';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from '@src/core/services/facade.service';
import { Observable, Subscription } from 'rxjs';
import { of } from 'rxjs';
import { AppUtills } from '@src/core/utills/appUtills';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CreateUserActionsProvider implements ActionsProvider, OnDestroy {
    roleSubscription: Subscription;
    filteredRoleSubscription: Subscription;
    constructor(private router: Router, private facadeService: FacadeService, private ngxService: NgxUiLoaderService) {

    }

    private createUserActions() {
        const actions: Array<Action> = [];
        actions.push({ handler: this.getloginModule });
        actions.push({ handler: this.getloginChannels });
        actions.push({ handler: this.getidType });
        actions.push({ handler: this.getlanguageId });
        actions.push({ handler: this.getstatus });
        actions.push({ handler: this.getdepartments });
        actions.push({ handler: this.getReportingMsisdn });
        return actions;
    }

    convertData(data: any) {
        AppUtills.removeValue('roleMaster');
        AppUtills.setValue('roleMaster', JSON.stringify(data));
        let filteredJson = [];
        data.map((res, key) => {
            filteredJson.push({ label: res.roleName, value: res.id });
        });
        return filteredJson;
    }

    getAllClients(roleIds) {
        let roleMasterData = AppUtills.getValue('roleMaster') ? JSON.parse(AppUtills.getValue('roleMaster')) : '';
        let uniqueClientIds = [];
        roleMasterData.map(value => {
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
        }
        return uniqueClientIds;
    }

    getclients = function (args?: any) {
        return of(this.getAllClients(args.roles));
    }

    getRoles() {
        return this.facadeService.onRoleGetAPI(apiUrls.roles).pipe(map((data: any) => this.convertData(data.result)));
    }

    getdepartments = function (args?: any) {
        let allClients = this.getAllClients(args.roles);
        let clientIds = args.clients;
        let clientDepartmentsObj = [];
        if (clientIds.length > 0) {
            allClients.map((clientInfo, clientKey) => {
                if (clientIds.indexOf(clientInfo.value) >= 0 && clientInfo.clientDepartments && clientInfo.clientDepartments.length > 0) {
                    clientInfo.clientDepartments.map((depaValue, depaKey) => {
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
                clientDepartmentsObj = result;
            }
        }
        console.log('clientDepartmentsObj are ', clientDepartmentsObj);
        return of(clientDepartmentsObj);
    }

    convertRMsData(data: any) {       
        let filteredJson = [];
        if(data && data.constructor.name == 'Array' && data.length > 0){
            data.map((res, key) => {
                filteredJson.push({ label: res.roleName, value: res.id });
            });
        }
        return filteredJson;
    }

    getAllFilteredRMs(data:any){
        let filteredJson = [];
        if(data && data.constructor.name == 'Array' && data.length > 0){
            data.map((res, key) => {
                let name = res.firstName+' '+res.lastName+'('+res.username+')';
                filteredJson.push({ label: name, value: res.id });
            });
        }
        return filteredJson;
    }

    getReportingMsisdn = function (args?: any) {
        if (args.roles && args.clients && args.department) {
            let selectedRoles = {
                roleList: args.roles,
                page: 0,
                size: 500,
                clientList: args.clients,
                departmentList: [args.department]
            }
            return this.facadeService.getAllReportsToUsers(selectedRoles).pipe(map((data: any) => this.getAllFilteredRMs(data.result.content)));
        }
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
        masterData.status.map(value => {
            let statusObj = { label: value, value: value };
            status.push(statusObj);
        });
        return of(status);
    }

    getlanguageId = function (args?: any) {
        let languages = [];
        let masterData = AppUtills.getValue('masterData') ? JSON.parse(AppUtills.getValue('masterData')) : '';
        masterData.language.map(value => {
            let languageVal = { languageId: value.languageId };
            let languageObj = { label: value.name, value: languageVal };
            languages.push(languageObj);
        });
        return of(languages);
    }

    actions(): Array<Action> {
        const actions: Array<Action> = this.createUserActions();
        return actions;
    }

    ngOnDestroy() {
        this.roleSubscription ? this.roleSubscription.unsubscribe() : '';
    }
}