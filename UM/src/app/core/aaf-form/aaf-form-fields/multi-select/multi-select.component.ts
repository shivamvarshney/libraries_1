import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../fields.interface";


/** @title Fixed size virtual scroll with custom buffer parameters */
@Component({
  selector: "app-multi-select", 
  templateUrl:'multi-select.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent implements OnInit  {
  field: FieldConfig;
  group: FormGroup;
  visibility: boolean = true
  constructor(private cdr: ChangeDetectorRef) { 
    
  }

  ngOnInit() { 
    if(this.field.templateOptions.styles && this.field.templateOptions.styles.isHidden == true){
      this.visibility = false;
    }    
  }
}
