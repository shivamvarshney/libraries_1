import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FacadeService } from '@src/core/services/facade.service';
import { DataService } from '@service/data-share-service/data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { HandleCommonApiService } from '@service/common-api-service/handle-common-api.service';
import { Observable, of, forkJoin, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isArray } from 'util';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss', '../common-form.scss'],
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
export class BankComponent implements OnInit, OnDestroy {

  fields: any;
  paramId: string;
  agentDetails: any;
  userActorId: string;
  imageURL: any = '';
  openSlider: string = '';
  visibleModel: boolean = false;
  resType: string;
  dropdownList = [];
  imgnameArray = [];
  currentReasons = [];
  imageUrlArray: any = [];
  rejResonResponse: any;
  dropdownSettings = {};
  uniqueArray: any;
  editAgentBusInfo: any;
  tooltipMsg = '';
  remarkText: string = '';
  acceptBoolean = false;
  rejectBoolean = true;
  hideInCocoCase: boolean = false;
  showRemarkError: boolean = false;
  highlightError: boolean = false;
  acceptBtn: boolean = false;
  htmltxt: any;
  inputTxt: any = '';
  currentRejectionSubReasons = [];
  curLabelTxt: string;
  rejResionRes: object;
  remarks: boolean = false;
  businessUnsubscription: Subscription;
  paramIdSubscription: Subscription;
  geoLocationSubscriber: Subscription;
  busUnsubscription: Subscription;
  singleImageSubscriber: Subscription;
  sliderImageImageSubscriber: Subscription;
  forkGeoLocationSubscriber: Subscription;
  reasonTxt: string = "Add Rejection Reason";
  safeUrl: SafeResourceUrl;
  actorInfo: any = JSON.parse(AppUtills.getValue('actor_info'));

  // ****************** dynamic form field ********************//
  fieldInfo(editAgentKyc) {
    this.fields = [
      {
        type: "input",
        label: "Bank Name *",
        inputType: "text",
        name: "bank_name",
        disabled: false,
        placeHolder: 'Bank Name',
        value: (editAgentKyc.id_channelType) ? editAgentKyc.id_channelType : '',
        validations: [],
        businessKey: ['id_channelType'],
        highlight: false
      },
      {
        type: "input",
        label: "Bank Account Holder Name",
        inputType: "text",
        name: "bank_acc_holder_name",
        disabled: false,
        placeHolder: 'Bank Account Holder Name',
        value: (editAgentKyc.id_channelType) ? editAgentKyc.id_channelType : '',
        validations: [],
        businessKey: ['id_channelType'],
        highlight: false
      },
      {
        type: "input",
        label: "Bank Account No *",
        inputType: "text",
        disabled: false,
        placeHolder: 'Bank Account No',
        value: (editAgentKyc.id_channelType) ? editAgentKyc.id_channelType : '',
        validations: [],
        businessKey: ['id_channelType'],
        highlight: false
      }
    ];
  }

  // ****************** dynamic form field ********************//
  dynamicForm: FormGroup;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);

  constructor(private facadeService: FacadeService,
    private dataService: DataService,
    private _router: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private route: Router,
    private commonApiService: HandleCommonApiService,
    private _http: HttpClient,
    private domSanitizer: DomSanitizer) { }
  ngOnInit() {
    let caseOutletObj = JSON.parse(AppUtills.getValue('storedCaseDetails'));
    if (caseOutletObj.ownerType.toLowerCase() == "COCO".toLowerCase()) {
      this.hideInCocoCase = true;
      AppUtills.removeValue('rejResonRes');
    }
    else {
      this.hideInCocoCase = false;

      this.fieldInfo('fieldVal');
      this.paramIdSubscription = this._router.params.subscribe((params: Params) => {
        this.paramId = params.id;
      });
      this.getUserKycDetails();

      if (JSON.parse(AppUtills.getValue('reasons'))) {
        this.rejResionRes = JSON.parse(AppUtills.getValue('reasons'));
      }

      if (JSON.parse(AppUtills.getValue('rejResonRes')) && JSON.parse(AppUtills.getValue('rejResonRes')) !== '') {
        this.rejResonResponse = JSON.parse(AppUtills.getValue('rejResonRes'));
      }

      const controls = {};
      this.fields.map(res => {
        const validationsArray = [];
        res.validations.forEach(value => {
          if (value.name === 'required') {
            validationsArray.push(
              Validators.required
            );
          }
          if (value.name === 'pattern') {
            validationsArray.push(
              Validators.pattern(value.pattern)
            );
          }
        });
        controls[res.label] = new FormControl('', validationsArray);
      });
      this.dynamicForm = new FormGroup(
        controls
      );

      let caseOutletObj = JSON.parse(AppUtills.getValue('storedCaseDetails'));
      if (caseOutletObj.ownerType.toLowerCase() == "AGGREGATOR".toLowerCase()) {
        this.acceptBtn = true;
      }
    }
  }

  agentUpdatedFieldObj(detailsInfo) {
    this.fields.map((curVal, curkey) => {
      if (detailsInfo && Object.keys(detailsInfo).length > 0) {
        Object.keys(detailsInfo).map((upVal, upkey) => {
          if ((curVal.businessKey[0] == upVal) && (curVal.value != detailsInfo[upVal])) {
            this.fields[curkey]['value'] = curVal.value;//detailsInfo[upVal];
            this.fields[curkey]['highlight'] = true;
            if (curVal.type == 'radio' || curVal.type == 'checkbox') {
              this.fields[curkey].options.map((optionsValue, optionsKey) => {
                let boolean = false;
                if (parseInt(optionsValue.optionId) == parseInt(curVal.value)) {
                  boolean = true;
                }
                this.fields[curkey].options[optionsKey].status = boolean;
              });
            }
          }
        })
      }
    });
  }

  arr = [];
  createImageNode(srcObj, idType, index, highlight?: boolean) {
    let imageObj = {
      type: "image",
      label: idType,
      name: "image",
      imgType: 'img',
      inputType: srcObj.resourceType,
      placeHolder: idType,
      disabled: false,
      options: [],
      validations: [],
      highlight: (highlight ? highlight : false),
      businessKey: ['mobNumAgentInfo'],
    }
    if (imageObj.inputType == 'pdf') {
      this.arr.push({
        resType: srcObj.resourceData,
        id: index,
        label: idType
      });
    } else {
      imageObj['imagePath'] = this.domSanitizer.bypassSecurityTrustUrl("data:image/image/" + srcObj.resourceType + ";base64," + srcObj.resourceData)
    }
    this.fields.push(imageObj);
  }

  prepareObj(imgobject) {
    this.imgnameArray = [];
    let companyRegistrationCertificateImage = imgobject && imgobject.hasOwnProperty('id_companyRegistrationCertificateImage') && (imgobject['id_companyRegistrationCertificateImage'].length > 1 ? imgobject['id_companyRegistrationCertificateImage'] : imgobject['id_companyRegistrationCertificateImage'][0]);
    let taxClearanceCertificateImage = imgobject && imgobject.hasOwnProperty('id_taxClearanceCertificateImage') && (imgobject['id_taxClearanceCertificateImage'].length > 1 ? imgobject['id_taxClearanceCertificateImage'] : imgobject['id_taxClearanceCertificateImage'][0]);
    this.imgnameArray.push(
      { 'name': companyRegistrationCertificateImage, 'fieldName': "Bank letter to confirm client account details", backendFieldKey: 'id_companyRegistrationCertificateImage' },
      { 'name': taxClearanceCertificateImage, 'fieldName': "Bank letter to confirm client account details", backendFieldKey: 'id_taxClearanceCertificateImage' },
      )
    return this.imgnameArray;
  }

  createSliderImage(srcObj, idType, index, highlight?: boolean) {
    let imgSliderObj = {
      type: "slider",
      label: idType,
      name: "image",
      imgType: 'img',
      inputType: 'slider',
      placeHolder: idType,
      disabled: false,
      options: [],
      validations: [],
      highlight: (highlight ? highlight : false),
      imageDataUrls: srcObj
    }
    this.fields.push(imgSliderObj);
  }

  makePdfNode(srcObj, idType, index, highlight?: boolean) {
    this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + srcObj.resourceData);
    let imageObj = {
      type: "singlepdf",
      label: idType,
      name: "singlepdf",
      imgType: 'singlepdf',
      pdfId: 'pdf_' + index,
      inputType: srcObj.resourceType,
      placeHolder: idType,
      disabled: false,
      options: [],
      validations: [],
      highlight: (highlight ? highlight : false),
      imagePath: this.safeUrl
    }
    this.fields.push(imageObj);
  }

  updateBusinessImageInfo(caseBusinessData) {
    this.ngxService.start();
    let upBusinessInfo = (caseBusinessData && caseBusinessData.hasOwnProperty('info') && caseBusinessData.info.hasOwnProperty('outlets')) ? caseBusinessData.info.outlets : '';
    if (upBusinessInfo && upBusinessInfo != '') {
      this.prepareObj(upBusinessInfo).map((val, key) => {
        if (val.name.constructor.name == "Array") {
          let apiRequests = [];
          val.name.map((mVal, mKey) => {
            let resourceObj = {
              resourceId: mVal ? mVal : '',
              actionName: "DOWNLOAD_IMAGE",
              actionType: "external"
            }
            let getKycImage = this._http.post(apiUrls.cpmImageService, resourceObj);
            apiRequests.push(getKycImage);
          });
          this.sliderImageImageSubscriber = forkJoin(apiRequests).subscribe(
            resData => {
              if (resData) {
                let multipleSliderReq = [];
                resData.map((value, key) => {
                  if (value['statusCode'] && value['statusCode'] == 200 && value['result'] && value['result']['data'] && value['result']['data'].resourceData) {
                    if (value['result']['data']['resourceType'] != 'pdf') {
                      let sanatrizedUrl = (`data:image/image/${value['result']['data']['resourceType']};base64,${value['result']['data']['resourceData']}`);
                      multipleSliderReq.push(sanatrizedUrl);
                    }
                  }
                });
                if (multipleSliderReq.length > 0) {
                  let highlight = this.verifyUpdationOnImageOrPdf(val.backendFieldKey, val.name, caseBusinessData);
                  this.createSliderImage(multipleSliderReq, val.fieldName, key, highlight);
                }
              }
            }
          );
        } else {
          let resourceObj = {
            resourceId: val ? val.name : '',
            actionName: "DOWNLOAD_IMAGE",
            actionType: "external"
          }
          this.singleImageSubscriber = this._http.post(apiUrls.cpmImageService, resourceObj).subscribe((res) => {
            if (res && res['statusCode'] == 200 && res['result'] != '') {
              let data = res['result'].data;
              let highlight = this.verifyUpdationOnImageOrPdf(val.backendFieldKey, val.name, caseBusinessData);
              if (data.resourceType == 'pdf') {
                this.makePdfNode(data, val.fieldName, key, highlight);
              } else {
                this.createImageNode(data, val.fieldName, key, highlight);
              }
              this.ngxService.stop();
            }
          });
        }
        this.ngxService.stop();
      });
    }
  }

  verifyUpdationOnImageOrPdf(fieldName, fieldValue, previousBusinessDetails) {
    if (previousBusinessDetails && previousBusinessDetails.previousInfo && Object.keys(previousBusinessDetails.previousInfo).length > 0) {
      let previousDataBusinessInfo = (previousBusinessDetails && previousBusinessDetails.hasOwnProperty('previousInfo') && previousBusinessDetails.previousInfo.hasOwnProperty('outlets')) ? previousBusinessDetails.previousInfo.outlets : '';
      if (previousDataBusinessInfo && previousDataBusinessInfo[fieldName] && fieldValue) {
        let previousBusinessInfo = previousDataBusinessInfo[fieldName];
        if ((previousBusinessInfo.constructor.name == "Array" && fieldValue.constructor.name == "Array") && (previousBusinessInfo.length == fieldValue.length)) {
          let boolenCheck = true;
          for (let counter = 0; counter < previousBusinessInfo.length; counter++) {
            if (fieldValue.indexOf(previousBusinessInfo[counter]) < 0) {
              boolenCheck = false;
              break;
            }
          }
          return boolenCheck;
        } else if ((previousBusinessInfo.constructor.name != "Array" && fieldValue.constructor.name != "Array") && (previousBusinessInfo == fieldValue)) {
          return false;
        } else if ((previousBusinessInfo.constructor.name == "Array" && previousBusinessInfo.length == 1) && (fieldValue.constructor.name != "Array" && fieldValue == previousBusinessInfo[0])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  // TOC
  prepareTOCData(companyId) {
    let tocname: string;
    if (AppUtills.getValue('toc_master_data') && AppUtills.getValue('toc_master_data') !== '') {
      let tocData = JSON.parse(AppUtills.getValue('toc_master_data'));
      tocData.map((val, key) => {
        if (val.value == companyId) {
          tocname = val.label;
        }
      });
    }
    return tocname;
  }

  updateBusinessInfo(businessDetails) {
    let updateObj = '';
    let getContentInfo = businessDetails;
    //let ownerType = getContentInfo && getContentInfo.ownerType;
    this.userActorId = getContentInfo && getContentInfo.assignedTo;
    this.agentDetails = getContentInfo && getContentInfo.info && getContentInfo.info.outlets;
    let tocId = getContentInfo && getContentInfo.info && getContentInfo.info.outlets && getContentInfo.info.outlets.id_companyTypeList;
    let tocMastertext = this.prepareTOCData(tocId);
    this.fieldInfo(this.agentDetails);
    if (getContentInfo && getContentInfo.previousInfo && Object.keys(getContentInfo.previousInfo).length > 0) {
      getContentInfo.previousInfo && getContentInfo.previousInfo.kycInfo ? (updateObj = getContentInfo.previousInfo.outlets) : '';
      updateObj['id_companyTypeList'] = tocMastertext;      
      updateObj['id_role_owner_type'] = getContentInfo.ownerType;      
      this.agentUpdatedFieldObj(updateObj)
    }
    this.updateBusinessImageInfo(businessDetails);
    if (businessDetails.status == 'PENDING') {
      if (getContentInfo.assignedTo == 0) {
        this.tooltipMsg = 'Please assign this case to yourself or someone else';
      } else if (this.actorInfo.id != getContentInfo.assignedTo) {
        this.tooltipMsg = 'This case is assigned to someone else';
      }
    } else {
      this.tooltipMsg = 'This case is already Approved/Rejected';
    }
    if (this.tooltipMsg != '') {
      this.acceptBoolean = true;
      this.rejectBoolean = true;
    }
  }

  // ******** fetch case details ******** //
  getUserKycDetails() {
    this.tooltipMsg = '';
    this.acceptBoolean = false;
    if (AppUtills.getValue('storedCaseDetails')) {
      let parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));
      this.updateBusinessInfo(parsedCaseJSON);
    } else {
      this.ngxService.start();
      let customUrl = apiUrls.caseList + '?id=' + this.paramId;
      if (AppUtills.checkUserType('dataExecutive')) {
        customUrl += '&status=PENDING&internalStatus=ACCEPTED';
      }
      this.businessUnsubscription = this.facadeService.onGetAPI(customUrl).subscribe(res => {
        let data: any;
        if (res) {
          data = res;
          this.ngxService.stop();
          if ((data.statusCode == 200) && data.message) {
            if (data.result.content.length > 0) {
              let updatedObj = data.result.content[0];
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
                        this.updateBusinessInfo(updatedObj);
                      }
                    }, err => {
                      this.ngxService.stop();
                      if (AppUtills.showErrorMessage(err)) {
                        this.updateBusinessInfo(updatedObj);
                      }

                    }
                  );
                } else {
                  this.updateBusinessInfo(updatedObj);
                }
              } else {
                AppUtills.removeValue('storedCaseDetails');
                AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
                this.updateBusinessInfo(updatedObj);
              }
            } else {
              this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
            }
          } else {
            this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
          }
        }
      }, error => {
        this.ngxService.stop();
        if (AppUtills.showErrorMessage(error)) {
          this.facadeService.openArchivedSnackBar('Something went wrong', 'Retry');
        }
      });
    }
  }

  toggleIconHandler(controls, particularFieldObj) {
    this.currentRejectionSubReasons = [];
    this.inputTxt = controls;
    this.curLabelTxt = this.inputTxt.placeHolder;
    this.currentRejectionSubReasons.length > 0 ? this.highlightError = true : this.highlightError = false
    let textid = (particularFieldObj && particularFieldObj.id).toString();
    let curval = (<HTMLInputElement>document.getElementById(textid));
    if (curval && curval.value !== "") {
      this.remarks = true;
    } else {
      if (curval == null || curval && curval.value == '') {
        (document.getElementById(textid) && <HTMLInputElement>document.getElementById(textid)).style.display = 'none';
      }
    }
  }

  remarkOnChange(event, filedObj: any) {
    if (event) {
      let txt = event.target.value;
      for (let i = 0; i < this.currentReasons.length; i++) {
        if (this.currentReasons[i].fieldId === filedObj.id) {
          this.currentReasons[i]['remarks'] = txt;
          if (this.rejResonResponse && this.rejResonResponse.length > 0) {
            this.rejResonResponse.map((v, k) => {
              this.currentReasons.push(v);
            });
          }
          this.currentReasons = AppUtills.removeDuplicateObject(this.currentReasons, 'fieldId');
          AppUtills.setValue('rejResonRes', JSON.stringify(this.currentReasons));
          return false;
        }
      }
      event ? this.showRemarkError = false : this.showRemarkError = true;
    }
  }

  onChangeHandler(selectedValue: string, event: any, filedObj: any) {
    this.remarks = false;
    let textContent = event.source._elementRef.nativeElement.textContent.trim();
    if (event.checked) {
      this.tooltipMsg !== '' ? (this.rejectBoolean = true) : (this.rejectBoolean = false);

      this.htmltxt = this.inputTxt.value;
      this.currentRejectionSubReasons.push(selectedValue);
      this.currentReasons.push({
        fieldId: filedObj.id,
        rejectionReason: this.currentRejectionSubReasons,
        remarks: this.remarkText
      });
      if (textContent == 'Other') {
        this.remarks = true;
        (<HTMLInputElement>document.getElementById((filedObj.id).toString())).style.display = 'block';
        this.remarkText = '';
      } else {
        this.remarks = false;
      }
      this.currentReasons = AppUtills.removeDuplicateObject(this.currentReasons, 'fieldId');
      //this.currentRejectionSubReasons.length > 0 ? this.highlightError = true : this.highlightError = false
      AppUtills.setValue('rejResonRes', JSON.stringify(this.currentReasons));
    } else {
      this.remarks = false;
      this.htmltxt = this.inputTxt.value;
      this.currentRejectionSubReasons.splice(this.currentRejectionSubReasons.indexOf(selectedValue), 1);
      this.currentRejectionSubReasons.length > 0 ? this.highlightError = true : this.highlightError = false

      if (this.currentReasons.length > 0) {
        this.currentReasons.map((val, key) => {
          if (val.fieldId === filedObj.id) {
            if (this.currentReasons.length === 0) {
              this.tooltipMsg !== '' ? (this.rejectBoolean = true) : (this.rejectBoolean = false);
            }
            if (this.currentReasons && this.currentReasons[key] && this.currentReasons[key]['rejectionReason'].length > 0) {
              this.currentReasons && this.currentReasons[key] && this.currentReasons[key]['rejectionReason'].splice(this.currentReasons[key]['rejectionReason'].indexOf(selectedValue), 1);
            }
          }
        })
      }
      if (this.currentReasons && this.currentReasons.length === 0) {
        this.tooltipMsg !== '' ? (this.rejectBoolean = true) : (this.rejectBoolean = false);
      }
      AppUtills.setValue('rejResonRes', JSON.stringify(this.currentReasons));
    }
  }

  userRejectActionHandler(userStatus) {
    AppUtills.setValue('rejResonRes', JSON.stringify(this.currentReasons));
    this.currentReasons.length == 0 ? '' : (this.commonApiService.onRejectHandler(this.currentReasons));
    AppUtills.removeValue('rejResonRes');
  }

  // will do common needs to change

  // ******** Approve cases ******** //
  userActionHandler(userAction) {
    this.ngxService.start();
    let outletInfo = {
      "actorId": this.actorInfo.id,
      "caseId": parseInt(this.paramId),
      "nextState": userAction.toUpperCase()
    }
    this.busUnsubscription = this.facadeService.onPostAPI(apiUrls.caseAcceptReject, outletInfo).subscribe(res => {
      let data: any;
      if (res) {
        this.ngxService.stop();
        data = res.body || res;
        if ((data.statusCode == 200) && data.message) {
          AppUtills.removeValue('rejResonRes');
          this.facadeService.openArchivedSnackBar(data.message, 'Success');
          let caseInfo = AppUtills.getValue('newCaseData');
          let storedCaseDetails = AppUtills.getValue('storedCaseDetails');
          if (storedCaseDetails && storedCaseDetails != '') {
            AppUtills.removeValue('storedCaseDetails');
          }
          if (caseInfo && caseInfo != '') {
            let storageParsedJson = JSON.parse(caseInfo);
            if (storageParsedJson.caseId) {
              AppUtills.removeValue('newCaseData');
            }
          }
          this.route.navigate(['/case-management']);
        } else {
          this.facadeService.openArchivedSnackBar(data.message, 'Retry');
        }
      }
    }, error => {
      this.ngxService.stop();
      if (AppUtills.showErrorMessage(error)) {
        this.facadeService.openArchivedSnackBar((error.error && error.error.message ? error.error.message : 'Something went wrong'), 'Retry');
      }
    });
  }
  //end
  selected: any;
  zoomSliderInModel(controlObj) {
    this.selected = controlObj;
  }

  isActive(item) {
    return this.selected === item;
  };

  // --------- Zoom image ----------//
  zoomImageInModel(currentControl) {
    this.visibleModel = true;
    this.imageURL = currentControl.imagePath;
  }

  // ---------- Slider Close -------//
  closeSliderModel() {
    this.selected = '';
  }

  // -------- close model ---------//
  closeModel() {
    this.visibleModel = false;
  }

  back() {
    AppUtills.removeValue('rejResonRes');
    this.facadeService.backToDashboard();
  }

  checkActionPermission() {
    let performActionPermissionId = PermissionIds.TRANSACTION_ANY;
    if (AppUtills.checkUserType('dataExecutive')) {
      performActionPermissionId = PermissionIds.TRANSACTION_SPECIFIC;
    }
    if (this.facadeService.validateSpecificPermission(performActionPermissionId)) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.businessUnsubscription ? this.businessUnsubscription.unsubscribe() : '';
    this.paramIdSubscription ? this.paramIdSubscription.unsubscribe() : '';
    this.geoLocationSubscriber ? this.geoLocationSubscriber.unsubscribe() : '';
    this.busUnsubscription ? this.busUnsubscription.unsubscribe() : '';
    this.forkGeoLocationSubscriber ? this.forkGeoLocationSubscriber.unsubscribe() : '';
  }

}
