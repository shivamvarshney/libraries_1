import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppUtills } from '../utills/appUtills';
import { FacadeService } from '../services/facade.service';
import { timer, Subscription } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'case-activity-timer',
  templateUrl: './case-activity-timer.component.html',
  styleUrls: ['./case-activity-timer.component.scss']
})
export class CaseActivityTimerComponent implements OnInit, OnDestroy {
  
  counter = 0;
  timeData: number;
  hour: any;
  minute: any;
  seconds: any;

  @Input() showTimer: boolean;
  timerSubscription: Subscription;

  constructor(
    private facadeService: FacadeService
  ) { }


  ngOnInit() {
    //console.log('Shivam varshney', this.showTimer);
    if (this.showTimer) {
      this.updateTimer();
    }
  }

  updateTimer() {
    let newCaseTimer = AppUtills.getValue('newCaseData');
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
              this.seconds.toString().length == '1' ? (this.seconds = '0' + this.seconds.toString()) : '';
              this.hour = Math.floor(this.minute / 60);
              this.minute = this.minute % 60;
              this.minute.toString().length == '1' ? (this.minute = '0' + this.minute.toString()) : '';
              this.hour = this.hour % 24;
              this.hour.toString().length == '1' ? (this.hour = '0' + this.hour.toString()) : '';
              this.timeData = this.counter;
              //console.log('this.seconds is ', this.seconds, ' this.counter is ', this.counter);
              if (this.counter <= 0) {
                //this.removeCaseFromBucket(parsedJson.caseId);
                //this.facadeService.openCaseEventArchivedSnackBar('Case Time has been exceed', 'Success');
                this.removeCaseFromBucket(parsedJson.caseId);
                this.timerSubscription.unsubscribe();
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

  ngOnDestroy() {
    this.timerSubscription ? this.timerSubscription.unsubscribe() : '';
  }
}
