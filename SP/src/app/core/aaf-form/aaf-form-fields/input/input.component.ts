import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
  selector: "app-input",
  template: `
<mat-form-field class="demo-full-width" [formGroup]="group" *ngIf="field.visibility">
<mat-label>{{field.label}}</mat-label>
<input [id]="field.name" matInput [formControlName]="field.name" [placeholder]="field.placeHolder" [type]="field.inputType" [required]="field.validations">
<ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
<mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</mat-form-field>
`,
  styles: []
})
export class InputComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() { }
  ngOnInit() { }
}
