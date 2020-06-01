import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModules } from  '@src/core/material.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PieChartComponent } from '@src/core/charts/pie-chart/pie-chart.component';
import { LineChartComponent } from '@src/core/charts/line-chart/line-chart.component';
//import { ChartsModule } from 'ng2-charts';

@NgModule({ 
  imports: [
    CommonModule,
    MaterialModules,
    NgxUiLoaderModule,
    //ChartsModule   
  ],
  declarations: [ 
    PieChartComponent,
    LineChartComponent
  ],
  exports: [PieChartComponent,LineChartComponent],
  entryComponents:[
    PieChartComponent
  ]
})
export class ChartModule {}
