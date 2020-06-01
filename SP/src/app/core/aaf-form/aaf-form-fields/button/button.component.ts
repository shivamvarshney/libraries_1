import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface"; 
import { Location } from '@angular/common';
import { DataService } from '@service/data-share-service/data.service';
@Component({
  selector: "app-button",
  template: `
<div [ngClass]="['demo-full-width','margin-top',field.class]" [formGroup]="group">
<button (click)="reset(field.clear)" [type]="field.buttonType" color="primary" class="choose_file">{{field.label}}</button>
</div>
`,
  styles: []
})
export class ButtonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor(private _location: Location, private dataService:DataService) {}
  ngOnInit() {}

  reset(check){
    if(check == 'reset'){      
      const articles = document.querySelectorAll('.css-class-1');
      articles.forEach((val,key) => {
        if(val.classList.contains('mat-select')){
          if(val.children && val.children[0]){
            if(val.children[0].classList.contains('mat-select-trigger')){
              if(val.children[0].children && val.children[0].children[0]){
                if(val.children[0].children[0].classList.contains('mat-select-value')){                  
                  document.querySelectorAll('.css-class-1 .mat-select-value')[key].innerHTML = '';
                  document.querySelectorAll('.css-class-1 .mat-select-value')[key].textContent = '';   
                }
              }
            }            
          }
        }        
      });       
      this.group.reset();  
      this.doubleReset();    
    }else if(check == 'cancel'){
      this.backClicked();
    }    
  }

  doubleReset(){
    const articles = document.querySelectorAll('.css-class-1');
      articles.forEach((val,key) => {
        if(val.classList.contains('mat-select')){
          if(val.children && val.children[0]){
            if(val.children[0].classList.contains('mat-select-trigger')){
              if(val.children[0].children && val.children[0].children[0]){
                if(val.children[0].children[0].classList.contains('mat-select-value')){                  
                  document.querySelectorAll('.css-class-1 .mat-select-value')[key].innerHTML = '';
                  document.querySelectorAll('.css-class-1 .mat-select-value')[key].textContent = '';   
                }
              }
            }            
          }
        }        
      });        
      this.group.reset();
  }

  backClicked(): void {
    this._location.back();
  }
} 
