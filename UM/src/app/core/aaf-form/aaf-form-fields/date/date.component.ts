import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../fields.interface";

@Component({
  selector: "app-date",
  template: `<mat-form-field class="demo-full-width margin-top" [formGroup]="group" *ngIf="visibility">
  <mat-label>{{field.templateOptions.label}}</mat-label>
  <input [name]="field.templateOptions.name" [min]="field.templateOptions.minDate" readonly [max]="field.templateOptions.maxDate" [id]="field.templateOptions.id" matInput [formControlName]="field.templateOptions.name" [placeholder]="field.templateOptions.placeHolder" [matDatepicker]="datepickerRef">
  <mat-datepicker-toggle [for]="datepickerRef" matSuffix></mat-datepicker-toggle>
  <mat-datepicker #datepickerRef></mat-datepicker>
  <mat-hint></mat-hint>
  <ng-container *ngFor="let validation of field.validationRules;" ngProjectAs="mat-error">
  <mat-error *ngIf="group.get(field.templateOptions.name).touched && group.get(field.templateOptions.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
  </mat-form-field>`,
  styles: []  
})
export class DateComponent implements OnInit {
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