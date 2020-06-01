import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { Router } from '@angular/router';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'cm-dashboard',
  templateUrl: './cm-dashboard.component.html',
  styleUrls: ['./cm-dashboard.component.scss']
})
export class CmDashboardComponent implements OnInit, OnDestroy {

  constructor(
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router
  ) { }

  supervisorDashboard: boolean = false;
  dataExecutiveDashboard: boolean = false;
  filteredRoleSubscription: Subscription;

  updateForDashboard(){
    this.supervisorDashboard = true;
    this.dataExecutiveDashboard = false;
  }

  updateForDE(){
    this.supervisorDashboard = false;
    this.dataExecutiveDashboard = true;
  }

  ngOnInit() {    
    if (AppUtills.getValue('user_actor_type') && AppUtills.getValue('user_actor_type') != '') {
      if(AppUtills.getValue('user_actor_type') == 'supervisor'){
        this.updateForDashboard();
        this.myRoute.navigate(['/case-management/supervisor']);
      }else{
        this.updateForDE();
        this.myRoute.navigate(['/case-management/de']);
      }
    } else {
      if(this.checkUserCMPermission()){
        this.verifyUserType();
      }else{
        this.myRoute.navigate(['/unauthorized-page']);
      }      
    }
  }

  checkUserCMPermission() {
    if (this.facadeService.validateSpecificPermission(PermissionIds.SEARCH_AGENT)) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.filteredRoleSubscription ? this.filteredRoleSubscription.unsubscribe() : '';
  }

  verifyUserType() {
    let loggedInUserInfo = JSON.parse(AppUtills.getValue('userData'));
    let getActorDetails = apiUrls.getActors+'?userName='+loggedInUserInfo.username;
    this.filteredRoleSubscription = this.facadeService.onRoleGetAPI(getActorDetails).subscribe(
      resp => {
        this.ngxService.start();
        if (resp.result && resp.result.content && resp.result.content.length > 0) {
            let actorType = resp.result.content[0].actorType;
            let superWiserRole = actorType.filter(mapped=>{
              return mapped == 'Supervisor';
            });
            this.ngxService.stop(); 
            if (superWiserRole.length > 0) {
              AppUtills.setValue('user_actor_type', 'supervisor');
              this.updateForDashboard();
              this.myRoute.navigate(['/case-management/supervisor']);
            } else {
              AppUtills.setValue('user_actor_type', 'dataExecutive');
              this.updateForDE();
              this.myRoute.navigate(['/case-management/de']);
            }
            let actorInfo =  resp.result.content[0];
            let stringifiesString = JSON.stringify(actorInfo);
            AppUtills.setValue('actor_info', stringifiesString);         
          }else{
            this.facadeService.navigateToDefaultLandingModule();
          }                         
      },
      err => {
        this.ngxService.stop();        
      },
      () => {
        this.ngxService.stop();
      }
    );
  }
}
