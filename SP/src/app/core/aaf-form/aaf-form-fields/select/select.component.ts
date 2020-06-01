import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
import { MatOption, MatSelect } from '@angular/material';
@Component({
  selector: "app-select", 
  template: `
<mat-form-field class="demo-full-width margin-top" [formGroup]="group" *ngIf="field.visibility">
<mat-select [ngClass]="field.isMultiselect ? 'css-class-1' : 'css-class-2'" [placeholder]="field.label" [name]="field.name" [(ngModel)]="field.value" [formControlName]="field.name" [required]="field.validations" [multiple]="field.isMultiselect">

<ng-container *ngIf="field.isMultiselect;then multiSelectTemplate else simpleSelectTemplate"></ng-container>
<ng-template #multiSelectTemplate>
<mat-option *ngIf="field.isMultiselect" #allSelected (click)="toggleAllSelection()" [value]="0">All</mat-option>
<mat-option (click)="tosslePerOne()" *ngFor="let item of field.options" [value]="item.value">{{item.label}}</mat-option>
</ng-template>
<ng-template #simpleSelectTemplate>
<mat-option *ngFor="let item of field.options" [value]="item.value">{{item.label}}</mat-option>
</ng-template>
</mat-select>
<ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
<mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</mat-form-field>  
`,
  styles: []
})
export class SelectComponent implements OnInit,AfterViewInit  {
  field: FieldConfig;
  group: FormGroup;
  select;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild(MatSelect) set contentSelect(contentSelect: ElementRef) {
    this.select = contentSelect;
  }
  constructor() { 
    
  }
  ngOnInit() { 
    this.getOnchanges();
  }
  getOnchanges(){
    this.group.get(this.field.name).valueChanges.subscribe(
      selectedRoleType => {
        if(this.field.isMultiselect && this.group.get(this.field.name).value && this.group.get(this.field.name).value.length > 0){   
          if(this.group.get(this.field.name).value.indexOf(0) >= 0){    
            this.select.trigger.nativeElement.childNodes[0].innerHTML = '<span>All</span>'; 
          }
          if(this.field.options && this.field.options.length == this.group.get(this.field.name).value.length){
            //this.group.get(this.field.name).value.push(0);
            this.select.trigger.nativeElement.childNodes[0].innerHTML = '<span>All</span>'; 
          }         
        }else{
          if(this.field.isMultiselect && this.select){            
              this.select.trigger.nativeElement.childNodes[0].innerHTML = '';             
          }
        }
      }
    );    
  }
  ngAfterViewInit() {
    
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {      
      if(this.field.options.length > 0){                       
        this.group.get(this.field.name).patchValue([...this.field.options.map(item => item.value), 0]);                  
        this.select.trigger.nativeElement.childNodes[0].innerHTML = '<span>All</span>';  
        this.allSelected.select();     
      }else{
        this.group.get(this.field.name).patchValue([]);
        this.select.trigger.nativeElement.childNodes[0].innerHTML = ''; 
        this.allSelected.deselect();  
      }
      //this.group.get(this.field.name).patchValue([...this.field.options.map(item => item.value), 0]);      
      //this.select.trigger.nativeElement.childNodes[0].innerHTML = '<span>All</span>';      
    } else {      
      this.group.get(this.field.name).patchValue([]);
      this.select.trigger.nativeElement.childNodes[0].innerHTML = '';
    }    
  }
  tosslePerOne() {
    if(this.field.isMultiselect == false){
      return true;
    }
    if (this.allSelected.selected) {            
      this.allSelected.deselect();      
    }
    if (this.group.get(this.field.name).value.length == this.field.options.length) {     
      this.allSelected.select();
    }
    if (this.allSelected.selected) { 
      this.select.trigger.nativeElement.childNodes[0].innerHTML = '<span>All</span>';
    }else{
      let spanStringArray = [];
      let finalSpanString = '';
      let selectedData = this.group.get(this.field.name).value;
      this.field.options.map((optionVal,optionKey)=>{
        if (selectedData.indexOf(optionVal.value) != -1) {           
            spanStringArray.push(optionVal.label);
        }
      });
      if(spanStringArray.length > 0){        
        finalSpanString = spanStringArray.join(','); 
      }
      this.select.trigger.nativeElement.childNodes[0].innerHTML = '<span>'+finalSpanString+'</span>';
    }
  }
}
