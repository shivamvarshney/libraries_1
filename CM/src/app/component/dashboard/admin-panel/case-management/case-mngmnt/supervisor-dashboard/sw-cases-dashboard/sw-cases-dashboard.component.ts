import { Component, OnInit, AfterViewInit, Inject, Renderer2 } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations'
import { DataService } from '@service/data-share-service/data.service';
import { Chart } from 'chart.js';
import { DOCUMENT } from '@angular/common';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HandleCommonApiService } from '@service/common-api-service/handle-common-api.service';
import { AppUtills } from '@src/core/utills/appUtills';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'sw-cases-dashboard',
  templateUrl: './sw-cases-dashboard.component.html',
  styleUrls: ['./sw-cases-dashboard.component.scss', '../../cm-module.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1000 )
      ]),
      transition(':leave',
        animate(1000, style({opacity: 0})))
    ])
  ]
})
export class SwCasesDashboardComponent implements OnInit, AfterViewInit {

  color = 'accent';
  checked1 = true;
  checked2 = false;
  disabled = false;
  dailyTime = 'daily';
  componentRef: any;

  daily: true;
  weekly: false;
  monthly: false;
  currectSelectedTab: any = 'daily';
  PIds:any;
  constructor(
    private dataService: DataService,
    @Inject(DOCUMENT) private document: Document,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private renderer: Renderer2,
    private commonApiService: HandleCommonApiService
  ) { }

  ngOnInit() {
    this.PIds = PermissionIds;
    if(this.checkListingPermission()){
      this.userRejectActionHandler();
      this.commonApiService.getMasterDataOfTOC();
    }
  }

  checkListingPermission() {
    if (this.facadeService.validateSpecificPermission(PermissionIds.LISTING_OF_CASE)) {
      return true;
    }
    return false;
  }

  onLinkClick(event) {
    this.dataService.resetTimerData(event);
  }

  userActiveTab(event: any, newValue: string) {
    this.currectSelectedTab = newValue;
  }

  userRejectActionHandler() {
    this.commonApiService.userRejectActionHandler();
  }

  ngAfterViewInit() {
    let ctxDaily = (<HTMLCanvasElement>document.getElementById('daily_drought_chart'));
    let myChartDaily = new Chart(ctxDaily, {
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
    let ctxDailyTotalCases = (<HTMLCanvasElement>document.getElementById('ctxDailyTotalCases'));
    let myChartctxDailyTotalCases = new Chart(ctxDailyTotalCases, {
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
    let ctxDailyApprovedCases = (<HTMLCanvasElement>document.getElementById('ctxDailyApprovedCases'));
    let myChartctxDailyApprovedCases = new Chart(ctxDailyApprovedCases, {
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
    let ctxDailyRejectedCases = (<HTMLCanvasElement>document.getElementById('ctxDailyRejectedCases'));
    let myChartctxDailyRejectedCases = new Chart(ctxDailyRejectedCases, {
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

    let ctxWeekly = (<HTMLCanvasElement>document.getElementById('weekly_drought_chart'));
    let myChartWeekly = new Chart(ctxWeekly, {
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
    let ctxWeeklyTotalCases = (<HTMLCanvasElement>document.getElementById('ctxWeeklyTotalCases'));
    let myChartctxWeeklyTotalCases = new Chart(ctxWeeklyTotalCases, {
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
    let ctxWeeklyApprovedCases = (<HTMLCanvasElement>document.getElementById('ctxWeeklyApprovedCases'));
    let myChartctxWeeklyApprovedCases = new Chart(ctxWeeklyApprovedCases, {
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
    let ctxWeeklyRejectedCases = (<HTMLCanvasElement>document.getElementById('ctxWeeklyRejectedCases'));
    let myChartctxWeeklyRejectedCases = new Chart(ctxWeeklyRejectedCases, {
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

    let ctxMonthly = (<HTMLCanvasElement>document.getElementById('monthly_drought_chart'));
    let myChartMonthly = new Chart(ctxMonthly, {
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
    let ctxMonthlyTotalCases = (<HTMLCanvasElement>document.getElementById('ctxMonthlyTotalCases'));
    let myChartctxMonthlyTotalCases = new Chart(ctxMonthlyTotalCases, {
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
    let ctxMonthlyApprovedCases = (<HTMLCanvasElement>document.getElementById('ctxMonthlyApprovedCases'));
    let myChartctxMonthlyApprovedCases = new Chart(ctxMonthlyApprovedCases, {
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
    let ctxMonthlyRejectedCases = (<HTMLCanvasElement>document.getElementById('ctxMonthlyRejectedCases'));
    let myChartctxMonthlyRejectedCases = new Chart(ctxMonthlyRejectedCases, {
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

  }

}
