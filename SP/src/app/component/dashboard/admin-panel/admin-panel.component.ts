import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  searchForm: FormGroup; 
  trueValue: boolean = true;
  constructor( private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }
}
