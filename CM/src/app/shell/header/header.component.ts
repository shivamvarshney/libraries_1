import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtills } from '@src/core/utills/appUtills';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { FacadeService } from '@src/core/services/facade.service';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public getApiURLs;
  public error;
  public innerWidth;
  public rootURL: string;
  userInformation: any;
  public tokenObj;
  logoutUnsubscription: Subscription;
  offlineSubscription:Subscription;
  constructor
    (private _router: Router,
      private ngxService: NgxUiLoaderService,
      private facadeService: FacadeService) { }

  ngOnInit() {
    this.rootURL = window.location.hash;
    this.innerWidth = window.innerWidth;
    this.tokenObj = AppUtills.getValue('token');
    this.userInformation = JSON.parse(AppUtills.getValue('userData'));
  }

  // window width on resize
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  offlineAcotr() {      
    let availabilityInfo = {      
      "availabilityStatus": 'OFFLINE'
    }
    this.offlineSubscription = this.facadeService.onCMPostAPI(apiUrls.availabilityStatus, availabilityInfo).subscribe(res => {
              
    });
    return true;
  }

  checkActionPermission() {     
    if (this.facadeService.validateSpecificPermission(PermissionIds.AVAILABILITY_STATUS_CHANGE)) {
      return true;
    }
    return false;
  }
  
  // logout API
  logout() {    
    this.ngxService.start();
    if (AppUtills.checkUserType('dataExecutive') && this.checkActionPermission()) {
      this.offlineAcotr();
    }
    this.logoutUnsubscription = this.facadeService.onPostAPI(apiUrls.logout, {}).subscribe(
      res => {        
        let data: any;
        if (res) {          
          this.ngxService.stop();
          AppUtills.removeValues();
          this._router.navigate(['/login']);
        }
      }, error => {
        this.ngxService.stop();
        if(AppUtills.showErrorMessage(error)){
          this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message: 'Something went wrong'), 'Retry');
        }
        AppUtills.removeValues();
        this._router.navigate(['/login']);              
      },
      ()=>{
        this.ngxService.stop();
      }
      );
  }

  ngOnDestroy() {
    this.logoutUnsubscription ? this.logoutUnsubscription.unsubscribe() : '';
  }
}
