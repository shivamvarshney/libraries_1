import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, ThemePalette, ProgressSpinnerMode } from '@angular/material';
import { FacadeService } from '@src/core/services/facade.service';
import { Subscription, Observable, timer, forkJoin } from 'rxjs';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service'
import { AppConstants } from '@src/core/utills/constant';
import { CommonDialogService } from '@service/common-dialog-service/common-dialog.service';
import { AppUtills } from '@src/core/utills/appUtills';
import { DataService } from '@service/data-share-service/data.service';
import { takeWhile, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PermissionIds } from '@src/core/utills/masterPermission';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'list-of-agents',
  templateUrl: './list-of-agents.component.html',
  styleUrls: ['./list-of-agents.component.scss', '../cm-module.scss']
})
export class ListOfAgentsComponent implements OnInit {

  alive: boolean;
  geoLocationSubscriber: Subscription;
  listOfAgentUnsubscription: Subscription;
  forkGeoLocationSubscriber: Subscription;
  aliveSubscription: Subscription;
  fetchCurrectUserInfo: any;
  isLoading = true;
  caseInfo: string;
  actorInfo: string;
  fetchCurrentObj: any;
  dataSource: any;
  notFoundRec: string;
  tomorrow = new Date();
  PIds: any;
  //color:"accent"; mode:"indeterminate"; diameter:40; strokeWidth="3";
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator
  constructor(private facadeService: FacadeService, private ngxService: NgxUiLoaderService,
    private aafModelService: AafModelService, private dataService: DataService, private routes: Router, private _http: HttpClient) {
    this.tomorrow.setDate(this.tomorrow.getDate());
  }

  @HostListener('click') onClick() {
    if (event.target['id'] == "myModal") {
      (<HTMLElement>document.getElementById("myModal")).style.display = "none";
    }
  }

  displayedColumns: string[] = ['Account No', 'CP Name', 'Type', 'Business Line', 'Case Type', 'Created Date', 'Created / Modified by', 'Case status', 'Assignment Status', 'Assign to'];

  filterForm: FormGroup;

  paginationObj = {
    totalCount: 0,
    pageNo: AppConstants.paginationPageNo,
    pageSize: AppConstants.paginationPageSize
  }

  caseDetails(caseObj) {
    let storedCaseDetails = AppUtills.getValue('storedCaseDetails');
    if (storedCaseDetails && storedCaseDetails != '') {
      AppUtills.removeValue('storedCaseDetails');
    }
    if (caseObj.info && caseObj.info.outlets && caseObj.info.outlets.id_addShop && caseObj.info.outlets.id_addShop.length > 0) {
      let leastLabelId = AppUtills.getLowestGeoHierarchyLabelId();
      let levelHierarchy = AppUtills.getSelectedLevelHierarchy(leastLabelId);
      let apiRequests = [];
      caseObj.info.outlets.id_addShop.map((shopInfo, shopKey) => {
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
                  caseObj.info.outlets.id_addShop[key]['geoHierarchy'] = geoDataInfo;
                }
              });
              this.ngxService.stop();
              AppUtills.setValue('storedCaseDetails', JSON.stringify(caseObj));
              this.routes.navigate(['/case-management/case/kyc/' + caseObj.id]);
            }
          }, err => {
            if (AppUtills.showErrorMessage(err)) {
              AppUtills.setValue('storedCaseDetails', JSON.stringify(caseObj));
              this.routes.navigate(['/case-management/case/kyc/' + caseObj.id]);
            }
            this.ngxService.stop();
          }
        );
      } else {
        AppUtills.setValue('storedCaseDetails', JSON.stringify(caseObj));
        this.routes.navigate(['/case-management/case/kyc/' + caseObj.id]);
      }
      /*
      if (caseObj.ownerType.toLowerCase() == "AGGREGATOR".toLowerCase()) {
        let regionIds = [];
        caseObj.info.outlets.id_addShop.map(shopInfo => {
          if (regionIds.indexOf(shopInfo.id_region) < 0) {
            regionIds.push(shopInfo.id_region);
          }
        });
        if (caseObj.previousInfo && caseObj.previousInfo.outlets && caseObj.previousInfo.outlets.id_addShop && caseObj.previousInfo.outlets.id_addShop.length > 0) {
          caseObj.previousInfo.outlets.id_addShop.map(shopInfo => {
            if (regionIds.indexOf(shopInfo.id_region) < 0) {
              regionIds.push(shopInfo.id_region);
            }
          });
        }
        if (regionIds.length > 0) {
          let obj = {
            levelIdList: regionIds
          }
          this.geoLocationSubscriber = this.facadeService.onCMPostAPI(apiUrls.levelDetails, obj).subscribe(res => {
            let data: any;
            if (res) {
              this.ngxService.stop();
              data = res.body || res;
              if (data.statusCode == 200 && data.message && data.result) {
                let updatedInfo = AppUtills.aggregatorUpdateGeoLocation(data.result, caseObj);
                AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedInfo));
                this.routes.navigate(['/case-management/case/kyc/' + caseObj.id]);
              }
            }
          }, error => {
            if (AppUtills.showErrorMessage(error)) {
              AppUtills.setValue('storedCaseDetails', JSON.stringify(caseObj));
              this.routes.navigate(['/case-management/case/kyc/' + caseObj.id]);
            }
            this.ngxService.stop();
          }, () => {
            this.ngxService.stop();
          });
        }
      } else {
        let siteIds = []
        caseObj.info.outlets.id_addShop.map(shopInfo => {
          if (siteIds.indexOf(shopInfo.id_cpSiteId) < 0) {
            siteIds.push(shopInfo.id_cpSiteId);
          }
        });
        if (caseObj.previousInfo && caseObj.previousInfo.outlets && caseObj.previousInfo.outlets.id_addShop && caseObj.previousInfo.outlets.id_addShop.length > 0) {
          caseObj.previousInfo.outlets.id_addShop.map(shopInfo => {
            if (siteIds.indexOf(shopInfo.id_region) < 0) {
              siteIds.push(shopInfo.id_region);
            }
          });
        }
        if (siteIds.length > 0) {
          this.ngxService.start();
          let sitesObj = { siteIdList: siteIds }
          this.geoLocationSubscriber = this.facadeService.onCMPostAPI(apiUrls.siteInfo, sitesObj).subscribe(res => {
            let data: any;
            if (res) {
              this.ngxService.stop();
              data = res.body || res;
              if (data.statusCode == 200 && data.message && data.result && Object.keys(data.result).length > 0) {
                let updatedInfo = AppUtills.OutLetGeoLocations(data.result, caseObj);
                AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedInfo));
                this.routes.navigate(['/case-management/case/kyc/' + caseObj.id]);
              }
            }
          }, error => {
            if (AppUtills.showErrorMessage(error)) {
              AppUtills.setValue('storedCaseDetails', JSON.stringify(caseObj));
              this.routes.navigate(['/case-management/case/kyc/' + caseObj.id]);
            }
            this.ngxService.stop();
          }, () => {
            this.ngxService.stop();
          });
        }
      }
      */
    } else {
      AppUtills.setValue('storedCaseDetails', JSON.stringify(caseObj));
      this.routes.navigate(['/case-management/case/kyc/' + caseObj.id]);
    }
  }

  getDataSource(updateUrl) {
    this.isLoading = true;
    this.listOfAgentUnsubscription = this.facadeService.onCMGetAPI(updateUrl).subscribe(res => {
      let data: any;
      if (res) {
        this.ngxService.stop();
        if (res['statusCode'] == 200 && res['message']) {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(res['result'].content);
          this.dataSource.sort = this.sort;
          this.paginationObj.totalCount = res['result'].totalElements;
          this.paginationObj.pageSize = res['result'].pageable.pageSize;
          this.paginationObj.pageNo = res['result'].pageable.pageNumber;
          if (res.result.content.length <= 0) {
            this.facadeService.openArchivedSnackBar(res['message'], 'Retry');
          }
        } else {
          this.facadeService.openArchivedSnackBar(res['message'], 'Retry');
          this.notFoundRec = res['message'];
        }
      }
    }, error => {
      this.ngxService.stop();
      if (AppUtills.showErrorMessage(error)) {
        this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message : 'Something went wrong'), 'Retry');
      }
    });
  }
  ngOnInit() {
    this.PIds = PermissionIds;
    this.filterForm = new FormGroup({
      caseSearch: new FormControl(''),
      type: new FormControl(''),
      caseStatus: new FormControl(''),
      fromDate: new FormControl(''),
      endDate: new FormControl(''),
    });
    /*
    this.alive = true;
    this.aliveSubscription = timer(10000, 10000).pipe(
      takeWhile(() => this.alive)
    ).subscribe(() => {
      this.getData();
    });
    */
    this.getData();
    AppUtills.getValue('actor_info') ? (this.actorInfo = JSON.parse(AppUtills.getValue('actor_info'))) : '';
  }

  // Prepare Pagination Obj
  preparePagination() {
    let paginationString = '';
    if (this.paginationObj.pageSize) {
      paginationString = paginationString + 'size=' + this.paginationObj.pageSize + '&';
    }
    if (this.paginationObj.pageNo || this.paginationObj.pageNo == 0) {
      paginationString = paginationString + 'page=' + this.paginationObj.pageNo + '&';
    }
    if (paginationString != '') {
      paginationString = paginationString.slice(0, -1);
    }
    return paginationString;
  }
  // On Page Change Event
  onPageChange(eventData: any) {
    this.paginationObj = {
      totalCount: eventData.length,
      pageNo: eventData.pageIndex,
      pageSize: eventData.pageSize
    }
    this.getData();
    return true;
  }
  caseStatus = [
    { value: 'APPROVED', viewValue: 'Approved' },
    { value: 'REJECTED', viewValue: 'Rejected' },
    { value: 'PENDING', viewValue: 'Pending' }
  ];
  caseTypes = [
    { value: 'NEW', viewValue: 'NEW' },
    { value: 'EDIT', viewValue: 'EDIT' }
  ];

  getDefaultPagination() {
    return 'page=' + AppConstants.paginationPageNo + '&size=' + AppConstants.paginationPageSize;
  }
  getFilteredData() {
    this.paginationObj = {
      totalCount: 0,
      pageNo: AppConstants.paginationPageNo,
      pageSize: AppConstants.paginationPageSize
    }
    this.getData();
    return true;
  }
  toTimestamp(strDate) {
    let myDate;
    myDate = new Date(strDate).getTime();
    return myDate
  }
  getData() {
    let url = apiUrls.caseList;
    if (this.preparePagination() && this.preparePagination() != '') {
      url = url + '?' + this.preparePagination();
    } else {
      url = url + '?' + this.getDefaultPagination();
    }
    if (this.onSearchFilterAction() && this.onSearchFilterAction() != '') {
      url = url + '&' + this.onSearchFilterAction();
    } else {
      url = url + '&status=PENDING';
    }
    url += '&sort=id,asc';
    this.getDataSource(url);
  }

  getAssignedMeCases() {
    let url = apiUrls.caseList;
    url = url + '?' + this.getDefaultPagination();
    let actorInfo = JSON.parse(AppUtills.getValue('actor_info'));
    url = url + '&status=PENDING&assignedTo=' + actorInfo.id;
    this.getDataSource(url);
  }

  onSearchFilterAction() {
    let queryString = '';
    if (this.filterForm.value.type && this.filterForm.value.type != '') {
      queryString = queryString + 'type=' + this.filterForm.value.type + '&';
    }
    if (this.filterForm.value.caseStatus && this.filterForm.value.caseStatus != '') {
      queryString = queryString + 'status=' + this.filterForm.value.caseStatus + '&';
    }
    if (this.filterForm.value.caseSearch && this.filterForm.value.caseSearch != '') {
      queryString = queryString + 'cpAccountNo=' + this.filterForm.value.caseSearch + '&';
    }
    if (this.filterForm.value.fromDate && this.filterForm.value.fromDate != '') {
      let preparedDateString = AppUtills.prepareHifunDateFormat(AppUtills.getYear(this.filterForm.value.fromDate), AppUtills.getMonth(this.filterForm.value.fromDate), AppUtills.getDate(this.filterForm.value.fromDate));
      let finalFromDateString = preparedDateString + ' 00:00:00';
      queryString = queryString + 'fromDate=' + this.toTimestamp(finalFromDateString) + '&';
    }
    if (this.filterForm.value.endDate && this.filterForm.value.endDate != '') {
      let preparedEndDateString = AppUtills.prepareHifunDateFormat(AppUtills.getYear(this.filterForm.value.endDate), AppUtills.getMonth(this.filterForm.value.endDate), AppUtills.getDate(this.filterForm.value.endDate));
      let finalToDateString = preparedEndDateString + ' 23:59:59';
      queryString = queryString + 'toDate=' + this.toTimestamp(finalToDateString) + '&';
      if (this.filterForm.value.fromDate == '') {
        queryString = queryString + 'fromDate=' + AppConstants.superVisorCasesDefaultFromDate + '&';
      }
    }
    if (queryString != '') {
      queryString = queryString.slice(0, -1);
    }
    return queryString;
  }

  callAssignmentPopup(caseInfo) {
    this.closeBtn();
    let actorInfo = JSON.parse(AppUtills.getValue('actor_info'));
    let selectAgent = {
      data: 'agentlist',
      title: 'Select Agent for Assignation',
      modalWidth: '30%',
      caseDataInfo: caseInfo,
      loggedInActorId: actorInfo.id
    }
    this.aafModelService.openModal(selectAgent);
  }

  agentListPopup(caseInfo, status) {
    let actorInfo = JSON.parse(AppUtills.getValue('actor_info'));
    this.fetchCurrentObj = caseInfo;
    if (caseInfo.status !== 'PENDING') {
      return false;
    }
    if ((caseInfo.status != 'PENDING') || (caseInfo.status == 'PENDING' && caseInfo.assignedTo !== actorInfo.id && caseInfo.assignedTo != 0)) {
      this.openPopup(caseInfo);
    } else {
      this.callAssignmentPopup(caseInfo);
    }
  }

  openPopup(currentCaseInfo) {
    this.caseInfo = currentCaseInfo;
    this.fetchCurrectUserInfo = currentCaseInfo.actorName;
    (<HTMLElement>document.getElementById("myModal")).style.display = "block";
  }

  closeBtn() {
    this.fetchCurrectUserInfo = '';
    (<HTMLElement>document.getElementById("myModal")).style.display = "none";
  }

  resetForm() {
    this.filterForm.reset();
  }

  ngOnDestroy() {
    this.geoLocationSubscriber ? this.geoLocationSubscriber.unsubscribe() : '';
    this.listOfAgentUnsubscription ? this.listOfAgentUnsubscription.unsubscribe() : '';
    this.alive = false;
    this.aliveSubscription ? this.aliveSubscription.unsubscribe() : '';
    this.forkGeoLocationSubscriber ? this.forkGeoLocationSubscriber.unsubscribe() : '';
  }
}