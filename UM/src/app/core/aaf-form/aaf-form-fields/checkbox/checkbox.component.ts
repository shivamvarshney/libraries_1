import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../fields.interface";
@Component({
  selector: "app-checkbox",
  template: `
<div class="demo-full-width margin-top" *ngIf="visibility" [formGroup]="group">
<mat-checkbox [name]="field.templateOptions.name" [id]="field.templateOptions.id" [formControlName]="field.templateOptions.name">{{field.templateOptions.label}}</mat-checkbox>
<ng-container *ngFor="let validation of field.validationRules;" ngProjectAs="mat-error">
<mat-error *ngIf="group.get(field.templateOptions.name).touched && group.get(field.templateOptions.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</div>
`,
  styles: []
})
export class CheckboxComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  visibility:boolean = true;
  constructor() {}
  ngOnInit() {
    if(this.field.templateOptions.styles && this.field.templateOptions.styles.isHidden == true){
      this.visibility = false;
    }
  }
}
