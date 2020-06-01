import { Validators, FormGroup, FormControl } from "@angular/forms";
import { FieldConfig, FormDetails, FormConfigurations } from "@src/core/aaf-form/fields.interface";
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FacadeService } from '@src/core/services/facade.service';
import { AafFormComponent } from '@src/core/aaf-form/aaf-form.component';
import { CreateUserActionsProvider } from './create-user-actions-provider';
import { AppUtills } from '@src/core/utills/appUtills';
import { Observable, Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { ComponentCanDeactivate } from '@src/auth/authd.guard';
import { DataService } from '@service/data-share-service/data.service';
import { FormConfiguration } from '@src/core/aaf-form/configuration.interface';

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css', '../common-user.scss'],
  providers: [CreateUserActionsProvider]
})
export class CreateUserComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  isDirty: boolean = false;
  editUserID: string;
  userUnsubscription: Subscription;
  masterDataSubscription: Subscription;
  siteGeoFieldsSubscription: Subscription;
  getUserPromptSubscription: Subscription;
  userModalResponseSubscription: Subscription;
  filteredRoleSubscription: Subscription;
  unauthorized_msg: string;
  masterDataLength: number = 0;
  geoFields = [];
  currentDate = new Date();
  submittedForm:any;
  @ViewChild(AafFormComponent) form: AafFormComponent;
  constructor(private facadeService: FacadeService,
    private createUserActionsProvider: CreateUserActionsProvider,
    private ngxService: NgxUiLoaderService,
    private _routes: Router,
    private dataService: DataService
  ) {
    this.getMasterData();
    this.getUserPromptSubscription = this.dataService.listen().subscribe(
      (data: any) => {
        this.isDirty = data
      }
    )
  }

  userCreateForm = new FormGroup({});

  ngOnInit() {
    this.userCreateForm = new FormGroup({});
    this.formFieldConfig.fields.forEach(x => {
      let control = new FormControl('');
      this.userCreateForm.addControl(x.key, control);
    });    
    this.onChanges();
  }

  onChanges() {
    let sdvsd = this.userCreateForm.get('loginModule').value;
    console.log(sdvsd);
    this.userCreateForm.get('loginModule').valueChanges.subscribe(
      changedValue => {
        
      }
    )
  }

  //confirmation pupup
  canDeactivate(): boolean {
    return !this.isDirty;
  }

  getMasterData() {
    this.ngxService.start();
    let masterData = AppUtills.getValue('masterData');
    if (masterData && masterData != '') {
      this.masterDataLength = 8;
      this.ngxService.stop();
    } else {
      this.ngxService.start();
      this.masterDataSubscription = this.facadeService.getmasterData().subscribe(
        (resp: any) => {
          if (resp) {
            this.ngxService.stop();
            AppUtills.removeValue('masterData');
            AppUtills.setValue('masterData', JSON.stringify(resp.result));
            this.masterDataLength = 8;
          }
        }
      );
    }
  }

  submit(value: { [name: string]: any }) {
    debugger
    this.submittedForm = value;
  }

  ngOnDestroy() {
    this.masterDataSubscription ? this.masterDataSubscription.unsubscribe() : '';
    this.siteGeoFieldsSubscription ? this.siteGeoFieldsSubscription.unsubscribe() : '';
    this.userUnsubscription ? this.userUnsubscription.unsubscribe() : '';
    this.getUserPromptSubscription ? this.getUserPromptSubscription.unsubscribe() : '';
    this.userModalResponseSubscription ? this.userModalResponseSubscription.unsubscribe() : '';
    this.filteredRoleSubscription ? this.filteredRoleSubscription.unsubscribe() : '';
  }

  createUserForm: FormDetails = {
    name: 'createUser',
    class: 'createUser'
  }  
  formFieldConfig: FormConfigurations = {
    name: this.userCreateForm, 
    fields: [
      // Roles
      {
        key: 'roles',
        type: 'multiSelect',
        templateOptions: {
          label: 'Roles',
          name: 'roles',
          id: 'roles',
          placeHolder: 'Select Role',
          disable: false,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Role is Required"
          }
        ],
        expressionProperties: {
          hooks: {
            onChange: {
              disable:[
                {                  
                  keys: ['clients','department','reportingMsisdn'],
                  rules: [null]                  
                },
                {                  
                  keys: ['department','reportingMsisdn'],
                  rules: [!null]
                }
              ],
              enable: [
                {
                  keys: ['clients'],
                  rules: [!null]                 
                }
              ],
              referenceKey:[
                {
                  key: 'clients',
                  dataProvider: 'getclients',
                  requestParams: ['roles']
                }
              ]              
            },
            onInIt: {
              dataProvider: 'getRoles'
            }
          },
        },
      },
      // Clients
      {
        key: 'clients',
        type: 'multiSelect',
        templateOptions: {
          label: 'Clients',
          name: 'clients',
          id: 'clients',
          placeHolder: 'Select Client',
          disable: true,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Client is Required"
          }
        ],
        expressionProperties: {
          hooks: {
            onChange: {
              disable:[
                {                  
                  keys: ['department','reportingMsisdn'],
                  rules: [null]                  
                },
                {                  
                  keys: ['reportingMsisdn'],
                  rules: [!null]
                }
              ],
              enable: [
                {
                  keys: ['department'],
                  rules: [!null]                 
                }
              ],
              referenceKey:[
                {
                  key: 'department',
                  dataProvider: 'getdepartments',
                  requestParams: ['roles','clients']
                }
              ]              
            }          
          },
        },
      },
      // Departments
      {
        key: 'department',
        type: 'select',
        templateOptions: {
          label: 'Department',
          name: 'department',
          id: 'department',
          placeHolder: 'Select Department',
          disable: true,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Department is Required"
          }
        ],
        expressionProperties: {
          hooks: {
            onChange: {
              disable:[
                {                  
                  keys: ['reportingMsisdn'],
                  rules: [null]                  
                }
              ],
              enable: [
                {
                  keys: ['reportingMsisdn'],
                  rules: [!null]                 
                }
              ],
              referenceKey:[
                {
                  key: 'reportingMsisdn',
                  dataProvider: 'getReportingMsisdn',
                  requestParams: ['roles','clients','department']
                }
              ]              
            }          
          },
        },
      },
      // Reporting MSISDN 
      {
        key: 'reportingMsisdn',
        type: 'select',
        templateOptions: {
          label: 'Reporting Manager',
          name: 'reportingMsisdn',
          id: 'reportingMsisdn',
          placeHolder: 'Select Reporting Manager',
          disable: true,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Reporting Manager is Required"
          }
        ]        
      },
      // Login Module
      {
        key: 'loginModule',
        type: 'select',
        templateOptions: {
          label: 'Login Module',
          name: 'loginModule',
          id: 'loginModule',
          placeHolder: 'Select Login Module',
          disable: false,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Login Module is Required"
          }
        ],
        expressionProperties: {
          hooks: {
            onChange: {
              disable:[
                {
                  keys: ['auuid'],
                  rules: [null,'MSISDN']
                }
              ],
              enable:[
                {
                  keys: ['auuid'],
                  rules: ['AUUID']
                }
              ]                
            },
            onInIt: {
              dataProvider: 'getloginModule'
            }
          },
        },
      },
      // AUUID
      {
        key: 'auuid',
        type: 'input',
        templateOptions: {
          label: 'AUUID',
          name: 'auuid',
          id: 'auuid',
          placeHolder: 'AUUID',
          disable: true,
          value: '',
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "AUUID is Required"
          },
          {
            name: "pattern",
            validator: "^[0-9]{6,10}$",
            message: "Accept only Numbers having length between 6 to 10"
          }
        ]
      },
      // MSISDN
      {
        key: 'msisdn',
        type: 'input',
        templateOptions: {
          label: 'MSISDN',
          name: 'msisdn',
          id: 'msisdn',
          placeHolder: 'MSISDN',
          disable: false,
          value: '',
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "pattern",
            validator: "^[0-9.]{10,11}$",
            message: "Accept only Numbers having length between 10 to 11"
          }
        ]
      },
      // First Name
      {
        key: 'firstName',
        type: 'input',
        templateOptions: {
          label: 'First name',
          name: 'firstName',
          id: 'firstName',
          placeHolder: 'First name',
          disable: false,
          value: '',
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "First name is Required"
          },
          {
            name: "pattern",
            validator: "^[a-zA-Z.]{2,30}$",
            message: "Accept only Alphabets having length between 2 to 30 and special characters allowed(.)"
          }
        ]
      },
      // Last Name
      {
        key: 'lastName',
        type: 'input',
        templateOptions: {
          label: 'Last name',
          name: 'lastName',
          id: 'lastName',
          placeHolder: 'Last name',
          disable: false,
          value: '',
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Last name is Required"
          },
          {
            name: "pattern",
            validator: "^[a-zA-Z.]{2,30}$",
            message: "Accept only Alphabets having length between 2 to 30 and special characters allowed(.)"
          }
        ]
      },  
      // Date of Birth
      {
        key: 'dob',
        type: 'date',
        templateOptions: {
          label: 'Date of Birth',
          name: 'dob',
          id: 'dob',
          placeHolder: 'Date of Birth',
          disable: false,
          value: '',
          minDate: new Date(1930, 0, 1),
          maxDate: new Date(AppUtills.getCurrentYear(), AppUtills.getCurrentMonth(), AppUtills.getCurrentDay() - 1),
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Date of Birth is Required"
          }        ]
      },  
      // Login Channels   
      {
        key: 'loginChannel',
        type: 'select',
        templateOptions: {
          label: 'Login Channel',
          name: 'loginChannel',
          id: 'loginChannel',
          placeHolder: 'Select Login Channel',
          disable: false,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Login Channel is Required"
          }
        ],
        expressionProperties: {
          hooks: {
            onInIt: {
              dataProvider: 'getloginChannels'
            }
          },
        }
      },
      // Id Type
      {
        key: 'idType',
        type: 'select',
        templateOptions: {
          label: 'National Id Type',
          name: 'idType',
          id: 'idType',
          placeHolder: 'Select National Id Type',
          disable: false,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "National Id Type is Required"
          }
        ],
        expressionProperties: {
          hooks: {
            onInIt: {
              dataProvider: 'getidType'
            }
          },
        }
      }, 
      // Language     
      {
        key: 'language',
        type: 'select',
        templateOptions: {
          label: 'Language',
          name: 'language',
          id: 'language',
          placeHolder: 'Select Language',
          disable: false,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Language is Required"
          }
        ],
        expressionProperties: {
          hooks: {
            onInIt: {
              dataProvider: 'getlanguageId'
            }
          },
        }
      },
      // Status
      {
        key: 'status',
        type: 'select',
        templateOptions: {
          label: 'Status',
          name: 'status',
          id: 'status',
          placeHolder: 'Status',
          disable: false,
          styles: {
            isHighlight: false,
            isHidden: false
          },
          options: [
            {
              label: 'Active',
              value: 'active'
            },
            {
              label: 'Inactive',
              value: 'inactive'
            }
          ]
        },
        validationRules: [
          {
            name: "required",
            validator: 'required',
            message: "Status is Required"
          }
        ]
      },
      {
        key:'gender',
        type: 'radiobutton',
        templateOptions: {        
          label: 'Gender',
          name: 'gender',
          id: 'gender',
          placeHolder: 'Gender',        
          disable: false,
          styles: {
            isHighlight: false,
            isHidden: false
          },
          options: [
            {
              label: 'Male',
              value: 'male'
            },
            {
              label: 'Female',
              value: 'female'
            },
            {
              label: 'Transgender',
              value: 'transgender'
            }
          ]
        },
        validationRules: [
          {
            name: "required",          
            validator: 'required',
            message: "Gender is Required"
          }
        ]
      },
      {
        key:'tnc',
        type: 'checkbox',
        templateOptions: {        
          label: 'Accept all terms and condition',
          name: 'tnc',
          id: 'tnc',
          placeHolder: 'T&C',        
          disable: false,
          styles: {
            isHighlight: false,
            isHidden: false
          }
        },
        validationRules: [
          {
            name: "required",          
            validator: 'required',
            message: "T&C is Required"
          }
        ]
      }
    ],
    actions:[
      {
        type: "submit",
        label: 'Submit',
      },
      {
        type: "reset",
        label: "Reset",
      },
      {
        type: "other",
        label: "Cancel",   
        actionHandler:'http://localhost:4200/#/user'
      }
    ]
  }
}