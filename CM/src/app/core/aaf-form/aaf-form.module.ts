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
import { AafFormFieldDirective } from "./aaf-form-field.directive";
import { AafFormComponent } from "./aaf-form.component";
import { NgxUiLoaderModule } from 'ngx-ui-loader';
  
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModules,
    NgxUiLoaderModule
  ],
  declarations: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    AafFormFieldDirective,
    AafFormComponent
  ],
  entryComponents: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent
  ],
  exports: [AafFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class AafFormModule { }
