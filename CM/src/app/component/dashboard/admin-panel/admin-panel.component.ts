import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationsService } from '@service/sse/notifications.service';
import { FacadeService } from '@src/core/services/facade.service';
import { AppConstants } from '@src/core/utills/constant';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  searchForm: FormGroup; 
  trueValue: boolean = true;
  eventData:any;
  showInfo : boolean = false;
  constructor( 
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }
} 
