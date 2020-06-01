import { Injectable } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { ApplicationFunctionalities } from '@src/core/utills/masterPermission';

@Injectable()
export class AuthService {
    loggedIn = false;
    permis: any;
    groupName = [];
    filterGroup = [];
    portalPermissions = [];
    filterPermissions = [];
    storeGroups = [];

    constructor() {

    }
    // Get Default landing Module 
    getDefaultLandingModule() {
        let modules = [];
        ApplicationFunctionalities.map((pgVal, pgKey) => {
            if (pgVal.default) {
                modules.push({ pgName: pgVal.name, moduleName: pgVal.moduleName });
            }
        });
        return modules;
    }
    // Get All Application Modules
    getAllApplicationModules() {
        let modules = [];
        ApplicationFunctionalities.map((pgVal, pgKey) => {
            modules.push({ pgName: pgVal.name, moduleName: pgVal.moduleName });
        });
        return modules;
    }
    // Is Authenticated
    isAuthenticated() {
        const promise = new Promise(
            (resolve, reject) => {
                resolve(this.loggedIn);
            }
        );
        return promise;
    }
    // Is LoggedIn
    isLoggin() {
        this.loggedIn = true;
        return;
    }
    // Is LoggedOut
    isLogout() {
        this.loggedIn = false;
    }
    // Get Admin Login Role
    loginRole() {
        return 'admin';
    }
    // Get All Master Permissions from Session
    allMasterPermissions() {
        let masterPermissions = AppUtills.getValue('masterPermissions') ? JSON.parse(AppUtills.getValue('masterPermissions')) : [];
        return masterPermissions;
    }
    // Get All UserData from Session
    permissions() {
        let activeUserRole = AppUtills.getValue('userData') ? JSON.parse(AppUtills.getValue('userData')) : {};
        return activeUserRole;
    }
    // Check User Loggin Status by Token
    isLoggedIn() {
        if (AppUtills.getValue('token')) {
            return true;
        }
        return false;
    }
    // Get All Authorities set of LoggedIn User
    loggedInUserPermissionSet() {
        let permissionsSet = [];
        let allAuthorities = this.permissions();
        if (Object.keys(allAuthorities).length > 0 && allAuthorities.authorities && allAuthorities.authorities.length > 0) {
            allAuthorities.authorities.map((val, key) => {
                if (val.authority) {
                    permissionsSet.push(val.authority);
                }
            });
        }
        return permissionsSet;
    }
    // Get Specific Permissions by Ids from Master Permissions
    getSpecificMasterPermissions(pIds) {
        let mPermissions = [];
        let allMasterPermissions = this.allMasterPermissions();
        if (allMasterPermissions.length > 0) {
            allMasterPermissions.map((pgVal, pgKey) => {
                pgVal.permissions.map((pVal, pKey) => {
                    if (pIds.indexOf(pVal.id) >= 0) {
                        let obj = { pName: pVal.permissionName, pId: pVal.id };
                        mPermissions.push(obj);
                    }
                });
            });
        }
        return mPermissions;
    }
    // Check Module is Granted
    checkModuleIsGranted(modulePermissions) {
        let permisionIds = [];
        let allAuthorities = this.loggedInUserPermissionSet();
        let verifiedPermissions = [];
        if (allAuthorities.length > 0) {
            if (modulePermissions.permission && modulePermissions.permission.length > 0) {
                modulePermissions.permission.map((val, key) => {
                    permisionIds.push(val.id);
                });
            }
            if (permisionIds.length > 0) {
                let mPermissions = this.getSpecificMasterPermissions(permisionIds);
                if (mPermissions.length > 0) {
                    mPermissions.map(mPData => {
                        if (allAuthorities.indexOf(mPData.pName) !== -1) {
                            verifiedPermissions.push(mPData.pName);
                        }
                    });
                }
            }
        }
        if (verifiedPermissions.length > 0) {
            return true;
        }
        return false;
    }
    // Get Module Functionality
    getModuleSpecificPermissions(moduleName: string) {
        return ApplicationFunctionalities.filter((pgVal, pgKey) => {
            return pgVal.name == moduleName;
        });
    }
    // Validate Module Is Allowed to access
    validatePermission(gpModule: string) {
        return (this.getModuleSpecificPermissions(gpModule).length) > 0 ? this.checkModuleIsGranted(this.getModuleSpecificPermissions(gpModule)[0]) : false;
    }
    // Validate Module Functionality Is Allowed to access
    validateSpecificPermission(pId: any) {    
        let verifiedPermission = [];
        // If we are not receiving PID(permission), then we need to pass as true
        if(pId && pId!=''){
            let allAuthorities = this.loggedInUserPermissionSet();
            let mPermissions = this.getSpecificMasterPermissions([pId]);        
            if (allAuthorities.length > 0 && mPermissions.length > 0) {
                mPermissions.map(mPData => {
                    if (allAuthorities.indexOf(mPData.pName) !== -1) {
                        verifiedPermission.push(mPData.pName);
                    }
                });
            }
            if (verifiedPermission.length > 0) {
                return true;
            }
        }
        return false;
    }
}