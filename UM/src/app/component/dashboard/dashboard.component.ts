import { Component, ElementRef, ViewChild, AfterViewInit,OnInit } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit,OnInit {
  @ViewChild('header') el: ElementRef;
  showHeader:boolean = true;
  constructor( ) {   }

  ngOnInit() {
    let tokenValue = AppUtills.getValue('ssoSource') ? AppUtills.getValue('ssoSource') : '';
    if(tokenValue == 'iframe'){
      this.showHeader = false;
    }
  }

  ngAfterViewInit(){
    if(this.showHeader){
      let headerHeight = this.el.nativeElement.offsetHeight;
      document.getElementById('header-top-height').style.paddingTop = headerHeight+'px';
    }
  }
}