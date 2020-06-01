import { Component, EventEmitter, Input, OnChanges, SimpleChanges, SimpleChange, OnInit, Output, Inject, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { FieldConfig, Validator, FormDetails, EventsType, Events } from "./field.interface";
import { DefaultFormConfiguration } from './default-configuration';
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
  </form>
  `,
  styles: [],
  providers: [DefaultFormConfiguration]
})
export class AafFormComponent implements OnInit {
  isDirty: boolean = false;
  @Input() fields: FieldConfig[];
  @Input() formInfo: FormDetails;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Input() actionProvider: ActionsProvider;
  form: FormGroup;
  deeplyClonedObject: any;
  onSubmit(event: Event) {
   
  }
  // listActions: any;
  // deeplyClonedObject: any;
  // initialEventsObj: Events[] = [];
  // onChangeEventsObj: Events[] = [];
  // editResp = [];
  // getEditDetailsSubscription: Subscription;

  // get value() {
  //   return this.form.value;
  // }
  constructor(
    // private fb: FormBuilder,
    // private defaultConfig: DefaultFormConfiguration,
    // private _location: Location,
    // private ngxService: NgxUiLoaderService,
    // private dataService: DataService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  // changeToEmptyState(controlName) {
  //   this.deeplyClonedObject.map((val, key) => {
  //     if (val.name == controlName) {
  //       this.deeplyClonedObject[key].options = [];
  //     }
  //   });
  // }

  // removeSpecificValue(array, value) {
  //   let index = array.indexOf(value);
  //   if (index > -1) {
  //     array.splice(index, 1);
  //   }
  //   return array;
  // }
  // verifyStatusField(allDependentFields) {
  //   let dependentFields = [];
  //   this.deeplyClonedObject.map((fieldVal, fieldKey) => {
  //     if (fieldVal.onChange && fieldVal.onChange.changeType && fieldVal.onChange.changeType.length > 0) {
  //       fieldVal.onChange.changeType.map((fieldMap, fieldKey) => {
  //         fieldMap.addDestination.map(source => {
  //           dependentFields.push(source);
  //         });
  //         fieldMap.removeDestination.map(source => {
  //           dependentFields.push(source);
  //         });
  //       })
  //     }
  //   });
  //   if (dependentFields.length > 0) {
  //     let uniqueFields = this.getUniqueValues(dependentFields);
  //     for (let counter = 0; counter < uniqueFields.length; counter++) {
  //       allDependentFields = this.removeSpecificValue(allDependentFields, uniqueFields[counter]);
  //     }
  //   }
  //   return allDependentFields;
  // }
  // onChanges(formGroup: FormGroup): void {
  //   if (this.onChangeEventsObj.length > 0) {
  //     this.onChangeEventsObj.map((val, key) => {
  //       this.form.get(val.source).valueChanges.subscribe(
  //         changedValue => {
  //           formGroup.dirty ? this.isDirty = true : this.isDirty = false;
  //           this.dataService.userStatus(this.isDirty);
  //           if (!val.changeType) {
  //             if (val.dependentFields && val.dependentFields.length > 0) {
  //               val.dependent.map(value => {
  //                 this.changeToEmptyState(value);
  //               });
  //             }
  //             if (val.dependent && val.dependent.length > 0) {
  //               val.dependent.map(value => {
  //                 this.changeToEmptyState(value);
  //               });
  //             }
  //             if (changedValue != '') {                
  //               if (val.destination && val.destination != 'None') {
  //                 if (val.dependent && val.dependent.length > 0) {
  //                   val.dependent.map(value => {
  //                     this.form.controls[value].setValue([]);   
  //                   });
  //                 }
  //                 if (val.dependentFields && val.dependentFields.length > 0) {
  //                   let dependentFIeldValue = this.form.controls[val.dependentFields[0]].value;
  //                   let actionGeoHandler = 'getGeoLocations';
  //                   this.listActions[actionGeoHandler](dependentFIeldValue, changedValue, val.destination).subscribe(
  //                     (resp: any) => {
  //                       this.updateFieldConfiguration(val.destination, resp);
  //                     }, err => {
  //                       let staticDdata = [];
  //                       staticDdata.push(this.blankDataObj);
  //                       staticDdata.push(this.staticData);
  //                       this.updateFieldConfiguration(val.destination, staticDdata);
  //                     }
  //                   )
  //                 } else {
  //                   this.listActions[val.actionDataProvider](changedValue).subscribe(
  //                     (resp: any) => {
  //                       this.updateFieldConfiguration(val.destination, resp);
  //                     }, err => {
  //                       let staticDdata = [];
  //                       staticDdata.push(this.blankDataObj);
  //                       staticDdata.push(this.staticData);
  //                       this.updateFieldConfiguration(val.destination, staticDdata);
  //                     }
  //                   )
  //                 }
  //               }
  //             }
  //           } else {
  //             let proceedCheck = false;
  //             if (typeof changedValue === 'string' || changedValue instanceof String) {
  //               if (changedValue && changedValue != '') {
  //                 proceedCheck = true;
  //               }
  //             } else if (changedValue && typeof changedValue === 'object' && changedValue.constructor === Array) {
  //               if (changedValue && changedValue.length > 0) {
  //                 proceedCheck = true;
  //               }
  //             }
  //             if (proceedCheck) {
  //               // Enable all dependent field
  //               if (val.dependent && val.dependent.length > 0) {
  //                 this.verifyStatusField(val.dependent).map(value => {
  //                   this.enableField(value);
  //                 });
  //               }
  //               if (Object.keys(val['nestedOnChange']).length > 0) {
  //                 if (val['nestedOnChange'].callApi) {
  //                   let actionProviderName = `get${val['nestedOnChange'].destination}`;
  //                   if (val['nestedOnChange'].destination) {
  //                     this.changeToEmptyState(val['nestedOnChange'].destination);
  //                   }
  //                   if (changedValue != '') {
  //                     this.listActions[actionProviderName](changedValue).subscribe(
  //                       (resp: any) => {
  //                         this.updateFieldConfiguration(val['nestedOnChange'].destination, resp);
  //                       }, err => {
  //                         this.updateFieldConfiguration(val['nestedOnChange'].destination, []);
  //                       }
  //                     )
  //                   }
  //                 }
  //               }
  //               if (val.changeType && val.changeType.length > 0) {
  //                 if (val.callApi) {
  //                   this.listActions[val.actionDataProvider]().subscribe(
  //                     (resp: any) => {
  //                       let getResponse = resp.filter(roleInfo => {
  //                         return (roleInfo.value.id ? roleInfo.value.id : roleInfo.value) == (changedValue.id ? changedValue.id : changedValue);
  //                       });
  //                       if (getResponse.length > 0) {
  //                         val.changeType.map((changeTypeInfo, changeInfoKey) => {
  //                           if (changeTypeInfo.source == getResponse[0].type) {
  //                             changeTypeInfo.removeDestination.map(destination => {
  //                               this.disableField(destination);
  //                               this.deeplyClonedObject.map((fieldVal, fieldKey) => {
  //                                 if (fieldVal.name == destination) {
  //                                   this.deeplyClonedObject[fieldKey].visibility = false;
  //                                 }
  //                               });
  //                             });
  //                             changeTypeInfo.addDestination.map(source => {
  //                               this.enableField(source);
  //                               this.deeplyClonedObject.map((fieldVal, fieldKey) => {
  //                                 if (fieldVal.name == source) {
  //                                   this.deeplyClonedObject[fieldKey].visibility = true;
  //                                 }
  //                               });
  //                             });
  //                           }
  //                         });
  //                       }
  //                     }
  //                   )
  //                 } else {
  //                   val.changeType.map((changeTypeInfo, changeInfoKey) => {
  //                     if (changeTypeInfo.source == changedValue) {
  //                       changeTypeInfo.removeDestination.map(destination => {
  //                         this.disableField(destination);
  //                         this.deeplyClonedObject.map((fieldVal, fieldKey) => {
  //                           if (fieldVal.name == destination) {
  //                             this.deeplyClonedObject[fieldKey].visibility = false;
  //                           }
  //                         });
  //                       });
  //                       changeTypeInfo.addDestination.map(source => {
  //                         this.enableField(source);
  //                         this.deeplyClonedObject.map((fieldVal, fieldKey) => {
  //                           if (fieldVal.name == source) {
  //                             this.deeplyClonedObject[fieldKey].visibility = true;
  //                           }
  //                         });
  //                       });
  //                     }
  //                   });
  //                 }
  //               }
  //             } else {
  //               // Disable all dependent field
  //               if (val.dependent && val.dependent.length > 0) {
  //                 val.dependent.map(value => {
  //                   this.disableField(value);
  //                 });
  //               }
  //               if (val.changeType && val.changeType.length > 0) {
  //                 val.changeType[0].removeDestination.map(destination => {
  //                   this.disableField(destination);
  //                   this.deeplyClonedObject.map((fieldVal, fieldKey) => {
  //                     if (fieldVal.name == destination) {
  //                       this.deeplyClonedObject[fieldKey].visibility = false;
  //                     }
  //                   });
  //                 });
  //                 val.changeType[0].addDestination.map(source => {
  //                   this.disableField(source);
  //                   this.deeplyClonedObject.map((fieldVal, fieldKey) => {
  //                     if (fieldVal.name == source) {
  //                       this.deeplyClonedObject[fieldKey].visibility = true;
  //                     }
  //                   });
  //                 });
  //               }
  //             }
  //           }
  //         }
  //       )
  //     });
  //   }
  // }
  // disableField(field: string) {
  //   this.form.get(field).disable();
  //   return true;
  // }
  // enableField(field: string) {
  //   this.form.get(field).enable();
  //   return true;
  // }
  ngOnInit() {  
    // this.deeplyClonedObject = JSON.parse(JSON.stringify(this.fields));
    // this.deeplyClonedObject.map((fieldVal, fieldKey) => {
    //   if ((fieldVal.type == 'select' && fieldVal.options && fieldVal.optionsData == false)) {
    //     if (!fieldVal.geoConfig) {
    //       let initialeventObj = {
    //         actionDataProvider: `get${fieldVal.name}`,
    //         source: fieldVal.name,
    //         localstorage: true,
    //         destination: fieldVal.name
    //       }
    //       this.initialEventsObj.push(initialeventObj);
    //     }
    //     if (fieldVal.onChange) {
    //       let onChangeObj = {
    //         source: fieldVal.name,
    //         destination: fieldVal.onChange.destination,
    //         actionDataProvider: `get${fieldVal.onChange.destination}`,
    //         localstorage: fieldVal.onChange.localstorage,
    //         dependent: fieldVal.onChange.dependent,
    //         changeType: fieldVal.onChange.changeType ? fieldVal.onChange.changeType : '',
    //         callApi: fieldVal.onChange.callApi ? fieldVal.onChange.callApi : false,
    //         nestedOnChange: fieldVal.onChange.onChange ? fieldVal.onChange.onChange : {},
    //         dependentFields: fieldVal.onChange.dependentFields ? fieldVal.onChange.dependentFields : []
    //       }
    //       this.onChangeEventsObj.push(onChangeObj);
    //     }
    //   }
    // });
    // this.form = this.createControl();
    // this.listActions = this.actionProvider;
    // this.getEditableDetails();
  }

  // createConfigurations() {
  //   this.getInitilizedValues();
  //   this.onChanges(this.form);
  // }
  // editconfigurations() {
  //   this.getInitilizedValues();
  //   this.onChanges(this.form);
  //   this.setValues();
  // }

  // getEditableDetails() {
  //   if (this.formInfo.id && this.formInfo.actionHaandler && this.formInfo.actionHaandler != '') {
  //     this.ngxService.start();
  //     this.getEditDetailsSubscription = this.listActions[this.formInfo.actionHaandler](this.formInfo.id).subscribe(
  //       (res: any) => {
  //         let data = res.body || res;
  //         if ((data.statusCode == 200) && data.message) {
  //           this.editResp = res.body.result;
  //           this.editconfigurations();
  //         }
  //         this.ngxService.stop();
  //       }, err => {
  //         this.ngxService.stop();
  //       }, () => {
  //         this.ngxService.stop();
  //       }
  //     );
  //   } else {
  //     this.createConfigurations();
  //   }
  // }

  // isArray(value): boolean {
  //   return (value.constructor === Array);
  // }

  // isObj(value) {
  //   return (typeof value === 'object' && value.constructor != Array);
  // }

  // setValues() {
  //   let allDefaultEditableFields = Object.keys(this.editResp);
  //   let levelFieldsObject = [];
  //   this.deeplyClonedObject.map((defaultfieldVal, defaultfieldKey) => {
  //     if (defaultfieldVal.geoConfig) {
  //       levelFieldsObject.push(defaultfieldVal);
  //     }
  //     if (allDefaultEditableFields.indexOf(defaultfieldVal.name) >= 0 && this.editResp[defaultfieldVal.name] && this.isObj(this.editResp[defaultfieldVal.name])) {

  //     } else if (allDefaultEditableFields.indexOf(defaultfieldVal.name) >= 0 && this.editResp[defaultfieldVal.name] && this.isArray(this.editResp[defaultfieldVal.name])) {
  //       if (defaultfieldVal.saveType && defaultfieldVal.saveType.length > 0) {
  //         if (this.editResp[defaultfieldVal.name].length > 0) {
  //           let formFieldValue = [];
  //           this.editResp[defaultfieldVal.name].map((val) => {
  //             formFieldValue.push(val[defaultfieldVal.saveType[0]]);
  //           });
  //           this.form.controls[defaultfieldVal.name].setValue(formFieldValue);
  //           if (defaultfieldVal.onChange && defaultfieldVal.onChange.onChange && Object.keys(defaultfieldVal.onChange.onChange).length > 0) {
  //             if (defaultfieldVal.onChange.onChange.callApi) {
  //               let actionProviderName = `get${defaultfieldVal.onChange.onChange.destination}`;
  //               if (defaultfieldVal.onChange.onChange.destination) {
  //                 this.changeToEmptyState(defaultfieldVal.onChange.onChange.destination);
  //                 if (formFieldValue.length > 0) {
  //                   this.listActions[actionProviderName](formFieldValue).subscribe(
  //                     (resp: any) => {
  //                       this.updateFieldConfiguration(defaultfieldVal.onChange.onChange.destination, resp);
  //                     }, err => {
  //                       this.updateFieldConfiguration(defaultfieldVal.onChange.onChange.destination, []);
  //                     }
  //                   )
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       } else {
  //         this.form.controls[defaultfieldVal.name].setValue(this.editResp[defaultfieldVal.name]);
  //       }


  //       // let booleanCheck = false;
  //       // let destinationString: string = '';
  //       // if (defaultfieldVal.dependent && defaultfieldVal.dependent.length > 0 && defaultfieldVal.onChange.destination) {
  //       //   booleanCheck = true;
  //       //   destinationString = defaultfieldVal.onChange.destination;
  //       // }
  //       // if (booleanCheck && destinationString != '') {
  //       //   let actionDataProvider = `get${destinationString}`;
  //       //   this.listActions[actionDataProvider](this.editResp[defaultfieldVal.name]).subscribe(
  //       //     (resp: any) => {
  //       //       this.deeplyClonedObject.map((fieldDestVal, fieldDestKey) => {
  //       //         if (fieldDestVal.name == destinationString) {
  //       //           this.deeplyClonedObject[fieldDestKey].options = resp;
  //       //         }
  //       //       });
  //       //     });
  //       // }
  //     } else {
  //       if (this.editResp[defaultfieldVal.name] && this.editResp[defaultfieldVal.name] != '') {
  //         if (defaultfieldVal.type == 'date') {
  //           this.form.controls[defaultfieldVal.name].setValue(new Date(this.editResp[defaultfieldVal.name]));
  //         } else {
  //           if (defaultfieldVal.onChange && defaultfieldVal.onChange.changeType && defaultfieldVal.onChange.changeType.length > 0) {
  //             defaultfieldVal.onChange.changeType.map((changeTypeInfo, changeInfoKey) => {
  //               if (changeTypeInfo.source == this.editResp[defaultfieldVal.name]) {
  //                 changeTypeInfo.removeDestination.map(destination => {
  //                   this.disableField(destination);
  //                   this.deeplyClonedObject.map((fieldClonedVal, fieldClonedKey) => {
  //                     if (fieldClonedVal.name == destination) {
  //                       this.deeplyClonedObject[fieldClonedKey].visibility = false;
  //                     }
  //                   });
  //                 });
  //                 changeTypeInfo.addDestination.map(source => {
  //                   this.enableField(source);
  //                   this.deeplyClonedObject.map((fieldClonedStatVal, fieldClonedStatKey) => {
  //                     if (fieldClonedStatVal.name == source) {
  //                       this.deeplyClonedObject[fieldClonedStatKey].visibility = true;
  //                       if (allDefaultEditableFields.indexOf(source) >= 0) {
  //                         this.form.controls[source].setValue(this.editResp[source]);
  //                       }
  //                     }
  //                   });
  //                 });
  //               }
  //             });
  //           }
  //           this.form.controls[defaultfieldVal.name].setValue(this.editResp[defaultfieldVal.name]);
  //         }
  //       }
  //     }
  //   });
  //   if (levelFieldsObject.length > 0) {      
  //     this.setLevelHerarchy(levelFieldsObject, this.editResp);
  //   }
  // }
  // getTopLevelId(geoFieldConfig) {
  //   let topLevelId: number = 1000;
  //   geoFieldConfig.map((defaultfieldVal, defaultfieldKey) => {
  //     if (topLevelId) {
  //       if (defaultfieldVal.levelId <= topLevelId) {
  //         topLevelId = defaultfieldVal.levelId;
  //       }
  //     } else {
  //       topLevelId = defaultfieldVal.levelId;
  //     }
  //   });
  //   return topLevelId;
  // }
  
  // getLowestLevelId(geoFieldConfig) {
  //   let childLevelId: number = 0;
  //   geoFieldConfig.map((defaultfieldVal, defaultfieldKey) => {
  //     if (childLevelId) {
  //       if (defaultfieldVal.levelId >= childLevelId) {
  //         childLevelId = defaultfieldVal.levelId;
  //       }
  //     } else {
  //       childLevelId = defaultfieldVal.levelId;
  //     }
  //   });
  //   return childLevelId;
  // }

  // getLastSavedLavelId(editResponse) {
  //   let childLevelId: number = 0;
  //   editResponse.map((defaultfieldVal, defaultfieldKey) => {
  //     if (childLevelId) {
  //       if (defaultfieldVal.levelHierarchy.levelId >= childLevelId) {
  //         childLevelId = defaultfieldVal.levelHierarchy.levelId;
  //       }
  //     } else {
  //       childLevelId = defaultfieldVal.levelHierarchy.levelId;
  //     }
  //   });
  //   return childLevelId;
  // }

  // getLevelIds(levelData, levelId) {
  //   if (levelData.levelHierarchy && levelData.levelHierarchy.levelId && levelData.levelHierarchy.levelId == levelId) {
  //     return levelData.id;
  //   } else {
  //     return this.getLevelIds(levelData.parent, levelId);
  //   }
  // }

  // updateDependent(values, SourcefieldInfo) {    
  //   if (SourcefieldInfo.onChange.dependentFields && SourcefieldInfo.onChange.dependentFields.length > 0) {
  //     let dependentFIeldValue = this.form.controls[SourcefieldInfo.onChange.dependentFields[0]].value;
  //     let actionGeoHandler = 'getGeoLocations';
  //     this.listActions[actionGeoHandler](dependentFIeldValue, values, SourcefieldInfo.onChange.destination).subscribe(
  //       (resp: any) => {
  //         this.enableField(SourcefieldInfo.onChange.destination);
  //         this.deeplyClonedObject.map((fieldDestVal, fieldDestKey) => {
  //           if (fieldDestVal.name == SourcefieldInfo.onChange.destination) {
  //             this.deeplyClonedObject[fieldDestKey].options = resp;
  //           }
  //         });
  //       }
  //     )
  //   }
  // }

  // setFieldValue(fieldInfo, values, levelId) {
  //   fieldInfo.map((defaultfieldVal, defaultfieldKey) => {
  //     if (defaultfieldVal.geoConfig && defaultfieldVal.levelId && defaultfieldVal.levelId == levelId) {
  //       this.form.controls[defaultfieldVal.name].setValue(values);
  //       this.updateDependent(values, defaultfieldVal);
  //     }
  //   });
  //   return;
  // }

  // setLevelHerarchy(fieldConfig, editResponse) {    
  //   if (editResponse.levelId && editResponse.levelId.length > 0) {
  //     let topLevellId = this.getTopLevelId(fieldConfig);      
  //     let lastSavedLevel = this.getLastSavedLavelId(editResponse.levelId);      
  //     for (let counter = topLevellId; counter <= lastSavedLevel; counter++) {
  //       let levelIds = [];
  //       editResponse.levelId.map((editData, editKey) => {
  //         if (editData.levelHierarchy && editData.levelHierarchy.levelId == counter) {
  //           levelIds.push(editData.id);
  //         }
  //       });
  //       if (levelIds.length > 0) {
  //         let uniqueLevelIds = this.getUniqueValues(levelIds);
  //         this.setFieldValue(fieldConfig, uniqueLevelIds, counter);
  //       }
  //     }
  //   }
  // }

  // getUniqueValues(arrayData) {
  //   return arrayData.filter((uniqueVal, uniqueKey) =>
  //     arrayData.indexOf(uniqueVal) === uniqueKey
  //   );
  // }

  // setDefaultValues(fieldName: string, responseData) {
  //   let allEditableFields = Object.keys(this.editResp);
  //   this.deeplyClonedObject.map((fieldVal, fieldKey) => {
  //     if (fieldVal.name == fieldName) {
  //       if (allEditableFields.indexOf(fieldVal.name) >= 0 && this.editResp[fieldVal.name] && this.isObj(this.editResp[fieldVal.name])) {
  //         responseData.map((respVal, respKey) => {
  //           if (respVal.value.id == this.editResp[fieldVal.name].id) {
  //             this.form.controls[fieldName].setValue(respVal.value);
  //             if (fieldVal.onChange && fieldVal.onChange.changeType) {
  //               fieldVal.onChange.changeType.map((changeTypeInfo, changeInfoKey) => {
  //                 if (changeTypeInfo.source == respVal.type) {
  //                   changeTypeInfo.removeDestination.map(destination => {
  //                     this.disableField(destination);
  //                     this.deeplyClonedObject.map((fieldClonedVal, fieldClonedKey) => {
  //                       if (fieldClonedVal.name == destination) {
  //                         this.deeplyClonedObject[fieldClonedKey].visibility = false;
  //                       }
  //                     });
  //                   });
  //                   changeTypeInfo.addDestination.map(source => {
  //                     this.enableField(source);
  //                     this.deeplyClonedObject.map((fieldClonedStatVal, fieldClonedStatKey) => {
  //                       if (fieldClonedStatVal.name == source) {
  //                         this.deeplyClonedObject[fieldClonedStatKey].visibility = true;
  //                         if (allEditableFields.indexOf(source) >= 0) {
  //                           this.form.controls[source].setValue(this.editResp[source]);
  //                         }
  //                       }
  //                     });
  //                   });
  //                 }
  //               });
  //             }
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  // updateFieldConfiguration(source, resp) {
  //   this.deeplyClonedObject.map((valStatic, keyStatic) => {
  //     if (valStatic.name == source) {
  //       this.deeplyClonedObject[keyStatic].options = resp;
  //       if (this.formInfo.id && this.formInfo.actionHaandler && this.formInfo.actionHaandler != '') {
  //         this.setDefaultValues(source, resp);
  //       }
  //     }
  //   });
  // }

  // get staticData() {
  //   return { label: "Sales User", value: "sales_user" };
  // }
  // get blankDataObj() {
  //   return { label: "Select", value: "" }
  // }
  // getInitilizedValues() {
  //   if (this.initialEventsObj.length > 0) {
  //     this.initialEventsObj.map((value, key) => {
  //       this.ngxService.start();
  //       this.listActions[value.actionDataProvider]().subscribe(
  //         (resp: any) => {
  //           this.updateFieldConfiguration(value.source, resp);
  //         }
  //       )
  //       this.ngxService.stop();
  //     }
  //     );
  //   }
  // }

  // onSubmit(event: Event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   if (this.form.valid) {
  //     this.submit.emit(this.form.value);
  //   } else {
  //     this.validateAllFormFields(this.form);
  //   }
  // }

  // createControl() {
  //   const group = this.fb.group({});
  //   this.deeplyClonedObject.forEach(field => {
  //     if (field.type === "button") return;
  //     let control;
  //     if (field.type == 'date') {
  //       control = this.fb.control(
  //         { disabled: field.disabled },
  //         this.bindValidations(field.validations || [])
  //       );
  //     } else {
  //       control = this.fb.control(
  //         { value: field.value, disabled: field.disabled },
  //         this.bindValidations(field.validations || [])
  //       );
  //     }
  //     group.addControl(field.name, control);
  //   });
  //   return group;
  // }

  // bindValidations(validations: any) {
  //   if (validations.length > 0) {
  //     const validList = [];
  //     validations.forEach(valid => {
  //       validList.push(valid.validator);
  //     });
  //     return Validators.compose(validList);
  //   }
  //   return null;
  // }

  // validateAllFormFields(formGroup: FormGroup) {
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     control.markAsTouched({ onlySelf: true });
  //   });
  // }
  // ngOnDestroy() {        
  //   this.getEditDetailsSubscription ? this.getEditDetailsSubscription.unsubscribe() : '';
  // }
}
