import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
//import { ChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MaterialModules } from  '@src/core/material.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AafCoreModule } from '@src/core/aaf-core.module';
import { CPRouterModule } from './cp-routing.module';
import { CPComponent } from './cp-dashboard/cp.component';
import { CardModule } from '@src/core/card/card.module';
import { DawnloadModule } from '@src/core/download/download.module';
import { ChartModule } from '@src/core/charts/charts.module';
import { SearchModule } from '@src/core/search/search.module';
import { AafFormModule } from '@src/core/aaf-form/aaf-form.module';
import { DirectivesModule } from '@src/core/directives/directives.module'; 
import { TranslateModule} from '@ngx-translate/core';
import { BlacklistedComponent } from './blacklisted/blacklisted.component';
import { AgentsComponent } from './agents/agents.component';
import { FreelanceAgentsComponent } from './freelance-agents/freelance-agents.component';
import { FreelanceAggregatorsComponent } from './freelance-aggregators/freelance-aggregators.component';
import { AggregatorsComponent } from './aggregators/aggregators.component';
import { AggregatorMappingComponent } from './aggregator-mapping/aggregator-mapping.component';

@NgModule({
  declarations: [ 
    CPComponent, BlacklistedComponent, AgentsComponent, FreelanceAgentsComponent, FreelanceAggregatorsComponent, AggregatorsComponent, AggregatorMappingComponent, 
  ],
  imports: [
    CommonModule, 
    CPRouterModule,
    MaterialModules,
    //ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgxUiLoaderModule,
    AafCoreModule,
    CardModule,
    DawnloadModule,
    ChartModule,
    SearchModule,
    AafFormModule,
    DirectivesModule,
    TranslateModule
  ],
  providers:[
    
  ],
  exports:[
    ChartModule,
    SearchModule
  ]
})
export class CPModule { }
