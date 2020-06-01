import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../fields.interface";
@Component({
  selector: "app-input",
  template: `
<mat-form-field class="demo-full-width" [formGroup]="group" *ngIf="visibility">
<mat-label>{{field.templateOptions.label}}</mat-label>
<input [name]="field.templateOptions.name" [id]="field.templateOptions.id" matInput [formControlName]="field.templateOptions.name" [placeholder]="field.templateOptions.placeHolder" type="text">
<ng-container *ngFor="let validation of field.validationRules;" ngProjectAs="mat-error">
<mat-error *ngIf="group.get(field.templateOptions.name).touched && group.get(field.templateOptions.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</mat-form-field>
`,
  styles: []
})
export class InputComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  visibility:boolean = true;
  constructor() { }
  ngOnInit() { 
    if(this.field.templateOptions.styles && this.field.templateOptions.styles.isHidden == true){
      this.visibility = false;
    }
  }
}
