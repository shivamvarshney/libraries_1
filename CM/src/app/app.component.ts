import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { AppUtills } from './core/utills/appUtills';
import { NotificationsService } from '@service/sse/notifications.service';
import { FacadeService } from './core/services/facade.service';
import { Router } from '@angular/router';
import { Howl, Howler } from 'howler';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  config: NgxUiLoaderConfig;
  notification: Subscription;
  sound = new Howl({
    src: ['../assets/images/beep.mp3']
  });

  constructor(
    private ngxUiLoaderService: NgxUiLoaderService,
    private translate: TranslateService,
    private notifications: NotificationsService,
    private facadeService: FacadeService,
    private myRoute: Router
  ) {
    this.config = this.ngxUiLoaderService.getDefaultConfig();
    translate.setDefaultLang('en'); // fr
  }

  // translation
  useLanguage(language: string) {
    this.translate.use(language);
  }

  redirectTo(uri) {
    this.myRoute.navigateByUrl('/', { skipLocationChange: true }).then(
      () => this.myRoute.navigate(['/case-management/case/kyc/' + uri])
    );
  }

  ngOnInit() {
    //console.log(this.myRoute.url)
    //if (this.facadeService.isLoggedIn()) {
      // this.notifications.getServerSentEvents().subscribe(data => {
      //   this.handleEvents(data);
      // });
    //}
  }
  private handleEvents(data: any) {
    if (data && data.data) {
      console.log('data.data is ', data.data);
      let loggedInUserInfo = JSON.parse(AppUtills.getValue('userData'));
      let parsedJson = JSON.parse(data.data);
      if (parsedJson && parsedJson.actor && parsedJson.actor.userName && loggedInUserInfo && loggedInUserInfo.username && parsedJson.actor.userName == loggedInUserInfo.username && parsedJson.caseId) {
        console.log('parsedJson.actor.userName is ', parsedJson.actor.userName, ' loggedInUserInfo.username is ', loggedInUserInfo.username);
        console.log('parsedJson.caseId is ', parsedJson.caseId);
        console.log('parsedJson.visiblityType is ', parsedJson.visiblityType, ' and parsedJson.assignmentType is ', parsedJson.assignmentType);
        if (parsedJson.visiblityType == 'HIDE' && parsedJson.assignmentType == 'SUPERVISOR') {
          let caseInfo = AppUtills.getValue('newCaseData');
          console.log('caseInfo is ', caseInfo);
          if (caseInfo && caseInfo != '') {
            let storageParsedJson = JSON.parse(caseInfo);
            console.log('storageParsedJson.caseId is ', storageParsedJson.caseId, ' and parsedJson.caseId is ', parsedJson.caseId);
            if (storageParsedJson.caseId == parsedJson.caseId) {
              AppUtills.removeValue('newCaseData');
              this.facadeService.openCaseEventArchivedSnackBar('Case has been removed.', 'Success');
              this.myRoute.navigate(['/case-management/']);
            }
          }
        }
        else if (parsedJson.visiblityType == 'SHOW') {
          this.sound.play();
          Howler.volume(0.5);
          let newCaseInfo = {
            caseId: parsedJson.caseId,
            currentTime: new Date(),
            maxTime: parsedJson.timeInMilli / 1000,
            caseEvent: 'SHOW'
          };
          let stringifyString = JSON.stringify(newCaseInfo);
          let showCaseInfo = AppUtills.getValue('newCaseData');
          console.log('caseInfo is ', showCaseInfo);
          if (showCaseInfo && showCaseInfo != '') {
            let showStorageParsedJson = JSON.parse(showCaseInfo);
            console.log('storageParsedJson.caseId is ', showStorageParsedJson.caseId, ' and parsedJson.caseId is ', parsedJson.caseId);
            if (showStorageParsedJson.caseId != parsedJson.caseId) {
              AppUtills.removeValue('newCaseData');
              AppUtills.setValue('newCaseData', stringifyString);
              this.redirectTo(parsedJson.caseId);
              //this.myRoute.navigate(['/case-management/case/kyc/' + parsedJson.caseId]);
              this.facadeService.openCaseEventArchivedSnackBar('New Case has been assigned.', 'Success');
            }
          }
          else {
            AppUtills.setValue('newCaseData', stringifyString);
            this.redirectTo(parsedJson.caseId);
            //this.myRoute.navigate(['/case-management/case/kyc/' + parsedJson.caseId]);
            this.facadeService.openCaseEventArchivedSnackBar('New Case has been assigned.', 'Success');
          }
        }
      }
    }
  }

  ngOnDestroy() {
    this.notification ? this.notification.unsubscribe() : '';
  }
}
