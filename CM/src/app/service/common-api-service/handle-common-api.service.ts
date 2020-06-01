import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service';
import { AppUtills } from '@src/core/utills/appUtills';

@Injectable({
  providedIn: 'root'
})
export class HandleCommonApiService implements OnInit ,OnDestroy {
  rejectUnsubscription: Subscription;
  tocUnsubscription: Subscription;
  constructor(private ngxService: NgxUiLoaderService, private facadeService: FacadeService, private aafModelService: AafModelService) { }
  actorInfo: any;
  paramId: string;
  ngOnInit() {
  }
  

  onRejectHandler(rejectObj) {  
    this.actorInfo = JSON.parse(AppUtills.getValue('actor_info'));
    this.paramId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.ngxService.start();
    let rejectInfo = {
      "actorId": this.actorInfo.id,
      "caseId": parseInt(this.paramId),
      "nextState": 'REJECTED',
      "rejectionReasons": rejectObj
    }
    this.rejectUnsubscription = this.facadeService.onPostAPI(apiUrls.caseAcceptReject, rejectInfo).subscribe(res => {
      let data: any;
      if (res) {
        this.ngxService.stop();
        data = res.body || res;
        if ((data.statusCode == 200) && data.message) {
          this.facadeService.openArchivedSnackBar(data.message, 'Success');
          let caseInfo = AppUtills.getValue('newCaseData');
          this.facadeService.backToDashboard();
        } else {
          this.facadeService.openArchivedSnackBar(data.message, 'Retry');
        }
      }
    }, error => {
      this.ngxService.stop();
      if(AppUtills.showErrorMessage(error)){
        this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message : 'Something went wrong'), 'Retry');
      }
    });
  }  
  
  userRejectActionHandler() {
    this.ngxService.start();
    this.rejectUnsubscription = this.facadeService.onGetAPI(apiUrls.rejectResion).subscribe(res => {
      let data: any;
      if (res) {
        this.ngxService.stop();
        data = res;
        if ((data.statusCode == 200) && data.message) {
          AppUtills.setValue('reasons', JSON.stringify(data.result));
        } else {
          this.facadeService.openArchivedSnackBar(data.message, 'Retry');
        }
      }
    }, error => {
      this.ngxService.stop();
      if(AppUtills.showErrorMessage(error)){
        this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message: 'Something went wrong'), 'Retry');
      }
    });
  }

  getMasterDataOfTOC(){
    let masterDataType = {      
      "actionName":"MASTER_DATA",  "masterDataType": "companyTypeList"
    }  
    this.tocUnsubscription = this.facadeService.onCMPostAPI(apiUrls.cpmImageService, masterDataType).subscribe(res => {
      let data: any;
        if (res) {
          data = res.body || res;
          this.ngxService.stop();
          if ((data.statusCode == 200) && data.message) {
           let masterDataTOC = data.result[0] && data.result[0].collections && data.result[0].collections.companyTypeList;
            AppUtills.setValue('toc_master_data', JSON.stringify(masterDataTOC))
            } else {
              this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
            }
          } else {
            this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
          }
    },error => {
      this.ngxService.stop();
    });
  }

  ngOnDestroy() {
    this.rejectUnsubscription ? this.rejectUnsubscription.unsubscribe() : '';
    this.tocUnsubscription ? this.tocUnsubscription.unsubscribe() : '';
  }

}
