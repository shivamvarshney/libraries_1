import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
//import { ChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MaterialModules } from  '@src/core/material.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AafCoreModule } from '@src/core/aaf-core.module';
import { DragDirective } from '@src/shared/directive/dragDrop.directive';
//import { CoreAirtelAfricaModule } from 'core-airtel-africa';
import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserService } from '@service/users/user.service';
import { CardModule } from '@src/core/card/card.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { UsersComponent } from './users/users.component';
import { DawnloadModule } from '@src/core/download/download.module';
import { ChartModule } from '@src/core/charts/charts.module';
import { SearchModule } from '@src/core/search/search.module';
import { AafFormModule } from '@src/core/aaf-form/aaf-form.module';
import { EdituserComponent } from './edituser/edituser.component';
import { DirectivesModule } from '@src/core/directives/directives.module'; 
import { TranslateModule} from '@ngx-translate/core';
import { AddUserComponent } from './add-user/add-user.component';
import { MatOptionSelectAllModule } from '@src/core/select-all/mat-select-all.module';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';

@NgModule({
  declarations: [ 
    UserDashboardComponent, 
    CreateUserComponent, 
    UsersComponent, 
    EdituserComponent, AddUserComponent
  ],
  imports: [
    CommonModule, 
    UserRoutingModule,
    MaterialModules,
    //ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgxUiLoaderModule,
    AafCoreModule,
    //CoreAirtelAfricaModule,
    CardModule,
    DawnloadModule,
    ChartModule,
    SearchModule,
    AafFormModule,
    DirectivesModule,
    TranslateModule,
    MatOptionSelectAllModule,
    SelectAutocompleteModule
  ],
  providers:[
    UserService
  ],
  exports:[
    ChartModule,
    SearchModule,
    MatOptionSelectAllModule
  ]
})
export class UserModule { }
