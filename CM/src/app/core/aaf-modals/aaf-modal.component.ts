import { Component, OnInit, Inject, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SalesService } from '@service/sales-service/sales-service.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
import { DataService } from '@service/data-share-service/data.service';
import { FacadeService } from '../services/facade.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { PermissionIds } from '../utills/masterPermission';

export interface User {
  name: string;
  kitId: string;
}

@Component({
  selector: 'aaf-modal',
  templateUrl: './aaf-modal.component.html',
  styleUrls: ['./aaf-modal.component.scss']
})
export class AafModalComponent implements OnInit, OnDestroy {
  paramId: string;
  remarkText: string;
  actorInfo: any;
  subReasonObj = {};
  remarks: boolean = false;
  sub: boolean = true;
  reasonID: string = 'reason_1';
  showRemarkError: boolean = false;
  listOfAvailabelAgentUnsubscription: Subscription;
  assignCaseToActorSubscription: Subscription;
  rejectUnsubscription: Subscription;
  currentSelectedAgentname: string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  ListOfAgents = [];
  PIds:any;

  constructor(
    public dialogRef: MatDialogRef<AafModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
    private _router: ActivatedRoute
  ) { }

  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  myControl = new FormControl();
  options: User[] = [
    { name: 'Tim', kitId: '90859584534' },
    { name: 'James', kitId: '90859584535' },
    { name: 'Igor', kitId: '90859584536' },
    { name: 'Mertin', kitId: '90859584534' },
  ];
  filteredOptions: Observable<User[]>;

  checkAvailableActorsPermission(){
    if (this.facadeService.validateSpecificPermission(PermissionIds.LIST_AVAILABLE_AGENTS)) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    this.PIds = PermissionIds;
    this.actorInfo = JSON.parse(AppUtills.getValue('actor_info'));
    this.paramId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    if (this.data.data.caseDataInfo && this.data.data.caseDataInfo.businessLine && this.checkAvailableActorsPermission()) {
      let updatedAvailableActors = apiUrls.availabelActors + '?bussinessLine=' + this.data.data.caseDataInfo.businessLine;
      //this.ngxService.start();
      this.listOfAvailabelAgentUnsubscription = this.facadeService.onCMGetAPI(updatedAvailableActors).subscribe(res => {
        if (res) {
          this.ngxService.stop();
          if (res['statusCode'] == 200 && res['message']) {
            if (res.result.length > 0) {
              this.ListOfAgents = res.result;
            }
          }
        }
      },
        error => {
          this.ngxService.stop();
          if(AppUtills.showErrorMessage(error)){
            this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message : 'Something went wrong'), 'Retry');
          }else{
            this.onNoClick();
          }
        });
    }
    if (this.data.caseDataInfo.length > 0) {
      this.updateRejectReasonsObj();
    }

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    this.currentRejectionReasons.push(1);
  }

  displayFn(user?: User): string | undefined {
    let username: string;
    if (user) {
      username = user.name + ' (' + user.kitId + ')';
    } else {
      username = undefined;
    }
    return username;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(userForm: any) {
    userForm['modalResponseType'] = false;
    this.dataService.filter(userForm);
    this.onNoClick();
  }

  currentRejectionReasons = [];
  onParentChangeHandler(selectedValue: string, isChecked: boolean, event) {
    this.remarks = false;
    let textContent = event.source._elementRef.nativeElement.textContent.trim();
    this.reasonID = 'reason_' + selectedValue;
    if (isChecked) {
      this.currentRejectionReasons.push(selectedValue);
      if (textContent == 'Others') {
        this.remarks = true;
      }
    } else {
      this.remarks = false;
      this.currentRejectionReasons.splice(this.currentRejectionReasons.indexOf(selectedValue), 1);
    }
    this.uncheckAll(selectedValue);
  }

  updateRejectReasonsObj() {
    this.data.caseDataInfo.map((updatedCaseValue, updatedCaseKey) => {
      if (updatedCaseValue.rejectionSubReasons && updatedCaseValue.rejectionSubReasons.length > 0) {
        updatedCaseValue.rejectionSubReasons.map((subReasonVal, subReasonKey) => {
          this.data.caseDataInfo[updatedCaseKey].rejectionSubReasons[subReasonKey].CheckStatus = false;
        });
      }
    });
  }
  uncheckAll(selectedValue) {
    this.data.caseDataInfo.map((updatedCaseValue, updatedCaseKey) => {
      if (updatedCaseValue.id == selectedValue && updatedCaseValue.rejectionSubReasons && updatedCaseValue.rejectionSubReasons.length > 0) {
        updatedCaseValue.rejectionSubReasons.map((subReasonVal, subReasonKey) => {
          this.data.caseDataInfo[updatedCaseKey].rejectionSubReasons[subReasonKey].CheckStatus = false;
        });
      }
    });
  }

  assignToActor(params) {
    this.assignCaseToActorSubscription = this.facadeService.onCMPostAPI(apiUrls.caseAcceptReject, params).subscribe(res => {
      if (res.body) {
        this.ngxService.stop();
        if (res['status'] == 200 && res.body['message']) {
          this.onNoClick();
          this.facadeService.openArchivedSnackBar(res.body.message || 'Something went wrong', 'Retry');
          if(params['actorId'] != this.actorInfo.id){
            this.facadeService.backToDashboard();
          }          
        }
      }
    }, error => {
      this.ngxService.stop();
      if(AppUtills.showErrorMessage(error)){
        this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message : 'Something went wrong'), 'Retry');
      }else{
        this.onNoClick();
      }
    });
  }

  assignToMe() {
    this.ngxService.start();
    let postParams = {
      nextState: 'ACCEPTED',
      actorId: this.data.loggedinActorId,
      caseId: this.data.data.caseDataInfo.id
    }
    this.assignToActor(postParams);
  }

  onSubmit() {
    if (!this.currentSelectedAgentname) {
      return false
    }
    let postParams = {
      nextState: 'ACCEPTED',
      actorId: this.currentSelectedAgentname,
      caseId: this.data.data.caseDataInfo.id
    }
    this.assignToActor(postParams);
  }

  currentAgent(Agentname) {
    this.currentSelectedAgentname = Agentname;
  }

  isActive(item) {
    return this.currentSelectedAgentname === item;
  }

  currentRejectionSubReasons = [];
  onChangeHandler(selectedValue: string, isChecked: boolean, parentId: string) {
    if (isChecked) {
      this.currentRejectionSubReasons.push(selectedValue);
    } else {
      this.currentRejectionSubReasons.splice(this.currentRejectionSubReasons.indexOf(selectedValue), 1);
    }
  }

  remarkOnChange(event) {
    event ? this.showRemarkError = false : this.showRemarkError = true;
  }

  onRejectHandler() {
    if(!this.remarkText && this.remarks){
      this.showRemarkError = true;
      return false
    }   
    
    this.ngxService.start();
    let rejectInfo = {
      "actorId": this.actorInfo.id,
      "caseId": parseInt(this.paramId),
      "nextState": 'REJECTED',
      "rejectionReasons": this.currentRejectionReasons,
      "rejectionSubReasons": this.currentRejectionSubReasons,
      "remarks": this.remarkText
    }
    this.rejectUnsubscription = this.facadeService.onPostAPI(apiUrls.caseAcceptReject, rejectInfo).subscribe(res => {
      let data: any;
      if (res) {
        this.ngxService.stop();
        data = res.body || res;
        if ((data.statusCode == 200) && data.message) {
          this.onNoClick();
          this.facadeService.openArchivedSnackBar(data.message, 'Success');
          let caseInfo = AppUtills.getValue('newCaseData');
          if (caseInfo && caseInfo != '') {
            let storedCaseDetails = AppUtills.getValue('storedCaseDetails');
            if (storedCaseDetails && storedCaseDetails != '') {
              AppUtills.removeValue('storedCaseDetails');
            }
            let storageParsedJson = JSON.parse(caseInfo);
            if (storageParsedJson.caseId) {
              AppUtills.removeValue('newCaseData');
            }
          }
          this.facadeService.backToDashboard();
        } else {
          this.facadeService.openArchivedSnackBar(data.message, 'Retry');
        }
      }
    }, error => {
      this.ngxService.stop();
      if(AppUtills.showErrorMessage(error)){
        this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message : 'Something went wrong'), 'Retry');
      }else{
        this.onNoClick();
      }
    });
  }

  ngOnDestroy() {
    this.listOfAvailabelAgentUnsubscription ? this.listOfAvailabelAgentUnsubscription.unsubscribe() : '';
    this.assignCaseToActorSubscription ? this.assignCaseToActorSubscription.unsubscribe() : '';
    this.rejectUnsubscription ? this.rejectUnsubscription.unsubscribe() : '';
  }
}
