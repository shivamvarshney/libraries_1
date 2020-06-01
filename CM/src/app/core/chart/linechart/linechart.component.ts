import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '@service/data-share-service/data.service';

@Component({
  selector: 'linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss']
})
export class LinechartComponent implements OnInit {

  constructor(private dataService: DataService) { }

  @Input() lineDataSet: any;

  ngOnInit() {
    // ********* fetch tab switch events **********//
    this.dataService.listen().subscribe((data: string) => {
      setTimeout(this.ngAfterViewInit, 500);  
      this.ngAfterViewInit();
    });
  }

  ngAfterViewInit() {
    this.lineDataSet.map(dataSetValues => {
      let ctx = (<HTMLCanvasElement>document.getElementById(dataSetValues.id));
      let myChart = new Chart(ctx, {
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
    });
  }
}
