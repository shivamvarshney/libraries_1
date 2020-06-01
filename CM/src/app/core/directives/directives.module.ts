import { NgModule } from '@angular/core';
import { AppCanAccessDirective } from './app-can-access.directive';
import { OnlyNumberDirective } from './number-only.directive';
import { AppPermissionCanAccessDirective } from './permission-can-access.directive';
import { OutsideClickDirective } from './outside-click.directive';



@NgModule({
  imports: [],
  declarations: [AppCanAccessDirective, OnlyNumberDirective,AppPermissionCanAccessDirective,OutsideClickDirective],
  exports: [AppCanAccessDirective, OnlyNumberDirective,AppPermissionCanAccessDirective,OutsideClickDirective]
})
export class DirectivesModule { }