import { Component, OnInit } from '@angular/core';
import { DataService } from '@service/data-share-service/data.service';

@Component({
  selector: 'data-executive-dashboard',
  templateUrl: './data-executive-dashboard.component.html',
  styleUrls: ['./data-executive-dashboard.component.scss']
})
export class DataExecutiveDashboardComponent implements OnInit {

  acceptUserData: any;
  timerToggleOnAccept:boolean = true;

  // ******** Timer ********//
  interval;
  max: number = 30;
  current: number = 30;
  color: String = "#FF0000";
  // ******** Timer ********//

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // ********* fetch tab switch events **********//
    this.dataService.listen().subscribe((data: string) => {
      this.timerToggleOnAccept = true;
      clearInterval(this.interval);
      this.current = 30;
      this.timerCountDown();
    });
    this.timerCountDown();

    // *************** Tabel data *************** //
    this.acceptUserData = [
      { 
        "caseId" : "56748902453678167345", 
        "accNo": "9876543122", 
        "name": "Airi Satou", 
        "type":"Agent", 
        "createdOn":"01/04/2019", 
        "createdTime": "9:30 pm", 
        "businessLine":"KYC CM", 
        "caseType":"New", 
        "modufyBy":"Created by: Jacob ( 9873567289)" 
      }
    ]
  }

  // *********** Timer Count Down **********//
  timerCountDown() {
    this.interval = setInterval(() => {
      this.current <= 1 ? (clearInterval(this.interval), console.log('Times Up, Assign to someone')) : '';
      this.current > this.max ? this.current = 0 : this.current--;
    }, 1000);
  }

   // *********** onAcceptHandler **********//
  onAcceptHandler() {
    this.timerToggleOnAccept = false;
  }

  // *********** OnDeclineHandler **********//
  OnDeclineHandler() {
    alert('Case Decline');
  }
}
