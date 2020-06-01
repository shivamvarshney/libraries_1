import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';

@Component({
  selector: 'app-save-agent',
  templateUrl: './save-agent.component.html',
  styleUrls: ['./save-agent.component.scss']
})
export class SaveAgentComponent implements OnInit, OnDestroy {

  createAgent: FormGroup;
  userDetailsSubscription: Subscription;
  makeAgentSubscription: Subscription;
  agentIdSubscription: Subscription;
  filteredRoleSubscription: Subscription;

  agentId: number;
  userObj: any;
  businessLineObj = ['KYC', 'CPO'];

  constructor(
    private ngxService: NgxUiLoaderService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private facadeService: FacadeService
  ) { }

  ngOnInit() {
    this.makeAgentForm();
    this.agentIdSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params.id) {
          this.agentId = params.id;
        }
      }
    );
    this.getUserInfo();
  }

  checkUserType() {
    this.filteredRoleSubscription = this.facadeService.onRoleGetAPI(apiUrls.roles).subscribe(
      resp => {
        this.ngxService.start();
        if (resp.result) {
          let roleReportsToMapping = resp.result;
          let levelDataSets = [];
          roleReportsToMapping.filter(function (role) {
            let levelObj = { level: role.level };
            levelDataSets.push(levelObj);            
          });
          if (levelDataSets.length > 0) {
            let uniqueRecord = AppUtills.removeDuplicates(levelDataSets, 'level');
            let isSupervisor = false;
            if(AppUtills.checkReportsToNullRole(uniqueRecord)){
              isSupervisor = true;
            }else{
              let maxRoleLevel = AppUtills.getMinLevel(uniqueRecord);
              let loggedInUserInfo = JSON.parse(AppUtills.getValue('userData'));   
              loggedInUserInfo.role.map(userRoles => {
                if (userRoles.level && userRoles.level == maxRoleLevel) {
                  isSupervisor = true;
                }
              });
            }                        
            if (isSupervisor) {
              //AppUtills.setValue('user_actor_type', 'supervisor');
              //this.updateForDashboard();
              //this.myRoute.navigate(['/case-management/supervisor']);
            } else {
              AppUtills.setValue('user_actor_type', 'dataExecutive');
              //this.updateForDE();
              //this.myRoute.navigate(['/case-management/de']);
            }
          }
        }
        this.ngxService.stop();
      },
      err => {
        this.ngxService.stop();        
      },
      () => {
        this.ngxService.stop();
      }
    );
  }

  saveAgent() { 
    let formValue = this.createAgent.value;
    let actorType = [];
    this.userObj.role.map(roleInfo => {
      actorType.push(roleInfo.roleName);
    });
    let actorName = this.userObj.firstName;;
    /*
    if(this.userObj.firstName && this.userObj.firstName != '' && this.userObj.lastName && this.userObj.lastName != ''){
      actorName = this.userObj.firstName+' '+this.userObj.lastName
    }else{
      actorName = this.userObj.firstName;
    }    
    */
    let agentData = {
      active : true,
      actorName : actorName,
      actorType : ["Data Executive"],
      availabilityStatus : "Available",
      availableCapacity : 0,
      businessLine : formValue.businessLine,
      maxCapacity : 1,
      picked : true,
      userName : this.userObj.username
    }

    this.ngxService.start();
    this.makeAgentSubscription = this.facadeService.onUserPostAPI(apiUrls.saveAgent, agentData).subscribe(
      (resp: any) => {
        let data;
        if (resp) {
          data = resp.body || resp ;
          this.ngxService.stop();
          if ((data.statusCode == 200) && data.message) {
            this.userObj = data.result;           
            this.facadeService.openArchivedSnackBar(data.message, 'Success');
            this.route.navigate(['/case-management/supervisor/manage-users']);
          } else {
            this.facadeService.openArchivedSnackBar(data.message, 'Retry');
          }
        }
      }, err => {
        this.ngxService.stop();
        if(AppUtills.showErrorMessage(err)){
          this.facadeService.openArchivedSnackBar('Something went wrong', 'Retry');
        }
      }
    )
  }

  getUserInfo() {
    this.ngxService.start();
    let editUserObj = { userId: this.agentId };
    this.userDetailsSubscription = this.facadeService.onUserPostAPI(apiUrls.getUserById, editUserObj).subscribe(
      (resp: any) => {
        if (resp.body.result) {
          this.userObj = resp.body.result;
        }
      },
      err => {
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    )
  }

  makeAgentForm() {
    this.createAgent = new FormGroup({
      businessLine: new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.userDetailsSubscription ? this.userDetailsSubscription.unsubscribe() : '';
    this.makeAgentSubscription ? this.makeAgentSubscription.unsubscribe() : '';
    this.agentIdSubscription ? this.agentIdSubscription.unsubscribe() : '';
    this.filteredRoleSubscription ? this.filteredRoleSubscription.unsubscribe() : '';
  }

}
