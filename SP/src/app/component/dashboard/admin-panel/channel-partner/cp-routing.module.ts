import { Routes, RouterModule } from '@angular/router';
import { CPComponent } from './cp-dashboard/cp.component';
import { NgModule } from '@angular/core';
import { BlacklistedComponent } from './blacklisted/blacklisted.component';
import { AgentsComponent } from './agents/agents.component';
import { FreelanceAgentsComponent } from './freelance-agents/freelance-agents.component';
import { AggregatorsComponent } from './aggregators/aggregators.component';
import { FreelanceAggregatorsComponent } from './freelance-aggregators/freelance-aggregators.component';
import { AggregatorMappingComponent } from './aggregator-mapping/aggregator-mapping.component';
import { AuthCGuard } from '@src/auth/authc.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CPComponent,
        data: { module: 'CP', label: 'Dashboard' }
    },    
    {
        path:'blacklisted',
        children:[
            {
                path:'',
                component:BlacklistedComponent,
                //canActivate:[AuthCGuard],
                data: { module:'CP',label:3 }
            }
        ]
    },
    {
        path:'agents',
        children:[
            {
                path:'',
                component:AgentsComponent,
                //canActivate:[AuthCGuard],
                data: { module:'CP',label:3 }
            }
        ]
    },
    {
        path:'freelance-agents',
        children:[
            {
                path:'',
                component:FreelanceAgentsComponent,
                //canActivate:[AuthCGuard],
                data: { module:'CP',label:3 }
            }
        ]
    },   
    {
        path:'aggregators',
        children:[
            {
                path:'',
                component:AggregatorsComponent,
                //canActivate:[AuthCGuard],
                data: { module:'CP',label:3 }
            }
        ]
    },
    {
        path:'freelance-aggregators',
        children:[
            {
                path:'',
                component:FreelanceAggregatorsComponent,
                //canActivate:[AuthCGuard],
                data: { module:'CP',label:3 }
            }
        ]
    }, 
    {
        path:'aggregator-mappings',
        children:[
            {
                path:'',
                component:AggregatorMappingComponent,
                //canActivate:[AuthCGuard],
                data: { module:'CP',label:3 }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CPRouterModule { }
