import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CoreAirtelAfricaComponent } from './core-airtel-africa.component';
import { AafModalComponent } from './aaf-modal/aaf-modal.component';
import { AafGridComponent } from './aaf-grid/aaf-grid.component';
import { MaterialModules } from './material.module';
import { AafModalService } from './aaf-modal/aaf-modal.service';

@NgModule({
  declarations: [CoreAirtelAfricaComponent, AafModalComponent, AafGridComponent],
  imports: [
    CommonModule,
    MaterialModules,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule
  ],
  exports: [
    AafModalComponent,
    AafGridComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [AafModalService]
})
export class CoreAirtelAfricaModule { }
