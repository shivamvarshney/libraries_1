import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModules } from  '@src/core/material.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CardComponent } from './card.component'
import { BulkModule } from '@src/core/bulk/bulk.module';
import { DawnloadModule } from '../download/download.module';
import { TranslateModule} from '@ngx-translate/core';
import { DirectivesModule } from '@src/core/directives/directives.module';
 
@NgModule({ 
  imports: [
    CommonModule,
    MaterialModules,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    BulkModule,
    DawnloadModule,
    TranslateModule,
    DirectivesModule
  ],
  declarations: [
    CardComponent
  ],
  exports: [CardComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [CardComponent]
})
export class CardModule {}
