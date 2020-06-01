import { Component, OnInit, Input } from '@angular/core';
import { CPConfiguration } from './cp-config';
import { CPDataProvider } from './cp-data-provider';
import { CPActionsProvider } from './cp-actions-provider';
import { FacadeService } from '@src/core/services/facade.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'blacklisted',
  templateUrl: './blacklisted.component.html',
  styleUrls: ['./blacklisted.component.css', '../common-cp.scss'],
  providers: [CPDataProvider, CPActionsProvider]
})
export class BlacklistedComponent implements OnInit {

  CPConfig: any;

  constructor(
    private CPDataProvider: CPDataProvider,
    private CPActionsProvider: CPActionsProvider,
    private facadeService: FacadeService,
    private activatedRoutes: ActivatedRoute
  ) { }

  ngOnInit() {
    this.CPConfig = this.getUsersConfiguration();
  }

  getUsersConfiguration() {
    let finalUsersConfig = new Array();
    finalUsersConfig['finalDynamicDisplayColumns'] = CPConfiguration.displayColumnKeys;
    finalUsersConfig['functionalityCheckBox'] = CPConfiguration.implementCheckBox;
    CPConfiguration.filters.default[0].dropDownValue = 'all';
    finalUsersConfig['customFilters'] = CPConfiguration.filters;
    finalUsersConfig['columnData'] = CPConfiguration.displayColumnHeader;
    let actionsAttribute = [];
    CPConfiguration.listActionInfo.map((actionsVal, actionKey) => {
      if (this.facadeService.validateSpecificPermission(actionsVal.permissionName)) {        
        actionsAttribute.push(CPConfiguration.listActionInfo[actionKey]);
      }
    });
    finalUsersConfig['objectColumn'] = CPConfiguration.objectColumn;
    finalUsersConfig['actionAttr'] = actionsAttribute;
    finalUsersConfig['itemPerPage'] = CPConfiguration.kitListDataPerPage;
    finalUsersConfig['configurationFor'] = 'cp';
    finalUsersConfig['listHeader'] = CPConfiguration.listHeader;
    finalUsersConfig['rootClasses'] = CPConfiguration.rootClasses;
    return finalUsersConfig;
  }
}

