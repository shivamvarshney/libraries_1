import { Component, OnInit, Output, EventEmitter, Input, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { SalesService } from '@service/sales-service/sales-service.service';
import { Subscription } from 'rxjs';
import { AppUtills } from '@src/core/utills/appUtills';
import { AppConstants } from '@src/core/utills/constant';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-sidenav-bar',
  templateUrl: './sidenav-bar.component.html',
  styleUrls: ['./sidenav-bar.component.css']
})
export class SidenavBarComponent implements OnInit, OnDestroy {
  public innerWidth;
  userPermission: any;
  public salesList: Array<any> = [];
  public selectedItem: Number | String = "1";
  private transformSubscription: Subscription;
  constructor(private saleService: SalesService, private _route: Router) { }

  @ViewChild('snav') usuarioMenu: MatSidenav;
  closeAllSidenav() {
    this.usuarioMenu.close();
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

  closebar() {

  }


  // ******** Destroy object ******** //
  ngOnDestroy() {
    this.transformSubscription ? this.transformSubscription.unsubscribe() : '';
  }


}
