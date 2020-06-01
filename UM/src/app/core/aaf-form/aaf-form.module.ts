import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// components
import { MaterialModules } from "@src/core/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "./aaf-form-fields/input/input.component";
import { ButtonComponent } from "./aaf-form-fields/button/button.component";
import { SelectComponent } from "./aaf-form-fields/select/select.component";
import { DateComponent } from "./aaf-form-fields/date/date.component";
import { RadiobuttonComponent } from "./aaf-form-fields/radiobutton/radiobutton.component";
import { CheckboxComponent } from "./aaf-form-fields/checkbox/checkbox.component";
import { MultiSelectComponent } from './aaf-form-fields/multi-select/multi-select.component';
import { MultiCheckboxComponent } from './aaf-form-fields/multi-checkbox/multi-checkbox.component';
import { AafFormFieldDirective } from "./aaf-form-field.directive";
import { AafFormActionsDirective } from './aaf-form-actions.directive';
import { OtherButtonComponent } from './aaf-form-fields/button/other-button.component';
import { ResetButtonComponent } from './aaf-form-fields/button/reset-button.component';
import { AafFormComponent } from "./aaf-form.component";
import { NgxUiLoaderModule } from 'ngx-ui-loader'; 
import { ScrollingModule } from '@angular/cdk/scrolling';
  
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModules,
    NgxUiLoaderModule,
    ScrollingModule
  ],
  declarations: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    AafFormFieldDirective,
    AafFormComponent,
    MultiSelectComponent,
    AafFormActionsDirective,
    ResetButtonComponent,
    OtherButtonComponent,
    MultiCheckboxComponent
  ],
  entryComponents: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    MultiSelectComponent,
    ResetButtonComponent,
    OtherButtonComponent,
    MultiCheckboxComponent
  ],
  exports: [AafFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class AafFormModule { }
