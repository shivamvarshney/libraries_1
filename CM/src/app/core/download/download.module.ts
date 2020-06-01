import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModules } from  '@src/core/material.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DownloadtemplateComponent } from './downloadtemplate/downloadtemplate.component';
import { TranslateModule} from '@ngx-translate/core';

@NgModule({ 
  imports: [
    CommonModule,
    MaterialModules,
    NgxUiLoaderModule,
    TranslateModule   
  ],
  declarations: [
    DownloadtemplateComponent
  ],
  exports: [DownloadtemplateComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [DownloadtemplateComponent]
})
export class DawnloadModule {}
