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
  selector: 'business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss', '../common-form.scss'],
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
export class BusinessComponent implements OnInit, OnDestroy {

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
  fieldInfo(editAgentKyc, tocMastertxt, caseData?: any) {
    this.fields = [
      {
        type: "input",
        label: "Role *",
        inputType: "text",
        name: "role",
        disabled: false,
        placeHolder: 'Role',
        //value: (editAgentKyc && editAgentKyc.id_role && editAgentKyc.id_role.length > 0) ? editAgentKyc.id_role.join(',') : '',
        value: (caseData && caseData.ownerType) ? caseData.ownerType : '',
        validations: [],
        businessKey: ['id_role_owner_type'],
        highlight: false
      },
      {
        type: "input",
        label: "Business License/Permit No",
        inputType: "text",
        name: "business_license/permit_no",
        disabled: false,
        placeHolder: 'Business License/Permit No',
        value: (editAgentKyc.id_businessLicense) ? editAgentKyc.id_businessLicense : '',
        validations: [],
        businessKey: ['id_businessLicense'],
        highlight: false
      },
      {
        type: "input",
        label: "Type Of Company",
        inputType: "text",
        name: "type_of_company",
        disabled: false,
        placeHolder: 'Type Of Company',
        value: tocMastertxt ? tocMastertxt : '',//(editAgentKyc.id_companyTypeList) ? editAgentKyc.id_companyTypeList : '',
        validations: [],
        businessKey: ['id_companyTypeList'],
        highlight: false
      },
      {
        type: "input",
        label: "Business Address",
        inputType: "text",
        name: "business_address",
        disabled: false,
        placeHolder: 'Business address',
        value: (editAgentKyc.id_postalAddressInput) ? editAgentKyc.id_postalAddressInput : '',
        validations: [],
        businessKey: ['id_postalAddressInput'],
        highlight: false
      },
      {
        type: "input",
        label: "Commercial Activity Done in last 12 months",
        inputType: "text",
        name: "activity",
        disabled: false,
        placeHolder: 'Commercial Activity Done in last 12 months',
        value: (editAgentKyc.id_commercialActivityInput) ? editAgentKyc.id_commercialActivityInput : '',
        validations: [],
        businessKey: ['id_commercialActivityInput'],
        highlight: false
      },
      {
        type: "input",
        label: "Source of funds",
        inputType: "text",
        name: "source_of_funds",
        disabled: false,
        placeHolder: 'Source of funds',
        value: (editAgentKyc.id_sourceOfFunds) ? editAgentKyc.id_sourceOfFunds : '',
        validations: [],
        businessKey: ['id_sourceOfFunds'],
        highlight: false
      },
      // {
      //   type: "input",
      //   label: "Use primary no for servicing?",
      //   name: "primary_no",
      //   inputType: "text",
      //   placeHolder: "Use primary no for servicing",
      //   value: (editAgentKyc.id_primaryServicing) ? editAgentKyc.id_primaryServicing : '',
      //   disabled: false,
      //   checkPrimaryStatus: true,
      //   options: [{ 'optionId': 2, 'checkname': 'Yes', 'status': editAgentKyc.id_usePrimaryNo == 'YES' ? true : false }, { 'optionId': 1, 'checkname': 'No', 'status': editAgentKyc.id_usePrimaryNo == 'NO' ? true : false }],
      //   validations: [],
      //   businessKey: ['id_primaryServicing'],
      //   highlight: false
      // },
      {
        type: "radio",
        label: "CP does not hold any criminal record in matters relating to finance, fraud, honesty or integrity, to the best of my knowledge.",
        name: "primary_no",
        inputType: "radio",
        placeHolder: "CP does not hold any criminal record",
        value: (editAgentKyc && editAgentKyc.id_agreementRadio) ? editAgentKyc.id_agreementRadio : '',//(editAgentKyc.id_primaryServicing) ? editAgentKyc.id_primaryServicing : '',
        disabled: false,
        options: [{ 'optionId': 1, 'checkname': 'No', 'status': editAgentKyc.id_agreementRadio == '1' ? true : false }, { 'optionId': 2, 'checkname': 'Yes', 'status': editAgentKyc.id_agreementRadio == '2' ? true : false }],
        validations: [],
        businessKey: ['id_agreementRadio'],
        highlight: false
      },
      {
        type: "checkbox",
        label: "Oualifying criteria for agent selection",
        name: "primary_no",
        inputType: "checkbox",
        placeHolder: "Use primary no for servicing",
        value: (editAgentKyc && editAgentKyc.id_agentSelectionCriteriaList) ? editAgentKyc.id_agentSelectionCriteriaList : '',//(editAgentKyc.id_primaryServicing) ? editAgentKyc.id_primaryServicing : '',
        disabled: false,
        options: [{ 'optionId': 1, 'checkname': 'Outreach', 'status': editAgentKyc.id_agentSelectionCriteriaList == '1' ? true : false }, { 'optionId': 2, 'checkname': 'Competence', 'status': editAgentKyc.id_agentSelectionCriteriaList == '2' ? true : false }, { 'optionId': 3, 'checkname': 'Integrity', 'status': editAgentKyc.id_agentSelectionCriteriaList == '3' ? true : false }, { 'optionId': 4, 'checkname': 'Others', 'status': editAgentKyc.id_agentSelectionCriteriaList == '4' ? true : false }],
        validations: [],
        businessKey: ['id_agentSelectionCriteriaList'],
        highlight: false
      },
      {
        type: "input",
        label: "Channel Type",
        inputType: "text",
        name: "channel_type",
        disabled: false,
        placeHolder: 'Channel Type',
        value: (editAgentKyc.id_channelType) ? editAgentKyc.id_channelType : '',
        validations: [],
        businessKey: ['id_channelType'],
        highlight: false
      },
      {
        type: "input",
        label: "Agent Name",
        inputType: "text",
        name: "agent_name",
        disabled: false,
        placeHolder: 'Agent Name',
        value: (editAgentKyc.id_agentName) ? editAgentKyc.id_agentName : '',
        validations: [],
        businessKey: ['id_agentName'],
        highlight: false
      },
      {
        type: "input",
        label: "CP ownership type",
        inputType: "text",
        name: "owner_type",
        disabled: false,
        placeHolder: 'CP ownership type',
        value: (editAgentKyc.id_ownership) ? editAgentKyc.id_ownership : '',
        validations: [],
        businessKey: ['ownerType'],
        highlight: false
      },
      {
        type: "input",
        label: "Company Registration No.",
        inputType: "text",
        name: "company_registration_no",
        disabled: false,
        placeHolder: 'Company Registration No.',
        value: (editAgentKyc.id_companyRegistrationNumber) ? editAgentKyc.id_companyRegistrationNumber : '',
        validations: [],
        businessKey: ['id_companyRegistrationNumber'],
        highlight: false
      },
      {
        type: "input",
        label: "Tax registration No. ",
        inputType: "text",
        name: "tax_registration_no.",
        disabled: false,
        placeHolder: 'Tax Registration No.',
        value: (editAgentKyc.id_taxRegistrationNumber) ? editAgentKyc.id_taxRegistrationNumber : '',
        validations: [],
        businessKey: ['id_taxRegistrationNumber'],
        highlight: false
      },
      {
        type: "input",
        label: "Email",
        inputType: "text",
        name: "email.",
        disabled: false,
        placeHolder: 'Email',
        value: (editAgentKyc.id_email) ? editAgentKyc.id_email : '',
        validations: [],
        businessKey: ['id_email'],
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

      this.fieldInfo('fieldVal', '');
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
    let cpCO2FormImg = imgobject && imgobject.hasOwnProperty('id_C02Input') && (imgobject['id_C02Input'].length > 1 ? imgobject['id_C02Input'] : imgobject['id_C02Input'][0]);
    let cpCO7FormImg = imgobject && imgobject.hasOwnProperty('id_C07Input') && (imgobject['id_C07Input'].length > 1 ? imgobject['id_C07Input'] : imgobject['id_C07Input'][0]);
    let cpBoardResolutionImg = imgobject && imgobject.hasOwnProperty('id_boardResolutionForAccountCreation') && (imgobject['id_boardResolutionForAccountCreation'].length > 1 ? imgobject['id_boardResolutionForAccountCreation'] : imgobject['id_boardResolutionForAccountCreation'][0]);
    let cpRefLetter1Img = imgobject && imgobject.hasOwnProperty('id_referenceLetter1') && (imgobject['id_referenceLetter1'].length > 1 ? imgobject['id_referenceLetter1'] : imgobject['id_referenceLetter1'][0]);
    let cpRefLetter2Img = imgobject && imgobject.hasOwnProperty('id_referenceLetter2') && (imgobject['id_referenceLetter2'].length > 1 ? imgobject['id_referenceLetter2'] : imgobject['id_referenceLetter2'][0]);
    let cpBusinessLicenseImg = imgobject && imgobject.hasOwnProperty('id_businessLicenseImage') && (imgobject['id_businessLicenseImage'].length > 1 ? imgobject['id_businessLicenseImage'] : imgobject['id_businessLicenseImage'][0]);
    let cpFinancialStatementImg = imgobject && imgobject.hasOwnProperty('id_2yrsFinancialStatement') && (imgobject['id_2yrsFinancialStatement'].length > 1 ? imgobject['id_2yrsFinancialStatement'] : imgobject['id_2yrsFinancialStatement'][0]);
    let cpFundEvidenceImg = imgobject && imgobject.hasOwnProperty('id_evidenceOfFundAvailability') && (imgobject['id_evidenceOfFundAvailability'].length > 1 ? imgobject['id_evidenceOfFundAvailability'] : imgobject['id_evidenceOfFundAvailability'][0]);
    let cpAgentAssmntFormImg = imgobject && imgobject.hasOwnProperty('id_agentAssessmentForm') && (imgobject['id_agentAssessmentForm'].length > 1 ? imgobject['id_agentAssessmentForm'] : imgobject['id_agentAssessmentForm'][0]);
    let cpFreeAgentContactImg = imgobject && imgobject.hasOwnProperty('id_freelanceAgentContact') && (imgobject['id_freelanceAgentContact'].length > 1 ? imgobject['id_freelanceAgentContact'] : imgobject['id_freelanceAgentContact'][0]);
    let cpAggreContractImg = imgobject && imgobject.hasOwnProperty('id_aggregatorContract') && (imgobject['id_aggregatorContract'].length > 1 ? imgobject['id_aggregatorContract'] : imgobject['id_aggregatorContract'][0]);
    let cpBusinessLicenseNo = imgobject && imgobject.hasOwnProperty('id_businessLicenseNo') && (imgobject['id_businessLicenseNo'].length > 1 ? imgobject['id_businessLicenseNo'] : imgobject['id_businessLicenseNo'][0]);
    let companyRegistrationCertificateImage = imgobject && imgobject.hasOwnProperty('id_companyRegistrationCertificate') && (imgobject['id_companyRegistrationCertificate'].length > 1 ? imgobject['id_companyRegistrationCertificate'] : imgobject['id_companyRegistrationCertificate'][0]);
    let taxClearanceCertificateImage = imgobject && imgobject.hasOwnProperty('id_taxClearanceCertificate') && (imgobject['id_taxClearanceCertificate'].length > 1 ? imgobject['id_taxClearanceCertificate'] : imgobject['id_taxClearanceCertificate'][0]);
    let airtelContractFile = imgobject && imgobject.hasOwnProperty('id_contract') && (imgobject['id_contract'].length > 1 ? imgobject['id_contract'] : imgobject['id_contract'][0]);
    let DirectorIDImage = imgobject && imgobject.hasOwnProperty('id_directorIdImage') && (imgobject['id_directorIdImage'].length > 1 ? imgobject['id_directorIdImage'] : imgobject['id_directorIdImage'][0]);

    this.imgnameArray.push(
      { 'name': cpBusinessLicenseImg, 'fieldName': "Business License/Permit Image", backendFieldKey: 'id_businessLicenseImage' },
      { 'name': cpCO2FormImg, 'fieldName': "Form CO2", backendFieldKey: 'id_C02Input' },
      { 'name': cpCO7FormImg, 'fieldName': "Form CO7", backendFieldKey: 'id_C07Input' },
      { 'name': cpBoardResolutionImg, 'fieldName': "Board Resolution for account creation", backendFieldKey: 'id_boardResolutionForAccountCreation' },
      { 'name': cpRefLetter1Img, 'fieldName': "Reference Letter 1", backendFieldKey: 'id_referenceLetter1' },
      { 'name': cpRefLetter2Img, 'fieldName': "Reference Letter 2", backendFieldKey: 'id_referenceLetter2' },
      { 'name': cpFinancialStatementImg, 'fieldName': "2 yrs Financial Statement", backendFieldKey: 'id_2yrsFinancialStatement' },
      { 'name': cpFundEvidenceImg, 'fieldName': "Evidence of fund availability", backendFieldKey: 'id_evidenceOfFundAvailability' },
      { 'name': cpAgentAssmntFormImg, 'fieldName': "Agent Assessment Form", backendFieldKey: 'id_agentAssessmentForm' },
      { 'name': cpFreeAgentContactImg, 'fieldName': "Freelance Agent Contract", backendFieldKey: 'id_freelanceAgentContact' },
      { 'name': cpAggreContractImg, 'fieldName': "Aggregator Contract", backendFieldKey: 'id_aggregatorContract' },
      { 'name': cpBusinessLicenseNo, 'fieldName': "Business License/Permit Image", backendFieldKey: 'id_businessLicenseNo' },
      { 'name': companyRegistrationCertificateImage, 'fieldName': "Company Registration Certificate Image", backendFieldKey: 'id_companyRegistrationCertificate' },
      { 'name': taxClearanceCertificateImage, 'fieldName': "Tax Clearance Certificate Image", backendFieldKey: 'id_taxClearanceCertificate' },
      { 'name': airtelContractFile, 'fieldName': "Airtel contract", backendFieldKey: 'id_contract' },
      { 'name': DirectorIDImage, 'fieldName': "Director ID image ", backendFieldKey: 'id_directorIdImage' }
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
    this.fieldInfo(this.agentDetails, tocMastertext, getContentInfo);
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
                        AppUtills.removeValue('storedCaseDetails');
                        AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedInfo));
                        this.updateBusinessInfo(updatedInfo);
                      }
                    }
                  }, () => {
                    this.ngxService.stop();
                  });
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
                          AppUtills.removeValue('storedCaseDetails');
                          AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedInfo));
                          this.updateBusinessInfo(updatedInfo);
                        }
                      }
                    });
                  }
                }
                */
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
