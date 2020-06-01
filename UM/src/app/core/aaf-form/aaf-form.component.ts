
import { Component, EventEmitter, Input, OnInit, Output, Inject, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl, FormControlDirective, FormControlName } from "@angular/forms";
import { FieldConfig, Validator, FormDetails, FormConfigurations } from "./fields.interface";
import { Location, DOCUMENT } from '@angular/common';
import { ActionsProvider } from './aaf-form-actions-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from '@service/data-share-service/data.service';
import { Subscription } from 'rxjs';

@Component({
  exportAs: "dynamicForm",
  selector: "aaf-form",
  template: `
  <form [class]="formInfo.class" [name]="formInfo.name" [formGroup]="form" (submit)="onSubmit($event)">
  <ng-container *ngFor="let field of deeplyClonedObject;" aafFormField [field]="field" [group]="form">
  </ng-container>
  <ng-container *ngFor="let action of clonedActions;" aafFormActions [action]="action" [group]="form">
  </ng-container>
  </form>
  `,
  styles: [],
  providers: []
})
export class AafFormComponent implements OnInit, OnDestroy {
  isDirty: boolean = false;
  @Input() fields: FormConfigurations;
  @Input() formInfo: FormDetails;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Input() actionProvider: ActionsProvider;
  @Input() formG: FormGroup;
  form: FormGroup;
  listActions: any;
  deeplyClonedObject: any;
  clonedActions: any;
  changeEventsMap = [];

  get value() {
    return this.form.value;
  }
  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private ngxService: NgxUiLoaderService,
    private dataService: DataService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.deeplyClonedObject = this.fields.fields;
    this.clonedActions = this.fields.actions;
    this.form = this.createControl();
    this.listActions = this.actionProvider;
    this.loadIntialInformation();
    this.createMapOfChangeEvents();
    this.onChanges();
  }

  createMapOfChangeEvents() {
    this.deeplyClonedObject.map(d_field => {
      if (d_field.expressionProperties && d_field.expressionProperties.hooks && d_field.expressionProperties.hooks.onChange) {
        this.changeEventsMap.push(d_field);
      }
    });
  }

  updateDisableKeyInObj(key, check) {
    this.deeplyClonedObject.map((d_field, d_key) => {
      if (d_field.key == key) {
        this.deeplyClonedObject[d_key].templateOptions.disable = check;
      }
    });
  }

  disableFormField(field) {
    this.form.get(field).disable();
  }

  enableFormField(field) {
    this.form.get(field).enable();
  }

  getFieldValue(field){
    return this.form.get(field).value;
  }

  setFieldValue(field,value){
    this.form.get(field).setValue(value);
  }

  onChanges(): void {
    this.changeEventsMap.map(fieldKey => {
      this.form.get(fieldKey.key).valueChanges.subscribe(
        selectedfieldChange => {
          if (typeof selectedfieldChange != 'undefined') {
            if (fieldKey.expressionProperties && fieldKey.expressionProperties.hooks && fieldKey.expressionProperties.hooks.onChange) {
              // Disable Fields              
              if (fieldKey.expressionProperties.hooks.onChange.disable) {
                if (selectedfieldChange.constructor.name == 'Array') {
                  let nullData = [];
                  let notNullData = [];
                  fieldKey.expressionProperties.hooks.onChange.disable.map((disVal, disKey) => {
                    if (disVal.rules.indexOf(null) != -1) {
                      nullData.push(fieldKey.expressionProperties.hooks.onChange.disable[disKey]);
                    }
                    if (disVal.rules.indexOf(!null) != -1) {
                      notNullData.push(fieldKey.expressionProperties.hooks.onChange.disable[disKey]);
                    }
                  });
                  if (selectedfieldChange.length > 0 && notNullData.length > 0) {
                    for (let j = 0; j < notNullData[0].keys.length; j++) {
                      if (notNullData[0].keys[j]) {
                        this.updateDisableKeyInObj(notNullData[0].keys[j], true);
                        this.disableFormField(notNullData[0].keys[j]);
                      }
                    }
                  }
                  if (selectedfieldChange.length == 0 && nullData.length > 0) {
                    for (let k = 0; k < nullData[0].keys.length; k++) {
                      if (nullData[0].keys[k]) {
                        this.updateDisableKeyInObj(nullData[0].keys[k], true);
                        this.disableFormField(nullData[0].keys[k]);
                      }
                    }
                  }
                } else {
                  fieldKey.expressionProperties.hooks.onChange.disable.map(disVal => {
                    let isDisableRequire = false;
                    for (let i = 0; i < disVal.rules.length; i++) {
                      if (selectedfieldChange == disVal.rules[i]) {
                        isDisableRequire = true;
                        break;
                      }
                    }
                    if (isDisableRequire) {
                      for (let j = 0; j < disVal.keys.length; j++) {
                        if (disVal.keys[j]) {
                          this.updateDisableKeyInObj(disVal.keys[j], true);
                          this.disableFormField(disVal.keys[j]);
                        }
                      }
                    }
                  });
                }
              }
              // Enable Fields
              if (fieldKey.expressionProperties.hooks.onChange.enable) {
                if (selectedfieldChange.constructor.name == 'Array') {
                  let nullData = [];
                  let notNullData = [];
                  fieldKey.expressionProperties.hooks.onChange.enable.map((disVal, disKey) => {
                    if (disVal.rules.indexOf(null) != -1) {
                      nullData.push(fieldKey.expressionProperties.hooks.onChange.enable[disKey]);
                    }
                    if (disVal.rules.indexOf(!null) != -1) {
                      notNullData.push(fieldKey.expressionProperties.hooks.onChange.enable[disKey]);
                    }
                  });
                  if (selectedfieldChange.length > 0 && notNullData.length > 0) {
                    for (let j = 0; j < notNullData[0].keys.length; j++) {
                      if (notNullData[0].keys[j]) {
                        this.updateDisableKeyInObj(notNullData[0].keys[j], false);
                        this.enableFormField(notNullData[0].keys[j]);
                        this.setFieldValue(notNullData[0].keys[j],'');
                      }
                    }
                  }
                  if (selectedfieldChange.length == 0 && nullData.length > 0) {
                    for (let k = 0; k < nullData[0].keys.length; k++) {
                      if (nullData[0].keys[k]) {
                        this.updateDisableKeyInObj(nullData[0].keys[k], false);
                        this.enableFormField(nullData[0].keys[k]);
                        this.setFieldValue(notNullData[0].keys[k],'');
                      }
                    }
                  }
                } else {
                  fieldKey.expressionProperties.hooks.onChange.enable.map(disVal => {
                    let isEnableRequire = false;
                    for (let i = 0; i < disVal.rules.length; i++) {
                      if (selectedfieldChange == disVal.rules[i]) {
                        isEnableRequire = true;
                        break;
                      }
                    }
                    if (isEnableRequire) {
                      for (let j = 0; j < disVal.keys.length; j++) {
                        if (disVal.keys[j]) {
                          this.updateDisableKeyInObj(disVal.keys[j], false);
                          this.enableFormField(disVal.keys[j]);
                          this.setFieldValue(disVal.keys[j],'');
                        }
                      }
                    }
                  });
                }
              }
              // Update Reference Info
              if ((selectedfieldChange.constructor.name == 'Array' && selectedfieldChange.length > 0) || (selectedfieldChange && selectedfieldChange != '')) {
                if (fieldKey.expressionProperties.hooks.onChange.referenceKey) {
                  fieldKey.expressionProperties.hooks.onChange.referenceKey.map(refInfo => {
                    this.ngxService.start();
                    let preparedObj = {}
                    if(refInfo.requestParams && refInfo.requestParams.length > 0){
                      refInfo.requestParams.map(r_field=>{
                        preparedObj[r_field] = this.getFieldValue(r_field);
                      });
                    } 
                    this.listActions[refInfo.dataProvider](preparedObj).subscribe(
                      (resp: any) => {
                        this.ngxService.stop();
                        this.updateDisableKeyInObj(refInfo.key, false);                                
                        this.enableFormField(refInfo.key);
                        this.updateFieldOptionsMaster(refInfo.key, resp);
                      }
                    )
                  });
                }
              }
            }
          }
        }
      )
    });
  }

  loadIntialInformation() {
    this.deeplyClonedObject.map(d_field => {
      if ((d_field.type == 'select') || (d_field.type == 'multiSelect')) {
        if (d_field.expressionProperties && d_field.expressionProperties.hooks && d_field.expressionProperties.hooks.onInIt && d_field.expressionProperties.hooks.onInIt.dataProvider) {
          this.ngxService.start();
          console.log('d_field.expressionProperties.hooks.onInIt.dataProvider is ',d_field.expressionProperties.hooks.onInIt.dataProvider)
          this.listActions[d_field.expressionProperties.hooks.onInIt.dataProvider]().subscribe(
            (resp: any) => {
              this.ngxService.stop();
              this.updateFieldOptionsMaster(d_field.templateOptions.name, resp);
            }
          )
        }
      }
    });
  }

  updateFieldOptionsMaster(fieldName, data) {
    this.deeplyClonedObject.map((d_field, d_key) => {
      if (d_field.templateOptions.name == fieldName) {
        this.deeplyClonedObject[d_key].templateOptions.options = data;
      }
    });
  }

  createControl() {
    let group = this.fb.group({});
    this.deeplyClonedObject.map((vales, keyes) => {
      let control = this.fb.control(
        { value: vales.templateOptions.value, disabled: vales.templateOptions.disable },
        this.bindValidations(vales.validationRules || [])
      );
      group.addControl(vales.templateOptions.name, control);
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        if (valid.name == 'required') {
          validList.push(Validators.required);
        } else if (valid.name == 'pattern') {
          validList.push(Validators.pattern(valid.validator));
        }
      });
      if (validList.length > 0) {
        return Validators.compose(validList);
      }
    }
    return null;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    }else{
      this.findInvalidControls();
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        const fieldControl = this.form.get(name);
        debugger
        fieldControl.markAsTouched({ onlySelf: true });
      }
    }
  }

  ngOnDestroy() {

  }
}
