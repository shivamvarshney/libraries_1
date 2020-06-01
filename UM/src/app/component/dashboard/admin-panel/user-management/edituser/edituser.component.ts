import { Validators } from "@angular/forms";
import { FieldConfig, FormDetails } from "@src/core/aaf-form/field.interface";
import { AafFormComponent } from "@src/core/aaf-form/aaf-form.component";
import { Component, ViewChild, OnInit, Input, OnDestroy } from '@angular/core';
import { FacadeService } from '@src/core/services/facade.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { EditUserActionsProvider } from './edit-user-actions-provider';
import { DataService } from '@service/data-share-service/data.service';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit, OnDestroy {

  userUnsubscription: Subscription;
  filteredRoleSubscription:Subscription;
  isDirty: boolean = false;
  @ViewChild(AafFormComponent) form: AafFormComponent;
  geoFields = [];

  editUserForm: FormDetails = {
    name: 'editUser',
    class: 'editUser',
    actionHaandler: 'editUser'
  }

  userName: string;
  editObj = {
    name: "Kennedy Jeroge"
  }

  userDetailsSubscription: Subscription;
  editUserSubscription: Subscription;
  masterDataSubscription: Subscription;
  siteGeoFieldsSubscription: Subscription;
  routeSubscription : Subscription;
  dataServiceListen : Subscription;
  siteMasterDataSubscription: Subscription;
  modalResponseSubscription : Subscription;
  masterDataLength: number = 0;
  //editUserRegex: string = environment.userRegexErrorMsg;
  

  constructor(private facadeService: FacadeService,
    private editUserActionsProvider: EditUserActionsProvider,
    private ngxService: NgxUiLoaderService,
    private _routes: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {
    this.routeSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params.id) {
          this.editUserForm.id = params.id;
        }
      }
    );
    this.getUserInfo();

    this.dataServiceListen = this.dataService.listen().subscribe(
      (data: any) => {
        this.isDirty = data
      }
    )
  }

  //confirmation pupup
  canDeactivate(): boolean {
    return !this.isDirty;
  }

  getRoles(){  
    this.filteredRoleSubscription = this.facadeService.onRoleGetAPI(apiUrls.roles).subscribe(
      resp => {                
        this.ngxService.start();        
        if (resp.result) {
          let roleMaster = AppUtills.getValue('roleMaster');
          if(roleMaster && roleMaster!= ''){
            AppUtills.removeValue('roleMaster');
          }
          AppUtills.setValue('roleMaster',JSON.stringify(resp.result));
          this.masterDataLength = 8;                                                  
        }
        this.ngxService.stop();
      },
      err => {
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    );
  }

  getUserInfo() {
    this.ngxService.start();
    let editUserObj = { userId: this.editUserForm.id };
    this.userDetailsSubscription = this.facadeService.onUserPostAPI(apiUrls.getUserById, editUserObj).subscribe(
      (resp: any) => {
        if (resp.body.result) {
          if (resp.body.result.siteId) {
            let paginationObj = {
              pageNo: 1,
              pageSize: 100,
              siteId: resp.body.result.siteId
            }
            this.siteMasterDataSubscription = this.facadeService.getSiteGeoLocationPagination(paginationObj).subscribe(
              (respData: any) => {
                AppUtills.removeValue('masterSiteData');
                AppUtills.setValue('masterSiteData', JSON.stringify(respData.result));
                this.userName = resp.body.result.firstName + ' ' + resp.body.result.lastName;
                this.getMasterData();
              }
            )
          } else {
            this.userName = resp.body.result.firstName + ' ' + resp.body.result.lastName;
            this.getMasterData();
          }
        }
      },
      err => {
        //alert('Something went Wrong');
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    )
  }

  updateFieldConfiguration() {
    let counter = 1;
    let updatedFields = [];
    this.geoFields.map((value, key) => {
      let fieldObj = {};
      fieldObj['type'] = 'select';
      fieldObj['label'] = value;
      fieldObj['name'] = 'L' + counter;
      fieldObj['value'] = '';
      fieldObj['disabled'] = true;
      fieldObj['visibility'] = true;
      fieldObj['isMultiselect'] = true;
      fieldObj['optionsData'] = false;
      fieldObj['geoConfig'] = true;
      fieldObj['levelId'] = counter;
      if (counter < this.geoFields.length) {
        let dependentArray = [];
        for (let index = counter + 1; index <= this.geoFields.length; index++) {
          dependentArray.push('L' + index);
        }
        fieldObj['onChange'] = {
          destination: 'L' + (counter + 1),
          localstorage: true,
          dependent: dependentArray,
          dependentFields: ['siteId']
        };
      }
      if (counter == this.geoFields.length) {
        fieldObj['onChange'] = {
          destination: 'None'
        };
      }
      fieldObj['options'] = [];
      fieldObj['validations'] = [
        {
          name: "required",
          validator: Validators.required,
          message: value + " is Required"
        }
      ];
      if (counter == 1) {
        this.regConfig.map((Fieldvalue, FieldKey) => {
          let siteDependent = [];
          for (let index = 0; index < this.geoFields.length; index++) {
            siteDependent.push('L' + (index + 1));
          }
          if (Fieldvalue.name == "siteId") {
            this.regConfig[FieldKey].dependent = siteDependent;
            this.regConfig[FieldKey].destination = 'L' + counter;
            this.regConfig[FieldKey].onChange = {
              destination: 'L' + counter,
              localstorage: true,
              dependent: siteDependent
            }
          }
          if (Fieldvalue.name == 'role') {
            siteDependent.map(siteDataKey => {
              this.regConfig[FieldKey].onChange.dependent.push(siteDataKey);
            });
          }
        });
      }
      counter = counter + 1;
      updatedFields.push(fieldObj);
    });
    this.regConfig = this.regConfig.concat(updatedFields);

    let buttonsData = [
      {
        type: "button",
        label: "Update User",
        class: 'submit',
        clear: 'submit',
        buttonType: 'submit'
      },
      {
        type: "button",
        label: "Cancel",
        class: 'reset',
        clear: 'cancel',
        buttonType: 'button'
      }
    ];
    this.regConfig = this.regConfig.concat(buttonsData);
    return true;
  }

  getMasterData() {
    this.ngxService.start();
    let masterData = AppUtills.getValue('masterData');
    let storageGeoFields = AppUtills.getValue('geoFields');
    if ((masterData && masterData != '') && (storageGeoFields && storageGeoFields != '')) {
      this.geoFields = JSON.parse(storageGeoFields);
      this.updateFieldConfiguration();
      this.getRoles();
      this.ngxService.stop();
    } else {
      this.ngxService.start();
      this.masterDataSubscription = this.facadeService.getmasterData().subscribe(
        resp => {
          if (resp) {
            AppUtills.removeValue('masterData');
            AppUtills.setValue('masterData', JSON.stringify(resp.result));
            this.siteGeoFieldsSubscription = this.facadeService.getGeoFields().subscribe(
              resp => {
                resp.result.map(geoFieldsData => {
                  if (geoFieldsData.type == "Sales Geographical Hierarchy") {
                    AppUtills.removeValue('geoFields');
                    this.geoFields = geoFieldsData.levels;
                    AppUtills.setValue('geoFields', JSON.stringify(geoFieldsData.levels));
                    this.updateFieldConfiguration();
                    this.getRoles();
                  }
                });
              }
            )
          }
        }, err => {
          this.ngxService.stop();
        },
        () => {
          this.ngxService.stop();
        }
      );
    }
  }
  ngOnInit() {
   this.modalResponseSubscription = this.dataService.listen().subscribe(
      (data: any) => {
        data.modalResponseType ? (
          this.isDirty = false,
          this.back()
        ) : this.isDirty = true;
      });
  }

  back() {
    //this.facadeService.backClicked();
    this._routes.navigate(['/user']);
  }

  regConfig: FieldConfig[] = [
    {
      type: "select",
      label: "Role",
      name: "role",
      value: '',
      visibility: true,
      isMultiselect: true, 
      optionsData: false,
      saveType: ['id'],
      onChange: {
        destination: 'role',
        localstorage: false,
        callApi: false,
        dependent: ['client', 'reportingMsisdn', 'loginModule', 'loginChannels', 'auuid', 'msisdn', 'status', 'idType', 'nationalId', 'mobileNumber', 'firstName', 'lastName', 'email', 'dob', 'languageId', 'department', 'siteId'],
        changeType: [

        ],
        onChange: [
          {
            destination: 'client',
            localstorage: true,
            dependent: ['client'],
            callApi: true,
          },
          {
            destination: 'reportingMsisdn',
            localstorage: false,
            dependent: ['reportingMsisdn'],
            callApi: true,
          }
        ]
      },
      disabled: false,
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Role is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Client ID",
      name: "client",
      value: '',
      disabled: true,
      visibility: true,
      isMultiselect: true,
      optionsData: false,
      geoConfig: false,
      saveType: ['clientId'],
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Client is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Reporting MSISDN",
      name: "reportingMsisdn",
      value: '',
      mendatory: true,
      disabled: true,
      visibility: true,
      isMultiselect: false,
      optionsData: false,
      geoConfig: false,
      options: [

      ],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Reporting MSISDN is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Login Module",
      name: "loginModule",
      value: '',
      mendatory: true,
      disabled: true,
      visibility: true,
      geoConfig: false,
      isMultiselect: false,
      optionsData: false,
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Login Module is Required"
        }
      ],
      onChange: {
        destination: 'loginModule',
        localstorage: false,
        callApi: false,
        changeType: [
          {
            source: 'AUUID',
            addDestination: ['auuid'],
            removeDestination: ['msisdn']
          },
          {
            source: 'MSISDN',
            addDestination: ['msisdn'],
            removeDestination: ['auuid']
          }
        ]
      },
    },
    {
      type: "input",
      label: "AUUID",
      inputType: "text",
      name: "auuid",
      placeHolder: 'AUUID',
      disabled: false,
      visibility: true,
      value: '',
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "AUUID is Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern(environment.addUserReg),
          message: environment.userRegexErrorMsg
        }
      ]
    },
    {
      type: "input",
      label: "MSISDN",
      inputType: "text",
      name: "msisdn",
      value: '',
      placeHolder: 'MSISDN',
      disabled: false,
      visibility: false,
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "MSISDN is Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern(environment.addUserReg),
          message: environment.userRegexErrorMsg
        }
      ]
    },
    {
      type: "select",
      label: "Login Channels",
      name: "loginChannels",
      value: '',
      disabled: true,
      visibility: true,
      geoConfig: false,
      isMultiselect: true,
      optionsData: false,
      saveType: ['id'],
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Login Channel is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Status",
      name: "status",
      value: '',
      mendatory: true,
      disabled: false,
      visibility: true,
      isMultiselect: false,
      geoConfig: false,
      optionsData: false,
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Status is Required"
        }
      ]
    },
    {
      type: "select",
      label: "National Id Type",
      name: "idType",
      value: '',
      mendatory: false,
      disabled: false,
      isMultiselect: false,
      visibility: true,
      geoConfig: false,
      optionsData: false,
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "National Id Type is Required"
        }
      ]
    },
    {
      type: "input",
      label: "National Id",
      inputType: "text",
      name: "nationalId",
      disabled: false,
      visibility: true,
      value: '',
      placeHolder: 'National Id',
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "National Id is Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern("^[0-9a-zA-Z-/]{7,20}$"),
          message: "Accept only AlphaNumeric having length between 7 to 20 and special characters allowed(-,/)"
        }
      ]
    },
    {
      type: "input",
      label: "Mobile Number",
      inputType: "text",
      name: "mobileNumber",
      disabled: false,
      visibility: true,
      value: '',
      placeHolder: 'Number',
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Mobile Number is Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern(environment.addUserReg),
          message: environment.userRegexErrorMsg
        }
      ]
    },
    {
      type: "input",
      label: "First name",
      inputType: "text",
      name: "firstName",
      disabled: false,
      visibility: true,
      value: '',
      placeHolder: 'Name',
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "First name is Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern("^[a-zA-Z.]{2,30}$"),
          message: "Accept only Alphabets having length between 2 to 30 and special characters allowed(.)"
        }
      ]
    },
    {
      type: "input",
      label: "Last name",
      inputType: "text",
      name: "lastName",
      disabled: false,
      value: '',
      visibility: true,
      placeHolder: 'Name',
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Last name is Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern("^[a-zA-Z.]{2,30}$"),
          message: "Accept only Alphabets having length between 2 to 30 and special characters allowed(.)"
        }
      ]
    },
    {
      type: "input",
      label: "Email Id",
      inputType: "text",
      name: "email",
      disabled: false,
      value: '',
      visibility: true,
      placeHolder: 'Name',
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Email Id is Required"
        },
        {
          name: "pattern",
          validator: Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
          message: "Invalid email"
        }
      ]
    },
    {
      type: "date",
      label: "Date of Birth",
      name: "dob",
      placeHolder: 'dd-mm-yy',
      disabled: false,
      minDate: new Date(1930, 0, 1),
      maxDate: new Date(AppUtills.getCurrentYear(), AppUtills.getCurrentMonth(), AppUtills.getCurrentDay() - 1),
      visibility: true,
      value: '',
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Date of Birth is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Primary Language",
      name: "languageId",
      value: '',
      mendatory: true,
      disabled: false,
      isMultiselect: false,
      visibility: true,
      optionsData: false,
      geoConfig: false,
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Primary Language is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Department",
      name: "department",
      value: '',
      mendatory: true,
      disabled: true,
      isMultiselect: false,
      visibility: true,
      optionsData: false,
      geoConfig: false,
      options: [

      ],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Department is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Site",
      name: "siteId",
      value: '',
      disabled: true,
      visibility: true,
      isMultiselect: false,
      optionsData: false,
      options: [],
      geoConfig: false,
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Site is Required"
        }
      ]
    }
    /*
    {
      type: "select",
      label: "Region",
      levelId: 1,
      name: "region",
      value: '',
      disabled: false,
      visibility: true,
      isMultiselect: true,
      optionsData: false,
      dependent: ['territory', 'cluster', 'unit'],
      destination: 'territory',
      localstorage: true,
      geoConfig: true,
      onChange: {
        destination: 'territory',
        localstorage: true,
        dependent: ['territory', 'cluster', 'unit']
      },
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Region is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Territory",
      levelId: 2,
      name: "territory",
      value: '',
      disabled: false,
      visibility: true,
      isMultiselect: true,
      optionsData: false,
      geoConfig: true,
      onChange: {
        destination: 'cluster',
        localstorage: true,
        dependent: ['cluster', 'unit']
      },
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Territory is Required"
        }
      ]
    },
    {
      type: "select",
      label: "Cluster",
      levelId: 3,
      name: "cluster",
      value: '',
      disabled: false,
      visibility: true,
      isMultiselect: true,
      geoConfig: true,
      optionsData: false,
      onChange: {
        destination: 'unit',
        localstorage: true,
        dependent: ['unit']
      },
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Cluster is Required"
        }
      ]
    },

    {
      type: "select",
      label: "Unit",
      name: "unit",
      levelId: 4,
      value: '',
      disabled: false,
      visibility: true,
      isMultiselect: true,
      optionsData: false,
      geoConfig: true,
      options: [],
      validations: [
        {
          name: "required",
          validator: Validators.required,
          message: "Unit is Required"
        }
      ]
    },
    {
      type: "button",
      label: "Update User",
      class: 'submit',
      clear: 'submit',
      buttonType: 'submit'
    },
    {
      type: "button",
      label: "Cancel",
      class: 'reset',
      clear: 'cancel',
      buttonType: 'button'
    }
    */
  ];

  getPareentGeoLocations(submitForm, fieldConfig, fieldName) {
    if (submitForm[fieldName].indexOf(0) >= 0) {
      let fieldInfoName;
      fieldConfig.map((mappedVal, mappedKey) => {
        if (mappedVal.onChange && mappedVal.onChange.destination && mappedVal.onChange.destination == fieldName) {
          fieldInfoName = mappedVal.name;
        }
      });
      if (fieldInfoName && fieldInfoName != '') {
        return this.getPareentGeoLocations(submitForm, fieldConfig, fieldInfoName);
      } else {
        return this.removeZeroFromArray(submitForm[fieldName]);
      }
    } else {
      return this.removeZeroFromArray(submitForm[fieldName]);
    }
  }

  removeZeroFromArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 0) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }

  submitEditUserForm(value: { [name: string]: any }) {
    this.ngxService.start();
    let geoConfigFields = [];
    let saveFieldsObject = [];
    this.regConfig.map((fieldVal, fieldKey) => {
      if (fieldVal.type && fieldVal.type == 'date') {
        if (value[fieldVal.name]) {
          var today = new Date(value[fieldVal.name]);
          var cDate = today.getDate();
          var cMonth = today.getMonth() + 1;
          var cYear = today.getFullYear();
          let dobReq = cMonth + '/' + cDate + '/' + cYear;
          value[fieldVal.name] = dobReq;
        }
      }
      if (fieldVal.geoConfig) {
        geoConfigFields.push(fieldVal);
      }
      if (fieldVal.saveType && fieldVal.saveType.length > 0) {
        saveFieldsObject.push(fieldVal);
      }
    });
    let levelIds = [];
    let geoIds = [];
    if (geoConfigFields.length > 0) {
      let lastField;
      geoConfigFields.map((lastFieldInfo, lastFieldKey) => {
        if (value[lastFieldInfo.name] && value[lastFieldInfo.name].length > 0) {
          value[lastFieldInfo.name].map((fVal, fKey) => {
            if (fVal != 0) {
              geoIds.push({ id: fVal });
            }
          });
        } 
        if (!lastFieldInfo.onChange) {
          lastField = lastFieldInfo;
        }
      });
      /*
      if(lastField){
        let lavelValues = this.getPareentGeoLocations(value,geoConfigFields,lastField.name);
        if(lavelValues.length > 0){
          lavelValues.map((infoVal,infoKey)=>{
            let obj = {id:infoVal};
            levelIds.push(obj);
          });        
          value['levelId'] = levelIds;  
        }        
      }
      */
      if (geoIds) {
        value['levelId'] = geoIds;
      }
    }
    if (saveFieldsObject.length > 0) {
      saveFieldsObject.map((fieldInfo, fieldInfoKey) => {
        let updatedFieldData = [];
        value[fieldInfo.name].map(val => {
          if (val != 0) {
            let jsObj = {};
            jsObj[fieldInfo.saveType[0]] = val;
            updatedFieldData.push(jsObj);
          }
        });
        value[fieldInfo.name] = updatedFieldData;
      });
    }
    value['id'] = this.editUserForm.id;
    this.userUnsubscription = this.facadeService.onUserPostAPI(apiUrls.updateUser, value).subscribe(res => {
      res = res.body || res;
      let data = res;
      if (data) {
        this.ngxService.stop();
        this.isDirty = false;
        if (data.statusCode == 200 && data.message) {
          this.facadeService.openArchivedSnackBar(res.message, 'Success');
          this._routes.navigate(['/user/users']);
        } else {
          this.facadeService.openArchivedSnackBar(res.message || 'Something Went Wrong', 'Retry');
        }
      }
    }, error => {
      this.ngxService.stop();
      if(AppUtills.showErrorMessage(error)){
        this.facadeService.openArchivedSnackBar('Something Went Wrong', 'Retry');
      }
    });
  }

  ngOnDestroy() {
    this.masterDataSubscription ? this.masterDataSubscription.unsubscribe() : '';
    this.siteGeoFieldsSubscription ? this.siteGeoFieldsSubscription.unsubscribe() : '';
    this.userDetailsSubscription ? this.userDetailsSubscription.unsubscribe() : '';
    this.editUserSubscription ? this.editUserSubscription.unsubscribe() : '';
    this.routeSubscription ? this.routeSubscription.unsubscribe() : '';
    this.dataServiceListen ? this.dataServiceListen.unsubscribe() : '';
    this.siteMasterDataSubscription ? this.siteMasterDataSubscription.unsubscribe() : '';
    this.modalResponseSubscription ? this.modalResponseSubscription.unsubscribe() : '';
    this.filteredRoleSubscription ? this.filteredRoleSubscription.unsubscribe() : '';
  }

}
