import { ActionsProvider, Action } from '@src/core/aaf-grid/actions-provider';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service';
import { Injectable, ViewChild, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { DataService } from '@service/data-share-service/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
 
@Injectable({
    providedIn: 'root'
})
export class UserActionsProvider implements ActionsProvider, OnDestroy {
    statusUnsubscription: Subscription;
    toggleUserSubscription: Subscription;
    state: String;
    currentSelectedUser: any;
    constructor(private aafModelService: AafModelService,
        private router: Router,
        private facadeService: FacadeService,
        private ngxService: NgxUiLoaderService,
        private dataService: DataService) {
        this.toggleUserSubscription = this.dataService.listen().subscribe((data: any) => {
            this.openModelResponse(data);
        });
    }

    actions(): Array<Action> {
        const actions: Array<Action> = this.userActions();
        return actions;
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

    handleRedirection= function(args?: any){
        if (args.dataInfo) {
            if(args.dataInfo == 'all'){
                args.dataInfo = '';
            }
            this.redirectTo(args.dataInfo);
        }
    }

    private userActions() {
        const actions: Array<Action> = [];
        actions.push({ label: 'Change Status', handler: this.editUser });
        actions.push({ label: 'Delete', handler: this.toggleStatus });
        actions.push({ label: 'Assign', handler: this.resetPassword });
        actions.push({ label: 'Permission Handler', handler: this.permissionHandler });
        return actions;
    }

    editUser = function (args?: any) {
        // Navigate To Edit User Details Page
        this.router.navigateByUrl('/user/add/' + args.row.id);
    }
    resetPassword = function (args?: any) {
        // Show Reset Password confirmation Popup
        this.aafModelService.openModal({
            title: "Reset Password for",
            status: `${args.row.user_details.user_name} - ${args.row.roles}`,
            reason: "user",
            modalWidth: 781,
            proceed_caps: 'CONFIRM'
        })
    }
    redirectTo(uri: string) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(
            () => this.router.navigate(['/user/users/' + uri])
        );
    }

    toggleStatus = function (args?: any) {
        this.currentSelectedUser = args.row;
        //this.redirectTo(this.router.url);
        this.state = 'Activate';
        if (args.row.status == 'Active') {
            this.state = 'Inactivate';
        }
        let bsModalRef = this.aafModelService.openModal({
            title: `Do you really want to ${this.state}`,
            status: `${args.row.firstName} ${args.row.lastName} ?`,
            reason: "user",
            modalWidth: 781,
            modelStatus: '',
            proceed_caps: 'CONFIRM'
        });
    }

    openModelResponse(data) {
        let booleanChek = false;
        let redirectAction = '';
        if (data['modalResponseType'] && data['modalResponseType'] == true) {
            if (this.currentSelectedUser && this.currentSelectedUser.status && this.currentSelectedUser.status != '') {
                if (this.currentSelectedUser && this.currentSelectedUser.id && this.currentSelectedUser.id != '') {
                    booleanChek = true;
                }
            }
        }
        if (booleanChek && (data.modelStatus !== 'exit')) {
            this.ngxService.start();
            let userStatus: string;
            if (this.currentSelectedUser.status == 'Inactive') {
                redirectAction = 'active';
            } else if (this.currentSelectedUser.status == 'Active') {
                redirectAction = 'inactive';
            }
            this.currentSelectedUser.status == 'Active' ? userStatus = "INACTIVE" : userStatus = "ACTIVE";
            let userInfo = {
                status: userStatus,
                userId: this.currentSelectedUser.id
            }
            this.statusUnsubscription = this.facadeService.onUserPostAPI(apiUrls.toggleUser, userInfo).subscribe(res => {
                let data: any;
                if (res) {
                    data = res;
                    this.ngxService.stop();
                    if (data.body.statusCode != 200 && data.body.statusCode != 401) {
                        this.facadeService.openArchivedSnackBar(data.body.message || "Something Went Wrong", 'RETRY');
                    }
                    else if ((data.body.statusCode !== 200) && (data.body.message)) {
                        this.facadeService.openArchivedSnackBar(data.body.message, 'RETRY');
                    }
                    else if (data.body.statusCode == 200 || true && data.body.message) {
                        this.facadeService.openArchivedSnackBar(data.body.message, 'Success');
                        this.redirectTo(redirectAction);
                    }
                }
            }, error => {
                if(AppUtills.showErrorMessage(error)){
                    let message = "Something went wrong";
                    if (error.error.message) {
                        message = error.error.message;
                    }
                    this.facadeService.openArchivedSnackBar(message, 'Retry');
                }else{
                    this.redirectTo(redirectAction);
                }                
            }, () => {
                this.ngxService.stop();
                data = [];
                this.currentSelectedUser = {};
                this.toggleUserSubscription ? this.toggleUserSubscription.unsubscribe() : '';
            }
            );
        }
    }

    ngOnDestroy() {
        this.statusUnsubscription ? this.statusUnsubscription.unsubscribe() : '';
        this.toggleUserSubscription ? this.toggleUserSubscription.unsubscribe() : '';
    }

}