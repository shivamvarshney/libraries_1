import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { AppConstants } from '@src/core/utills/constant';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-make-agent',
  templateUrl: './make-agent.component.html',
  styleUrls: ['./make-agent.component.css']
})
export class MakeAgentComponent implements OnInit, OnDestroy {

  ifarmeUrl = '';  
  safeUrl: SafeResourceUrl;
  constructor(
    private ngxService: NgxUiLoaderService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {    
    this.ngxService.start();
    let appToken = AppUtills.getValue('token');
    let iframe = 'iframe';
    this.ifarmeUrl = AppConstants.userManagementCreateUserBaseUrl + '?sso-token=' + appToken + '&sso-source=' + iframe + '&sso-client=' +AppConstants.clientId + '&sso-createAgentButtonLabel=' +AppConstants.createAgentButtonLabel + '&sso-serviceId=' +AppConstants.serviceId+ '&sso-createAgentRedirectUrl=' +AppConstants.createAgentRedirectUrl;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.ifarmeUrl);
    this.ngxService.stop();
  } 

  ngOnDestroy() {
    
  }
}
