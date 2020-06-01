import { Component, OnInit, OnDestroy, OnChanges, DoCheck } from '@angular/core';
import { FacadeService } from '@src/core/services/facade.service';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
import { timer } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'agent-status',
  templateUrl: './agent-status.component.html',
  styleUrls: ['./agent-status.component.scss']
})
export class AgentStatusComponent implements OnInit, OnDestroy {

  color = 'accent';
  checkedAvailable: boolean = true;
  checkedBreak: boolean = false;
  disabled = false;
  dataExecutive: boolean = false;
  hour: number;
  minute: number;
  seconds: number;
  UserAvailableStatus: string = 'Available';
  breakTime: string = 'Mark yourself unavailable for future assignments!';
  availableStatus: string = 'Available';
  breakStatus: string = 'Plan a break';
  enableStatus: boolean = true;
  disableStatus: boolean = false;
  availableBreakStatus: boolean = false;
  StatusUnsubscription: Subscription;
  counter = 0;
  timeData: number;

  timerSubscription: Subscription;
  permissionIds:any;

  constructor(
    private facadeService: FacadeService,
    private myRoute: Router,
    private ngxService: NgxUiLoaderService) {
  }

  updateTimer() {
    let newCaseTimer = AppUtills.getValue('newCaseData');
    console.log('newCaseTimer is ',newCaseTimer);
    if (newCaseTimer && newCaseTimer != '') {
      let parsedJson = JSON.parse(newCaseTimer);
      this.counter = parsedJson.maxTime;
      if (parsedJson.maxTime > 0) {
        let t = new Date(parsedJson.currentTime);
        t.setSeconds(t.getSeconds() + parsedJson.maxTime);
        let currentDate = new Date();
        if (currentDate < t) {
          let dif = t.getTime() - currentDate.getTime();
          let secondsInDifferences = dif / 1000;
          let secondsAbsoluteValue = Math.ceil(secondsInDifferences);
          if (secondsAbsoluteValue > 0) {
            if (secondsAbsoluteValue > parsedJson.maxTime) {
              this.counter = parsedJson.maxTime;
            } else {
              this.counter = secondsAbsoluteValue;
            }
            this.timerSubscription = timer(1000, 1000).pipe(//Initial delay 1 seconds and interval countdown also 1 second
              takeWhile(() => this.counter > 0),
              tap(() => this.counter--)
            ).subscribe(() => {
              this.minute = Math.floor(this.counter / 60);
              this.seconds = this.counter % 60;
              this.hour = Math.floor(this.minute / 60);
              this.minute = this.minute % 60;
              this.hour = this.hour % 24;
              this.timeData = this.counter;
              if (this.counter <= 0) {
                this.removeCaseFromBucket(parsedJson.caseId);
                this.facadeService.openCaseEventArchivedSnackBar('You have exceeded time limit', 'Success');
                //this.myRoute.navigate(['/case-management/case-not-found']);
              }
            });
          }
        }
      }
    }
  }

  removeCaseFromBucket(removeCaseId) {
    let newCaseInfo = AppUtills.getValue('newCaseData');
    if (newCaseInfo && newCaseInfo != '') {
      let parsedJson = JSON.parse(newCaseInfo);
      let case_Id = parsedJson.caseId;
      if (case_Id == removeCaseId && parsedJson.caseEvent == 'SHOW') {
        AppUtills.removeValue('newCaseData');
      }
    }
  }

  ngOnInit() {
    this.permissionIds = PermissionIds;
    if (AppUtills.getValue('user_actor_type') && AppUtills.getValue('user_actor_type') == 'dataExecutive') {
      this.dataExecutive = true;
    } else {
      this.dataExecutive = false;
    }
    if (AppUtills.getValue('actorAvailabilityStatus') && AppUtills.getValue('actorAvailabilityStatus') != '') {
      if (AppUtills.getValue('actorAvailabilityStatus') == 'Available') {
        this.UserAvailableStatus = 'Available';
        //this.breakTime = "Plan a break";
        this.disableStatus = false;
        this.enableStatus = true;
        this.checkedAvailable = true;
      } else {
        this.UserAvailableStatus = 'Break';
        //this.breakTime = '';
        this.checkedAvailable = false;
        this.enableStatus = false;
        this.disableStatus = true;
      }
    }
  }

  toggle(event) {
    if (event.checked) {
      this.UserAvailableStatus = 'Available';
      //this.breakTime = "Plan a break";
      this.disableStatus = false;
      this.enableStatus = true;
      // this.checkedAvailable = true;
    } else {
      this.UserAvailableStatus = 'Break';
      //this.breakTime = '';
      this.enableStatus = false;
      this.disableStatus = true;
      // this.checkedAvailable = false;
    }
    if (AppUtills.getValue('user_actor_type') && AppUtills.getValue('user_actor_type') == 'dataExecutive') {
    this.fetchAvgTimer();
    }
  }

  // ******** fetch timer ************//
  fetchAvgTimer() {
    let userProfileStatus = this.UserAvailableStatus.toUpperCase();
    let availabilityInfo = {
      "availabilityStatus": userProfileStatus
    }
    AppUtills.setValue('actorAvailabilityStatus', this.UserAvailableStatus);
    this.StatusUnsubscription = this.facadeService.onCMPostAPI(apiUrls.availabilityStatus, availabilityInfo).subscribe(res => {
      let data: any;
      if (res) {
        this.ngxService.stop();
        data = res.body || res;
        if (data.statusCode == 200 && data.message) {
          if (data.result.availabilityStatus === "AVAILABLE") {
            this.checkedAvailable = true;
            this.checkedBreak = false;
            this.UserAvailableStatus = 'Available';
          } else {
            this.checkedAvailable = false;
            this.checkedBreak = true;
            this.UserAvailableStatus = 'Break';
          }
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

  ngOnDestroy() {
    this.StatusUnsubscription ? this.StatusUnsubscription.unsubscribe() : '';
    this.timerSubscription ? this.timerSubscription.unsubscribe() : '';
  }

}
