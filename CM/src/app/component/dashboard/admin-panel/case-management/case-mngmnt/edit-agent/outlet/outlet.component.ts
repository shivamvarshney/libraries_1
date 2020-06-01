import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FacadeService } from '@src/core/services/facade.service';
import { DataService } from '@service/data-share-service/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppUtills } from '@src/core/utills/appUtills';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service';
import { HandleCommonApiService } from '@service/common-api-service/handle-common-api.service';
import { Observable, of, forkJoin, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss', '../common-form.scss'],
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
export class OutletComponent implements OnInit, OnDestroy {
  outletData;
  fields: any;
  dynamicForm: FormGroup;
  userActorId: string;
  rejResionRes: object;
  // actorId: string;
  dropdownList = [];
  imgnameArray = [];
  rejResonResponse: any;
  buttonStatus: string;
  imageURL: string = '';
  visibleModel: boolean = false;
  actionOnButtonStatus: string = 'PENDING';
  tooltipMsg: string = "Case already approved";
  mobNumAgent: '9898787678';
  dropdownSettings = {};
  editAgentKycInfo: any;
  kycInfoUnsubscription: Subscription;
  outletUnsubscription: Subscription;
  paramIdSubscription: Subscription;
  geoLocationSubscriber: Subscription;
  singleImageSubscriber: Subscription;
  sliderImageImageSubscriber: Subscription;
  forkGeoLocationSubscriber: Subscription;
  KYCDetails: any;
  paramId: string;
  parsedCaseObj: any;
  acceptBoolean: boolean = false;
  rejectBoolean: boolean = true;
  selectedItem: string = '0';
  currectIdx: string = '0';
  htmltxt: any;
  inputTxt: any = '';
  currentRejectionSubReasons = [];
  remarkText: string = '';
  curLabelTxt: string;
  highlightError: boolean = false;
  currentReasons = [];
  showRemarkError: boolean = false;
  remarks: boolean = false;
  uniqueArray: any;
  hideInAggregatorCase: boolean = false;
  safeUrl: SafeResourceUrl;
  actorInfo: any = JSON.parse(AppUtills.getValue('actor_info'));
  constructor(private facadeService: FacadeService,
    private dataService: DataService,
    private ngxService: NgxUiLoaderService,
    private _router: ActivatedRoute,
    private route: Router,
    private aafModelService: AafModelService,
    private commonApiService: HandleCommonApiService,
    private _http: HttpClient,
    private domSanitizer: DomSanitizer) { }

  // ****************** dynamic form field ********************//
  fieldInfo(editAgentKyc, shopObj) {
    this.fields = [
      {
        type: "input",
        label: "CP Site ID",
        inputType: "text",
        name: "cp_site_id",
        disabled: false,
        value: (editAgentKyc && editAgentKyc.id_cpSiteId) ? editAgentKyc.id_cpSiteId : '',
        placeHolder: 'CP Site ID',
        validations: [],
        businessKey: ['id_cpSiteId'],
        highlight: false
      },
      {
        type: "input",
        label: "Shop Name",
        name: "shop_name",
        inputType: "text",
        placeHolder: "Shop Name",
        value: (shopObj && shopObj.id_shopName) ? shopObj.id_shopName : '',
        disabled: false,
        options: [],
        validations: [],
        businessKey: ['id_shopName'],
        highlight: false
      },
      {
        type: "input",
        label: "Shop Address",
        name: "shop_address",
        inputType: "text",
        placeHolder: "Shop Address",
        value: (editAgentKyc && editAgentKyc.id_shopAddress) ? editAgentKyc.id_shopAddress : '',
        disabled: false,
        options: [],
        validations: [],
        businessKey: ['id_shopAddress'],
        highlight: false
      },
      {
        type: "input",
        label: "CP Lat/Long Location",
        inputType: "text",
        name: "cp_long_location",
        disabled: false,
        value: (editAgentKyc && editAgentKyc.id_cpLatLongLocation) ? editAgentKyc.id_cpLatLongLocation : '',
        placeHolder: 'CP Lat/Long Location',
        validations: [],
        businessKey: ['id_cpLatLongLocation'],
        highlight: false
      },
      /*
      {
        type: "input",
        label: "Region",
        inputType: "text",
        name: "Region",
        disabled: false,
        value: (editAgentKyc && editAgentKyc.id_region) ? editAgentKyc.id_region : '',
        placeHolder: 'Region',
        validations: [],
        businessKey: ['id_region'],
        highlight: false
      },
      {
        type: "input",
        label: "Zone",
        inputType: "text",
        name: "Zone",
        disabled: false,
        value: (editAgentKyc && editAgentKyc.id_zone) ? editAgentKyc.id_zone : '',
        placeHolder: 'Zone',
        validations: [],
        businessKey: ['id_zone'],
        highlight: false
      },
      {
        type: "input",
        label: "Area",
        inputType: "text",
        name: "Area",
        disabled: false,
        value: (editAgentKyc && editAgentKyc.id_area) ? editAgentKyc.id_area : '',
        placeHolder: 'Area',
        validations: [],
        businessKey: ['id_area'],
        highlight: false
      },
      {
        type: "input",
        label: "Territory",
        inputType: "text",
        name: "Territory",
        disabled: false,
        value: (editAgentKyc && editAgentKyc.id_territory) ? editAgentKyc.id_territory : '',
        placeHolder: 'Territory',
        validations: [],
        businessKey: ['id_territory'],
        highlight: false
      },
      {
        type: "input",
        label: "Cluster",
        inputType: "text",
        name: "Cluster",
        disabled: false,
        value: (editAgentKyc && editAgentKyc.id_cluster) ? editAgentKyc.id_cluster : '',
        placeHolder: 'Cluster',
        validations: [],
        businessKey: ['id_cluster'],
        highlight: false
      },
      */
      {
        type: "input",
        label: "SMF Territory Code",
        inputType: "text",
        name: "code_no",
        disabled: false,
        placeHolder: 'SMF Territory Code',
        value: (editAgentKyc && editAgentKyc.id_smfTerritory) ? editAgentKyc.id_smfTerritory : '',
        validations: [],
        businessKey: ['id_smfTerritory'],
        highlight: false
      },
      {
        type: "input",
        label: "State",
        inputType: "text",
        name: "State",
        disabled: false,
        value: (editAgentKyc && editAgentKyc.id_state) ? editAgentKyc.id_state : '',
        placeHolder: 'State',
        validations: [],
        businessKey: ['id_state'],
        highlight: false
      },
      {
        type: "input",
        label: "LGA",
        inputType: "text",
        name: "lga",
        disabled: false,
        placeHolder: 'LGA',
        value: (editAgentKyc && editAgentKyc.id_lga) ? editAgentKyc.id_lga : '',
        validations: [],
        businessKey: ['id_lga'],
        highlight: false
      },
      {
        type: "input",
        label: "PSB parent *",
        inputType: "text",
        name: "psb_parent",
        disabled: false,
        placeHolder: 'PSB parent',
        value: (shopObj && shopObj.id_psbParentName) ? shopObj.id_psbParentName : '',
        validations: [],
        businessKey: ['id_psbParent'],
        highlight: false
      },
      {
        type: "input",
        label: "Use primary no for servicing?",
        name: "primary_no",
        inputType: "text",
        placeHolder: "Use primary no for servicing",
        value: (shopObj && shopObj.id_primaryServicing) ? shopObj.id_primaryServicing : '',
        disabled: false,
        checkPrimaryStatus: true,
        options: [{ 'optionId': 2, 'checkname': 'Yes', 'status': shopObj.id_isPrimaryServicing == 'YES' ? true : false }, { 'optionId': 1, 'checkname': 'No', 'status': shopObj.id_isPrimaryServicing == 'NO' ? true : false }],
        validations: [],
        businessKey: ['id_primaryServicing'],
        highlight: false
      },
      // {
      //   type: "input",
      //   label: "Role *",
      //   inputType: "text",
      //   name: "role",
      //   disabled: false,
      //   placeHolder: 'Role',
      //   value: (shopObj && shopObj.id_role) ? shopObj.id_role : '',
      //   validations: [],
      //   businessKey: ['id_role'],
      //   highlight: false
      // },
      {
        type: "input",
        label: "MSISDN",
        inputType: "text",
        name: "msisdn",
        disabled: false,
        placeHolder: 'MSISDN',
        value: (shopObj && shopObj.id_msisdn) ? shopObj.id_msisdn : '',
        validations: [],
        businessKey: ['id_msisdn'],
        highlight: false
      },
      {
        type: "input",
        label: "SIM role",
        inputType: "text",
        name: "sim_role",
        disabled: false,
        placeHolder: 'SIM role',
        value: (shopObj && shopObj.id_simSellingList && shopObj.id_simSellingList.length > 0) ? shopObj.id_simSellingList.join(',') : '',
        validations: [],
        businessKey: ['id_simSellingList'],
        highlight: false
      },
      {
        type: "input",
        label: "CP Parent Account No",
        inputType: "text",
        name: "State",
        disabled: false,
        value: (shopObj && shopObj.id_psbParent) ? shopObj.id_psbParent : '',
        placeHolder: 'State',
        validations: [],
        businessKey: ['id_cp_parent_acc_no'],
        highlight: false
      }
    ];
  }

  // ****************** dynamic form field ********************//


  ngOnInit() {
    let caseOutletObj = JSON.parse(AppUtills.getValue('storedCaseDetails'));
    if (caseOutletObj.ownerType.toLowerCase() == "AGGREGATOR".toLowerCase()) {
      this.hideInAggregatorCase = true;
      AppUtills.removeValue('rejResonRes');
    }
    else {
      this.hideInAggregatorCase = false;
      this.fieldInfo('fieldVal', '');

      const controls = {};
      this.paramIdSubscription = this._router.params.subscribe((params: Params) => { this.paramId = params.id; });
      this.getUserKycDetails();
      if (AppUtills.getValue('reasons')) {
        this.rejResionRes = JSON.parse(AppUtills.getValue('reasons'));
      }
      if (AppUtills.getValue('rejResonRes') && AppUtills.getValue('rejResonRes') !== '') {
        this.rejResonResponse = JSON.parse(AppUtills.getValue('rejResonRes'));
      }
      if (AppUtills.getValue('storedCaseDetails')) {
        let caseOutletObj = JSON.parse(AppUtills.getValue('storedCaseDetails'));
        let psbParent = caseOutletObj && caseOutletObj.info && caseOutletObj.info.psbparentInfo && caseOutletObj.info.psbparentInfo.fields.id_cp_name ? caseOutletObj.info.psbparentInfo.fields.id_cp_name : '';
        this.parsedCaseObj = caseOutletObj.info.outlets.id_addShop;
        this.updateOutletInfo(caseOutletObj);
      }
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
      this.showOutlets(0);
    }
  }

  // **************** Prepare obj for premary andserving number dynamic *************** //
  createPrimaryServingNode(primaryNumObj, servinglabel, previousObj) {
    let highlightMob: boolean = false;
    let parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));
    if (parsedCaseJSON.previousInfo && Object.keys(parsedCaseJSON.previousInfo).length > 0) {
      highlightMob = true;
      let previousDataBusinessInfo = (parsedCaseJSON.previousInfo.hasOwnProperty('outlets')) ? (parsedCaseJSON.previousInfo.outlets.id_addShop ? parsedCaseJSON.previousInfo.outlets.id_addShop : '') : '';
      if (previousDataBusinessInfo && previousDataBusinessInfo.length > 0 && previousDataBusinessInfo[this.selectedItem] && previousDataBusinessInfo[this.selectedItem].id_mobile) {
        previousDataBusinessInfo[this.selectedItem].id_mobile.map((mobV, mobK) => {
          if (mobV.id_mobileNo == primaryNumObj.id_mobileNo) {
            highlightMob = false;
          }
        });
      }
    }
    /*
    if (previousObj && previousObj.id_mobile && previousObj.id_mobile) {
      previousObj.id_mobile.map((mobV, mobK) => {
        if (mobV.id_mobileNo == primaryNumObj.id_mobileNo) {
          highlightMob = false;
        } else {
          highlightMob = true;
        }
      })
    } else {
      highlightMob = true;
    }
    */
    let numberObj = {
      type: "input",
      label: servinglabel,
      name: "primary_service",
      inputType: "text",
      placeHolder: servinglabel,
      value: primaryNumObj ? primaryNumObj.id_mobileNo : '',
      disabled: false,
      options: [],
      validations: [],
      businessKey: ['mobNumAgentInfo'],
      highlight: highlightMob
    }
    this.fields.push(numberObj);
  }

  agentUpdatedFieldObj(detailsInfo) {
    this.fields.map((curVal, curkey) => {
      if (detailsInfo && Object.keys(detailsInfo).length > 0) {
        Object.keys(detailsInfo).map((upVal, upkey) => {
          if ((curVal.businessKey[0] == upVal) && (curVal.value != detailsInfo[upVal])) {
            this.fields[curkey]['value'] = curVal.value;
            this.fields[curkey]['highlight'] = true;
          }
        })
      } else {
        this.fields[curkey]['highlight'] = true;
      }
    });
  }
  selected: any;
  zoomSliderInModel(controlObj) {
    this.selected = controlObj;
  }
  isActive(item) {
    return this.selected === item;
  }
  closeSliderModel() {
    this.selected = '';
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
  createSliderImage(srcObj, idType, highlight?: boolean) {
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
  createImageNode(srcObj, idType, highlight?: boolean) {
    let imageObj = {
      type: "image",
      label: idType,
      name: "image",
      inputType: "text",
      placeHolder: idType,
      disabled: false,
      options: [],
      validations: [],
      highlight: (highlight ? highlight : false),
      imagePath: this.domSanitizer.bypassSecurityTrustUrl("data:image/image/" + srcObj.resourceType + ";base64," + srcObj.resourceData)
    }
    this.fields.push(imageObj);
  }

  prepareObj(imgobject) {
    this.imgnameArray = [];
    let cpOutletCertifiedImg = imgobject && imgobject.hasOwnProperty('id_outletCertificateImage') && (imgobject['id_outletCertificateImage'].length > 1 ? imgobject['id_outletCertificateImage'] : imgobject['id_outletCertificateImage'][0]);
    let cpLatLongImg = imgobject && imgobject.hasOwnProperty('id_cpImageLatLong') && (imgobject['id_cpImageLatLong'].length > 1 ? imgobject['id_cpImageLatLong'] : imgobject['id_cpImageLatLong'][0]);
    this.imgnameArray.push(
      { 'name': cpLatLongImg, 'fieldName': "Shop image with lat-long", backendFieldKey: "id_cpImageLatLong" },
      { 'name': cpOutletCertifiedImg, 'fieldName': "Outlet Certificate Image", backendFieldKey: "id_outletCertificateImage" }
    )
    return this.imgnameArray;
  }

  updateBusinessImageInfo(caseBusinessData) {
    this.ngxService.start();
    let upBusinessInfo = caseBusinessData;//(caseBusinessData && caseBusinessData.hasOwnProperty('info') && caseBusinessData.info.hasOwnProperty('outlets') && caseBusinessData.info.outlets.hasOwnProperty('id_addShop')) ? caseBusinessData.info.outlets.id_addShop : '';
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
                  let highlight = this.verifyUpdationOnImageOrPdf(val.backendFieldKey, val.name);
                  this.createSliderImage(multipleSliderReq, val.fieldName, highlight);
                }
                this.ngxService.stop();
              }
            },
            err => {
              this.ngxService.stop();
            },
            () => {
              this.ngxService.stop();
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
              let singleHighlight = this.verifyUpdationOnImageOrPdf(val.backendFieldKey, val.name);
              if (data.resourceType == 'pdf') {
                this.makePdfNode(data, val.fieldName, singleHighlight);
              } else {
                this.createImageNode(data, val.fieldName, singleHighlight);
              }
              this.ngxService.stop();
            }
          },
            err => {
              this.ngxService.stop();
            },
            () => {
              this.ngxService.stop();
            }
          );
        }
      });
      /*
      let apiRequests = [];
      this.prepareObj(upBusinessInfo).map((val, key) => {
        let resourceObj = {
          resourceId: val ? val.name : '',
          actionName: "DOWNLOAD_IMAGE",
          actionType: "external"
        }
        let getKycImage = this._http.post(apiUrls.cpmImageService, resourceObj);
        apiRequests.push(getKycImage);
      });
      forkJoin(apiRequests).subscribe(
        data => {
          if (data) {
            this.ngxService.stop();
            data.map((value, key) => {
              if (value['statusCode'] && value['statusCode'] == 200 && value['result'] && value['result']['data'] && value['result']['data'].resourceData) {
                let highlight = this.verifyUpdationOnImageOrPdf(this.imgnameArray[key].backendFieldKey, this.imgnameArray[key].name);
                this.createImageNode(value['result']['data'].resourceData, this.imgnameArray[key]['fieldName'], highlight);
              }
            });
            return false;
          }
        },
        err => {
          console.error(err)
        }
      );
      */
    }
  }

  verifyUpdationOnImageOrPdf(fieldName, fieldValue) {
    let parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));
    if (parsedCaseJSON.previousInfo && Object.keys(parsedCaseJSON.previousInfo).length > 0) {
      let previousDataBusinessInfo = (parsedCaseJSON.previousInfo.hasOwnProperty('outlets')) ? (parsedCaseJSON.previousInfo.outlets.id_addShop ? parsedCaseJSON.previousInfo.outlets.id_addShop : '') : '';
      if (previousDataBusinessInfo && previousDataBusinessInfo.length > 0 && previousDataBusinessInfo[this.selectedItem] && previousDataBusinessInfo[this.selectedItem][fieldName]) {
        let previousBusinessInfo = previousDataBusinessInfo[this.selectedItem][fieldName];
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

  // ******** fetch case details ******** //
  updateOutletInfo(caseDetailObj) {
    let updateObj = '';
    let getContentInfo = caseDetailObj;
    this.userActorId = getContentInfo.assignedTo;
    this.buttonStatus = getContentInfo.status;
    this.KYCDetails = (getContentInfo.info && getContentInfo.info.outlets && getContentInfo.info.outlets.id_addShop && getContentInfo.info.outlets.id_addShop[this.selectedItem]) ? getContentInfo.info.outlets.id_addShop[this.selectedItem] : '';
    let mobileNum = (this.KYCDetails && this.KYCDetails != '' && this.KYCDetails.id_mobile && this.KYCDetails.id_mobile.length > 0 ? this.KYCDetails.id_mobile : '');

    this.updateBusinessImageInfo(caseDetailObj);
    if (getContentInfo.ownerType.toLowerCase() == "AGGREGATOR".toLowerCase()) {
      this.hideInAggregatorCase = true;
    } else {
      this.hideInAggregatorCase = false;
      this.fieldInfo(this.KYCDetails, '');
    }
    if (getContentInfo && getContentInfo.previousInfo && Object.keys(getContentInfo.previousInfo).length > 0) {
      getContentInfo.previousInfo && getContentInfo.previousInfo.kycInfo ? (updateObj = getContentInfo.previousInfo.outlets.id_addShop[this.selectedItem]) : '';
      this.agentUpdatedFieldObj(updateObj)
    }
    if (caseDetailObj.status == 'PENDING') {
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
    let i = 1;
    mobileNum && mobileNum.map((nVal, nKey) => {
      let labelname = (`Service Number ${i++}`);//nVal.id_isPrimaryServicing == true ? "Primary Service Number" : `Service Number ${i}`;
      this.createPrimaryServingNode(nVal, labelname, updateObj);
    });
  }
  getUserKycDetails() {
    this.tooltipMsg = '';
    this.acceptBoolean = false;
    if (AppUtills.getValue('storedCaseDetails')) {
      let parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));
      this.updateOutletInfo(parsedCaseJSON);
    } else {
      let customUrl = apiUrls.caseList + '?id=' + this.paramId;
      if (AppUtills.checkUserType('dataExecutive')) {
        customUrl += '&status=PENDING&internalStatus=ACCEPTED';
      }
      this.kycInfoUnsubscription = this.facadeService.onGetAPI(customUrl).subscribe(res => {
        let data: any;
        if (res) {
          data = res;
          this.ngxService.stop();
          if ((data.statusCode == 200) && data.message && (data.result.content.length > 0)) {
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
                        this.updateOutletInfo(updatedObj);
                      }
                    }, err => {
                      this.ngxService.stop();
                      if (AppUtills.showErrorMessage(err)) {
                        this.updateOutletInfo(updatedObj);
                      }

                    }
                  );
                } else {
                  this.updateOutletInfo(updatedObj);
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
                        this.updateOutletInfo(updatedInfo);
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
                          this.updateOutletInfo(updatedObj);
                        }
                      }
                    });
                  }
                }
                */
              } else {
                AppUtills.removeValue('storedCaseDetails');
                AppUtills.setValue('storedCaseDetails', JSON.stringify(updatedObj));
                this.updateOutletInfo(updatedObj);
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

  // ******** Approve cases ******** //
  userActionHandler(userAction) {
    this.ngxService.start();
    let outletInfo = {
      "actorId": this.actorInfo.id,
      "caseId": parseInt(this.paramId),
      "nextState": userAction.toUpperCase()
    }
    this.outletUnsubscription = this.facadeService.onPostAPI(apiUrls.caseAcceptReject, outletInfo).subscribe(res => {
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

  /* Adding Dynamic GeoLocations */
  prepareGeoLocationField(shopObj, highlight?: boolean) {
    return {
      type: "input",
      label: shopObj.label,
      inputType: "text",
      name: shopObj.key,
      disabled: false,
      placeHolder: shopObj.label,
      value: shopObj.value,
      validations: [],
      businessKey: [shopObj.key],
      highlight: highlight ? highlight : false
    }
  }
  checkGeoHierarchyIsEdited(index, fieldKey, values) {
    let parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));
    if (parsedCaseJSON.previousInfo && Object.keys(parsedCaseJSON.previousInfo).length > 0) {
      if (parsedCaseJSON.previousInfo.hasOwnProperty('outlets') && parsedCaseJSON.previousInfo.outlets.id_addShop && parsedCaseJSON.previousInfo.outlets.id_addShop[index]) {
        if (parsedCaseJSON.previousInfo.outlets.id_addShop[index][fieldKey] && (typeof parsedCaseJSON.previousInfo.outlets.id_addShop[index][fieldKey] == typeof values) && (values.length == parsedCaseJSON.previousInfo.outlets.id_addShop[index][fieldKey].length)) {
          let booleanCheck = true;
          for (let counter = 0; counter < values.length; counter++) {
            if (parsedCaseJSON.previousInfo.outlets.id_addShop[index][fieldKey].indexOf(values[counter]) == -1) {
              booleanCheck = false;
              break;
            }
          }
          if (booleanCheck) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }
  updateFieldObj(shopObj, index) {
    if (shopObj.geoHierarchy) {
      if (Object.keys(shopObj.geoHierarchy).length > 0) {
        let shopGeoHierarchy = Object.keys(shopObj.geoHierarchy);
        shopGeoHierarchy.map(s_geoHierarchy => {
          let ids = [];
          let labels = [];
          shopObj.geoHierarchy[s_geoHierarchy].map(hierarchyData => {
            labels.push(hierarchyData.label);
            ids.push(hierarchyData.id);
          });
          let highlightCheck = this.checkGeoHierarchyIsEdited(index, s_geoHierarchy, ids);
          let hiererchyMaster = AppUtills.getSelectedLevelKeyHierarchy(s_geoHierarchy);
          let preparedGeoField = { value: labels.join(), label: hiererchyMaster[0].label, key: s_geoHierarchy };
          let preparedGeoObj = this.prepareGeoLocationField(preparedGeoField, highlightCheck);
          this.fields.push(preparedGeoObj);
        });
      }
    }
  }
  /* End of the code related to Dynamic Geo Location Rendering */

  // ---------- Show outlets --------------- //
  showOutlets(index) {
    let updateObj = '';
    if (AppUtills.getValue('storedCaseDetails')) {
      this.selectedItem = index;
      this.currectIdx = null;
      let parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));
      let parseOutletObj = parsedCaseJSON.info.outlets.id_addShop && parsedCaseJSON.info.outlets.id_addShop[index];
      let shopObj = parsedCaseJSON.info.outlets.id_addShop && parsedCaseJSON.info.outlets.id_addShop[index];//['id_psbParentName'];//parsedCaseJSON && parsedCaseJSON.info && parsedCaseJSON.info.psbparentInfo && parsedCaseJSON.info.psbparentInfo.fields.id_cp_name ? parsedCaseJSON.info.psbparentInfo.fields.id_cp_name : '';
      let mobileNum = (parseOutletObj && parseOutletObj != '' && parseOutletObj.id_mobile && parseOutletObj.id_mobile.length > 0 ? parseOutletObj.id_mobile : '');

      this.updateBusinessImageInfo(parseOutletObj);
      if (parsedCaseJSON.ownerType.toLowerCase() == "AGGREGATOR".toLowerCase()) {
        this.hideInAggregatorCase = true;
      } else {
        this.hideInAggregatorCase = false;
        this.fieldInfo(parseOutletObj, shopObj);
        /* Add Geo Location Field Dynamically */
        this.updateFieldObj(shopObj, index);
      }
      if (parsedCaseJSON && parsedCaseJSON.previousInfo && Object.keys(parsedCaseJSON.previousInfo).length > 0) {
        parsedCaseJSON.previousInfo && parsedCaseJSON.previousInfo.kycInfo ? (updateObj = parsedCaseJSON.previousInfo.outlets.id_addShop[index]) : '';
        this.agentUpdatedFieldObj(updateObj)
      }
      let i = 1;
      mobileNum && mobileNum.map((nVal, nKey) => {
        let labelname = (`Service Number ${i++}`);
        this.createPrimaryServingNode(nVal, labelname, updateObj);
      });

    } else {
      this.getUserKycDetails();
    }
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
    this.paramIdSubscription ? this.paramIdSubscription.unsubscribe() : '';
    this.kycInfoUnsubscription ? this.kycInfoUnsubscription.unsubscribe() : '';
    this.outletUnsubscription ? this.outletUnsubscription.unsubscribe() : '';
    this.geoLocationSubscriber ? this.geoLocationSubscriber.unsubscribe() : '';
    this.singleImageSubscriber ? this.singleImageSubscriber.unsubscribe() : '';
    this.sliderImageImageSubscriber ? this.sliderImageImageSubscriber.unsubscribe() : '';
    this.forkGeoLocationSubscriber ? this.forkGeoLocationSubscriber.unsubscribe() : '';
  }

}
