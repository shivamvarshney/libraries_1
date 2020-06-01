import { Component, OnInit, Input } from '@angular/core';
import { UsersConfiguration } from './users-config';
import { UsersDataProvider } from './users-data-provider';
import { UserActionsProvider } from './user-actions-provider';
import { FacadeService } from '@src/core/services/facade.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css', '../common-user.scss'],
  providers: [UsersDataProvider, UserActionsProvider]
})
export class UsersComponent implements OnInit {

  usersConfig: any;

  constructor(
    private _routes: Router,
    private usersDataProvider: UsersDataProvider,
    private userActionsProvider: UserActionsProvider,
    private facadeService: FacadeService,
    private activatedRoutes: ActivatedRoute
  ) { }

  ngOnInit() {
    UsersConfiguration.gridFiltersConfiguration.default.hooks.onChange.value = 'all';
    this.activatedRoutes.params.subscribe((params: Params) => {
      if (params.status) {
        if (params.status.toUpperCase() == 'ACTIVE') {
          UsersConfiguration.gridFiltersConfiguration.default.hooks.onChange.value = 'active';
        } else if (params.status.toUpperCase() == 'INACTIVE') {
          UsersConfiguration.gridFiltersConfiguration.default.hooks.onChange.value = 'inactive';
        } else {
          UsersConfiguration.gridFiltersConfiguration.default.hooks.onChange.value = 'all';
        }
      }
    });
    let finalConfigs = new Array();
    finalConfigs['headerConfiguration'] = UsersConfiguration.gridHeaderConfiguration;
    finalConfigs['filtersConfiguration'] = UsersConfiguration.gridFiltersConfiguration;
    finalConfigs['actionsConfiguration'] = UsersConfiguration.gridActionsConfiguration;
    finalConfigs['styleConfiguration'] = UsersConfiguration.gridStyleConfiguration;
    this.usersConfig = finalConfigs;
  }

  back(){
    this._routes.navigate(['/user']);    
  }
}
