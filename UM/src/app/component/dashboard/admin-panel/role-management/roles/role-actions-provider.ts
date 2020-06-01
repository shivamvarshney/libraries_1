import { ActionsProvider, Action } from '@src/core/aaf-grid/actions-provider';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FacadeService } from '@src/core/services/facade.service';
import { DataService } from '@service/data-share-service/data.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';

@Injectable({
    providedIn: 'root'
})
export class RoleActionsProvider implements ActionsProvider,OnDestroy {
    statusUnsubscription: Subscription;
    toggleRoleSubscription:Subscription;
    state: String;
    currentSelectedRole: any;
    constructor(private aafModelService: AafModelService,
        private router: Router,
        private facadeService: FacadeService,
        private ngxService: NgxUiLoaderService,
        private dataService: DataService
    ) {
        this.toggleRoleSubscription = this.dataService.listen().subscribe((data: any) => {
            this.openModelResponse(data);
        });
    }

    actions(): Array<Action> {
        const actions: Array<Action> = this.roleActions();
        return actions;
    }
    private roleActions() {
        const actions: Array<Action> = [];
        actions.push({ label: 'Change Status', handler: this.editRole });
        actions.push({ label: 'Delete', handler: this.toggleRole });
        actions.push({ label: 'Delete', handler: this.users });
        actions.push({ label: 'Permission Handler', handler: this.permissionHandler });
        return actions;
    }

    handleRedirection= function(args?: any){
        if (args.dataInfo) {
            if(args.dataInfo == 'all'){
                args.dataInfo = '';
            }
            this.redirectTo(args.dataInfo);
        }
    }   

    permissionHandler = function(args?: any){
        let permissionName = '';
        if(args.row.type === 'toggle'){
            if(args.row.showCase.rules.active.permissionName){
                if(args.dataInfo[args.row.showCase.key] == args.row.showCase.rules.active.value){
                    permissionName = args.row.showCase.rules.active.permissionName;
                }else{
                    permissionName = args.row.showCase.rules.inactive.permissionName;
                }                
            }            
        }else{
            if(args.row.permissionName){
                permissionName = args.row.permissionName;
            }            
        }
        if(permissionName){
            if (this.facadeService.validateSpecificPermission(permissionName)) {
                return true;
            }
            return false;
        }else{
            return true;
        }             
    }

    users = function (args?: any) {
        if (args.row.id && args.row.count > 0) {
            this.router.navigate(['/user', 'users'], { queryParams: { roleId: args.row.id } });
        }
    }
    editRole = function (args?: any) {
        this.router.navigate(['/role', 'edit', args.row.id]);
    }
    toggleRole = function (args?: any) {
        this.currentSelectedRole = args.row;
        this.state = 'Activate';
        if (args.row.active && args.row.active == true) {
            this.state = 'Inactivate';
        }
        let bsModalRef = this.aafModelService.openModal({
            title: `Do you really want to ${this.state}`,
            status: `${args.row.roleName} ?`,
            reason: "role",
            modalWidth: 781,
            modelStatus: '',
            proceed_caps: 'CONFIRM'
        });
    }
    /*redirectTo(uri: string) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(
            () => this.router.navigate([uri])
        );
    }*/
    redirectTo(uri: string) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(
            () => this.router.navigate(['/role/roles/' + uri])
        );
    }
    openModelResponse(data) {
        let booleanChek = false;
        if (data['modalResponseType'] && data['modalResponseType'] == true) {
            if (this.currentSelectedRole && typeof this.currentSelectedRole.active == 'boolean') {
                if (this.currentSelectedRole && this.currentSelectedRole.id && this.currentSelectedRole.id != '') {
                    booleanChek = true;
                }
            }
        }
        if (booleanChek && (data.modelStatus !== 'exit')) {
            this.ngxService.start();
            let redirectAction = '';
            let roleStatus: boolean = true;
            redirectAction = 'active';
            if (this.currentSelectedRole.active && this.currentSelectedRole.active == true) {
                roleStatus = false;
                redirectAction = 'inactive';
            }
            let roleInfo = {
                active: roleStatus,
                id: this.currentSelectedRole.id
            }
            this.statusUnsubscription = this.facadeService.onRolePostAPI(apiUrls.toggleRole, roleInfo).subscribe((res: any) => {
                this.ngxService.stop();
                res = res.body || res;
                let data = res; 
                if (data) {
                    if (data.statusCode == 200 && data.message) {
                        this.facadeService.openArchivedSnackBar(data.message, 'Success');
                        this.redirectTo(redirectAction);
                    }else{
                        this.facadeService.openArchivedSnackBar(data.message || "Something Went Wrong", 'RETRY');
                    }
                }
            }, error => {
                if(AppUtills.showErrorMessage(error)){
                    this.facadeService.openArchivedSnackBar('Something Went Wrong', 'Retry');
                }else{
                    this.redirectTo(redirectAction);
                }
            },
                () => {
                    this.ngxService.stop();
                    this.currentSelectedRole = '';
                    data = [];
                    this.currentSelectedRole = {};
                }
            );
        }
    }
    ngOnDestroy() {
        this.statusUnsubscription ? this.statusUnsubscription.unsubscribe() : '';
        this.toggleRoleSubscription ? this.toggleRoleSubscription.unsubscribe(): '';
    }
}