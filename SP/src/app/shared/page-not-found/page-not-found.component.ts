import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FacadeService } from '@src/core/services/facade.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppUtills } from '@src/core/utills/appUtills';
import { SalesService } from '@service/sales-service/sales-service.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css', '../../shell/sidenav-bar/sidenav-bar.component.css']
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  public innerWidth;
  pageStatus: string;
  pageCommonNum = "4";
  userPermission: any;
  public salesList: Array<any> = [];
  public selectedItem: Number | String = "1";
  private transformSubscription: Subscription;
  showHeader:boolean = true;
  showSideNav:boolean = true;
  constructor(private facadeService: FacadeService, private saleService: SalesService, private _route: Router) { }


  redirectToDefaultPage() {
    this.facadeService.navigateToDefaultLandingModule();
    return true;
  }

  // param id with @output decorator
  gotoProductDetails(currectUrl: string, id: string) {
    this.selectedItem = id;
    this._route.navigate([currectUrl]);
  }
  // window width on resize
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  // opne side menu
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  // close side nav
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  ngOnInit() {
    if (this._route.url === '/unauthorized-page') {
      this.pageStatus = "403";
    }
    else { 
      this.pageStatus = "404" 
    }
    let tokenValue = AppUtills.getValue('ssoSource') ? AppUtills.getValue('ssoSource') : '';
    if(tokenValue == 'iframe'){
      this.showHeader = false;
      this.showSideNav = false;
    }    

    this.innerWidth = window.innerWidth;
    // fetch side nav list from json
    this.transformSubscription = this.saleService.getTranslation().subscribe(res => {
      let data;
      data = res;
      this.salesList = data.side_nav_text;
    });

    // ******** get user role ******** //
    let userRole = JSON.parse(AppUtills.getValue('userData'));
    if (userRole) {
      this.userPermission = userRole.roles;
    }
  }


  // ******** Destroy object ******** //
  ngOnDestroy() {
    this.transformSubscription ? this.transformSubscription.unsubscribe() : '';
  }

}
