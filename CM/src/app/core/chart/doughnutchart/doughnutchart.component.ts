import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '@service/data-share-service/data.service';

@Component({
  selector: 'doughnutchart',
  templateUrl: './doughnutchart.component.html',
  styleUrls: ['./doughnutchart.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoughnutchartComponent implements OnInit {

  constructor(private dataService: DataService) { }
  @Input() droughtDataSet: any;

  ngOnInit() {
      // ********* fetch tab switch events **********//
      this.dataService.listen().subscribe((data: string) => {
      setTimeout(this.ngAfterViewInit, 500); 
        this.ngAfterViewInit();
      });
    }

    ngAfterViewInit() {
      this.droughtDataSet.map(dataSetValues => {
        let ctx = (<HTMLCanvasElement>document.getElementById(dataSetValues.id));
        let myChart = new Chart(ctx, {
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
      });
  }
}
