import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { FacadeService } from '@src/core/services/facade.service';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss', '../../cm-module.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1000 )
      ]),
      transition(':leave',
        animate(1000, style({opacity: 0})))
    ])
  ]
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  agentOnBoardUnsubscription: Subscription;
  dataSource: any;
  Pids:any;
  constructor(private _route: Router, private facadeService: FacadeService, private ngxService: NgxUiLoaderService) { }
  displayedColumns: string[] = ['Actor Name', 'Created Date', 'Business Line', 'Case Type', 'Created / Modified by'];

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.Pids = PermissionIds;
    this.dataExecutiveOnBoard()
  }

  dataExecutiveOnBoard() {
    this.ngxService.start();
    this.agentOnBoardUnsubscription = this.facadeService.onCMGetAPI(apiUrls.onBoardActor).subscribe(res => {
      let data: any;
      if (res) {
        this.ngxService.stop();
        if (res['statusCode'] == 200 && res['message']) {
          this.dataSource = new MatTableDataSource(res.result.content);         
        } else {
          this.facadeService.openArchivedSnackBar(data.message, 'Retry');
        }
      }
    }, error => {
      this.ngxService.stop();
      if(AppUtills.showErrorMessage(error)){
        this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message: 'Something went wrong'), 'Retry');
      }
    });
  }

  onAddAgent() {
    this._route.navigate(['/case-management/create-agent']);
  }

  ngOnDestroy() {
    this.agentOnBoardUnsubscription ? this.agentOnBoardUnsubscription.unsubscribe() : '';
  }

}
