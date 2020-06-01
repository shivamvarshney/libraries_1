import { CommonModule } from '@angular/common';
import { FacadeService } from '@src/core/services/facade.service';
import { NgModule } from '@angular/core';
import { LoginService } from './login.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { RolesService } from './roles.service';
import { MasterDataService } from './masterData.service';
 
@NgModule({ 
  imports: [
    CommonModule
  ],
  declarations: [   
  ],
  providers: [
    AuthService,
    LoginService,
    FacadeService,
    UserService,
    RolesService,
    MasterDataService
  ]
})
export class SalesServiceModule {}
