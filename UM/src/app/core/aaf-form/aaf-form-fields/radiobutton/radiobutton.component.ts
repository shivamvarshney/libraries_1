import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../fields.interface";
@Component({
  selector: "app-radiobutton", 
  template: `
<div class="demo-full-width margin-top" *ngIf="visibility" [formGroup]="group">
<mat-label>{{field.templateOptions.label}}</mat-label>
<mat-radio-group [formControlName]="field.templateOptions.name" [id]="field.templateOptions.id">
<mat-radio-button *ngFor="let item of field.templateOptions.options" [value]="item.value">{{item.label}}</mat-radio-button>
</mat-radio-group>
<ng-container *ngFor="let validation of field.validationRules;" ngProjectAs="mat-error">
<mat-error *ngIf="group.get(field.templateOptions.name).touched && group.get(field.templateOptions.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</div>
`,
  styles: []
})
export class RadiobuttonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  visibility: boolean = true;
  constructor() { }
  ngOnInit() {
    if (this.field.templateOptions.styles && this.field.templateOptions.styles.isHidden == true) {
      this.visibility = false;
    }
  }
}
