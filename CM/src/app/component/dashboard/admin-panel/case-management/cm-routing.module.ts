import { Routes, RouterModule } from '@angular/router';
import { CaseMngmntComponent } from './case-mngmnt/case-mngmnt.component';
import { NgModule } from '@angular/core';
import { AuthCGuard } from '@src/auth/authc.guard';
import { AgentStatusComponent } from './case-mngmnt/agent-status/agent-status.component';
import { EditAgentComponent } from './case-mngmnt/edit-agent/edit-agent.component';
import { KycComponent } from './case-mngmnt/edit-agent/kyc/kyc.component';
import { BusinessComponent } from './case-mngmnt/edit-agent/business/business.component';
import { OutletComponent } from './case-mngmnt/edit-agent/outlet/outlet.component';
import { CmDashboardComponent } from './case-mngmnt/cm-dashboard/cm-dashboard.component';
import { MakeAgentComponent } from './case-mngmnt/make-agent/make-agent.component';
import { ManageUsersComponent } from './case-mngmnt/supervisor-dashboard/manage-users/manage-users.component';
import { SaveAgentComponent } from './case-mngmnt/save-agent/save-agent.component';
import { SupervisorDashboardComponent } from './case-mngmnt/supervisor-dashboard/supervisor-dashboard.component';
import { SwCasesDashboardComponent } from './case-mngmnt/supervisor-dashboard/sw-cases-dashboard/sw-cases-dashboard.component';
import { SwReportsComponent } from './case-mngmnt/supervisor-dashboard/sw-reports/sw-reports.component';
import { DeDashboardComponent } from './case-mngmnt/de-dashboard/de-dashboard.component';
import { CaseNotFoundComponent } from '@src/core/case-not-found/case-not-found.component';
import { PermissionIds } from '@src/core/utills/masterPermission';
import { CaseDetailsComponent } from './case-mngmnt/case-details/case-details.component';
import { BankComponent } from './case-mngmnt/edit-agent/bank/bank.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'verifyAgent'
    },
    {
        path: 'verifyAgent',
        component: CmDashboardComponent,
        canActivate: [AuthCGuard],
        data: { module: 'CM', label: PermissionIds.SEARCH_AGENT }
    },
    {
        path: 'create-agent',
        component: MakeAgentComponent,
        canActivate: [AuthCGuard],
        data: { module: 'CM', label: PermissionIds.CREATE_AGENT }
    },
    {
        path: 'save-agent/:id',
        component: SaveAgentComponent,
        canActivate: [AuthCGuard],
        data: { module: 'CM', label: PermissionIds.CREATE_AGENT }
    },
    {
        path: 'case/case-details',
        component: CaseDetailsComponent,
        //canActivate: [AuthCGuard],
        //data: { module: 'CM', label: PermissionIds.CREATE_AGENT }
    },
    {
        path: 'case',
        component: AgentStatusComponent,
        children: [
            {
                path: '',
                component: EditAgentComponent,
                children: [
                    {
                        path: ''
                    },
                    {
                        path: 'business/:id',
                        component: BusinessComponent
                    },
                    {
                        path: 'outlet/:id',
                        component: OutletComponent
                    },
                    {
                        path: 'kyc/:id',
                        component: KycComponent
                    },
                    {
                        path: 'bank/:id',
                        component: BankComponent
                    }
                ]
            }
        ]
    },
    {
        path: 'de',
        component: AgentStatusComponent,
        children: [
            {
                path: '',
                component: DeDashboardComponent
            }
        ]
    },
    {
        path: 'supervisor',
        component: AgentStatusComponent,
        children: [
            {
                path: '',
                component: SupervisorDashboardComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'cases'
                    },
                    {
                        path: 'cases',
                        component: SwCasesDashboardComponent
                    },
                    {
                        path: 'reports',
                        component: SwReportsComponent
                    },
                    {
                        path: 'manage-users',
                        component: ManageUsersComponent
                    },
                    {
                        path: 'save-agent/:id',
                        component: SaveAgentComponent
                    },
                ]
            }
        ]
    },
    {
        path: 'case-not-found',
        component: AgentStatusComponent,
        children:[
            {
                path:'',
                component:CaseNotFoundComponent
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CMRouterModule { }
