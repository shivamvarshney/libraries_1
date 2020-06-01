import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActionsConfig } from "../../fields.interface"; 
import { Location } from '@angular/common';
import { DataService } from '@service/data-share-service/data.service';
import { Router } from '@angular/router';
@Component({
  selector: "app-button",
  template: `
<div [ngClass]="['demo-full-width','margin-top']" [formGroup]="group">
<button [type]="action.type" color="primary" class="choose_file">{{action.label}}</button>
</div>
`,
  styles: []
})
export class ButtonComponent implements OnInit {
  action: ActionsConfig;
  group: FormGroup;
  constructor(private _location: Location, private dataService:DataService,private _router: Router) {}
  ngOnInit() {}

} 
