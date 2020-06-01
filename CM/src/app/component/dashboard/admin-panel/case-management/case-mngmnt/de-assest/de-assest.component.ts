import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '@service/data-share-service/data.service';

@Component({
  selector: 'de-graphs-assest',
  templateUrl: './de-assest.component.html',
  styleUrls: ['./de-assest.component.css']
})
export class DeAssestComponent implements OnInit {

  acceptUserData: any;
  timerToggleOnAccept: boolean = true;

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
      setTimeout(this.ngAfterViewInit, 500);
      this.ngAfterViewInit();
      this.timerToggleOnAccept = true;
      clearInterval(this.interval);
      this.current = 30;
      this.timerCountDown();
    });
    this.timerCountDown();

    // *************** Tabel data *************** //
    this.acceptUserData = [
      {
        "caseId": "56748902453678167345",
        "accNo": "9876543122",
        "name": "Airi Satou",
        "type": "Agent",
        "createdOn": "01/04/2019",
        "createdTime": "9:30 pm",
        "businessLine": "KYC CM",
        "caseType": "New",
        "modufyBy": "Created by: Jacob ( 9873567289)"
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

  ngAfterViewInit() {
    // *********** bar chart **********//
    var ctx = (<HTMLCanvasElement>document.getElementById('totalCasePieChart'));
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Approved',
          'Rejected'
        ],
        datasets: [
          { data: [80, 40], backgroundColor: ['#EA6061', '#B85C9E'] },
        ]
      }
    });

    // *********** Line chart 1 **********//
    var ctx = (<HTMLCanvasElement>document.getElementById('approvedLineChart'));
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
        datasets: [
          {
            label: "Approved Cases",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(234, 96, 97, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            data: [15, 29, 10, 20, 36],
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 10
            }
          }]
        }
      }
    });

    // *********** Line chart 2 **********//
    var ctx = (<HTMLCanvasElement>document.getElementById('rejectedLineChart'));
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
        datasets: [
          {
            label: "Rejected Cases",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(184, 92, 158, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            data: [15, 29, 10, 20, 36],
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 10
            }
          }]
        }
      }
    });
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
