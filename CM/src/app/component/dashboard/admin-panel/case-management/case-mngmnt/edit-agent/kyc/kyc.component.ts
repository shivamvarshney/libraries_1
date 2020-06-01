import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { FacadeService } from '@src/core/services/facade.service';
import { DataService } from '@service/data-share-service/data.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, forkJoin, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss', '../common-form.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(1000)
      ]),
      transition(':leave',
        animate(1000, style({ opacity: 0 })))
    ])
  ]
})
export class KycComponent implements OnInit {
  dropdownList = [];
  dropdownSettings = {};
  paramId: string; agentDetails: any;
  userActorId: string;
  fields: any;
  imageURL: string = '';
  visibleModel: boolean = false;
  kycUnsubscription: Subscription;
  geoLocationSubscriber: Subscription;
  forkGeoLocationSubscriber: Subscription;
  // show hide KYC form
  kycData: boolean = false;

  // ****************** dynamic form field ********************//
  fieldInfo(editAgentKyc) {
    this.fields = [
      {
        type: "input",
        label: "BVN No",
        inputType: "text",
        name: "bvn_no",
        disabled: false,
        value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.bvnNumber ? editAgentKyc.kycInfo.bvnNumber : '') : '',
        placeHolder: 'BVN No',
        validations: [],
        hightlight: false,
        fieldLocation: ['kycInfo', 'bvnNumber']
      },
      {
        type: "input",
        label: "ID Type",
        inputType: "text",
        name: "id_type",
        value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.idList ? ((editAgentKyc.kycInfo.idList.length > 0 && editAgentKyc.kycInfo.idList[0].idType) ? editAgentKyc.kycInfo.idList[0].idType : '') : '') : '',// editAgentKyc.idList ? (editAgentKyc.idList.idType1 ? editAgentKyc.idList.idType1 : '') : '',
        disabled: false,
        placeHolder: 'ID Type',
        validations: [],
        hightlight: false,
        fieldLocation: ['kycInfo', 'idList', 'idType']
      },
      {
        type: "input",
        label: "ID No",
        inputType: "text",
        name: "id_no",
        disabled: false,
        value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.idList ? ((editAgentKyc.kycInfo.idList.length > 0 && editAgentKyc.kycInfo.idList[0].idNumber) ? editAgentKyc.kycInfo.idList[0].idNumber : '') : '') : '',
        //value: editAgentKyc.idList ? (editAgentKyc.idList.idNumber1 ? editAgentKyc.idList.idNumber1 : '') : '',
        placeHolder: 'ID No',
        validations: [],
        hightlight: false,
        fieldLocation: ['kycInfo', 'idList', 'idNumber']
      },
      {
        type: "input",
        label: "Name",
        inputType: "text",
        name: "name",
        disabled: false,
        value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.name ? editAgentKyc.kycInfo.name : '') : '',
        placeHolder: 'Name',
        validations: [],
        hightlight: false,
        fieldLocation: ['kycInfo', 'name']
      },
      {
        type: "input",
        label: "date",
        inputType: "text",
        name: "date",
        placeHolder: "DOB",
        disabled: false,
        value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.dateOfBirth ? editAgentKyc.kycInfo.dateOfBirth : '') : '',
        options: [],
        validations: [
          {
            name: "required",
            validator: Validators.required,
            pattern: '',
            message: "DOB is required"
          },
          {
            name: "pattern",
            pattern: '',
            message: "Invalid mobile number"
          }
        ],
        hightlight: false,
        fieldLocation: ['kycInfo', 'dateOfBirth']
      },
      {
        type: "input",
        label: "Gender",
        inputType: "text",
        name: "gender",
        value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.gender ? editAgentKyc.kycInfo.gender : '') : '',
        disabled: false,
        placeHolder: 'Gender',
        validations: [],
        hightlight: false,
        fieldLocation: ['kycInfo', 'gender']
      },
      // {
      //   type: "select",
      //   label: "Gender",
      //   name: "Gender",
      //   value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.gender ? editAgentKyc.kycInfo.gender : '') : '',
      //   disabled: false,
      //   options: [
      //     { value: 'male', viewValue: 'Male' },
      //     { value: 'female', viewValue: 'Female' }
      //   ],
      //   validations: [
      //     {
      //       name: "required",
      //       validator: Validators.required,
      //       pattern: '',
      //       message: ""
      //     }
      //   ],
      //   hightlight: false,
      //   fieldLocation: ['kycInfo', 'gender']
      // },
      // {
      //   type: "input",
      //   label: "Mother’s Name",
      //   inputType: "text",
      //   name: "mother_name",
      //   value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.motherName ? editAgentKyc.kycInfo.motherName : '') : '',
      //   disabled: false,
      //   placeHolder: 'Mother’s Name',
      //   validations: [],
      //   hightlight: false,
      //   fieldLocation: ['kycInfo', 'motherName']
      // },
      {
        type: "input",
        label: "Residence address",
        name: "residence_address",
        inputType: "textarea",
        value: editAgentKyc.kycInfo ? (editAgentKyc.kycInfo.id_residenceAddress ? editAgentKyc.kycInfo.id_residenceAddress : '') : '',
        //editAgentKyc.outlets ? (editAgentKyc.outlets.id_businessLicense ? editAgentKyc.outlets.id_businessLicense : '') : '',
        placeHolder: "Residence address",
        disabled: false,
        options: [],
        validations: [
          {
            name: "required",
            validator: Validators.required,
            pattern: '',
            message: "Residence address is required"
          },
          {
            name: "pattern",
            validator: Validators.maxLength(10),
            pattern: '',
            message: "Invalid Residence address"
          }
        ],
        hightlight: false,
        fieldLocation: ['kycInfo', 'id_residenceAddress']
      },
      {
        type: "input",
        label: "MSISDN",
        name: "msisdn",
        inputType: "number",
        value: editAgentKyc.outlets ? (editAgentKyc.outlets.id_primaryServicing ? editAgentKyc.outlets.id_primaryServicing : '') : '',
        placeHolder: "MSISDN",
        disabled: false,
        options: [],
        validations: [],
        hightlight: false,
        fieldLocation: ['outlets', 'id_primaryServicing']
      }
      /*{
        type: "input",
        label: "",
        name: "image",
        imagePath: './assets/images/national_id.png',
        inputType: "number",
        placeHolder: "National ID image*",
        disabled: false,
        options: [],
        validations: [],
        hightlight: false
      }
      */
    ];
  }
  // ****************** dynamic form field ********************//
  dynamicForm: FormGroup;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);

  constructor(private facadeService: FacadeService, private dataService: DataService,
    private ngxService: NgxUiLoaderService, private _router: ActivatedRoute,
    private route: Router, private fb: FormBuilder, private _http: HttpClient,
    private domSanitizer: DomSanitizer) { }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      let control = this.fb.control(
        { value: field.value, disabled: field.disabled }
      );
      group.addControl(field.name, control);
    });
    return group;
  }

  ngOnInit() {
    AppUtills.removeValue('rejResonRes');
    this.fieldInfo('');
    this.dynamicForm = this.createControl();
    this._router.params.subscribe((params: Params) => {
      this.paramId = params.id;
    });
    this.getUserKycDetails();
  }

  // ******** fetch case details ******** //

  createImageNode(srcObj, idType) {
    let imageObj = {
      type: "image",
      label: "",
      name: "image",
      //src: './assets/images/national_id.png',
      inputType: "text",
      placeHolder: idType,
      disabled: false,
      options: [],
      validations: [],
      hightlight: false,
      imagePath: this.domSanitizer.bypassSecurityTrustUrl("data:image/image/png;base64," + srcObj)
    }
    this.fields.push(imageObj);
  }

  updateKycDetails(kycInfo) {
    this.userActorId = kycInfo.assignedTo;
    this.agentDetails = kycInfo.info;
    this.fieldInfo(this.agentDetails);
    let upKycInfo = (kycInfo && kycInfo.info && kycInfo.info.kycInfo) ? kycInfo.info.kycInfo : '';
    if (upKycInfo && upKycInfo != '' && upKycInfo.kyc_id && upKycInfo.kyc_id.length > 0) {
      let apiRequests = [];
      for (let counter = 0; counter < upKycInfo.kyc_id.length; counter++) {
        let resourceObj = {
          //resourceId : 'IMG1582727608831',//upKycInfo.idList[0].imageUrls[counter].url,
          resourceId: upKycInfo.kyc_id[counter],//upKycInfo.idList[0].imageUrls[counter].tag[0] || upKycInfo.idList[0].imageUrls[counter],
          actionName: "DOWNLOAD_IMAGE",
          actionType: "external"
        }
        let getKycImage = this._http.post(apiUrls.cpmImageService, resourceObj);
        apiRequests.push(getKycImage);
      }
      forkJoin(apiRequests).subscribe(
        data => {
          if (data) {
            data.map((value, key) => {
              if (value['statusCode'] && value['statusCode'] == 200 && value['result'] && value['result']['data'] && value['result']['data'].resourceData) {
                let level = 'Passport Back Image';
                if (key == 0) {
                  level = 'Passport Front Image'
                }
                this.createImageNode(value['result']['data'].resourceData, level);
              }
            });
          }
        },
        err => {
          console.error(err)
        }
      );
    }
  }

  getUserKycDetails() {
    if (AppUtills.getValue('storedCaseDetails')) {
      let parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));
      this.updateKycDetails(parsedCaseJSON);
    } else {
      this.ngxService.start();
      let customUrl = apiUrls.caseList + '?id=' + this.paramId;
      if (AppUtills.checkUserType('dataExecutive')) {
        customUrl += '&status=PENDING&internalStatus=ACCEPTED';
      }
      let subscribedData = '';
      this.kycUnsubscription = this.facadeService.onGetAPI(customUrl).subscribe(res => {
        let data: any;
        if (res) {
          data = res;
          this.ngxService.stop();
          if ((data.statusCode == 200) && data.message) {
            if (data.result.content.length > 0) {
              let updatedObj = data.result.content[0];
              subscribedData = updatedObj;
              if (updatedObj.info && updatedObj.info.outlets && updatedObj.info.outlets.id_addShop && updatedObj.info.outlets.id_addShop.length > 0) {
                let leastLabelId = AppUtills.getLowestGeoHierarchyLabelId();
                let levelHierarchy = AppUtills.getSelectedLevelHierarchy(leastLabelId);
                let apiRequests = [];
                updatedObj.info.outlets.id_addShop.map((shopInfo, shopKey) => {
                  let obj = {
                    levelIdList: AppUtills.getSelectedLeafHierarchy(levelHierarchy, shopInfo)
                  }
                  let getGeoHierarchy = this._http.post(apiUrls.levelListDetails, obj);
                  apiRequests.push(getGeoHierarchy);
                });
                if (apiRequests.length > 0) {
                  this.ngxService.start();
                  this.forkGeoLocationSubscriber = forkJoin(apiRequests).subscribe(
                    resData => {
                      if (resData) {
                        resData.map((value, key) => {
                          if (value['statusCode'] && value['statusCode'] == 200 && value['result'] && value['result'].length > 0) {
                            let geoDataInfo = {};
                            value['result'].map(val => {
                              geoDataInfo = AppUtills.prepareCaseGeoHierarchy(val, geoDataInfo);
                            });
                            updatedObj.info.outlets.id_addShop[key]['geoHierarchy'] = geoDataInfo;
                          }
                        });
                        this.ngxService.stop();
                        AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
                        this.updateKYCStorageDetails(updatedObj);
                      }
                    }, err => {
                      this.ngxService.stop();
                      if (AppUtills.showErrorMessage(err)) {
                        this.updateKYCStorageDetails(updatedObj);
                      }

                    }
                  );
                } else {
                  this.updateKYCStorageDetails(updatedObj);
                }
                /*
                if (updatedObj.ownerType.toLowerCase() == "AGGREGATOR".toLowerCase()) {
                  let regionIds = [];
                  updatedObj.info.outlets.id_addShop.map(shopInfo => {
                    if (regionIds.indexOf(shopInfo.id_region) < 0) {
                      regionIds.push(shopInfo.id_region);
                    }
                  });
                  if (updatedObj.previousInfo && updatedObj.previousInfo.outlets && updatedObj.previousInfo.outlets.id_addShop && updatedObj.previousInfo.outlets.id_addShop.length > 0) {
                    updatedObj.previousInfo.outlets.id_addShop.map(shopInfo => {
                      if (regionIds.indexOf(shopInfo.id_region) < 0) {
                        regionIds.push(shopInfo.id_region);
                      }
                    });
                  }
                  if (regionIds.length > 0) {
                    let obj = {
                      levelIdList: regionIds
                    }
                    this.geoLocationSubscriber = this.facadeService.onCMPostAPI(apiUrls.levelDetails, obj).subscribe(res => {
                      let data: any;
                      if (res) {
                        this.ngxService.stop();
                        data = res.body || res;
                        if (data.statusCode == 200 && data.message && data.result) {
                          let updatedInfo = AppUtills.aggregatorUpdateGeoLocation(data.result, updatedObj);
                          this.updateKYCStorageDetails(updatedInfo);
                        }
                      }
                    }, error => {
                      if (AppUtills.showErrorMessage(error)) {
                        this.updateKYCStorageDetails(updatedObj);
                      }
                      this.ngxService.stop();
                    }, () => {
                      this.ngxService.stop();
                    });
                  } else {
                    this.updateKYCStorageDetails(updatedObj);
                  }
                } else {
                  let siteIds = []
                  updatedObj.info.outlets.id_addShop.map(shopInfo => {
                    if (siteIds.indexOf(shopInfo.id_cpSiteId) < 0) {
                      siteIds.push(shopInfo.id_cpSiteId);
                    }
                  });
                  if (updatedObj.previousInfo && updatedObj.previousInfo.outlets && updatedObj.previousInfo.outlets.id_addShop && updatedObj.previousInfo.outlets.id_addShop.length > 0) {
                    updatedObj.previousInfo.outlets.id_addShop.map(shopInfo => {
                      if (siteIds.indexOf(shopInfo.id_region) < 0) {
                        siteIds.push(shopInfo.id_region);
                      }
                    });
                  }
                  if (siteIds.length > 0) {
                    this.ngxService.start();
                    let sitesObj = { siteIdList: siteIds }
                    this.geoLocationSubscriber = this.facadeService.onCMPostAPI(apiUrls.siteInfo, sitesObj).subscribe(res => {
                      let data: any;
                      if (res) {
                        this.ngxService.stop();
                        data = res.body || res;
                        if (data.statusCode == 200 && data.message && data.result && Object.keys(data.result).length > 0) {
                          let updatedInfo = AppUtills.OutLetGeoLocations(data.result, updatedObj);
                          this.updateKYCStorageDetails(updatedInfo);
                        } else {
                          this.updateKYCStorageDetails(updatedObj);
                        }
                      } else {
                        this.updateKYCStorageDetails(updatedObj);
                      }
                    });
                  } else {
                    this.updateKYCStorageDetails(updatedObj);
                  }
                }
                */
              } else {
                this.updateKYCStorageDetails(updatedObj);
              }
            } else {
              this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
            }
          } else {
            this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
          }
        }
      }, error => {
        if (subscribedData && subscribedData != '') {
          this.updateKYCStorageDetails(subscribedData);
        } else {
          this.ngxService.stop();
          if (AppUtills.showErrorMessage(error)) {
            this.facadeService.openArchivedSnackBar('Something went wrong', 'Retry');
          }
        }
      });
    }
  }

  updateKYCStorageDetails(updatedObj) {
    AppUtills.removeValue('storedCaseDetails');
    AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
    this.updateKycDetails(updatedObj);
    true;
  }

  // --------- Zoom image ----------//
  zoomImageInModel(currentControl) {
    this.visibleModel = true;
    this.imageURL = currentControl.imagePath;
  }

  // -------- close model ---------//
  closeModel() {
    this.visibleModel = false;
  }

  back() {
    this.facadeService.backToDashboard();
  }

  ngOnDestroy() {
    this.kycUnsubscription ? this.kycUnsubscription.unsubscribe() : '';
    this.geoLocationSubscriber ? this.geoLocationSubscriber.unsubscribe() : '';
    this.forkGeoLocationSubscriber ? this.forkGeoLocationSubscriber.unsubscribe(): '';
  }

}
