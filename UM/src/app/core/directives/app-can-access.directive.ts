import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FacadeService } from '../services/facade.service';

@Directive({
  selector: '[appCanAccess]'
})

export class AppCanAccessDirective implements OnInit {

  @Input('appCanAccess') appCanAccess: string | string[];

  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private facadeService: FacadeService) {
  } 
 
  ngOnInit(): void {
    this.applyPermission();
  }
 
  private applyPermission(): void {
    let booleanCheck = this.facadeService.validatePermission(this.appCanAccess[0]);
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