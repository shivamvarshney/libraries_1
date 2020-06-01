import { Component, OnInit } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { Router } from '@angular/router';

@Component({
  selector: 'supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.scss', '../cm-module.scss']
})
export class SupervisorDashboardComponent implements OnInit {

  ngOnInit() {
    
  }

  constructor(private myRoute: Router){
    if(!AppUtills.checkUserType('supervisor')){
      this.myRoute.navigate(['/case-management/de']);
    }
  }

}
