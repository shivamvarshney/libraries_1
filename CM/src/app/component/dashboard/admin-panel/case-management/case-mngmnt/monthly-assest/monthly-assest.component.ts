import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '@service/data-share-service/data.service';

@Component({
  selector: 'monthly-graphs-assest',
  templateUrl: './monthly-assest.component.html',
  styleUrls: ['./monthly-assest.component.css']
})
export class MonthlyAssestComponent implements OnInit {

  constructor(private dataService: DataService) { }

/*
  ngOnInit() {
    this.dataService.listen().subscribe((data: string) => {
      setTimeout(this.ngAfterViewInitTest, 500);
      this.ngAfterViewInitTest();
    });
  }
*/
  ngOnInit() {
    

    
  }

}
