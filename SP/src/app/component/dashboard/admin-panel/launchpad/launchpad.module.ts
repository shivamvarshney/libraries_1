import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesConfigurationComponent } from './roles-configuration/roles-configuration.component';
import { LaunchpadRouterModule } from './launchpad-routing.module';

@NgModule({
  declarations: [RolesConfigurationComponent],
  imports: [
    CommonModule,
    LaunchpadRouterModule
  ]
})
export class LaunchpadModule { }
