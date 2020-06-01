import { NgModule } from '@angular/core';
import { AppCanAccessDirective } from './app-can-access.directive';
import { OnlyNumberDirective } from './number-only.directive';
import { AppPermissionCanAccessDirective } from './permission-can-access.directive';


@NgModule({
  imports: [],
  declarations: [AppCanAccessDirective, OnlyNumberDirective,AppPermissionCanAccessDirective],
  exports: [AppCanAccessDirective, OnlyNumberDirective,AppPermissionCanAccessDirective]
})
export class DirectivesModule { }