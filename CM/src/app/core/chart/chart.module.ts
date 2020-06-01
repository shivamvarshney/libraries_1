import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModules } from  '@src/core/material.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ChartComponent } from './chart.component'
import { TranslateModule} from '@ngx-translate/core';
import { DoughnutchartComponent } from './doughnutchart/doughnutchart.component';
import { LinechartComponent } from './linechart/linechart.component';
 
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
    ChartComponent,
    DoughnutchartComponent,
    LinechartComponent
  ],
  exports: [ChartComponent, DoughnutchartComponent, LinechartComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [ChartComponent, DoughnutchartComponent, LinechartComponent]
})
export class ChartModule {}
