import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppConstants } from '@src/core/utills/constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, forkJoin } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { AppUtills } from '@src/core/utills/appUtills';
import { HttpClient } from '@angular/common/http';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css', '../common-user.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  userActiveCount: string = '0';
  userInactiveCount: string = '0';
  cardInfo: any;
  constructor(private ngxService: NgxUiLoaderService, private facadeService: FacadeService, private _http: HttpClient) {
    this.cardInfomation(this.userActiveCount, this.userInactiveCount);
  }

  userSubscription: Subscription;
  masterDataSubscription: Subscription;
  siteGeoFieldsSubscription: Subscription;
  getAllSitesSubscription: Subscription;
  masterDataSubscriber: Subscription;
  siteLevelForkJoinSubscriber: Subscription;

  cardInfomation(userActiveCount, userInactiveCount) {
    this.cardInfo = [
      {
        image: "bulk-upload-kits.svg",
        totalNum: "",
        cardText: "user_dashboard_card_bulk_upload_users",
        bulkStatus: true,
        redirectUrl: "",
        downloadImage: (this.checkDownloadTemplatePermission() ? "download-template.svg" : ''),
        downloadTitle: (this.checkDownloadTemplatePermission() ? "user_dashboard_card_download_template" : ''),
        endPoint: (this.checkDownloadTemplatePermission() ? apiUrls.downloadFile : ''),
        sampleFileType: "text/csv",
        sampleTemplateName: AppConstants.sampleUserTemplate,
        moduleName: "USERS",
        permissionName: PermissionIds.BULK_UPLOAD_USER
      }, 
      {
        image: "add_new_user.svg",
        totalNum: "",
        cardText: "user_dashboard_card_add_new_user",
        bulkStatus: false,
        redirectUrl: "/user/add",
        moduleName: "USERS",
        permissionName: PermissionIds.CREATE_USER
      },
      {
        image: "active.svg",
        totalNum: userActiveCount,
        cardText: "user_dashboard_card_add_active_users",
        bulkStatus: false,
        redirectUrl: ((this.checkRedirectPermission() && (userActiveCount > 0)) ? "/user/users/active" : ''),
        moduleName: "USERS",
        permissionName: PermissionIds.ACTIVE_USER_COUNT
      },
      {
        image: "active.svg",
        totalNum: userInactiveCount,
        cardText: "user_dashboard_card_add_inactive_users",
        bulkStatus: false,
        redirectUrl: ((this.checkRedirectPermission() && (userInactiveCount > 0)) ? "/user/users/inactive" : '' ),
        moduleName: "USERS",
        permissionName: PermissionIds.INACTIVE_USER_COUNT
      }
    ]
  }

  checkRedirectPermission(){    
    if (this.facadeService.validateSpecificPermission(PermissionIds.VIEW_USER_LISTING)) {        
      return true;
    }
    return false;
  }
  checkDownloadTemplatePermission(){    
    if (this.facadeService.validateSpecificPermission(PermissionIds.DOWNLOAD_USER_BULK_UPLOAD_TEMPLATE)) {        
      return true;
    }
    return false;
  }

  lineChartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  lineChartColors = [
    {
      borderColor: '#24AEFC',
      backgroundColor: 'transparent',
    },
  ];
  lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  userlineChartData = {
    lineChartData: this.lineChartData,
    lineChartLabels: this.lineChartLabels,
    lineChartColors: this.lineChartColors
  };

  userPieChartData = {
    center_text: '16780',
    center_fill_color_code: 'blue',
    legend_title: 'Totral Assign Kit(s)',
    chartColors: [{
      hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
      hoverBorderWidth: 0,
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
      hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
    }],
    chartLabels: ['Total', 'Active User', 'Inactive User'],
    chartData: [300, 50, 100]
  }

  ngOnInit() {
    // ******** Fetch User Count ******** //
    this.ngxService.start();
    this.userSubscription = this.facadeService.onUserPostAPI(apiUrls.fetchCount, {}).subscribe(roleRes => {
      let data;
      if (roleRes) {
        data = roleRes.body;
        if ((data.statusCode == 200) && data.message) {
          let Usercount = data.result;
          this.cardInfomation(Usercount.activeUsers, Usercount.inActiveUsers);
          this.ngxService.stop();
          this.getAllUMMasterData();
        } else {
          this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
        }
      }
    });
  }  

  getAllUMMasterData() {
    let storageGeoFields = AppUtills.getValue('geoFields');
    let masterGeoLocations = AppUtills.getValue('masterGeoLocations');
    if ((storageGeoFields && storageGeoFields != '') && (masterGeoLocations && masterGeoLocations != '')) {

    } else {
      this.ngxService.start();
      this.masterDataSubscriber = this.facadeService.getUserMCompleteMasterData().subscribe(
        (masterResp: any) => {  
          if (masterResp.length > 0) {
            if (masterResp[0].statusCode == 200 && masterResp[0].result) {
              masterResp[0].result.map(geoFieldsData => {
                if (geoFieldsData.type == "Sales Geographical Hierarchy") {
                  let geoFieldsCounter = 1;
                  let geoFieldsObj = [];
                  let apiRequests = [];
                  geoFieldsData.levels.map((fieldV, fieldK) => {
                    let geoFieldObj = { fieldLevelId: 'L' + geoFieldsCounter, fieldLevel: fieldV }
                    geoFieldsObj.push(geoFieldObj);
                    let preparedUrl = apiUrls.siteLevelHirerchy + '?levelId=' + geoFieldsCounter;
                    let getgeoLevelData = this._http.post(preparedUrl, {});
                    apiRequests.push(getgeoLevelData);
                    geoFieldsCounter += 1;
                  });
                  AppUtills.removeValue('geoFields');
                  AppUtills.setValue('geoFields', JSON.stringify(geoFieldsObj));
                  this.siteLevelForkJoinSubscriber = forkJoin(apiRequests).subscribe(
                    (geolocations: any) => {
                      if (geolocations) {
                        let geoData = {};
                        geolocations.map((geolocation, key) => {
                          if (geolocation.statusCode == 200 && geolocation.result && geolocation.result.length > 0) {
                            let preparedLevel = 'L' + geolocation.result[0].levelHierarchy.levelId;
                            geoData[preparedLevel] = [];
                            geolocation.result.map(iteration => {
                              let parentId = '';
                              let parentLevel = '';
                              if (iteration.parent) {
                                parentId = iteration.parent.id;
                                parentLevel = 'L' + iteration.parent.levelHierarchy.levelId;
                              }
                              let preparedObj = { id: iteration.id, level: iteration.levelName, rootlevel: preparedLevel, parent: parentId, parentLevel: parentLevel }
                              geoData[preparedLevel].push(preparedObj);
                            });
                          }
                        });
                        AppUtills.removeValue('masterGeoLocations');
                        AppUtills.setValue('masterGeoLocations', JSON.stringify(geoData));
                        this.ngxService.stop();
                      }
                    }
                  );
                }
              });
            }
          }
        },
        err => {
          console.log(err);
          this.ngxService.stop();
        }
      );
    }
  }

  ngOnDestroy() {
    this.userSubscription ? this.userSubscription.unsubscribe() : '';
    this.masterDataSubscription ? this.masterDataSubscription.unsubscribe() : '';
    this.siteGeoFieldsSubscription ? this.siteGeoFieldsSubscription.unsubscribe() : '';
    this.getAllSitesSubscription ? this.getAllSitesSubscription.unsubscribe() : '';
    this.masterDataSubscriber ? this.masterDataSubscriber.unsubscribe() : '';
    this.siteLevelForkJoinSubscriber ? this.siteLevelForkJoinSubscriber.unsubscribe() : '';
  }
}