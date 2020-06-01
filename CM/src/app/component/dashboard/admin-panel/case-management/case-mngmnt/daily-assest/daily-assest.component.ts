import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '@service/data-share-service/data.service';

@Component({
  selector: 'daily-graphs-assessts',
  templateUrl: './daily-assest.component.html',
  styleUrls: ['./daily-assest.component.css']
})
export class DailyAssestComponent implements OnInit {  

  constructor(private dataService: DataService) { }

  ngAfterViewInit() {
    
  }

  ngOnInit() {
    
    // *********** bar chart **********//
    var ctx = (<HTMLCanvasElement>document.getElementById('dailyTotalCasePieChart'));
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
    var ctx = (<HTMLCanvasElement>document.getElementById('dailyApprovedLineChart'));
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
    var ctx = (<HTMLCanvasElement>document.getElementById('dailyRejectedLineChart'));
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
}
