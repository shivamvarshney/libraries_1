import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RolesConfigurationComponent } from './roles-configuration/roles-configuration.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'roles-configuration'
    },
    {
        path: 'roles-configuration',
        component: RolesConfigurationComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LaunchpadRouterModule { }
