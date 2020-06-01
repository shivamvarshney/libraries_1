import { Component, OnInit } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subscription, forkJoin } from 'rxjs';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.css']
})
export class CaseDetailsComponent implements OnInit {

  constructor(private domSanitizer: DomSanitizer, private _http: HttpClient, private ngxService: NgxUiLoaderService) { }
  singleImageSubscriber: Subscription;
  sliderImageImageSubscriber: Subscription;
  geoLocationSubscriber: Subscription;
  updatedVisibleData: any;

  prepareOutletObj(conter, lable, fieldsArray) {
    return {
      id: 'outlet_' + conter,
      name: lable + ' ' + conter,
      key: 'outlet_' + conter,
      fields: fieldsArray
    }
  }

  createGeoGraphicalObj(val, fieldName, fieldKey) {
    return {
      key: fieldKey,
      type: 'input',
      mappingRef: fieldKey,
      templateOptions: {
        id: fieldKey,
        name: fieldKey,
        label: fieldName,
        placeHolder: fieldName,
        value: val,
        properties: {
          isDisable: false,
          isHightlisght: false,
          isHide: false
        }
      }
    }
  }

  createImageSlider(srcObj, fieldName, fieldKey) {
    return {
      key: fieldKey,
      type: "multimediaImageSlider",
      templateOptions: {
        label: fieldName,
        value: fieldKey,
        imageSrc: srcObj,
        properties: {
          isDisable: false,
          isHightlisght: false,
          isHide: false
        }
      }
    }
  }

  makeImageNode(srcObj, fieldName, fieldKey) {
    return {
      key: fieldKey,
      type: "multimediaImage",
      templateOptions: {
        label: fieldName,
        value: fieldKey,
        imageSrc: this.domSanitizer.bypassSecurityTrustUrl("data:image/image/png;base64," + srcObj),
        properties: {
          isDisable: false,
          isHightlisght: false,
          isHide: false
        }
      }
    }
  }

  makePdfNode(srcObj, fieldName, fieldKey) {
    let safeUrl: SafeResourceUrl = this.domSanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + srcObj.resourceData);
    return {
      key: fieldKey,
      type: "multimediaPdf",
      templateOptions: {
        label: fieldName,
        value: fieldKey,
        imagePath: safeUrl,
        properties: {
          isDisable: false,
          isHightlisght: false,
          isHide: false
        }
      }
    }
  }

  // Field JSON
  parsedCaseJSON = JSON.parse(AppUtills.getValue('storedCaseDetails'));

  caseSections = [
    {
      id: 'kyc',
      name: 'KYC',
      fields: [
        {
          key: 'bvn_no',
          type: 'input',
          mappingRef: 'info.kycInfo.bvnNumber',
          templateOptions: {
            id: 'bvn_no',
            name: 'bvn_no',
            label: 'BVN No',
            placeHolder: 'BVN No',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_type',
          type: 'input',
          mappingRef: 'info.kycInfo.idList[0].idType',
          templateOptions: {
            id: 'id_type',
            name: 'id_type',
            label: 'ID Type',
            placeHolder: 'ID Type',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_no',
          type: 'input',
          mappingRef: 'info.kycInfo.idList[0].idNumber',
          templateOptions: {
            id: 'id_no',
            name: 'id_no',
            label: 'ID No',
            placeHolder: 'ID No',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'name',
          type: 'input',
          mappingRef: 'info.kycInfo.name',
          templateOptions: {
            id: 'name',
            name: 'name',
            label: 'Name',
            placeHolder: 'Name',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'date',
          type: 'input',
          mappingRef: 'info.kycInfo.dateOfBirth',
          templateOptions: {
            id: 'date',
            name: 'date',
            label: 'DOB',
            placeHolder: 'DOB',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'gender',
          type: 'input',
          mappingRef: 'info.kycInfo.gender',
          templateOptions: {
            id: 'gender',
            name: 'gender',
            label: 'Gender',
            placeHolder: 'Gender',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'residence_address',
          type: 'textarea',
          mappingRef: 'info.kycInfo.residentAddress',
          templateOptions: {
            id: 'residence_address',
            name: 'residence_address',
            label: 'Residence address',
            placeHolder: 'Residence address',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'msisdn',
          type: 'input',
          mappingRef: 'info.outlets.id_primaryServicing',
          templateOptions: {
            id: 'msisdn',
            name: 'msisdn',
            label: 'MSISDN',
            placeHolder: 'MSISDN',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'passport_front_image',
          type: 'multiMedia',
          mappingRef: 'info.kycInfo.kyc_id[0]',
          templateOptions: {
            id: 'passport_front_image',
            name: 'passport_front_image',
            label: 'Passport Front Image',
            placeHolder: 'Passport Front Image',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'passport_back_image',
          type: 'multiMedia',
          mappingRef: 'info.kycInfo.kyc_id[1]',
          templateOptions: {
            id: 'passport_back_image',
            name: 'passport_back_image',
            label: 'Passport Back Image',
            placeHolder: 'Passport Back Image',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        }
      ]
    },
    {
      id: 'business',
      name: 'BUSINESS',
      fields: [
        // Business License/Permit No
        {
          key: 'id_businessLicense',
          type: 'input',
          mappingRef: 'info.outlets.id_businessLicense',
          templateOptions: {
            id: 'id_businessLicense',
            name: 'id_businessLicense',
            label: 'Business License/Permit No',
            placeHolder: 'Business License/Permit No',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Type Of Company
        {
          key: 'id_companyTypeList',
          type: 'input',
          mappingRef: 'info.outlets.id_companyTypeList',
          actionHandler: 'prepareTOCData',
          templateOptions: {
            id: 'id_companyTypeList',
            name: 'id_companyTypeList',
            label: 'Type Of Company',
            placeHolder: 'Type Of Company',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        //Business Address 
        {
          key: 'id_postalAddressInput',
          type: 'input',
          mappingRef: 'info.outlets.id_postalAddressInput',
          templateOptions: {
            id: 'id_postalAddressInput',
            name: 'id_postalAddressInput',
            label: 'Business Address',
            placeHolder: 'Business Address',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Commercial Activity Done in last 12 months
        {
          key: 'id_commercialActivityInput',
          type: 'input',
          mappingRef: 'info.outlets.id_commercialActivityInput',
          templateOptions: {
            id: 'id_commercialActivityInput',
            name: 'id_commercialActivityInput',
            label: 'Commercial Activity Done in last 12 months',
            placeHolder: 'Commercial Activity Done in last 12 months',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Source of funds
        {
          key: 'id_sourceOfFunds',
          type: 'input',
          mappingRef: 'info.outlets.id_sourceOfFunds',
          templateOptions: {
            id: 'id_sourceOfFunds',
            name: 'id_sourceOfFunds',
            label: 'Source of funds',
            placeHolder: 'Source of funds',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Oualifying criteria for agent selection
        {
          key: 'id_agentSelectionCriteriaList',
          type: 'checkbox',
          mappingRef: 'info.outlets.id_agentSelectionCriteriaList',
          templateOptions: {
            id: 'id_agentSelectionCriteriaList',
            name: 'id_agentSelectionCriteriaList',
            label: 'Oualifying criteria for agent selection',
            placeHolder: 'Use primary no for servicing?',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            },
            options: [
              {
                value: 1,
                label: 'Outreach'
              },
              {
                value: 2,
                label: 'Competence'
              },
              {
                value: 3,
                label: 'Integrity'
              },
              {
                value: 4,
                label: 'Others'
              }
            ]
          }
        },
        // CP does not hold any criminal record
        {
          key: 'id_agreementRadio',
          type: 'radioButton',
          mappingRef: 'info.outlets.id_agreementRadio',
          templateOptions: {
            id: 'id_agreementRadio',
            name: 'id_agreementRadio',
            label: 'CP does not hold any criminal record in matters relating to finance, fraud, honesty or integrity, to the best of my knowledge.',
            placeHolder: 'CP does not hold any criminal record',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            },
            options: [
              {
                value: 1,
                label: 'No'
              },
              {
                value: 2,
                label: 'Yes'
              }
            ]
          }
        },
        // Channel Type
        {
          key: 'id_channelType',
          type: 'input',
          mappingRef: 'info.outlets.id_channelType',
          templateOptions: {
            id: 'id_channelType',
            name: 'id_channelType',
            label: 'Channel Type',
            placeHolder: 'Channel Type',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Agent Name
        {
          key: 'id_agentName',
          type: 'input',
          mappingRef: 'info.outlets.id_agentName',
          templateOptions: {
            id: 'id_agentName',
            name: 'id_agentName',
            label: 'Agent Name',
            placeHolder: 'Agent Name',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // CP ownership type
        {
          key: 'id_ownership',
          type: 'input',
          mappingRef: 'info.outlets.id_ownership',
          templateOptions: {
            id: 'id_ownership',
            name: 'id_ownership',
            label: 'CP ownership type',
            placeHolder: 'CP ownership type',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Company Registration No.
        {
          key: 'id_companyRegistrationNo',
          type: 'input',
          mappingRef: 'info.outlets.id_companyRegistrationNo',
          templateOptions: {
            id: 'name',
            name: 'name',
            label: 'Company Registration No.',
            placeHolder: 'Company Registration No.',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Tax registration No.
        {
          key: 'id_taxRegistrationNo',
          type: 'input',
          mappingRef: 'info.outlets.id_taxRegistrationNo',
          templateOptions: {
            id: 'id_taxRegistrationNo',
            name: 'id_taxRegistrationNo',
            label: 'Tax registration No.',
            placeHolder: 'Tax registration No.',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Email
        {
          key: 'id_email',
          type: 'input',
          mappingRef: 'info.outlets.id_email',
          templateOptions: {
            id: 'id_email',
            name: 'id_email',
            label: 'Email',
            placeHolder: 'Email',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        // Role *
        {
          key: 'ownerType',
          type: 'input',
          mappingRef: 'ownerType',
          templateOptions: {
            id: 'ownerType',
            name: 'ownerType',
            label: 'Role *',
            placeHolder: 'Role',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },


        {
          key: 'id_C02Input',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_C02Input',
          templateOptions: {
            id: 'id_C02Input',
            name: 'id_C02Input',
            label: 'Form CO2',
            placeHolder: 'Form CO2',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_businessLicenseImage',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_businessLicenseImage',
          templateOptions: {
            id: 'id_businessLicenseImage',
            name: 'id_businessLicenseImage',
            label: 'Business License/Permit Image',
            placeHolder: 'Business License/Permit Image',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_C07Input',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_C07Input',
          templateOptions: {
            id: 'id_C07Input',
            name: 'id_C07Input',
            label: 'Form CO7',
            placeHolder: 'Form CO7',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_boardResolutionForAccountCreation',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_boardResolutionForAccountCreation',
          templateOptions: {
            id: 'id_boardResolutionForAccountCreation',
            name: 'id_boardResolutionForAccountCreation',
            label: 'Board Resolution for account creation',
            placeHolder: 'Board Resolution for account creation',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_taxClearanceCertificate',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_taxClearanceCertificate',
          templateOptions: {
            id: 'id_taxClearanceCertificate',
            name: 'id_taxClearanceCertificate',
            label: 'Tax Clearance Certificate',
            placeHolder: 'Tax Clearance Certificate',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_referenceLetter1',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_referenceLetter1',
          templateOptions: {
            id: 'id_referenceLetter1',
            name: 'id_referenceLetter1',
            label: 'Reference Letter 1',
            placeHolder: 'Reference Letter 1',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_referenceLetter2',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_referenceLetter2',
          templateOptions: {
            id: 'id_referenceLetter2',
            name: 'id_referenceLetter2',
            label: 'Reference Letter 2',
            placeHolder: 'Reference Letter 2',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_2yrsFinancialStatement',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_2yrsFinancialStatement',
          templateOptions: {
            id: 'id_2yrsFinancialStatement',
            name: 'id_2yrsFinancialStatement',
            label: '2 yrs Financial Statement',
            placeHolder: '2 yrs Financial Statement',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_evidenceOfFundAvailability',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_evidenceOfFundAvailability',
          templateOptions: {
            id: 'id_evidenceOfFundAvailability',
            name: 'id_evidenceOfFundAvailability',
            label: 'Evidence of fund availability',
            placeHolder: 'Evidence of fund availability',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_agentAssessmentForm',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_agentAssessmentForm',
          templateOptions: {
            id: 'id_agentAssessmentForm',
            name: 'id_agentAssessmentForm',
            label: 'Agent Assessment Form',
            placeHolder: 'Agent Assessment Form',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_freelanceAgentContact',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_freelanceAgentContact',
          templateOptions: {
            id: 'id_freelanceAgentContact',
            name: 'id_freelanceAgentContact',
            label: 'Freelance Agent Contract',
            placeHolder: 'Freelance Agent Contract',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_aggregatorContract',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_aggregatorContract',
          templateOptions: {
            id: 'id_aggregatorContract',
            name: 'id_aggregatorContract',
            label: 'Aggregator Contract',
            placeHolder: 'Aggregator Contract',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_businessLicenseNo',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_businessLicenseNo',
          templateOptions: {
            id: 'id_businessLicenseNo',
            name: 'id_businessLicenseNo',
            label: 'Business License/Permit Image',
            placeHolder: 'Business License/Permit Image',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_companyRegistrationCertificateImage',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_companyRegistrationCertificateImage',
          templateOptions: {
            id: 'id_companyRegistrationCertificateImage',
            name: 'id_companyRegistrationCertificateImage',
            label: 'Company Registration Certificate Image',
            placeHolder: 'Company Registration Certificate Image',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_taxClearanceCertificateImage',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_taxClearanceCertificateImage',
          templateOptions: {
            id: 'id_taxClearanceCertificateImage',
            name: 'id_taxClearanceCertificateImage',
            label: 'Tax Clearance Certificate Image',
            placeHolder: 'Tax Clearance Certificate Image',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_airtelContractFile',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_airtelContractFile',
          templateOptions: {
            id: 'id_airtelContractFile',
            name: 'id_airtelContractFile',
            label: 'Airtel contract',
            placeHolder: 'Airtel contract',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'id_directorIDImage',
          type: 'multiMedia',
          mappingRef: 'info.outlets.id_directorIDImage',
          templateOptions: {
            id: 'id_directorIDImage',
            name: 'id_directorIDImage',
            label: 'Director ID image',
            placeHolder: 'Director ID image',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
      ]
    },
    {
      id: 'outlets',
      name: 'OUTLETS',
      key: 'OUTLET',
      mappingRef: 'info.outlets.id_addShop',
      fields: [
        {
          key: 'id_cpSiteId',
          type: 'input',
          mappingRef: 'id_cpSiteId',
          templateOptions: {
            id: 'id_cpSiteId',
            name: 'id_cpSiteId',
            label: 'CP Site ID',
            placeHolder: 'CP Site ID',
            value: '',
            properties: {
              isDisable: false,
              isHightlisght: false,
              isHide: false
            }
          }
        },
        {
          key: 'geoFields',
          type: 'geoFields',
          mappingRef: 'id_addShop',
          templateOptions: {
            id: 'geoFields',
            name: 'geoFields',
            label: 'GeoFields',
            placeHolder: 'GeoFields',
            value: '',
            properties: {
              isDisable: true,
              isHightlisght: false,
              isHide: true
            }
          }
        }
      ]
    }
  ]

  visibleCaseDetails: any = [];

  getFinalPreparedJson(caseJson) {
    let clonnedCaseInfo = caseJson;
    let multiSection = [];
    let preparedCaseDetails = [];
    clonnedCaseInfo.map((c_val, c_key) => {
      if (c_val.mappingRef) {
        multiSection.push(clonnedCaseInfo[c_key]);
      } else {
        preparedCaseDetails.push(clonnedCaseInfo[c_key]);
      }
    });
    if (multiSection.length > 0) {
      multiSection.map((m_val, m_key) => {
        let outletsObj = this.getMappedFieldValue(m_val.mappingRef);
        let outlets = [];
        if (outletsObj.length > 0) {
          let con = 1;
          outletsObj.map((d_val, d_key) => {
            //let updateFieldMapref = [];            
            m_val.fields.map((mapVal, mapKey) => {
              m_val.fields[mapKey].mappingRef = m_val.mappingRef + '[' + d_key + '].' + mapVal.mappingRef;
            });
            console.log('m_val is ', m_val);
            outlets.push(this.prepareOutletObj(con, m_val.key, m_val.fields));
            con = con + 1;
          });
        }
        let preparedComboObj = {
          id: m_val.id,
          name: m_val.name,
          outlets: outlets,
          mappingRef: m_val.mappingRef,
        }
        preparedCaseDetails.push(preparedComboObj);
      });
    }
    return preparedCaseDetails;
  }

  getGeoObjInfo(nestedObjArr, rowData) {
    let getValueObj = rowData;
    for (let i = 0; i < nestedObjArr.length; i++) {
      if (getValueObj[nestedObjArr[i]]) {
        getValueObj = getValueObj[nestedObjArr[i]];
      }
    }
    if (getValueObj.constructor.name == "Array" || getValueObj.constructor.name == 'Object') {
      return getValueObj;
    } else {
      return '';
    }
  }

  getMappingValue(ref, rowData) {
    let splitedString = this.explodedValue(ref);
    if (splitedString.length > 0) {
      return this.getGeoObjInfo(splitedString, rowData);
    }
    return '';
  }

  prepareAndUpdateGeoHierarchy(fieldRef, sectionKey, rowData, sectionIndex?: number) {
    let caseDetails = this.getMappingValue(fieldRef, rowData);
    if (caseDetails && ((caseDetails.constructor.name == 'Array' && caseDetails.length > 0) || (caseDetails.constructor.name = 'Object' && Object.keys(caseDetails).length > 0))) {
      let sharedObj;
      if (caseDetails.constructor.name == 'Array' && typeof sectionIndex != 'undefined') {
        sharedObj = caseDetails[sectionIndex];
      }
      let leastLabelId = AppUtills.getLowestGeoHierarchyLabelId();
      let levelHierarchy = AppUtills.getSelectedLevelHierarchy(leastLabelId);
      let obj = {
        levelIdList: AppUtills.getSelectedLeafHierarchy(levelHierarchy, sharedObj)
      }
      this.geoLocationSubscriber = this._http.post(apiUrls.levelListDetails, obj).subscribe((res) => {
        if (res && res['statusCode'] == 200 && res['result'] != '') {
          let geoDataInfo = {};
          res['result'].map(val => {
            geoDataInfo = AppUtills.prepareCaseGeoHierarchy(val, geoDataInfo);
          });
          this.visibleCaseDetails.map((s_val, s_key) => {
            if (s_val.id == sectionKey) {
              if (s_val.outlets && s_val.outlets.length > 0) {
                if (Object.keys(geoDataInfo).length > 0) {
                  let objKeys = Object.keys(geoDataInfo);
                  objKeys.map(geoKey => {
                    let preparedNames = [];
                    geoDataInfo[geoKey].map(geoN => {
                      preparedNames.push(geoN.label);
                    });
                    let hiererchyMaster = AppUtills.getSelectedLevelKeyHierarchy(geoKey);
                    this.visibleCaseDetails[s_key].outlets[sectionIndex].fields.push(this.createGeoGraphicalObj(preparedNames.join(), hiererchyMaster[0].label, geoKey));
                  });
                }
              }
            }
          })
        }
      });
    }
  }

  mappedFieldValues(fieldsObj, sectionKey, sectionIndex?: number) {
    fieldsObj.map((sectionWV, sectionWK) => {
      if (sectionWV.mappingRef) {
        if (sectionWV.key == 'geoFields' && sectionWV.type == 'geoFields') {
          this.prepareAndUpdateGeoHierarchy(sectionWV.mappingRef, sectionKey, this.parsedCaseJSON, sectionIndex);
        } else {
          let mappedRefferenceVlue = this.getMappedFieldValue(sectionWV.mappingRef);
          if (mappedRefferenceVlue) {
            if (sectionWV.type == 'multiMedia') {
              let getImageNode = {
                fieldName: sectionWV.templateOptions.label,
                fieldKey: sectionWV.key,
                fileId: mappedRefferenceVlue
              }
              this.getMultiMediaFile(getImageNode, sectionKey, sectionIndex);
              fieldsObj[sectionWK].templateOptions.properties.isDisable = true;
              fieldsObj[sectionWK].templateOptions.properties.isHide = true;
            } else {
              if (mappedRefferenceVlue.constructor.name == 'Array') {
                let isAllString = true;                
                mappedRefferenceVlue.map((mapV,mapK)=>{
                  if(mapV.constructor.name != 'String'){
                    isAllString = false;
                  }
                });
                if(isAllString){
                  mappedRefferenceVlue = mappedRefferenceVlue.join();
                }else{
                  mappedRefferenceVlue = '';
                }
              }
              if (mappedRefferenceVlue && mappedRefferenceVlue.constructor.name != 'Array') {
                if (sectionWV.actionHandler) {
                  let actionHandlerVal = this[sectionWV.actionHandler](mappedRefferenceVlue);
                  if (actionHandlerVal) {
                    mappedRefferenceVlue = actionHandlerVal;
                  }
                }
                fieldsObj[sectionWK].templateOptions.value = mappedRefferenceVlue;
                fieldsObj[sectionWK].templateOptions.properties.isDisable = false;
                fieldsObj[sectionWK].templateOptions.properties.isHide = false;
              } else {
                fieldsObj[sectionWK].templateOptions.properties.isDisable = true;
                fieldsObj[sectionWK].templateOptions.properties.isHide = true;
              }
            }
          }else{
            fieldsObj[sectionWK].templateOptions.properties.isDisable = true;
            fieldsObj[sectionWK].templateOptions.properties.isHide = true;
          }
        }
      }
    });
    return fieldsObj;
  }

  ngOnInit() {
    let caseDetails = this.getFinalPreparedJson(this.caseSections);
    caseDetails.map((sectionV, sectionK) => {
      if (sectionV.outlets && sectionV.outlets.length > 0) {
        sectionV.outlets.map((s_val, s_key) => {
          sectionV.outlets[s_key].fields = this.mappedFieldValues(s_val.fields, sectionV.id, s_key);
        });
      } else {
        sectionV.fields = this.mappedFieldValues(sectionV.fields, sectionV.id);
      }
    });
    this.visibleCaseDetails = caseDetails;
  }

  singleMultiMediaFile(resourceId, sectionKey, fileObj) {
    let resourceObj = {
      resourceId: resourceId,
      actionName: "DOWNLOAD_IMAGE",
      actionType: "external"
    }
    this.singleImageSubscriber = this._http.post(apiUrls.cpmImageService, resourceObj).subscribe((res) => {
      if (res && res['statusCode'] == 200 && res['result'] != '') {
        let data = res['result'].data;
        if (data.resourceType == 'pdf') {
          this.pushMultimediaFileIntoSection(sectionKey, this.makePdfNode(data, fileObj.fieldName, fileObj.fileId));
        } else {
          this.pushMultimediaFileIntoSection(sectionKey, this.makeImageNode(data, fileObj.fieldName, fileObj.fileId));
        }
      }
    });
  }

  makeImageSlider(resourceId, sectionKey, fileObj) {
    let apiRequests = [];
    resourceId.map((mVal, mKey) => {
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
            this.pushMultimediaFileIntoSection(sectionKey, this.createImageSlider(multipleSliderReq, fileObj.fieldName, fileObj.fileId));
          }
        }
      }
    );
  }

  getMultiMediaFile(fileObj, sectionKey, sectionIndex?: number) {
    if (fileObj.fileId.constructor.name == 'Array') {
      if (fileObj.fileId.length > 1) {
        // Make Sliders
        this.makeImageSlider(fileObj.fileId, sectionKey, fileObj)
      } else {
        // Make Single Node File
        this.singleMultiMediaFile(fileObj.fileId[0], sectionKey, fileObj);
      }
    } else {
      // Make Single Node File
      this.singleMultiMediaFile(fileObj.fileId, sectionKey, fileObj);
    }
  }

  pushMultimediaFileIntoSection(key, multimediaNode) {
    this.visibleCaseDetails.map((s_val, s_key) => {
      if (s_val.id == key) {
        this.visibleCaseDetails[s_key].fields.push(multimediaNode);
      }
    })
  }

  checkKeyIsArray(stri) {
    return stri.split("[");
  }
  checkCloseArray(stri) {
    return stri.split("]");
  }

  getNestedObjValue(nestedObjArr, rowData) {
    let getValueObj = rowData;
    for (let i = 0; i < nestedObjArr.length; i++) {
      let explodedArray = this.checkKeyIsArray(nestedObjArr[i]);
      if (explodedArray.length > 1) {
        if (getValueObj[explodedArray[0]]) {
          for (let count = 0; count < explodedArray.length; count++) {
            let closingArray = this.checkCloseArray(explodedArray[count]);
            if (closingArray.length > 1) {
              if (getValueObj[closingArray[0]]) {
                getValueObj = getValueObj[closingArray[0]];
              }
            } else {
              if (getValueObj[closingArray[0]]) {
                getValueObj = getValueObj[closingArray[0]];
              }
            }
          }
        } else {
          return '';
        }
      } else {
        if (getValueObj[explodedArray[0]]) {
          getValueObj = getValueObj[nestedObjArr[i]];
        }
      }
    }
    if (getValueObj.constructor.name == "Array" || getValueObj.constructor.name == 'String') {
      return getValueObj;
    } else {
      return '';
    }
  }

  explodedValue(stri) {
    return stri.split(".");
  }

  getMappedFieldValue(ref) {
    let splitedString = this.explodedValue(ref);
    if (splitedString.length > 0) {
      return this.getNestedObjValue(splitedString, this.parsedCaseJSON);
    }
    return '';
    //this.parsedCaseJSON
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

}