import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit, HostListener } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { AppUtills } from '@src/core/utills/appUtills';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { NotificationsService } from '@service/sse/notifications.service';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('header') el: ElementRef;

  readonly googlePlayLink: string;
  readonly appStoreLink: string;
  dropCaseInfoUnsubscription: Subscription;
  getCaseInfoSubscription: Subscription;
  caseObject: any;

  constructor(
    private userIdle: UserIdleService,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
    private notifications: NotificationsService
  ) { }

  @HostListener('click') onClick() {
    if (event.target['id'] == "myModal") {
      (<HTMLElement>document.getElementById("myModal")).style.display = "block";
    }
  }

  ngOnDestroy() {
    this.dropCaseInfoUnsubscription ? this.dropCaseInfoUnsubscription.unsubscribe() : '';
    this.getCaseInfoSubscription ? this.getCaseInfoSubscription.unsubscribe() : '';
  }

  ngAfterViewInit() {
    let headerHeight = this.el.nativeElement.offsetHeight;
    document.getElementById('header-top-height').style.paddingTop = headerHeight + 'px';
  }

  checkPermission(pId) {
    if (this.facadeService.validateSpecificPermission(pId)) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    if(this.checkPermission(PermissionIds.EVENT_WATCH)){
      this.notifications.getServerSentEvents().subscribe(data => {
        this.facadeService.handleServerEvents(data);
      });
    }
    if (AppUtills.checkUserType('dataExecutive') && this.checkPermission(PermissionIds.DROP_CASE)) {
      this.userIdle.startWatching();
      this.userIdle.onTimerStart().subscribe(count => {
        let eventList = ['click', 'mouseover', 'keydown', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'keyup'];
        for (let event of eventList) {
          document.body.addEventListener(event, () => this.userIdle.resetTimer());
        }
      });
      this.userIdle.onTimeout().subscribe(() => this.dropCase());
    }
  }

  dropCase() {
    let url = apiUrls.caseList + '?status=PENDING&internalStatus=ACCEPTED';
    this.getCaseInfoSubscription = this.facadeService.onCMGetAPI(url).subscribe(res => {
      if (res) {
        if (res['statusCode'] == 200 && res['message']) {
          if (res['result'].content && res['result'].content.length > 0) {
            this.caseObject = res['result'].content[0];
            this.onProceedHandler();
          }
        }
      }
    }, error => {
      console.log(error);
    });
  }

  openFinalPopup() {
    (<HTMLElement>document.getElementById("myModal")).style.display = "block";
  }

  closeBtn() {
    (<HTMLElement>document.getElementById("myModal")).style.display = "none";
    this.myRoute.navigate(['/case-management']);
  }

  removeCaseFromBucket(removalCaseId) {
    let newCaseInfo = AppUtills.getValue('newCaseData');
    if (newCaseInfo && newCaseInfo != '') {
      let parsedJson = JSON.parse(newCaseInfo);
      if (removalCaseId == parsedJson.caseId) {
        AppUtills.removeValue('newCaseData');
      }
    }
  }

  onProceedHandler() {
    if (this.caseObject && this.caseObject.id) {
      this.dropCaseInfoUnsubscription = this.facadeService.onCMPostAPI(apiUrls.dropCases, this.caseObject.id).subscribe(res => {
        let data: any;
        if (res) {
          this.ngxService.stop();
          data = res.body || res;
          if (data.statusCode == 200 && data.message) {
            this.removeCaseFromBucket(this.caseObject.id);
            this.openFinalPopup();
          }
        }
      });
    }
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

}
