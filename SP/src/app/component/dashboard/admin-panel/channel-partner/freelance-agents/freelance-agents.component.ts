import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FreelanceAgentsActionsProvider } from './freelance-actions-provider';
import { FreelanceAgentsDataProvider } from './freelance-agents-data-provider';
import { freelanceAgentsGridConfig } from './freelance-agents-grid-config';

@Component({
  selector: 'app-freelance-agents',
  templateUrl: './freelance-agents.component.html',
  styleUrls: ['./freelance-agents.component.css'],
  providers:[ FreelanceAgentsActionsProvider,FreelanceAgentsDataProvider ]
})

export class FreelanceAgentsComponent implements OnInit {

  freelanceAgentConfig =[];
  
  constructor(
    private _location: Location,
    private freelanceAgentsDataProvider: FreelanceAgentsDataProvider,
    private freelanceAgentsActionsProvider: FreelanceAgentsActionsProvider) { 
    
  }

  ngOnInit() { 
    let finalConfigs = new Array();
    finalConfigs['headerConfiguration'] = freelanceAgentsGridConfig.gridHeaderConfiguration;
    finalConfigs['filtersConfiguration'] = freelanceAgentsGridConfig.gridFiltersConfiguration;
    finalConfigs['actionsConfiguration'] = freelanceAgentsGridConfig.gridActionsConfiguration;
    finalConfigs['styleConfiguration'] = freelanceAgentsGridConfig.gridStyleConfiguration;
    finalConfigs['allRowsSelection'] = freelanceAgentsGridConfig.gridAllRowsSelection;
    this.freelanceAgentConfig = finalConfigs;    
  }

  back(): void {
    this._location.back();
  }

}
