import { CommonModule } from '@angular/common';
import { FacadeService } from '@src/core/services/facade.service';
import { NgModule } from '@angular/core';
import { LoginService } from './login.service';
import { AuthService } from './auth.service';
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
    MasterDataService
  ]
})
export class SalesServiceModule {}
