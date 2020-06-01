import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModules } from  '@src/core/material.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AafGridComponent } from './aaf-grid/aaf-grid.component';
import { AafModalComponent } from './aaf-modals/aaf-modal.component';
import { AafModelService} from './aaf-modals/aaf-modal.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule} from '@ngx-translate/core';
import { DirectivesModule } from '@src/core/directives/directives.module';

@NgModule({ 
  imports: [
    CommonModule,
    MaterialModules,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    NgxPaginationModule,
    TranslateModule,
    DirectivesModule
  ],
  declarations: [
    AafModalComponent,
	  AafGridComponent
  ],
  exports: [AafModalComponent,AafGridComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [AafModelService],
  entryComponents: [AafModalComponent]
})
export class AafCoreModule {}
