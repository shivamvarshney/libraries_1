import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtills } from '@src/core/utills/appUtills';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { FacadeService } from '@src/core/services/facade.service';

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

  // logout API
  logout() {    
    this.ngxService.start();
    this.logoutUnsubscription = this.facadeService.onPostAPI(apiUrls.logout, {}).subscribe(
      res => {        
        let data: any;
        if (res) {          
          this.ngxService.stop();
          AppUtills.removeValues();
          this._router.navigate(['/login']);
        }
      }, error => {
        this.error = error;
        this.ngxService.stop();
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
