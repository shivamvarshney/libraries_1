import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { NotificationsService } from '@service/sse/notifications.service';
import { FacadeService } from '@src/core/services/facade.service';
import { AppUtills } from '@src/core/utills/appUtills';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Subscription, forkJoin } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { DOCUMENT } from '@angular/common';
import { HandleCommonApiService } from '@service/common-api-service/handle-common-api.service';
import { PermissionIds } from '@src/core/utills/masterPermission';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'de-dashboard',
  templateUrl: './de-dashboard.component.html',
  styleUrls: ['./de-dashboard.component.scss', '../cm-module.scss']
})
export class DeDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  //color = 'accent';
  checked1 = true;
  checked2 = false;
  disabled = false;
  dailyTime = 'daily';
  componentRef: any;

  daily: true;
  weekly: false;
  monthly: false;

  deNewCase = [];
  dePreapredCaseInfo = [];
  timerToggleOnAccept: boolean = false;
  currectSelectedTab: any = 'daily';
  interval;
  max: number = 0;
  current: number = 0;
  color: String = "#FF0000";
  booleanTimer = false;

  permissionIds:any;

  listOfAgentUnsubscription: Subscription;
  acceptCaseUnsubscription: Subscription;
  StatusUnsubscription: Subscription;
  geoLocationSubscriber: Subscription;
  forkGeoLocationSubscriber: Subscription;

  constructor(
    private notifications: NotificationsService,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
    private commonApiService: HandleCommonApiService,
    private _http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (!AppUtills.checkUserType('dataExecutive')) {
      this.myRoute.navigate(['/case-management/supervisor']);
    }
  }

  ngOnInit() {
    this.permissionIds = PermissionIds;
    if(this.checkListingPermission()){
      this.getData();
      this.userRejectActionHandler();
      this.commonApiService.getMasterDataOfTOC();
    }
  }

  userRejectActionHandler() {
    this.commonApiService.userRejectActionHandler();
  }

  checkListingPermission() {
    if (this.facadeService.validateSpecificPermission(PermissionIds.LISTING_OF_CASE)) {
      return true;
    }
    return false;
  }

  prepareEventCaseData(eventData) {
    let caseObj = {
      caseId: eventData.case.id,
      assignedActor: eventData.actor.id,
      cpAccountNo: eventData.case.cpAccountNo,
      businessLine: eventData.case.businessLine,
      caseType: eventData.case.type,
      caseOwnerType: eventData.case.ownerType,
      caseStatus: eventData.case.status,
      caseCreatedOn: eventData.case.createdAt,
      caseUpdatedBy: eventData.case.updatedBy,
      caseStatusType: 'EventData',
      cpName: (eventData.info && eventData.info.outlets && eventData.info.outlets.id_cpName) ? eventData.info.outlets.id_cpName : '-'
    }

    let maxTime = eventData.timeInMilli / 1000;
    let t = new Date(eventData.currentTime);
    t.setSeconds(t.getSeconds() + maxTime);
    let currentDate = new Date();
    if (currentDate < t) {
      let dif = t.getTime() - currentDate.getTime();
      let secondsInDifferences = dif / 1000;
      let secondsAbsoluteValue = Math.ceil(secondsInDifferences);
      if (secondsAbsoluteValue > 0) {
        this.dePreapredCaseInfo.push(caseObj);
        this.current = secondsAbsoluteValue;
        this.max = secondsAbsoluteValue;
        this.timerToggleOnAccept = true;
      }
    }
  }

  prepareAcceptedCaseData(obje) {
    obje.map(caseInfo => {
      let caseObj = {
        caseId: caseInfo.id,
        assignedActor: caseInfo.assignedTo,
        cpAccountNo: caseInfo.cpAccountNo,
        businessLine: caseInfo.businessLine,
        caseType: caseInfo.type,
        caseOwnerType: caseInfo.ownerType,
        caseStatus: caseInfo.status,
        caseCreatedOn: caseInfo.createdOn,
        caseUpdatedBy: caseInfo.updatedBy,
        caseStatusType: 'Accepted',
        cpName: (caseInfo.info && caseInfo.info.outlets && caseInfo.info.outlets.id_cp_name) ? caseInfo.info.outlets.id_cp_name : '-',
        createdByName: caseInfo.createdByName,
        updatedByName: caseInfo.updatedByName,
        createdByLoginInfo: caseInfo.createdByLoginInfo,
        updatedByLoginInfo: caseInfo.updatedByLoginInfo
      }
      AppUtills.removeValue('storedCaseDetails');
      AppUtills.setValue('storedCaseDetails', JSON.stringify(caseInfo));
      this.dePreapredCaseInfo.push(caseObj);
    });
  }

  prepareTimerObj(caseInfo) {
    if (caseInfo.closureSLAInMillis > 0 && caseInfo.assignmentTime) {
      console.log(caseInfo)
      console.log(new Date(caseInfo).toUTCString);
      let serverTime = AppUtills.getUTCTimeStamp(caseInfo.assignmentTime);
      console.log('serverTime is ', serverTime, 'serverTime.getMilliseconds() is ', serverTime.getMilliseconds(), ' caseInfo.closureSLAInMillis ', caseInfo.closureSLAInMillis);
      serverTime.setMilliseconds(serverTime.getMilliseconds() + caseInfo.closureSLAInMillis);
      console.log('updated serverTime is ', serverTime, 'serverTime.getMilliseconds() is ', serverTime.getMilliseconds());
      let serverCreatedTime = serverTime.getTime();
      let t = AppUtills.getCurrentTimeInUTC();
      console.log('current time is ', t);
      let currentDateTime = t.getTime();
      console.log('serverCreatedTime is ', serverCreatedTime, ' and currentDateTime is ', currentDateTime, ' minus is ', serverCreatedTime - currentDateTime);
      if (serverCreatedTime > currentDateTime) {
        let dif = serverCreatedTime - currentDateTime;
        let secondsInDifferences = dif / 1000;
        let secondsAbsoluteValue = Math.ceil(secondsInDifferences);
        if (secondsAbsoluteValue > 0) {
          let counter = secondsAbsoluteValue;
          console.log('counter is ', counter);
          if (secondsAbsoluteValue > caseInfo.closureSLAInMillis) {
            counter = caseInfo[0].closureSLAInMillis;
          }
          console.log('updated counter is ', counter);
          let newCaseInfo = {
            caseId: caseInfo.id,
            currentTime: new Date(),
            maxTime: counter,
            refreshed: true
          }
          console.log('newCaseInfo is ', newCaseInfo);
          let stringifyString = JSON.stringify(newCaseInfo);
          AppUtills.setValue('newCaseData', stringifyString);
        }
      }
    }
  }

  acceptCase(objectInfo) {
    if (objectInfo.caseStatusType == 'Accepted') {
      this.myRoute.navigate(['/case-management/case/kyc/' + objectInfo.caseId]);
    } else {
      let accptCaseObj = {
        nextState: 'ACCEPTED',
        actorId: objectInfo.assignedActor,
        caseId: objectInfo.caseId,
      };
      this.ngxService.start();
      this.acceptCaseUnsubscription = this.facadeService.onCMPostAPI(apiUrls.caseAcceptReject, accptCaseObj).subscribe(res => {
        let data: any;
        if (res) {
          data = res.body || res;
          this.ngxService.stop();
          if (data.message) {
            this.facadeService.openArchivedSnackBar(data.message, 'Success');
            if (data.statusCode == 200) {
              this.myRoute.navigate(['/case-management/case/kyc/' + accptCaseObj.caseId]);
            }
          }
        }
      }, error => {
        this.ngxService.stop();
        if (AppUtills.showErrorMessage(error)) {
          this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message : 'Something went wrong'), 'Retry');
        }
      });
      this.timerToggleOnAccept = false;
    }
  }

  getData() {
    this.ngxService.start();
    let url = apiUrls.caseList + '?status=PENDING&internalStatus=ACCEPTED';
    this.listOfAgentUnsubscription = this.facadeService.onCMGetAPI(url).subscribe(res => {
      let data: any;
      if (res) {
        this.ngxService.stop();
        if (res['statusCode'] == 200 && res['message']) {
          if (res['result'].content && res['result'].content.length > 0) {
            let updatedObj = res['result'].content[0];
            this.prepareAcceptedCaseData(res['result'].content);
            if (res['result'].content[0].info.outlets.id_addShop) {
              let updatedInfo = res['result'].content[0]
              let leastLabelId = AppUtills.getLowestGeoHierarchyLabelId();
              let levelHierarchy = AppUtills.getSelectedLevelHierarchy(leastLabelId);
              let apiRequests = [];
              updatedInfo.info.outlets.id_addShop.map((shopInfo, shopKey) => {
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
                          updatedInfo.info.outlets.id_addShop[key]['geoHierarchy'] = geoDataInfo;
                        }
                      });
                      this.ngxService.stop();                      
                      AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedInfo));
                      let newCaseTimer = AppUtills.getValue('newCaseData');
                      if (newCaseTimer == '' || newCaseTimer == null) {
                        this.prepareTimerObj(updatedObj);
                      }
                      this.booleanTimer = true;
                    }
                  }, err => {
                    if (AppUtills.showErrorMessage(err)) {
                      AppUtills.removeValue('storedCaseDetails');
                      AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
                    }
                    this.ngxService.stop();                    
                  }
                );
              }else{
                AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
                let newCaseTimer = AppUtills.getValue('newCaseData');
                if (newCaseTimer == '' || newCaseTimer == null) {
                  this.prepareTimerObj(updatedObj);
                }
                this.booleanTimer = true;
              }
              /*
              if (res['result'].content[0].ownerType.toLowerCase() == "AGGREGATOR".toLowerCase()) {
                let regionIds = [];
                res['result'].content[0].info.outlets.id_addShop.map(shopInfo => {
                  if (regionIds.indexOf(shopInfo.id_region) < 0) {
                    regionIds.push(shopInfo.id_region);
                  }
                });
                if (regionIds.length > 0) {
                  let obj = {
                    levelIdList: regionIds
                  } 
                  if (res['result'].content[0].previousInfo && res['result'].content[0].previousInfo.outlets && res['result'].content[0].previousInfo.outlets.id_addShop && res['result'].content[0].previousInfo.outlets.id_addShop.length > 0) {
                    res['result'].content[0].previousInfo.outlets.id_addShop.map(shopInfo => {
                      if (regionIds.indexOf(shopInfo.id_region) < 0) {
                        regionIds.push(shopInfo.id_region);
                      }
                    });
                  }
                  this.geoLocationSubscriber = this.facadeService.onCMPostAPI(apiUrls.levelDetails, obj).subscribe(res => {
                    let data: any;
                    if (res) {
                      this.ngxService.stop();
                      data = res.body || res;
                      if (data.statusCode == 200 && data.message && data.result) {
                        let updatedInfo = AppUtills.aggregatorUpdateGeoLocation(data.result, updatedObj);
                        AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedInfo));
                        let newCaseTimer = AppUtills.getValue('newCaseData');
                        if (newCaseTimer == '' || newCaseTimer == null) {
                          this.prepareTimerObj(updatedObj);
                        }
                        this.booleanTimer = true;
                      }
                    }
                  }, error => {
                    if (AppUtills.showErrorMessage(error)) {
                      AppUtills.removeValue('storedCaseDetails');
                      AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
                    }
                    this.ngxService.stop();
                  }, () => {
                    this.ngxService.stop();
                  });
                }
              } else {
                let siteIds = []
                res['result'].content[0].info.outlets.id_addShop.map(shopInfo => {
                  if (siteIds.indexOf(shopInfo.id_cpSiteId) < 0) {
                    siteIds.push(shopInfo.id_cpSiteId);
                  }
                });
                if (res['result'].content[0].previousInfo && res['result'].content[0].previousInfo.outlets && res['result'].content[0].previousInfo.outlets.id_addShop && res['result'].content[0].previousInfo.outlets.id_addShop.length > 0) {
                  res['result'].content[0].previousInfo.outlets.id_addShop.map(shopInfo => {
                    if (siteIds.indexOf(shopInfo.id_region) < 0) {
                      siteIds.push(shopInfo.id_region);
                    }
                  });
                } 
                if (siteIds.length > 0) {
                  this.ngxService.start();
                  let sitesObj = { siteIdList: siteIds }
                  this.geoLocationSubscriber = this.facadeService.onCMPostAPI(apiUrls.siteInfo, sitesObj).subscribe(geoInfo => {
                    let data: any;
                    if (geoInfo) {
                      this.ngxService.stop();
                      data = geoInfo.body || geoInfo;
                      if (data.statusCode == 200 && data.message && data.result && Object.keys(data.result).length > 0) {
                        let updatedInfo = AppUtills.OutLetGeoLocations(data.result, updatedObj);
                        AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedInfo));
                        let newCaseTimer = AppUtills.getValue('newCaseData');
                        if (newCaseTimer == '' || newCaseTimer == null) {
                          this.prepareTimerObj(updatedObj);
                        }
                        this.booleanTimer = true;
                      }
                    }
                  }, error => {
                    if (AppUtills.showErrorMessage(error)) {
                      AppUtills.removeValue('storedCaseDetails');
                      AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
                    }
                    this.ngxService.stop();
                  }, () => {
                    this.ngxService.stop();
                  });
                }
              }
              */
            } else {
              AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
              let newCaseTimer = AppUtills.getValue('newCaseData');
              if (newCaseTimer == '' || newCaseTimer == null) {
                this.prepareTimerObj(updatedObj);
              }
              this.booleanTimer = true;
            }
            /*
            let newCaseTimer = AppUtills.getValue('newCaseData');
            if (newCaseTimer == '' || newCaseTimer == null) {
              this.prepareTimerObj(res['result'].content[0]);
            }
            this.booleanTimer = true;
            */
          } else {
            let storedCaseDetails = AppUtills.getValue('storedCaseDetails');
            if (storedCaseDetails && storedCaseDetails != '') {
              AppUtills.removeValue('storedCaseDetails');
            }
            this.dePreapredCaseInfo = [];
          }
          if (this.checkActionPermission()) {
            this.updateUserStatus();
          }
        } else {
          this.facadeService.openArchivedSnackBar(res.message, 'Retry');
        }
      }
    }, error => {
      this.ngxService.stop();
      if (AppUtills.showErrorMessage(error)) {
        this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message : 'Something went wrong'), 'Retry');
      }
    });
  }

  checkActionPermission() {     
    if (this.facadeService.validateSpecificPermission(PermissionIds.AVAILABILITY_STATUS_CHANGE)) {
      return true;
    }
    return false;
  }

  updateUserStatus() {
    let actorAvailabilityStatus = AppUtills.getValue('actorAvailabilityStatus');
    if (actorAvailabilityStatus == '' || actorAvailabilityStatus == null) {
      let availabilityInfo = {
        "availabilityStatus": 'AVAILABLE'
      }
      this.StatusUnsubscription = this.facadeService.onCMPostAPI(apiUrls.availabilityStatus, availabilityInfo).subscribe(res => {
        let data: any;
        if (res) {
          this.ngxService.stop();
          data = res.body || res;
          if (data.statusCode == 200 && data.message) {
            if (data.result.availabilityStatus === "AVAILABLE") {
              AppUtills.setValue('actorAvailabilityStatus', 'Available');
            } else {
              AppUtills.setValue('actorAvailabilityStatus', 'Break');
            }
          }
        }
      }, error => {
        this.ngxService.stop();
      });
    }
  }

  ngOnDestroy() {
    this.listOfAgentUnsubscription ? this.listOfAgentUnsubscription.unsubscribe() : '';
    this.acceptCaseUnsubscription ? this.acceptCaseUnsubscription.unsubscribe() : '';
    this.StatusUnsubscription ? this.StatusUnsubscription.unsubscribe() : '';
    this.geoLocationSubscriber ? this.geoLocationSubscriber.unsubscribe() : '';
  }

  userActiveTab(event: any, newValue: string) {
    this.currectSelectedTab = newValue;
  }

  userassests(eventData) {
    let clickedSection = eventData.target.htmlFor;
    document.getElementById("Daily-graphs").style.display = "none";
    document.getElementById("Weekly-graphs").style.display = "none";
    document.getElementById("Monthly-graphs").style.display = "none";
    document.getElementById(clickedSection + "-graphs").style.display = "block";
  }

  ngAfterViewInit() {
    let ctxDaily = (<HTMLCanvasElement>document.getElementById('daily_drought_chart'));
    let myChartDaily = new Chart(ctxDaily, {
      type: 'doughnut',
      data: {
        labels: [
          'Approved',
          'Rejected'
        ],
        datasets: [
          { data: [80, 40], backgroundColor: ['#EA6061', '#B85C9E'] },
        ]
      }
    });
    let ctxDailyTotalCases = (<HTMLCanvasElement>document.getElementById('ctxDailyTotalCases'));
    let myChartctxDailyTotalCases = new Chart(ctxDailyTotalCases, {
      type: 'line',
      data: {
        labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
        datasets: [
          {
            label: "Approved Cases",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(234, 96, 97, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            data: [15, 29, 10, 20, 36],
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 10
            }
          }]
        }
      }
    });
    let ctxDailyApprovedCases = (<HTMLCanvasElement>document.getElementById('ctxDailyApprovedCases'));
    let myChartctxDailyApprovedCases = new Chart(ctxDailyApprovedCases, {
      type: 'line',
      data: {
        labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
        datasets: [
          {
            label: "Approved Cases",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(234, 96, 97, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            data: [15, 29, 10, 20, 36],
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 10
            }
          }]
        }
      }
    });

    let ctxWeekly = (<HTMLCanvasElement>document.getElementById('weekly_drought_chart'));
    let myChartWeekly = new Chart(ctxWeekly, {
      type: 'doughnut',
      data: {
        labels: [
          'Approved',
          'Rejected'
        ],
        datasets: [
          { data: [80, 40], backgroundColor: ['#EA6061', '#B85C9E'] },
        ]
      }
    });
    let ctxWeeklyTotalCases = (<HTMLCanvasElement>document.getElementById('ctxWeeklyTotalCases'));
    let myChartctxWeeklyTotalCases = new Chart(ctxWeeklyTotalCases, {
      type: 'line',
      data: {
        labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
        datasets: [
          {
            label: "Approved Cases",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(234, 96, 97, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            data: [15, 29, 10, 20, 36],
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 10
            }
          }]
        }
      }
    });
    let ctxWeeklyApprovedCases = (<HTMLCanvasElement>document.getElementById('ctxWeeklyApprovedCases'));
    let myChartctxWeeklyApprovedCases = new Chart(ctxWeeklyApprovedCases, {
      type: 'line',
      data: {
        labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
        datasets: [
          {
            label: "Approved Cases",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(234, 96, 97, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            data: [15, 29, 10, 20, 36],
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 10
            }
          }]
        }
      }
    });

    let ctxMonthly = (<HTMLCanvasElement>document.getElementById('monthly_drought_chart'));
    let myChartMonthly = new Chart(ctxMonthly, {
      type: 'doughnut',
      data: {
        labels: [
          'Approved',
          'Rejected'
        ],
        datasets: [
          { data: [80, 40], backgroundColor: ['#EA6061', '#B85C9E'] },
        ]
      }
    });
    let ctxMonthlyTotalCases = (<HTMLCanvasElement>document.getElementById('ctxMonthlyTotalCases'));
    let myChartctxMonthlyTotalCases = new Chart(ctxMonthlyTotalCases, {
      type: 'line',
      data: {
        labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
        datasets: [
          {
            label: "Approved Cases",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(234, 96, 97, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            data: [15, 29, 10, 20, 36],
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 10
            }
          }]
        }
      }
    });
    let ctxMonthlyApprovedCases = (<HTMLCanvasElement>document.getElementById('ctxMonthlyApprovedCases'));
    let myChartctxMonthlyApprovedCases = new Chart(ctxMonthlyApprovedCases, {
      type: 'line',
      data: {
        labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
        datasets: [
          {
            label: "Approved Cases",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(234, 96, 97, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            data: [15, 29, 10, 20, 36],
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 10
            }
          }]
        }
      }
    });

  }
}
