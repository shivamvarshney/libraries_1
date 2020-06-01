import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppUtills } from '@src/core/utills/appUtills';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'] 
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup; 
  showSideNav:boolean = true;
  constructor( private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
    let tokenValue = AppUtills.getValue('ssoSource') ? AppUtills.getValue('ssoSource') : '';
    if(tokenValue == 'iframe'){
      this.showSideNav = false;
    }
  }

  ngAfterViewInit(){
    //document.getElementById('header-avail-height').style.height = window.innerHeight-71+'px';
  }

  searchBar(searchForm: any) {
    
  }

}
