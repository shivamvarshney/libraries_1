import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActionsConfig } from "./fields.interface";
import { ButtonComponent } from "./aaf-form-fields/button/button.component";
import { ResetButtonComponent } from "./aaf-form-fields/button/reset-button.component";
import { OtherButtonComponent } from "./aaf-form-fields/button/other-button.component";

const componentMapper = {
  reset: ResetButtonComponent,
  submit: ButtonComponent,
  other: OtherButtonComponent
};

@Directive({
  selector: "[aafFormActions]"
})
export class AafFormActionsDirective implements OnInit {
  @Input() action: ActionsConfig;
  @Input() group: FormGroup;
  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }
  
  ngOnInit() {    
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.action.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.action = this.action;
    this.componentRef.instance.group = this.group;
  }
  handleChangeEvent(value) {
    
  }
}
