import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { AppConstants } from '@src/core/utills/constant';
import { SalesService } from '@service/sales-service/sales-service.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
 
@Component({
  selector: 'app-iframes',
  templateUrl: './iframes.component.html',
  styleUrls: ['./iframes.component.css']
})
export class IframesComponent implements OnInit, OnDestroy {

  ifarmeUrl = '';
  safeUrl: SafeResourceUrl;
  paramUnsubscribe: Subscription;
  iframensubscribe: Subscription;
  constructor(
    private ngxService: NgxUiLoaderService,
    private saleService: SalesService,
    private activatedRoutes: ActivatedRoute,
    public sanitizer: DomSanitizer) { }

  myLoadEvent() {

  }

  ngOnInit() {
    let type = '';
    this.ngxService.start();
    this.paramUnsubscribe = this.activatedRoutes.params.subscribe((params: Params) => {
      if (params.type) {
        type = params.type;
        this.iframensubscribe = this.saleService.getTranslation().subscribe(res => {
          let data;
          data = res;
          let appToken = AppUtills.getValue('token');          
          data.side_nav_text.map((navInfo, navKey) => {
            if (navInfo.externalData == type) {
              this.ifarmeUrl = AppConstants.userManagementBaseUrl + navInfo.externalFor + '?sso-token=' + appToken + '&sso-source=' + AppConstants.umDestination + '&sso-client=' +AppConstants.clientId + '&sso-serviceId=' +AppConstants.serviceId;
              this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.ifarmeUrl);
              this.ngxService.stop();
            }
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.paramUnsubscribe ? this.paramUnsubscribe.unsubscribe() : '';
    this.iframensubscribe ? this.iframensubscribe.unsubscribe() : '';
  }

}
