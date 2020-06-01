import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './format-datepicker';


@Component({
  selector: "app-date",
  template: `<mat-form-field class="demo-full-width margin-top" [formGroup]="group" *ngIf="field.visibility">
  <mat-label>{{field.label}}</mat-label>
  <input [min]="field.minDate" readonly [max]="field.maxDate" matInput [placeholder]="field.placeHolder" [matDatepicker]="datepickerRef" [formControlName]="field.name" [required]="field.validations"/>
  <mat-datepicker-toggle [for]="datepickerRef" matSuffix></mat-datepicker-toggle>
  <mat-datepicker #datepickerRef></mat-datepicker>
  <mat-hint></mat-hint>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
  <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
  </mat-form-field>`,
  styles: [] 
})
export class DateComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() { }
  ngOnInit() { }
}