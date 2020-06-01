import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModules } from  '@src/core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { CMRouterModule } from './cm-routing.module';
import { TranslateModule} from '@ngx-translate/core';
import { SlideshowModule } from 'ng-simple-slideshow';
import { AllPipesModule } from '@src/core/pipe/all-pipes.module';
import { CaseMngmntComponent } from './case-mngmnt/case-mngmnt.component';
import { DataExecutiveDashboardComponent } from './case-mngmnt/data-executive-dashboard/data-executive-dashboard.component';
import { AgentStatusComponent } from './case-mngmnt/agent-status/agent-status.component';
import { DataService } from '@service/data-share-service/data.service';
import { EditAgentComponent } from './case-mngmnt/edit-agent/edit-agent.component';
import { KycComponent } from './case-mngmnt/edit-agent/kyc/kyc.component';
import { BusinessComponent } from './case-mngmnt/edit-agent/business/business.component';
import { OutletComponent } from './case-mngmnt/edit-agent/outlet/outlet.component';
import { ChartModule } from '@src/core/chart/chart.module';
import { TranslateLoader} from '@ngx-translate/core';
import { CmDashboardComponent } from './case-mngmnt/cm-dashboard/cm-dashboard.component';
import { DeDashboardComponent } from './case-mngmnt/de-dashboard/de-dashboard.component';
import { SupervisorDashboardComponent } from './case-mngmnt/supervisor-dashboard/supervisor-dashboard.component';
import { CmCasesComponent } from './case-mngmnt/cm-cases/cm-cases.component';
import { MakeAgentComponent } from './case-mngmnt/make-agent/make-agent.component';
import { SaveAgentComponent } from './case-mngmnt/save-agent/save-agent.component';
import { ListOfAgentsComponent } from './case-mngmnt/list-of-agents/list-of-agents.component';
import { CMService } from '@src/core/services/cm.service';
import { DailyAssestComponent } from './case-mngmnt/daily-assest/daily-assest.component';
import { MonthlyAssestComponent } from './case-mngmnt/monthly-assest/monthly-assest.component';
import { WeeklyAssestComponent } from './case-mngmnt/weekly-assest/weekly-assest.component';
import { DeAssestComponent } from './case-mngmnt/de-assest/de-assest.component';
import { SupervisorAssestComponent } from './case-mngmnt/supervisor-assest/supervisor-assest.component';
import { SwHeaderComponent } from './case-mngmnt/supervisor-dashboard/sw-header/sw-header.component';
import { SwCasesDashboardComponent } from './case-mngmnt/supervisor-dashboard/sw-cases-dashboard/sw-cases-dashboard.component';
import { SwReportsComponent } from './case-mngmnt/supervisor-dashboard/sw-reports/sw-reports.component';
import { ManageUsersComponent } from './case-mngmnt/supervisor-dashboard/manage-users/manage-users.component';
import { HandleCommonApiService } from '@service/common-api-service/handle-common-api.service';
import { CaseNotFoundComponent } from '@src/core/case-not-found/case-not-found.component';
import { HttpLoaderFactory } from '@src/app.module';
import { HttpClient } from '@angular/common/http';
//import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CaseActivityTimerComponent } from '@src/core/case-activity-timer/case-activity-timer.component';
import { DirectivesModule } from '@src/core/directives/directives.module';
import { CaseDetailsComponent } from './case-mngmnt/case-details/case-details.component';
import { BankComponent } from './case-mngmnt/edit-agent/bank/bank.component';


@NgModule({
  declarations: [
    CaseMngmntComponent, 
    DataExecutiveDashboardComponent, 
    AgentStatusComponent, 
    EditAgentComponent, 
    KycComponent, 
    BusinessComponent, 
    OutletComponent, 
    CmDashboardComponent, 
    DeDashboardComponent, 
    SupervisorDashboardComponent, 
    CmCasesComponent, 
    MakeAgentComponent, 
    SaveAgentComponent, 
    ListOfAgentsComponent,
    SaveAgentComponent, 
    DailyAssestComponent, 
    MonthlyAssestComponent, 
    WeeklyAssestComponent, 
    DeAssestComponent, 
    SupervisorAssestComponent, SwHeaderComponent, 
    SwCasesDashboardComponent, SwReportsComponent, 
    ManageUsersComponent, 
    CaseNotFoundComponent,
    CaseActivityTimerComponent,
    CaseDetailsComponent,
    BankComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SlideshowModule,
    RoundProgressModule,
    MaterialModules,
    CommonModule, 
    CMRouterModule,
    AllPipesModule,
    ChartModule,
    DirectivesModule,
    // TranslateModule.forRoot({
    //   loader: {
    //       provide: TranslateLoader,
    //       useFactory: HttpLoaderFactory,
    //       deps: [HttpClient]
    //   }
    // }),
    TranslateModule
  ], 
  providers: [DataService, CMService, HandleCommonApiService]
})
export class CaseManagementModule { }
