import { Component, OnInit, HostListener } from '@angular/core';
import { FacadeService } from '../services/facade.service';
import { AppUtills } from '../utills/appUtills';
import { Subscription } from 'rxjs';
import { SalesService } from '@service/sales-service/sales-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-not-found',
  templateUrl: './case-not-found.component.html',
  styleUrls: ['./case-not-found.component.scss', '../../shell/sidenav-bar/sidenav-bar.component.css', '../../shared/page-not-found/page-not-found.component.css']
})
export class CaseNotFoundComponent implements OnInit {

  public innerWidth;
  pageStatus: string = "Case not found";
  pageCommonNum = "4";
  userPermission: any;
  public salesList: Array<any> = [];
  public selectedItem: Number | String = "1";
  private transformSubscription: Subscription;
  showHeader: boolean = true;
  showSideNav: boolean = true;
  constructor(private facadeService: FacadeService,
    private saleService: SalesService, private _route: Router) { }


  redirectToDefaultPage() {
    this.facadeService.navigateToDefaultLandingModule();
    return true;
  }

  // param id with @output decorator
  gotoProductDetails(currectUrl: string, id: string) {
    this.selectedItem = id;
    this._route.navigate([currectUrl]);
  }

  ngOnInit() {
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
