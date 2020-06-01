import { Component, OnInit } from '@angular/core';
import { DataService } from '@service/data-share-service/data.service';

@Component({
  selector: 'app-case-mngmnt',
  templateUrl: './case-mngmnt.component.html',
  styleUrls: ['./case-mngmnt.component.scss']  
})
export class CaseMngmntComponent implements OnInit {

  color = 'accent';
  checked1 = true;
  checked2 = false;
  disabled = false;
  constructor( private dataService: DataService ) { }

  ngOnInit() {
  }

  onLinkClick(event) {
    this.dataService.resetTimerData(event);
  }

}
