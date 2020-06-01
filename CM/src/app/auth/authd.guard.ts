import { CanDeactivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>
}

@Injectable()
export class AuthDGuard implements OnInit, CanDeactivate<ComponentCanDeactivate> {

  constructor(private aafModelService: AafModelService,
    private _router: Router) { }

  ngOnInit() { }

  canDeactivate(component: ComponentCanDeactivate, next: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    if (component.canDeactivate())
      return true;
    else {
      this.aafModelService.openModal({
        title: `Are you sure you want to leave this page?`,
        status: ``,
        reason: next.data.module,
        modalWidth: 640,
        proceed_caps: 'DISCARD',
        modelStatus: 'exit'
      });
    }
  }
}