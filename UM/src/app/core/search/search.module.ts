import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModules } from  '@src/core/material.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SearchComponent } from './search.component';

 
@NgModule({ 
  imports: [
    CommonModule,
    MaterialModules,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule
  ],
  declarations: [
   SearchComponent
  ],
  exports: [
    SearchComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    SearchComponent
  ]
})
export class SearchModule {}
