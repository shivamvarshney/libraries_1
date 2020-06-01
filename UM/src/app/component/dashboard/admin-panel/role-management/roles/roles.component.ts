import { Component, OnInit } from '@angular/core';
import { RolesConfiguration } from './role-config';
import { RoleDataProvider } from './role-data-provider';
import { RoleActionsProvider } from './role-actions-provider';
import { FacadeService } from '@src/core/services/facade.service';
import { Params, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  providers: [RoleDataProvider, RoleActionsProvider]
})
export class RolesComponent implements OnInit {
 
  roleConfig: any  
 
  constructor(
    private _routes: Router,
    private roleDataProvider: RoleDataProvider,
    private roleActionsProvider: RoleActionsProvider,
    private facadeService: FacadeService,
    private activatedRoutes: ActivatedRoute
  ) { }

  ngOnInit() {
    RolesConfiguration.gridFiltersConfiguration.default.hooks.onChange.value = 'all';
    this.activatedRoutes.params.subscribe((params: Params) => {
      if (params.status) {
        if (params.status.toUpperCase() == 'ACTIVE') {
          RolesConfiguration.gridFiltersConfiguration.default.hooks.onChange.value = 'active';
        } else if (params.status.toUpperCase() == 'INACTIVE') {
          RolesConfiguration.gridFiltersConfiguration.default.hooks.onChange.value = 'inactive';
        } else {
          RolesConfiguration.gridFiltersConfiguration.default.hooks.onChange.value = 'all';
        }
      }
    });
    let finalConfigs = new Array();
    finalConfigs['headerConfiguration'] = RolesConfiguration.gridHeaderConfiguration;
    finalConfigs['filtersConfiguration'] = RolesConfiguration.gridFiltersConfiguration;
    finalConfigs['actionsConfiguration'] = RolesConfiguration.gridActionsConfiguration;
    finalConfigs['styleConfiguration'] = RolesConfiguration.gridStyleConfiguration;
    this.roleConfig = finalConfigs;    
  }  

  back(){
    this._routes.navigate(['/role']);    
  }
}
