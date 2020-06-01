import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('header') el: ElementRef;
  constructor( ) {   }

  ngAfterViewInit(){
    let headerHeight = this.el.nativeElement.offsetHeight;
    document.getElementById('header-top-height').style.paddingTop = headerHeight+'px';
  }
}