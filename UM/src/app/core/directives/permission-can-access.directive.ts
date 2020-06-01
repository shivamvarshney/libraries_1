import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FacadeService } from '../services/facade.service';

@Directive({
  selector: '[appPermissionCanAccess]'
})

export class AppPermissionCanAccessDirective implements OnInit {

  @Input('appPermissionCanAccess') appPermissionCanAccess: string | string[];

  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private facadeService: FacadeService) {
  } 
 
  ngOnInit(): void { 
    this.applyAppPermission();
  }
 
  private applyAppPermission(): void {
    let booleanCheck = true;
    if(this.appPermissionCanAccess[0] && this.appPermissionCanAccess[0] != ''){
      booleanCheck = this.facadeService.validateSpecificPermission(this.appPermissionCanAccess[0]);
    }    
    this.embedTemplate(booleanCheck);
  }

  embedTemplate(val:boolean){
    if(val){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainer.clear();
    }
  }
}