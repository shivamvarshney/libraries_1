import { environment } from '@environments/environment';

let apiRef = "/api";
let loginRef = "/app";
let logoutRef = "/logout";
let cmApiRef = "/cm";
let cpmServiceRef = "/cpmservices";
let siteMgmntRef = "/siteMgmnt";

// BackendTEam API connection for NG
// let apiRef = "http://172.24.35.204:30021/bfe/web/userm/api";
// let loginRef = "http://172.24.35.204:30021/bfe/web/auth/app";
// let logoutRef = "http://172.24.35.204:30021/bfe/api/v1/user/logout";
// let cmApiRef = "http://172.24.35.204:30021/bfe/web/cms/api/cm";
// let cpmServiceRef = "http://172.24.35.204:30021/bfe/web/cpmservices";
// let siteMgmntRef = "http://172.24.35.204:30021/bfe/web/sitemgmt/api";

// BackendTEam API connection for ZM
// let apiRef = "https://bfeuat.airtel.co.zm/bfe/web/userm/api";
// let loginRef = "https://bfeuat.airtel.co.zm/bfe/web/auth/app";
// let logoutRef = "https://bfeuat.airtel.co.zm/bfe/api/v1/user/logout";
// let cmApiRef = "https://bfeuat.airtel.co.zm/bfe/web/cms/api/cm";
// let cpmServiceRef = "https://bfeuat.airtel.co.zm/bfe/web/cpmservices";
// let siteMgmntRef = "https://bfeuat.airtel.co.zm/bfe/web/sitemgmt/api";

export const apiUrls = {    
 opco: environment.OPCO,
 logout: logoutRef+'/',
 getMasterData: apiRef+"/user-mngmnt/v1/getMasterData",
 login: loginRef+"/login", 
 user: apiRef + "/user-mngmnt/users",
 verifyUser:apiRef+"/user-mngmnt/verifyUser",
 masterPermissions: apiRef+"/user-mngmnt/v1/permissions",
 permissions: apiRef + "/user-mngmnt/v1/permissions",
 sendOTP: apiRef+"/user-mngmnt/send-otp",
 resendOTP: apiRef+"/user-mngmnt/resend-otp",
 getGeoDefinition: apiRef+"/user-mngmnt/v1/user/getGeoDefinition",
 getGeoLocationData: apiRef+"/user-mngmnt/v1/user/getSiteDefinition",
 downloadFile: apiRef+"/user-mngmnt/v1/user-download-file",
 bulkUploadFile: apiRef+"/user-mngmnt/v1/upload-users",
 userList: apiRef+"/user-mngmnt/v2/user/search",
 toggleUser: apiRef+"/user-mngmnt/v2/user/setStatus",
 cpCount: apiRef+"/cpm/entity/entityCount",
 cpUploadFile: apiRef+"/cpm/bulkUpload",
 cpDownloadSampleFile: apiRef+"/cpm/bulkUpload/download-sample",
 roles: apiRef + "/user-mngmnt/v1/roles",
 getUserById: apiRef + "/user-mngmnt/v2/user/getUserDetails",

 availabilityStatus: cmApiRef+"/v1/actorpool/actor-availability-status",
 assignmentWatch: cmApiRef+"/v1/case-assignment/watch",
 caseList: cmApiRef+"/v1/case/search",
 saveAgent: cmApiRef+"/v1/actorpool/actor",
 availabelActors: cmApiRef+"/v1/actorpool/available-actors",
 getActors: cmApiRef+"/v1/actorpool/actor/search",
 caseAcceptReject: cmApiRef+"/v1/transition/act",
 onBoardActor: cmApiRef+"/v1/actorpool/actor/search",
 rejectResion: cmApiRef+"/v1/rejection-reasons",
 dropCases:cmApiRef+"/v1/case/drop-case",
 cpmImageService:cpmServiceRef+'/cpm/execute',
 geoLocations: siteMgmntRef+ "/site-mngmnt/v1/site/id-list",
 siteInfo: siteMgmntRef+ "/site-mngmnt/v1/site/siteIdSummaryList",
 levelDetails: siteMgmntRef+ "/site-mngmnt/v1/site/id",
 levelListDetails: siteMgmntRef+ "/site-mngmnt/v1/site/levelMasterById"
};
