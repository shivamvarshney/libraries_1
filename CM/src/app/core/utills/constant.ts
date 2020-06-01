// All the application constant will be written here
import { environment } from '@environments/environment';
export const AppConstants = {
  sampleKitTemplate:"KitsSample.csv",
  sampleUserTemplate:"UsersSample.csv",
  createRoleLevel:"Level", 
  opco: environment.OPCO,  
  opcoConfig: {
    patternNum: /^[0-9]*$/,
    namePattern: /^[a-zA-Z \-\']+/,
    dobpattern: /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/, // format = mm/dd/yyyy
    currencyCode: 'UG',
    numberLength: 10,
    opcode: '234',
    min: 3,
    auuidMax: 10,
    msisdnMax: 10,
    nationalIdMax: 20,
    otpMaxLength: 4
  },
  tokenAccessSpecifier:'Bearer',
  userManagementBaseUrl:environment.userManagementBaseUrl,
  userManagementCreateUserBaseUrl:environment.userManagementBaseUrl+"user/add",
  clientId:'3',
  umDestination:'iframe',
  createAgentButtonLabel: 'Continue',
  createAgentRedirectUrl: environment.caseManagementBaseURL+'case-management/save-agent/',
  serviceId: 'snd_user_mngt_service_app',
  newCaseNotificationMsg:"A new Case has been arrived",
  caseRemoveNotificationMsg:"That Case has been removed",
  paginationPageNo : 0,
  paginationPageSize : 10,
  superVisorCasesDefaultFromDate : '1947-01-01 00:00:00'
};
 