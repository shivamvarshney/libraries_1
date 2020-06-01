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
export class CPActionsProvider implements ActionsProvider, OnDestroy {
    statusUnsubscription: Subscription;
    dataServiceUnsubscribe: Subscription;
    state: String;
    currentSelectedUser: any;
    constructor(private aafModelService: AafModelService,
        private router: Router,
        private facadeService: FacadeService,
        private ngxService: NgxUiLoaderService,
        private dataService: DataService) {
        this.dataServiceUnsubscribe = this.dataService.listen().subscribe((data: any) => {
            this.openModelResponse(data);
        });
    }

    actions(): Array<Action> {
        const actions: Array<Action> = this.userActions();
        return actions;
    }
    private userActions() {
        const actions: Array<Action> = [];
        actions.push({ label: 'Change Status', handler: this.editUser });
        actions.push({ label: 'Delete', handler: this.toggleStatus });
        actions.push({ label: 'Assign', handler: this.resetPassword });
        return actions;
    }

    editUser = function (args?: any) {
        // Navigate To Edit User Details Page
        this.router.navigateByUrl('/user/edit/' + args.row.id);
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
            () => this.router.navigate([uri])
        );
    }

    toggleStatus = function (args?: any) {
        this.currentSelectedUser = args.row;
        //this.redirectTo(this.router.url);
        this.state = 'Active';
        if (args.row.status == 'Active') {
            this.state = 'Inactive';
        }
        let bsModalRef = this.aafModelService.openModal({
            title: `Do you really want to ${this.state}`,
            status: `${args.row.firstName} ${args.row.lastName}`,
            reason: "user",
            modalWidth: 781,
            modelStatus: '',
            proceed_caps: 'CONFIRM'
        });
    }

    openModelResponse(data) {
        let booleanChek = false;
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
            this.currentSelectedUser.status == 'Active' ? userStatus = "INACTIVE" : userStatus = "ACTIVE";
            let userInfo = {
                status: userStatus,
                userId: this.currentSelectedUser.id
            }
            this.statusUnsubscription = this.facadeService.onCPPostAPI(apiUrls.toggleUser, userInfo).subscribe(res => {
                let data: any;
                if (res) {
                    data = res;                    
                    this.ngxService.stop();
                    if ((data.body.status == false) && (data.body.message)) {
                        this.facadeService.openArchivedSnackBar(data.body.message, 'RETRY');
                    }
                    else if (data.body.status != 200 && data.body.status != 401 && data.body.status != true) {
                        this.facadeService.openArchivedSnackBar(data.body.message || "Something Went Wrong", 'RETRY');
                    }
                    else if (data.body.status == 200 || true && data.body.message) {
                        this.facadeService.openArchivedSnackBar(data.body.message, 'Success');
                        this.redirectTo(this.router.url);
                    }
                }
            }, error => {
                if(AppUtills.showErrorMessage(error)){
                    this.facadeService.openArchivedSnackBar('Something Went Wrong', 'Retry');
                }else{
                    this.redirectTo(this.router.url);
                }
                //this.error = error
            }, () => {
                this.ngxService.stop();
                data = [];
                this.currentSelectedUser = {};
            }
            );
        }
    }

    ngOnDestroy() {
        this.statusUnsubscription ? this.statusUnsubscription.unsubscribe() : '';
        this.dataServiceUnsubscribe ? this.dataServiceUnsubscribe.unsubscribe() : '';
    }

}