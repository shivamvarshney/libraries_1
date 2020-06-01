import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CardModule } from '@src/core/card/card.module';
import { ChartModule } from '@src/core/charts/charts.module';
import { SearchModule } from '@src/core/search/search.module';
import { AafCoreModule } from '@src/core/aaf-core.module';
import { AafFormModule } from '@src/core/aaf-form/aaf-form.module';
import { RoleRoutingModule } from './role.routing.module';
import { RoleDashboardComponent } from './role-dashboard/role-dashboard.component';
import { RolesComponent } from './roles/roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { TranslateModule} from '@ngx-translate/core';
import { DirectivesModule } from '@src/core/directives/directives.module';
import { ShowErrorComponent } from '@src/core/show-error/show-error.component'; 
import { AllPipesModule } from '@src/core/pipe/all-pipes.module';
import { MaterialModules } from "@src/core/material.module";

@NgModule({
    declarations: [
        RoleDashboardComponent, 
        RolesComponent, 
        CreateRoleComponent,
        ShowErrorComponent
    ],
    imports: [
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        RoleRoutingModule,
        ChartModule, 
        SearchModule,
        CardModule,
        AafCoreModule,
        AafFormModule,
        TranslateModule,
        DirectivesModule,
        AllPipesModule,
        MaterialModules
    ],
    providers: [

    ],
    exports: [
        ChartModule,
        SearchModule
    ]
})

export class RoleModule { }