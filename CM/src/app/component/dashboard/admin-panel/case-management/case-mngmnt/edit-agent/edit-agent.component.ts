import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from '@service/data-share-service/data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationsService } from '@service/sse/notifications.service';
import { AppUtills } from '@src/core/utills/appUtills';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrls: ['./edit-agent.component.scss']
})
export class EditAgentComponent implements OnInit, OnDestroy {
  booleanTimer = false;
  kycInfoUnsubscription: Subscription;
  editGeoLocationSubscriber: Subscription;
  forkGeoLocationSubscriber: Subscription;
  KYCDetails: any;
  noKYCDetails: any;
  paramId: string;
  caseMSISDN: string;
  parsedCaseJSON: string;
  dataExecutive: boolean = false;
  caseExecutivePerson: string;
  constructor(private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private dataService: DataService,
    private _router: ActivatedRoute,
    private myRoute: Router,
    private _http: HttpClient,
    private notifications: NotificationsService) { }

  ngOnInit() {
    let completeUrl = this.myRoute.url;
    let splitedUrl = completeUrl.split('/');
    //console.log('splitedUrl is ',splitedUrl);
    if (splitedUrl && splitedUrl.length > 0 && splitedUrl.length == 5 && splitedUrl[1] == "case-management" && splitedUrl[2] == "case" && splitedUrl[4]) {
      this.paramId = splitedUrl[4];
      this.getUserKycDetails();
    } else {
      this.facadeService.backToDashboard();
    }
    if (AppUtills.getValue('user_actor_type') && AppUtills.getValue('user_actor_type') == 'dataExecutive') {
      this.dataExecutive = true;
    } else {
      this.dataExecutive = false;
    }
  }

  updateCaseInfo(caseOIbj) {
    this.noKYCDetails = caseOIbj;
    this.KYCDetails = caseOIbj;
    this.caseExecutivePerson = (caseOIbj ? (caseOIbj.updatedByName ? this.KYCDetails.updatedByName : (this.KYCDetails.createdByName ? this.KYCDetails.createdByName : '')) : '');
    this.caseMSISDN = (caseOIbj ? (this.KYCDetails.updatedByLoginInfo ? this.KYCDetails.updatedByLoginInfo : (this.KYCDetails.createdByLoginInfo ? this.KYCDetails.createdByLoginInfo : '')) : '');
    //this.caseExecutivePerson = (this.KYCDetails.info && this.KYCDetails.info.salesUserInfo && this.KYCDetails.info.salesUserInfo.firstName ? this.KYCDetails.info.salesUserInfo.firstName : '');//info.outlets && this.KYCDetails.info.outlets.id_cp_name) ? this.KYCDetails.info.outlets.id_cp_name : '';
    //this.caseMSISDN = (this.KYCDetails.info && this.KYCDetails.info.salesUserInfo && this.KYCDetails.info.salesUserInfo.msisdn ? this.KYCDetails.info.salesUserInfo.msisdn : '');//(this.KYCDetails.info && this.KYCDetails.info.outlets && this.KYCDetails.info.outlets.id_addShop && this.KYCDetails.info.outlets.id_addShop.length > 0 && this.KYCDetails.info.outlets.id_addShop[0].id_mobile && this.KYCDetails.info.outlets.id_addShop[0].id_mobile.length > 0 && this.KYCDetails.info.outlets.id_addShop[0].id_mobile[0].id_mobileNo) ? this.KYCDetails.info.outlets.id_addShop[0].id_mobile[0].id_mobileNo : '';
    this.dataService.fetchAgentDetails(this.KYCDetails);
    this.booleanTimer = true;
  }

  // ******** Get User Details ******** //
  getUserKycDetails() {
    if (AppUtills.getValue('storedCaseDetails')) {
      this.parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));
      this.updateCaseInfo(this.parsedCaseJSON);
    } else {
      this.ngxService.start();
      let customUrl = apiUrls.caseList + '?id=' + this.paramId;
      if (AppUtills.checkUserType('dataExecutive')) {
        customUrl += '&status=PENDING&internalStatus=ACCEPTED';
      }
      let subscribedData = '';
      this.kycInfoUnsubscription = this.facadeService.onGetAPI(customUrl).subscribe(res => {
        let data: any;
        if (res) {
          this.ngxService.stop();
          data = res;
          if ((data.statusCode == 200) && data.message) {
            if (data.result.content.length > 0) {
              let updatedObj = data.result.content[0];
              subscribedData = updatedObj;
              if (updatedObj.info && updatedObj.info.outlets && updatedObj.info.outlets.id_addShop && updatedObj.info.outlets.id_addShop.length > 0) {
                let leastLabelId = AppUtills.getLowestGeoHierarchyLabelId();
                let levelHierarchy = AppUtills.getSelectedLevelHierarchy(leastLabelId);
                let apiRequests = [];
                updatedObj.info.outlets.id_addShop.map((shopInfo, shopKey) => {
                  let obj = {
                    levelIdList: AppUtills.getSelectedLeafHierarchy(levelHierarchy, shopInfo)
                  }
                  let getGeoHierarchy = this._http.post(apiUrls.levelListDetails, obj);
                  apiRequests.push(getGeoHierarchy);
                });
                if (apiRequests.length > 0) {
                  this.ngxService.start();
                  this.forkGeoLocationSubscriber = forkJoin(apiRequests).subscribe(
                    resData => {
                      if (resData) {
                        resData.map((value, key) => {
                          if (value['statusCode'] && value['statusCode'] == 200 && value['result'] && value['result'].length > 0) {
                            let geoDataInfo = {};
                            value['result'].map(val => {
                              geoDataInfo = AppUtills.prepareCaseGeoHierarchy(val, geoDataInfo);
                            });
                            updatedObj.info.outlets.id_addShop[key]['geoHierarchy'] = geoDataInfo;
                          }
                        });
                        this.ngxService.stop();
                        AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
                        this.updateSessionInfo(updatedObj);
                      }
                    }, err => {
                      this.ngxService.stop();
                      if (AppUtills.showErrorMessage(err)) {
                        this.updateSessionInfo(updatedObj);
                      }                      
                      
                    }
                  );
                } else {
                  this.updateSessionInfo(updatedObj);
                }
                /*
                if (updatedObj.ownerType.toLowerCase() == "AGGREGATOR".toLowerCase()) {
                  let regionIds = [];
                  updatedObj.info.outlets.id_addShop.map(shopInfo => {
                    if (regionIds.indexOf(shopInfo.id_region) < 0) {
                      regionIds.push(shopInfo.id_region);
                    }
                  });
                  if (updatedObj.previousInfo && updatedObj.previousInfo.outlets && updatedObj.previousInfo.outlets.id_addShop && updatedObj.previousInfo.outlets.id_addShop.length > 0) {
                    updatedObj.previousInfo.outlets.id_addShop.map(shopInfo => {
                      if (regionIds.indexOf(shopInfo.id_region) < 0) {
                        regionIds.push(shopInfo.id_region);
                      }
                    });
                  }
                  if (regionIds.length > 0) {
                    let obj = {
                      levelIdList: regionIds
                    }
                    this.editGeoLocationSubscriber = this.facadeService.onCMPostAPI(apiUrls.levelDetails, obj).subscribe(res => {
                      let data: any;
                      if (res) {
                        this.ngxService.stop();
                        data = res.body || res;
                        if (data.statusCode == 200 && data.message && data.result) {
                          let updatedInfo = AppUtills.aggregatorUpdateGeoLocation(data.result, updatedObj);
                          this.updateSessionInfo(updatedInfo);
                        }
                      }
                    }, error => {
                      if (AppUtills.showErrorMessage(error)) {
                        this.updateSessionInfo(updatedObj);
                      }
                      this.ngxService.stop();
                    }, () => {
                      this.ngxService.stop();
                    });
                  } else {
                    this.updateSessionInfo(updatedObj);
                  }
                } else {
                  let siteIds = []
                  updatedObj.info.outlets.id_addShop.map(shopInfo => {
                    if (siteIds.indexOf(shopInfo.id_cpSiteId) < 0) {
                      siteIds.push(shopInfo.id_cpSiteId);
                    }
                  });
                  if (updatedObj.previousInfo && updatedObj.previousInfo.outlets && updatedObj.previousInfo.outlets.id_addShop && updatedObj.previousInfo.outlets.id_addShop.length > 0) {
                    updatedObj.previousInfo.outlets.id_addShop.map(shopInfo => {
                      if (siteIds.indexOf(shopInfo.id_region) < 0) {
                        siteIds.push(shopInfo.id_region);
                      }
                    });
                  }
                  if (siteIds.length > 0) {
                    this.ngxService.start();
                    let sitesObj = { siteIdList: siteIds }
                    this.editGeoLocationSubscriber = this.facadeService.onCMPostAPI(apiUrls.siteInfo, sitesObj).subscribe((geoData: any) => {
                      let geoInfoData: any;
                      if (geoData) {
                        this.ngxService.stop();
                        geoInfoData = geoData.body || geoData;
                        if (geoInfoData.statusCode == 200 && geoInfoData.message && geoInfoData.result && Object.keys(geoInfoData.result).length > 0) {
                          let updatedInfo = AppUtills.OutLetGeoLocations(geoInfoData.result, updatedObj);
                          this.updateSessionInfo(updatedInfo);
                        }
                      }
                    }, error => {
                      this.ngxService.stop();
                      if (AppUtills.showErrorMessage(error)) {
                        this.updateSessionInfo(updatedObj);
                      }
                    });
                  } else {
                    this.updateSessionInfo(updatedObj);
                  }
                }
                */
              } else {
                this.updateSessionInfo(updatedObj);
              }
            } else {
              this.noKYCDetails = null;
            }
          } else {
            this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
          }
        }
      }, error => {
        if (subscribedData && subscribedData != '') {
          this.updateSessionInfo(subscribedData);
        } else {
          this.ngxService.stop();
          if (AppUtills.showErrorMessage(error)) {
            this.facadeService.openArchivedSnackBar('Something went wrong', 'Retry');
          }
        }
      });
    }
  }

  updateSessionInfo(updatedObj) {
    AppUtills.removeValue('storedCaseDetails');
    AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
    let showCaseInfo = AppUtills.getValue('newCaseData');
    if (showCaseInfo && showCaseInfo != '') {
      let showStorageParsedJson = JSON.parse(showCaseInfo);
      let newCaseInfo = {
        caseId: showStorageParsedJson.caseId,
        currentTime: new Date(),
        maxTime: showStorageParsedJson.maxTime,
        caseEvent: 'SHOW'
      };
      let stringifyString = JSON.stringify(newCaseInfo);
      AppUtills.removeValue('newCaseData');
      AppUtills.setValue('newCaseData', stringifyString);
    }
    this.updateCaseInfo(updatedObj);
    return true;
  }

  ngOnDestroy() {
    this.kycInfoUnsubscription ? this.kycInfoUnsubscription.unsubscribe() : '';
    this.editGeoLocationSubscriber ? this.editGeoLocationSubscriber.unsubscribe() : '';
    this.forkGeoLocationSubscriber ? this.forkGeoLocationSubscriber.unsubscribe(): '';
  }
}  
