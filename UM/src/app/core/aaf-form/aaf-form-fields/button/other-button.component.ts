import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActionsConfig } from "../../fields.interface"; 
import { DOCUMENT } from '@angular/common';


@Component({
  selector: "app-other-button",
  template: `
<div [ngClass]="['demo-full-width','margin-top']" [formGroup]="group">
<button (click)="doAction()" [type]="action.type" color="primary" class="choose_file">{{action.label}}</button>
</div>
`,
  styles: [] 
})
export class OtherButtonComponent implements OnInit {
  action: ActionsConfig;
  group: FormGroup;
  constructor(@Inject(DOCUMENT) private document: Document) {}
  ngOnInit() {}

  doAction(): void {
      if(this.action && this.action.actionHandler){
        window.location.href = this.action.actionHandler;
      } 
  }
} 
