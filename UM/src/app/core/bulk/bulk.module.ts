import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModules } from  '@src/core/material.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { BulkComponent } from './bulk.component';
import { BulkUploadDialogService } from './bulk-upload-dialog/bulk-upload-dialog.service';
import { BulkUploadDialogComponent } from './bulk-upload-dialog/bulk-upload-dialog.component';
import { BulkCOnfirmationComponent } from './bulk-confirmation/bulk-confirmation.component';
import { BulkConfirmationDialogService } from './bulk-confirmation/bulk-confirmation.service';
import { TranslateModule} from '@ngx-translate/core';

@NgModule({ 
  imports: [
    CommonModule, 
    MaterialModules,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    TranslateModule   
  ],
  declarations: [
    BulkComponent,
    BulkUploadDialogComponent,
    BulkCOnfirmationComponent
  ],
  providers:[
    BulkUploadDialogService,
    BulkConfirmationDialogService
  ],
  exports: [BulkComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    BulkComponent,
    BulkUploadDialogComponent,
    BulkCOnfirmationComponent
  ]
})
export class BulkModule {}
